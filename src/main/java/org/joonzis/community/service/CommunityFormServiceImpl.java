package org.joonzis.community.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
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

    // ===== 최종 저장(등록/수정 완료 시점) =====
    private Path buildSaveDir(String boardType) {
        return Paths.get(uploadRoot, "board_upload", boardFolderKor(boardType), today());
    }

    private String buildSubDir(String boardType) {
        return boardFolderKor(boardType) + "/" + today();
    }

    // ===== 임시 저장(업로드 직후, submit 전) =====
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

    // ===== meta 저장(원본명/타입 보관용) =====
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
            // meta 저장 실패는 치명적이지 않게 처리
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
        try { Files.deleteIfExists(p); } catch (Exception e) {}
    }

    private void deleteDirectoryRecursive(Path dir) {
        if (dir == null) return;
        if (!Files.exists(dir)) return;
        try {
            Files.walk(dir)
                 .sorted((a, b) -> b.compareTo(a))
                 .forEach(this::deleteQuietly);
        } catch (Exception e) {
            // ignore
        }
    }

    // ===== 본문 HTML에서 temp 이미지(savedName)만 추출 =====
    private Set<String> extractTempSavedNamesFromHtml(String html, String tempSubDir) {
        Set<String> out = new HashSet<>();
        if (html == null || html.trim().isEmpty()) return out;

        // .../community/file?subDir=_temp%2F{tempKey}&savedName=xxxx.png
        Pattern p = Pattern.compile("subDir=([^&\\\"']+)&savedName=([a-zA-Z0-9._-]+)");
        Matcher m = p.matcher(html);
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
            String from = "subDir=" + encodedTemp + "&savedName=" + encode(saved);
            String to   = "subDir=" + encodedFinal + "&savedName=" + encode(saved);
            out = out.replace(from, to);
        }
        return out;
    }

    /**
     * ✅ submit 시점에만:
     * 1) _temp/tempKey에 있는 이미지를 최종 폴더로 이동
     * 2) 그때만 TBL_BOARD_FILE insert
     * 3) 본문 HTML의 subDir을 최종 경로로 치환
     */
    private String finalizeTempImagesIfNeeded(int boardId, String boardType, String tempKey, String contentHtml) {
        if (tempKey == null || tempKey.trim().isEmpty()) return contentHtml;
        if (boardType == null || boardType.trim().isEmpty()) boardType = "G";

        Path tempDir = buildTempDir(tempKey);
        if (!Files.exists(tempDir)) return contentHtml;

        String tempSubDir = buildTempSubDir(tempKey);
        Set<String> usedSaved = extractTempSavedNamesFromHtml(contentHtml, tempSubDir);

        // 본문에서 temp 이미지를 다 지운 경우: temp 폴더 통째로 정리
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

            long sizeLong = 0L;
            try { sizeLong = Files.size(src); } catch (IOException e) { sizeLong = 0L; }

            Path dst = finalDir.resolve(savedName);
            try {
                Files.move(src, dst, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                throw new RuntimeException("move temp file failed", e);
            }

            deleteQuietly(metaPath(tempDir, savedName));

            // ✅ 여기서만 DB insert
            BoardFileVO vo = new BoardFileVO();
            vo.setBoard_id(boardId);
            vo.setOriginal_name(original);
            vo.setSaved_name(savedName);
            vo.setFile_size((int) Math.min(Integer.MAX_VALUE, sizeLong));
            vo.setContent_type(ct);
            vo.setTemp_key(null);
            vo.setSub_dir(finalSubDir);
            vo.setFile_kind("EDITOR");
            vo.setIs_active("Y");
            vo.setIs_thumbnail("N");
            mapper.insertBoardFile(vo);
        }

        // temp 폴더 정리(본문에서 삭제된 이미지 포함)
        deleteDirectoryRecursive(tempDir);

        // 본문 URL 치환
        return rewriteHtmlTempToFinal(contentHtml, tempSubDir, finalSubDir, usedSaved);
    }

    // ==============================
    // Public APIs
    // ==============================

    @Override
    @Transactional
    public UploadResponseDTO uploadTempFile(MultipartFile file, String tempKey, String boardType) {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("file is empty");
        if (tempKey == null || tempKey.trim().isEmpty()) throw new IllegalArgumentException("tempKey is required");
        if (boardType == null || boardType.trim().isEmpty()) boardType = "G";

        String original = file.getOriginalFilename();
        String saved = newSavedName(original);

        // ✅ 업로드 시점: 로컬/NAS 임시 폴더에만 저장 (DB 저장 X)
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

        // 1) SEQ 선세팅
        int nextId = mapper.selectBoardSeqNextVal();
        board.setBoard_id(nextId);

        // 2) 게시글 먼저 insert (FK 존재 시 BOARD_FILE 선 insert 방지)
        mapper.insertBoard(board);

        // 3) submit 시점: temp 이미지 이동 + DB 저장 + 본문 URL 치환
        String contentFinal = finalizeTempImagesIfNeeded(nextId, board.getBoard_type(), tempKey, board.getContent());
        if (contentFinal != null && !contentFinal.equals(board.getContent())) {
            board.setContent(contentFinal);
            mapper.updateBoard(board); // content 변경 반영
        }

        // 4) 첨부(비이미지) 파일 저장 + DB 기록
        saveAttachFiles(nextId, board.getBoard_type(), attachFiles);

        // 5) 해시태그 처리(추후)
        // parseTags(tagsCsv);

        return nextId;
    }

    @Override
    @Transactional
    public int edit(BoardVO board, int loginUserId, String tempKey, MultipartFile[] attachFiles, String tagsCsv) {
        if (board == null) throw new IllegalArgumentException("board is null");
        if (loginUserId <= 0) throw new SecurityException("login required");

        Integer owner = mapper.selectBoardOwnerUserId(board.getBoard_id());
        if (owner == null || owner.intValue() != loginUserId) {
            throw new SecurityException("not owner");
        }

        // ✅ submit 시점: temp 이미지 이동 + DB 저장 + 본문 URL 치환
        String contentFinal = finalizeTempImagesIfNeeded(board.getBoard_id(), board.getBoard_type(), tempKey, board.getContent());
        board.setContent(contentFinal);

        mapper.updateBoard(board);
        saveAttachFiles(board.getBoard_id(), board.getBoard_type(), attachFiles);

        // 해시태그 갱신(추후)
        // parseTags(tagsCsv);

        return board.getBoard_id();
    }

    private void saveAttachFiles(int boardId, String boardType, MultipartFile[] attachFiles) {
        if (attachFiles == null || attachFiles.length == 0) return;
        if (boardType == null || boardType.trim().isEmpty()) boardType = "G";

        Path dir = buildSaveDir(boardType);
        String subDir = buildSubDir(boardType);

        for (MultipartFile f : attachFiles) {
            if (f == null || f.isEmpty()) continue;

            String original = f.getOriginalFilename();
            String saved = newSavedName(original);

            try {
                Files.createDirectories(dir);
                f.transferTo(dir.resolve(saved).toFile());
            } catch (IOException e) {
                throw new RuntimeException("attach upload failed", e);
            }

            BoardFileVO vo = new BoardFileVO();
            vo.setBoard_id(boardId);
            vo.setOriginal_name(original);
            vo.setSaved_name(saved);
            vo.setFile_size((int) Math.min(Integer.MAX_VALUE, f.getSize()));
            vo.setContent_type(f.getContentType());
            vo.setTemp_key(null);
            vo.setSub_dir(subDir);
            vo.setFile_kind("ATTACH");
            vo.setIs_active("Y");
            vo.setIs_thumbnail("N");

            mapper.insertBoardFile(vo);
        }
    }

    @Override
    public List<String> suggestHashtags(String q, int limit) {
        if (q == null) q = "";
        q = q.trim();
        if (q.isEmpty()) return java.util.Collections.emptyList();
        if (limit <= 0) limit = 10;
        if (limit > 20) limit = 20;
        return mapper.selectHashtagSuggest(q, limit);
    }
    
    @Override
    public BoardVO getBoardById(int boardId) {
    	return mapper.selectBoardById(boardId);
    }
    
    @Override
    public boolean isOwner(int boardId, int loginUserId) {
    	if (loginUserId <= 0) return false;
        Integer owner = mapper.selectBoardOwnerUserId(boardId);
        return owner != null && owner.intValue() == loginUserId;
    }
}