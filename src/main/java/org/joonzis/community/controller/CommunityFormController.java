package org.joonzis.community.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.joonzis.community.dto.UploadResponseDTO;
import org.joonzis.community.service.CommunityFormService;
import org.joonzis.community.vo.BoardVO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommunityFormController {

    private final CommunityFormService formService;

    @Value("${hsf.upload.root:\\\\192.168.0.153\\\\projecthsf}")
    private String uploadRoot;

    // ====== 로그인 유저ID 가져오기(프로젝트 세션 키에 맞게 수정) ======
    private int loginUserId(HttpSession session) {
        // 예시:
        // Integer id = (Integer) session.getAttribute("user_id");
        // return id == null ? 0 : id;
        Object v = session.getAttribute("user_id");
        if (v instanceof Integer) return (Integer) v;
        if (v instanceof String) {
            try { return Integer.parseInt((String) v); } catch (Exception e) {}
        }
        return 0;
    }

    // ====== 폼 진입 ======
    @GetMapping("/form")
    public String form(
            @RequestParam(defaultValue = "insert") String mode,  // insert|edit
            @RequestParam(required = false) Integer board_id,
            @RequestParam(defaultValue = "G") String boardType,   // G/A/T/S
            HttpSession session,
            Model model
    ) {
        // tempKey는 "페이지 단위"로 발급 (업로드 파일 묶음)
        String tempKey = java.util.UUID.randomUUID().toString();

        model.addAttribute("mode", mode);
        model.addAttribute("tempKey", tempKey);
        model.addAttribute("boardType", boardType);

        // 수정 모드면 서버에서 board 조회해서 초기값 내려주기(프로젝트 로직에 맞게 확장)
        // 작성자 검증은 edit submit에서 1차, form 진입에서도 1차(원하면)
        if ("edit".equalsIgnoreCase(mode) && board_id != null) {
            // TODO: board 조회 후 model에 담기
            // model.addAttribute("board", board);
            // model.addAttribute("__IS_OWNER__", true/false);
        }

        return "community/CommunityForm";
    }

    // ====== 선업로드: Toast UI addImageBlobHook / 첨부이미지 본문삽입 ======
    @PostMapping("/upload")
    public ResponseEntity<UploadResponseDTO> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "tempKey", required = false) String tempKey,
            @RequestParam(value = "boardType", required = false, defaultValue = "G") String boardType
    ) {
        if (!StringUtils.hasText(tempKey)) {
            // JS가 tempKey를 안 보내는 경우를 대비해 서버에서 생성
            tempKey = java.util.UUID.randomUUID().toString();
        }
        UploadResponseDTO res = formService.uploadTempFile(tempKey, boardType, file);

        // JS는 res.url, res.savedName, res.subDir를 사용
        return ResponseEntity.ok(res);
    }

    // ====== NAS 파일 스트리밍(브라우저 접근 URL 통일) ======
    @GetMapping("/file")
    public ResponseEntity<byte[]> file(
            @RequestParam("subDir") String subDir,
            @RequestParam("savedName") String savedName
    ) throws IOException {

        // projecthsf/board_upload/{subDir}/{savedName}
        Path path = Paths.get(uploadRoot, "board_upload", subDir, savedName);

        if (!Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }

        byte[] bytes = Files.readAllBytes(path);

        String ct = Files.probeContentType(path);
        MediaType mt = (ct != null) ? MediaType.parseMediaType(ct) : MediaType.APPLICATION_OCTET_STREAM;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, mt.toString())
                .body(bytes);
    }

    // ====== 해시태그 추천 ======
    @GetMapping("/hashtag/suggest")
    public ResponseEntity<java.util.List<String>> suggest(
            @RequestParam("q") String q,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(formService.suggestHashtags(q, limit));
    }

    // ====== 글 등록 ======
    @PostMapping("/write")
    public String write(
            BoardVO board,
            @RequestParam("tempKey") String tempKey,
            @RequestParam(value = "attachFiles", required = false) MultipartFile[] attachFiles,
            @RequestParam(value = "tagsHidden", required = false) String tagsCsv,
            @RequestParam("contentHtml") String contentHtml,
            HttpSession session,
            HttpServletRequest req
    ) {
        int uid = loginUserId(session);
        if (uid <= 0) throw new SecurityException("login required");

        // BoardVO 세팅
        board.setUser_id(uid);
        board.setContent(contentHtml);

        // ✅ Oracle SEQ를 쓰면 여기서 board_id를 선세팅하는 방식을 추천
        // ex) int newId = mapper.selectBoardSeqNextVal(); board.setBoard_id(newId);
        // 현재는 write() 서비스에서 board_id가 세팅되어 있어야 한다고 가정했으니,
        // 실제 프로젝트에서는 "NEXTVAL 선조회" 쿼리를 추가하세요.

        int boardId = formService.write(board, tempKey, attachFiles, tagsCsv);

        return "redirect:" + req.getContextPath() + "/community/detail?board_id=" + boardId;
    }

    // ====== 글 수정 ======
    @PostMapping("/edit")
    public String edit(
            BoardVO board,
            @RequestParam("tempKey") String tempKey,
            @RequestParam(value = "attachFiles", required = false) MultipartFile[] attachFiles,
            @RequestParam(value = "tagsHidden", required = false) String tagsCsv,
            @RequestParam("contentHtml") String contentHtml,
            HttpSession session,
            HttpServletRequest req
    ) {
        int uid = loginUserId(session);
        if (uid <= 0) throw new SecurityException("login required");

        board.setContent(contentHtml);

        int boardId = formService.edit(board, uid, tempKey, attachFiles, tagsCsv);

        return "redirect:" + req.getContextPath() + "/community/detail?board_id=" + boardId;
    }
}