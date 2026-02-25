package org.joonzis.community.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

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

    /**
     * NAS 루트(UNC 권장)
     * 예) \\192.168.0.153\\projecthsf
     */
    @Value("${hsf.upload.root:\\\\192.168.0.153\\\\projecthsf}")
    private String uploadRoot;

    private String today() {
        return new SimpleDateFormat("yyyyMMdd").format(new Date());
    }

    private boolean isMarketType(String boardType) {
        return "T".equals(boardType) || "S".equals(boardType);
    }

    private String boardFolderKor(String boardType) {
        // 요구사항 반영: 자유게시판 / 벼룩시장
        return isMarketType(boardType) ? "벼룩시장" : "자유게시판";
    }

    private String safeExt(String name) {
        if (name == null) return "";
        int idx = name.lastIndexOf('.');
        if (idx < 0) return "";
        String ext = name.substring(idx).toLowerCase();
        // 필요하면 화이트리스트 처리
        return ext;
    }

    private String newSavedName(String originalName) {
        return UUID.randomUUID().toString().replace("-", "") + safeExt(originalName);
    }

    private Path buildSaveDir(String boardType) {
        // projecthsf/board_upload/{자유게시판|벼룩시장}/{yyyyMMdd}
        return Paths.get(uploadRoot, "board_upload", boardFolderKor(boardType), today());
    }

    private String buildSubDir(String boardType) {
        // DB용(상대): 자유게시판/20260224
        return boardFolderKor(boardType) + "/" + today();
    }

    private String buildServeUrl(String subDir, String savedName) {
        // 브라우저 접근은 컨트롤러 스트리밍으로 통일
        // /community/file?subDir=자유게시판/20260224&savedName=xxx.png
        return "/community/file?subDir=" + encode(subDir) + "&savedName=" + encode(savedName);
    }

    private String encode(String s) {
        try {
            return java.net.URLEncoder.encode(s, "UTF-8");
        } catch (Exception e) {
            return s;
        }
    }

    @Override
    @Transactional
    public UploadResponseDTO uploadTempFile(String tempKey, String boardType, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("file is empty");
        }
        if (tempKey == null || tempKey.trim().isEmpty()) {
            throw new IllegalArgumentException("tempKey is required");
        }
        if (boardType == null || boardType.trim().isEmpty()) boardType = "G";

        String original = file.getOriginalFilename();
        String saved = newSavedName(original);

        Path dir = buildSaveDir(boardType);
        try {
            Files.createDirectories(dir);
            Path target = dir.resolve(saved);
            file.transferTo(target.toFile());
        } catch (IOException e) {
            throw new RuntimeException("upload failed", e);
        }

        String subDir = buildSubDir(boardType);

        // DB 기록(임시, board_id = null)
        BoardFileVO vo = new BoardFileVO();
        vo.setBoard_id(null);
        vo.setOriginal_name(original);
        vo.setSaved_name(saved);
        vo.setFile_size((int) file.getSize());
        vo.setContent_type(file.getContentType());
        vo.setTemp_key(tempKey);
        vo.setSub_dir(subDir);
        vo.setFile_kind("EDITOR");   // addImageBlobHook/첨부이미지 본문삽입 모두 여기로
        vo.setIs_active("Y");
        vo.setIs_thumbnail("N");     // 썸네일은 글 등록 시 첫 이미지로 세팅(정책)

        mapper.insertBoardFile(vo);

        // URL은 컨트롤러에서 스트리밍
        String url = buildServeUrl(subDir, saved);
        return new UploadResponseDTO(url, saved, subDir);
    }

    @Override
    @Transactional
    public int write(BoardVO board, String tempKey, MultipartFile[] attachFiles, String tagsCsv) {
        // 1) 게시글 insert
        mapper.insertBoard(board);

        // board_id 획득 방식:
        // - Oracle + SEQ 사용이면 insert 전에 NEXTVAL을 받아 VO에 세팅하거나
        // - SELECT SEQ_TBL_BOARD.CURRVAL 로 가져오는 보조쿼리 필요
        // 여기서는 "컨트롤러에서 board_id 미리 세팅" 방식(추천)으로 가정합니다.
        if (board.getBoard_id() <= 0) {
            throw new IllegalStateException("board_id must be set before insert (use SEQ in controller)");
        }

        // 2) 선업로드 파일들을 게시글에 연결
        if (tempKey != null && !tempKey.trim().isEmpty()) {
            mapper.attachTempFilesToBoard(tempKey, board.getBoard_id());
            // (선택) 첫 이미지 썸네일 처리: tempKey 파일 목록의 첫 번째를 썸네일로 update 하는 쿼리 추가 가능
        }

        // 3) 첨부(비이미지) 파일 저장 + DB 기록
        saveAttachFiles(board.getBoard_id(), board.getBoard_type(), attachFiles);

        // 4) 해시태그 반영
        // 이 프로젝트에서 "게시글-해시태그 매핑 테이블"이 무엇인지(이전 대화에서 TBL_BOARD_HASHTAG_LIST 외에 연결 테이블 존재) 기준으로
        // upsert + mapping insert 로직을 붙이면 됩니다.
        // 여기서는 tagsCsv 파싱까지만 걸어두고, 실제 매핑 insert는 프로젝트 테이블명 확정 후 추가하세요.
        // parseTags(tagsCsv);

        return board.getBoard_id();
    }

    @Override
    @Transactional
    public int edit(BoardVO board, int loginUserId, String tempKey, MultipartFile[] attachFiles, String tagsCsv) {
        // 1) 작성자 검증(서버에서 1차 차단)
        Integer owner = mapper.selectBoardOwnerUserId(board.getBoard_id());
        if (owner == null || owner.intValue() != loginUserId) {
            throw new SecurityException("not owner");
        }

        // 2) 게시글 update
        mapper.updateBoard(board);

        // 3) (정책) 수정 시 기존 파일 유지/교체 선택
        // - 교체 정책이면: 기존 파일 N 처리 후 새 tempKey 연결
        // - 유지 정책이면: 새로 올린 것만 추가
        // 아래는 "유지 + 새로 올린 것만 추가" 정책
        if (tempKey != null && !tempKey.trim().isEmpty()) {
            mapper.attachTempFilesToBoard(tempKey, board.getBoard_id());
        }

        // 4) 첨부 파일 추가 저장
        saveAttachFiles(board.getBoard_id(), board.getBoard_type(), attachFiles);

        // 5) 해시태그 갱신(연결테이블 기준으로 delete+insert or diff-update)
        // parseTags(tagsCsv);

        return board.getBoard_id();
    }

    private void saveAttachFiles(int boardId, String boardType, MultipartFile[] attachFiles) {
        if (attachFiles == null || attachFiles.length == 0) return;

        Path dir = buildSaveDir(boardType);
        String subDir = buildSubDir(boardType);

        for (MultipartFile f : attachFiles) {
            if (f == null || f.isEmpty()) continue;

            String original = f.getOriginalFilename();
            String saved = newSavedName(original);

            try {
                Files.createDirectories(dir);
                Path target = dir.resolve(saved);
                f.transferTo(target.toFile());
            } catch (IOException e) {
                throw new RuntimeException("attach upload failed", e);
            }

            BoardFileVO vo = new BoardFileVO();
            vo.setBoard_id(boardId);
            vo.setOriginal_name(original);
            vo.setSaved_name(saved);
            vo.setFile_size((int) f.getSize());
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
}