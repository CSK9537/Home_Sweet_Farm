package org.joonzis.community.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Properties;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.joonzis.community.dto.UploadResponseDTO;
import org.joonzis.community.mapper.CommunityFormMapper;
import org.joonzis.community.vo.BoardFileVO;
import org.joonzis.community.vo.BoardVO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityFormServiceImpl implements CommunityFormService {

    private final CommunityFormMapper mapper;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${hsf.upload.root:\\\\192.168.0.153\\\\projecthsf}")
    private String uploadRoot;

    private static class TempAttachItem {
        private String savedName;
        public String getSavedName() { return savedName; }
        public void setSavedName(String savedName) { this.savedName = savedName; }
    }

    private static class FinalizeResult {
        private String html;
        private Integer selectedTempThumbnailFileId;
    }

    private String today() {
        return new SimpleDateFormat("yyyyMMdd").format(new Date());
    }

    private boolean isMarketType(String boardType) {
        return "T".equals(boardType) || "S".equals(boardType);
    }

    private String boardFolderKor(String boardType) {
        return isMarketType(boardType) ? "벼룩시장" : "자유게시판";
    }

    private String safeExt(String name) {
        if (name == null) return "";
        int idx = name.lastIndexOf('.');
        if (idx < 0) return "";
        return name.substring(idx).toLowerCase();
    }

    private String newSavedName(String originalName) {
        return UUID.randomUUID().toString().replace("-", "") + safeExt(originalName);
    }

    private Path buildSaveDir(String boardType) {
        return Paths.get(uploadRoot, "board_upload", boardFolderKor(boardType), today());
    }

    private String buildSubDir(String boardType) {
        return boardFolderKor(boardType) + "/" + today();
    }

    private Path buildTempDir(String tempKey) {
        return Paths.get(uploadRoot, "board_upload", "_temp", tempKey);
    }

    private String buildTempSubDir(String tempKey) {
        return "_temp/" + tempKey;
    }

    private String encode(String s) {
        try {
            return java.net.URLEncoder.encode(s, "UTF-8");
        } catch (Exception e) {
            return s;
        }
    }

    private String decode(String s) {
        try {
            return java.net.URLDecoder.decode(s, "UTF-8");
        } catch (Exception e) {
            return s;
        }
    }

    private String buildServeUrl(String subDir, String savedName) {
        return "/community/file?subDir=" + encode(subDir) + "&savedName=" + encode(savedName);
    }

    private Path metaPath(Path dir, String savedName) {
        return dir.resolve(savedName + ".meta");
    }

    private void writeMeta(Path dir, String savedName, MultipartFile file, String originalName, String purpose) {
        Properties p = new Properties();
        p.setProperty("original", originalName == null ? "" : originalName);
        p.setProperty("size", String.valueOf(file.getSize()));
        p.setProperty("contentType", file.getContentType() == null ? "" : file.getContentType());
        p.setProperty("fileKind", (purpose == null || purpose.trim().isEmpty()) ? "EDITOR" : purpose.trim().toUpperCase());

        try (OutputStream os = Files.newOutputStream(metaPath(dir, savedName))) {
            p.store(os, "temp upload metadata");
        } catch (IOException e) {
            // ignore
        }
    }

    private Properties readMeta(Path dir, String savedName) {
        Properties p = new Properties();
        Path mp = metaPath(dir, savedName);
        if (!Files.exists(mp)) return p;

        try (InputStream is = Files.newInputStream(mp)) {
            p.load(is);
        } catch (IOException e) {
            // ignore
        }
        return p;
    }

    private void deleteQuietly(Path p) {
        try {
            Files.deleteIfExists(p);
        } catch (Exception e) {
            // ignore
        }
    }

    private void deleteDirectoryRecursive(Path dir) {
        if (dir == null || !Files.exists(dir)) return;

        try {
            Files.walk(dir)
                 .sorted((a, b) -> b.compareTo(a))
                 .forEach(this::deleteQuietly);
        } catch (Exception e) {
            // ignore
        }
    }

    private Set<String> extractTempSavedNamesFromHtml(String html, String tempSubDir) {
        Set<String> out = new HashSet<>();
        if (html == null || html.trim().isEmpty()) return out;

        String normalized = html.replace("&amp;", "&");
        Pattern p = Pattern.compile("subDir=([^&\\\"']+)&savedName=([a-zA-Z0-9._-]+)");
        Matcher m = p.matcher(normalized);

        while (m.find()) {
            String subDirRaw = m.group(1);
            String saved = m.group(2);
            String subDirDecoded = decode(subDirRaw);

            if (tempSubDir.equals(subDirDecoded)) {
                out.add(saved);
            }
        }
        return out;
    }

    private String rewriteHtmlTempToFinal(String html, String tempSubDir, String finalSubDir, Set<String> savedNames) {
        if (html == null || html.trim().isEmpty()) return html;
        if (savedNames == null || savedNames.isEmpty()) return html;

        String encodedTemp = encode(tempSubDir);
        String encodedFinal = encode(finalSubDir);

        String out = html;
        for (String saved : savedNames) {
            String encodedSaved = encode(saved);

            out = out.replace(
                "subDir=" + encodedTemp + "&savedName=" + encodedSaved,
                "subDir=" + encodedFinal + "&savedName=" + encodedSaved
            );

            out = out.replace(
                "subDir=" + encodedTemp + "&amp;savedName=" + encodedSaved,
                "subDir=" + encodedFinal + "&amp;savedName=" + encodedSaved
            );
        }

        return out;
    }

    private String normalizeContentType(String contentType) {
        if (contentType == null || contentType.trim().isEmpty()) {
            return "FILE";
        }

        String ct = contentType.toLowerCase();
        if (ct.startsWith("image/")) {
            return "IMAGE";
        }

        return "FILE";
    }

    private String resolveFileKind(String metaFileKind, String contentType) {
        if (metaFileKind != null && !metaFileKind.trim().isEmpty()) {
            String v = metaFileKind.trim().toUpperCase();
            if ("ATTACH".equals(v) || "EDITOR".equals(v)) {
                return v;
            }
        }

        if (contentType != null && contentType.toLowerCase().startsWith("image/")) {
            return "EDITOR";
        }

        return "ATTACH";
    }

    private List<String> normalizeTags(String tagsCsv) {
        if (tagsCsv == null || tagsCsv.trim().isEmpty()) {
            return Collections.emptyList();
        }

        Set<String> dedup = new LinkedHashSet<>();
        String[] arr = tagsCsv.split(",");

        for (String raw : arr) {
            if (raw == null) continue;

            String tag = raw.trim();
            if (tag.isEmpty()) continue;

            while (tag.startsWith("#")) {
                tag = tag.substring(1).trim();
            }

            if (tag.isEmpty()) continue;

            if (tag.length() > 20) {
                tag = tag.substring(0, 20);
            }

            dedup.add(tag);
        }

        return new ArrayList<>(dedup);
    }

    private void saveBoardTags(int boardId, String tagsCsv) {
        mapper.deleteBoardAspectsByBoardId(boardId);

        List<String> tags = normalizeTags(tagsCsv);
        if (tags.isEmpty()) {
            return;
        }

        for (String tag : tags) {
            Integer hashtagId = mapper.selectBoardHashtagIdByName(tag);

            if (hashtagId == null) {
                mapper.insertBoardHashtag(tag);
                hashtagId = mapper.selectBoardHashtagIdByName(tag);
            }

            if (hashtagId != null) {
                mapper.insertBoardAspect(boardId, hashtagId);
            }
        }
    }

    private List<String> parseDeleteFileIds(String csv) {
        if (csv == null || csv.trim().isEmpty()) return Collections.emptyList();

        List<String> out = new ArrayList<>();
        String[] arr = csv.split(",");
        for (String s : arr) {
            if (s == null) continue;
            String v = s.trim();
            if (!v.isEmpty() && v.matches("\\d+")) {
                out.add(v);
            }
        }
        return out;
    }

    private Set<String> parseUploadedAttachSavedNames(String uploadedAttachFilesJson) {
        if (uploadedAttachFilesJson == null || uploadedAttachFilesJson.trim().isEmpty()) {
            return Collections.emptySet();
        }

        try {
            List<TempAttachItem> list = objectMapper.readValue(
                    uploadedAttachFilesJson,
                    new TypeReference<List<TempAttachItem>>() {}
            );

            Set<String> out = new LinkedHashSet<>();
            if (list != null) {
                for (TempAttachItem item : list) {
                    if (item == null || item.getSavedName() == null) continue;
                    String savedName = item.getSavedName().trim();
                    if (!savedName.isEmpty()) {
                        out.add(savedName);
                    }
                }
            }
            return out;
        } catch (Exception e) {
            return Collections.emptySet();
        }
    }

    private FinalizeResult finalizeTempFiles(
            int boardId,
            String boardType,
            String tempKey,
            String contentHtml,
            String uploadedAttachFilesJson,
            String thumbnailTarget
    ) {
        FinalizeResult result = new FinalizeResult();
        result.html = contentHtml;
        result.selectedTempThumbnailFileId = null;

        if (tempKey == null || tempKey.trim().isEmpty()) return result;
        if (boardType == null || boardType.trim().isEmpty()) boardType = "G";

        Path tempDir = buildTempDir(tempKey);
        if (!Files.exists(tempDir)) return result;

        String tempSubDir = buildTempSubDir(tempKey);
        Set<String> usedInHtml = extractTempSavedNamesFromHtml(contentHtml, tempSubDir);
        Set<String> selectedAttachSavedNames = parseUploadedAttachSavedNames(uploadedAttachFilesJson);

        Set<String> targetSavedNames = new LinkedHashSet<>();
        targetSavedNames.addAll(usedInHtml);
        targetSavedNames.addAll(selectedAttachSavedNames);

        if (targetSavedNames.isEmpty()) {
            deleteDirectoryRecursive(tempDir);
            return result;
        }

        Path finalDir = buildSaveDir(boardType);
        String finalSubDir = buildSubDir(boardType);

        try {
            Files.createDirectories(finalDir);
        } catch (IOException e) {
            throw new RuntimeException("final dir create failed", e);
        }

        for (String savedName : targetSavedNames) {
            Path src = tempDir.resolve(savedName);
            if (!Files.exists(src)) continue;

            Properties meta = readMeta(tempDir, savedName);
            String original = meta.getProperty("original", savedName);
            String ct = meta.getProperty("contentType", "");
            String metaKind = meta.getProperty("fileKind", "");
            String fileKind = selectedAttachSavedNames.contains(savedName)
                    ? "ATTACH"
                    : resolveFileKind(metaKind, ct);

            long sizeLong;
            try {
                sizeLong = Files.size(src);
            } catch (IOException e) {
                sizeLong = 0L;
            }

            Path dst = finalDir.resolve(savedName);
            try {
                Files.move(src, dst, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                throw new RuntimeException("move temp file failed", e);
            }

            deleteQuietly(metaPath(tempDir, savedName));

            BoardFileVO vo = new BoardFileVO();
            vo.setBoard_id(boardId);
            vo.setOriginal_name(original);
            vo.setSaved_name(savedName);
            vo.setFile_size((int) Math.min(Integer.MAX_VALUE, sizeLong));
            vo.setContent_type(normalizeContentType(ct));
            vo.setTemp_key(null);
            vo.setSub_dir(finalSubDir);
            vo.setFile_kind(fileKind);
            vo.setIs_active("Y");
            vo.setIs_thumbnail("N");

            mapper.insertBoardFile(vo);

            if (thumbnailTarget != null
                    && thumbnailTarget.equals("temp:" + savedName)
                    && "IMAGE".equals(vo.getContent_type())) {
                Integer insertedId = mapper.selectFirstActiveImageFileId(boardId);
                List<BoardFileVO> files = mapper.selectBoardFilesByBoardId(boardId);
                for (BoardFileVO f : files) {
                    if (savedName.equals(f.getSaved_name())) {
                        result.selectedTempThumbnailFileId = f.getFile_id();
                    }
                }
            }
        }

        deleteDirectoryRecursive(tempDir);
        result.html = rewriteHtmlTempToFinal(contentHtml, tempSubDir, finalSubDir, targetSavedNames);
        return result;
    }

    private void saveAttachFilesFallback(int boardId, String boardType, MultipartFile[] attachFiles) {
        if (attachFiles == null || attachFiles.length == 0) return;
        if (boardType == null || boardType.trim().isEmpty()) boardType = "G";

        Path dir = buildSaveDir(boardType);
        String subDir = buildSubDir(boardType);

        try {
            Files.createDirectories(dir);
        } catch (IOException e) {
            throw new RuntimeException("attach dir create failed", e);
        }

        boolean thumbnailAssigned = (mapper.selectThumbnailFileId(boardId) != null);

        for (MultipartFile f : attachFiles) {
            if (f == null || f.isEmpty()) continue;

            String original = f.getOriginalFilename();
            String saved = newSavedName(original);
            String normalizedType = normalizeContentType(f.getContentType());

            try {
                f.transferTo(dir.resolve(saved).toFile());
            } catch (IOException e) {
                throw new RuntimeException("attach upload failed", e);
            }

            BoardFileVO vo = new BoardFileVO();
            vo.setBoard_id(boardId);
            vo.setOriginal_name(original);
            vo.setSaved_name(saved);
            vo.setFile_size((int) Math.min(Integer.MAX_VALUE, f.getSize()));
            vo.setContent_type(normalizedType);
            vo.setTemp_key(null);
            vo.setSub_dir(subDir);
            vo.setFile_kind("ATTACH");
            vo.setIs_active("Y");

            if (!thumbnailAssigned && "IMAGE".equals(normalizedType)) {
                vo.setIs_thumbnail("Y");
                thumbnailAssigned = true;
            } else {
                vo.setIs_thumbnail("N");
            }

            mapper.insertBoardFile(vo);
        }
    }

    private void deactivateRequestedFiles(int boardId, String existingDeletedFileIds) {
        List<String> ids = parseDeleteFileIds(existingDeletedFileIds);
        for (String id : ids) {
            mapper.deactivateBoardFileById(boardId, Integer.parseInt(id));
        }
    }

    private void applyThumbnail(int boardId, String thumbnailTarget, Integer selectedTempThumbnailFileId) {
        Integer finalThumbnailFileId = null;

        if (thumbnailTarget != null && thumbnailTarget.startsWith("existing:")) {
            String raw = thumbnailTarget.substring("existing:".length());
            if (raw.matches("\\d+")) {
                finalThumbnailFileId = Integer.parseInt(raw);
            }
        } else if (thumbnailTarget != null && thumbnailTarget.startsWith("temp:")) {
            finalThumbnailFileId = selectedTempThumbnailFileId;
        } else {
            finalThumbnailFileId = mapper.selectThumbnailFileId(boardId);
        }

        if (finalThumbnailFileId != null) {
            mapper.clearThumbnailByBoardId(boardId);
            mapper.setThumbnailByFileId(boardId, finalThumbnailFileId);
            return;
        }

        Integer firstImageFileId = mapper.selectFirstActiveImageFileId(boardId);
        mapper.clearThumbnailByBoardId(boardId);
        if (firstImageFileId != null) {
            mapper.setThumbnailByFileId(boardId, firstImageFileId);
        }
    }

    @Override
    @Transactional
    public UploadResponseDTO uploadTempFile(MultipartFile file, String tempKey, String boardType, String purpose) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("file is empty");
        }
        if (tempKey == null || tempKey.trim().isEmpty()) {
            throw new IllegalArgumentException("tempKey is required");
        }
        if (boardType == null || boardType.trim().isEmpty()) {
            boardType = "G";
        }

        String original = file.getOriginalFilename();
        String saved = newSavedName(original);

        Path dir = buildTempDir(tempKey);
        try {
            Files.createDirectories(dir);
            file.transferTo(dir.resolve(saved).toFile());
        } catch (IOException e) {
            throw new RuntimeException("upload failed", e);
        }

        writeMeta(dir, saved, file, original, purpose);

        String subDir = buildTempSubDir(tempKey);
        String url = buildServeUrl(subDir, saved);
        return new UploadResponseDTO(url, saved, subDir);
    }

    @Override
    @Transactional
    public int write(BoardVO board,
                     int loginUserId,
                     String tempKey,
                     MultipartFile[] attachFiles,
                     String tagsCsv,
                     String uploadedAttachFilesJson,
                     String thumbnailTarget) {

        if (board == null) throw new IllegalArgumentException("board is null");
        if (loginUserId <= 0) throw new SecurityException("login required");

        board.setUser_id(loginUserId);

        int nextId = mapper.selectBoardSeqNextVal();
        board.setBoard_id(nextId);

        mapper.insertBoard(board);

        FinalizeResult finalizeResult = finalizeTempFiles(
                nextId,
                board.getBoard_type(),
                tempKey,
                board.getContent(),
                uploadedAttachFilesJson,
                thumbnailTarget
        );

        if (finalizeResult.html != null && !finalizeResult.html.equals(board.getContent())) {
            board.setContent(finalizeResult.html);
            mapper.updateBoard(board);
        }

        saveAttachFilesFallback(nextId, board.getBoard_type(), attachFiles);
        saveBoardTags(nextId, tagsCsv);
        applyThumbnail(nextId, thumbnailTarget, finalizeResult.selectedTempThumbnailFileId);

        return nextId;
    }

    @Override
    @Transactional
    public int edit(BoardVO board,
                    int loginUserId,
                    String tempKey,
                    MultipartFile[] attachFiles,
                    String tagsCsv,
                    String uploadedAttachFilesJson,
                    String existingDeletedFileIds,
                    String thumbnailTarget) {

        if (board == null) throw new IllegalArgumentException("board is null");
        if (loginUserId <= 0) throw new SecurityException("login required");

        Integer owner = mapper.selectBoardOwnerUserId(board.getBoard_id());
        if (owner == null || owner.intValue() != loginUserId) {
            throw new SecurityException("not owner");
        }

        deactivateRequestedFiles(board.getBoard_id(), existingDeletedFileIds);

        FinalizeResult finalizeResult = finalizeTempFiles(
                board.getBoard_id(),
                board.getBoard_type(),
                tempKey,
                board.getContent(),
                uploadedAttachFilesJson,
                thumbnailTarget
        );

        board.setContent(finalizeResult.html);
        mapper.updateBoard(board);

        saveAttachFilesFallback(board.getBoard_id(), board.getBoard_type(), attachFiles);
        saveBoardTags(board.getBoard_id(), tagsCsv);
        applyThumbnail(board.getBoard_id(), thumbnailTarget, finalizeResult.selectedTempThumbnailFileId);

        return board.getBoard_id();
    }

    @Override
    public List<String> suggestHashtags(String q, int limit) {
        if (q == null) q = "";
        q = q.trim();
        if (q.isEmpty()) return Collections.emptyList();

        if (limit <= 0) limit = 10;
        if (limit > 20) limit = 20;

        return mapper.selectHashtagSuggest(q, limit);
    }

    @Override
    public BoardVO getBoardById(int boardId) {
        return mapper.selectBoardById(boardId);
    }

    @Override
    public List<BoardFileVO> getBoardFiles(int boardId) {
        return mapper.selectBoardFilesByBoardId(boardId);
    }

    @Override
    public String getBoardTagsCsv(int boardId) {
        return mapper.selectBoardTagsCsv(boardId);
    }

    @Override
    public boolean isOwner(int boardId, int loginUserId) {
        if (loginUserId <= 0) return false;
        Integer owner = mapper.selectBoardOwnerUserId(boardId);
        return owner != null && owner.intValue() == loginUserId;
    }

    @Override
    @Transactional
    public boolean deleteBoard(int boardId, int loginUserId) {
        if (boardId <= 0) throw new IllegalArgumentException("boardId is invalid");
        if (loginUserId <= 0) throw new SecurityException("login required");

        Integer owner = mapper.selectBoardOwnerUserId(boardId);
        if (owner == null || owner.intValue() != loginUserId) {
            throw new SecurityException("not owner");
        }

        mapper.deactivateFilesByBoardId(boardId);
        mapper.deactivateRepliesByBoardId(boardId);
        mapper.deleteBoardAspectsByBoardId(boardId);

        return mapper.deactivateBoard(boardId, loginUserId) > 0;
    }
}