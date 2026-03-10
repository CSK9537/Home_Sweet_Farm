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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityFormServiceImpl implements CommunityFormService {

    private final CommunityFormMapper mapper;

    @Value("${hsf.upload.root:\\\\192.168.0.153\\\\projecthsf}")
    private String uploadRoot;

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

    private void writeMeta(Path dir, String savedName, MultipartFile file, String originalName) {
        Properties p = new Properties();
        p.setProperty("original", originalName == null ? "" : originalName);
        p.setProperty("size", String.valueOf(file.getSize()));
        p.setProperty("contentType", file.getContentType() == null ? "" : file.getContentType());
        p.setProperty("fileKind", "EDITOR");

        try (OutputStream os = Files.newOutputStream(metaPath(dir, savedName))) {
            p.store(os, "temp upload metadata");
        } catch (IOException e) {
            // meta 저장 실패는 본 업로드 자체를 막지 않음
        }
    }

    private Properties readMeta(Path dir, String savedName) {
        Properties p = new Properties();
        Path mp = metaPath(dir, savedName);
        if (!Files.exists(mp)) return p;

        try (InputStream is = Files.newInputStream(mp)) {
            p.load(is);
        } catch (IOException e) {
            // meta 못 읽어도 빈 값으로 진행
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

    /**
     * 본문 HTML 안에서 현재 tempKey에 해당하는 임시 업로드 파일명(savedName)들을 추출한다.
     * 에디터/JSP 처리 과정에서 & 가 &amp; 로 바뀌는 경우까지 대응한다.
     */
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

    /**
     * 본문 HTML 안의 temp 경로를 최종 저장 경로로 치환한다.
     * &savedName= 뿐 아니라 &amp;savedName= 형태도 같이 처리한다.
     */
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

    /**
     * DB 제약조건에 맞게 IMAGE / FILE 로 정규화
     */
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

    /**
     * 에디터 본문에 들어간 이미지면 EDITOR, 일반 첨부면 ATTACH
     */
    private String resolveFileKind(String contentType) {
        if (contentType == null || contentType.trim().isEmpty()) {
            return "ATTACH";
        }

        String ct = contentType.toLowerCase();
        if (ct.startsWith("image/")) {
            return "EDITOR";
        }

        return "ATTACH";
    }

    /**
     * temp 폴더의 파일 중 본문에서 실제 사용한 파일만 최종 폴더로 이동 + DB 저장 + 본문 URL 치환
     */
    private String finalizeTempFilesIfNeeded(int boardId, String boardType, String tempKey, String contentHtml) {
        if (tempKey == null || tempKey.trim().isEmpty()) return contentHtml;
        if (boardType == null || boardType.trim().isEmpty()) boardType = "G";

        Path tempDir = buildTempDir(tempKey);
        if (!Files.exists(tempDir)) return contentHtml;

        String tempSubDir = buildTempSubDir(tempKey);
        Set<String> usedSaved = extractTempSavedNamesFromHtml(contentHtml, tempSubDir);

        if (usedSaved.isEmpty()) {
            deleteDirectoryRecursive(tempDir);
            return contentHtml;
        }

        Path finalDir = buildSaveDir(boardType);
        String finalSubDir = buildSubDir(boardType);

        try {
            Files.createDirectories(finalDir);
        } catch (IOException e) {
            throw new RuntimeException("final dir create failed", e);
        }

        for (String savedName : usedSaved) {
            Path src = tempDir.resolve(savedName);
            if (!Files.exists(src)) continue;

            Properties meta = readMeta(tempDir, savedName);
            String original = meta.getProperty("original", savedName);
            String ct = meta.getProperty("contentType", "");

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
            vo.setFile_kind(resolveFileKind(ct));
            vo.setIs_active("Y");
            vo.setIs_thumbnail("N");

            mapper.insertBoardFile(vo);
        }

        deleteDirectoryRecursive(tempDir);

        return rewriteHtmlTempToFinal(contentHtml, tempSubDir, finalSubDir, usedSaved);
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

    private void saveAttachFiles(int boardId, String boardType, MultipartFile[] attachFiles) {
        if (attachFiles == null || attachFiles.length == 0) return;
        if (boardType == null || boardType.trim().isEmpty()) boardType = "G";

        Path dir = buildSaveDir(boardType);
        String subDir = buildSubDir(boardType);

        try {
            Files.createDirectories(dir);
        } catch (IOException e) {
            throw new RuntimeException("attach dir create failed", e);
        }

        boolean thumbnailAssigned = false;

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

    @Override
    @Transactional
    public UploadResponseDTO uploadTempFile(MultipartFile file, String tempKey, String boardType) {
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

        writeMeta(dir, saved, file, original);

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
                     String tagsCsv) {

        if (board == null) throw new IllegalArgumentException("board is null");
        if (loginUserId <= 0) throw new SecurityException("login required");

        board.setUser_id(loginUserId);

        int nextId = mapper.selectBoardSeqNextVal();
        board.setBoard_id(nextId);

        mapper.insertBoard(board);

        String contentFinal = finalizeTempFilesIfNeeded(
            nextId,
            board.getBoard_type(),
            tempKey,
            board.getContent()
        );

        if (contentFinal != null && !contentFinal.equals(board.getContent())) {
            board.setContent(contentFinal);
            mapper.updateBoard(board);
        }

        saveAttachFiles(nextId, board.getBoard_type(), attachFiles);
        saveBoardTags(nextId, tagsCsv);

        return nextId;
    }

    @Override
    @Transactional
    public int edit(BoardVO board,
                    int loginUserId,
                    String tempKey,
                    MultipartFile[] attachFiles,
                    String tagsCsv) {

        if (board == null) throw new IllegalArgumentException("board is null");
        if (loginUserId <= 0) throw new SecurityException("login required");

        Integer owner = mapper.selectBoardOwnerUserId(board.getBoard_id());
        if (owner == null || owner.intValue() != loginUserId) {
            throw new SecurityException("not owner");
        }

        String contentFinal = finalizeTempFilesIfNeeded(
            board.getBoard_id(),
            board.getBoard_type(),
            tempKey,
            board.getContent()
        );
        board.setContent(contentFinal);

        mapper.updateBoard(board);
        saveAttachFiles(board.getBoard_id(), board.getBoard_type(), attachFiles);
        saveBoardTags(board.getBoard_id(), tagsCsv);

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