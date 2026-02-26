package org.joonzis.community.controller;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.joonzis.community.dto.UploadResponseDTO;
import org.joonzis.community.service.CommunityFormService;
import org.joonzis.community.vo.BoardVO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommunityFormController {

    private final CommunityFormService formService;

    @Value("${hsf.upload.root:\\\\192.168.0.153\\\\projecthsf}")
    private String uploadRoot;

    private int loginUserId(HttpSession session) {
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
            @RequestParam(defaultValue = "G") String boardType,   // insert일 때만 의미
            HttpSession session,
            Model model
    ) {
        int uid = loginUserId(session);

        // ✅ 페이지 단위 업로드 묶음키(새로 발급)
        String tempKey = java.util.UUID.randomUUID().toString();
        model.addAttribute("mode", mode);
        model.addAttribute("tempKey", tempKey);

        // ===== edit 모드: 기존 게시글 로드 + 권한 체크 + boardType은 DB 기준 =====
        if ("edit".equalsIgnoreCase(mode)) {
            if (uid <= 0) return "redirect:/login";
            if (board_id == null) return "redirect:/community/main";

            BoardVO post = formService.getBoardById(board_id);
            if (post == null) return "redirect:/community/main";

            boolean isOwner = formService.isOwner(board_id, uid);

            model.addAttribute("post", post);                 // ✅ JSP에서 post.xxx 로 사용
            model.addAttribute("isOwner", isOwner);           // ✅ JSP에서 작성자 여부 제어
            model.addAttribute("boardType", post.getBoard_type()); // ✅ DB 기준으로 자동 세팅
            return "community/CommunityForm";
        }

        // ===== insert 모드: boardType 파라미터 기준 =====
        model.addAttribute("boardType", boardType);
        return "community/CommunityForm";
    }

    // ====== 선업로드 ======
    @PostMapping("/upload")
    @ResponseBody
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tempKey") String tempKey,
            @RequestParam("boardType") String boardType,
            HttpServletRequest req) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 비어있습니다.");
        }
        if (tempKey == null || tempKey.isBlank()) {
            return ResponseEntity.badRequest().body("tempKey가 필요합니다.");
        }

        try {
            UploadResponseDTO dto = formService.uploadTempFile(file, tempKey, boardType);
            String fullUrl = req.getContextPath() + dto.getUrl();
            return ResponseEntity.ok(new UploadResponseDTO(fullUrl, dto.getSavedName(), dto.getSubDir()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("업로드 실패");
        }
    }

    // ====== 파일 스트리밍 ======
    @GetMapping("/file")
    public ResponseEntity<Resource> file(
            @RequestParam("subDir") String subDir,
            @RequestParam("savedName") String savedName) throws IOException {

        if (!savedName.matches("[a-zA-Z0-9._-]+")) {
            return ResponseEntity.badRequest().build();
        }

        Path basePath = Paths.get(uploadRoot, "board_upload").toAbsolutePath().normalize();
        Path filePath = basePath.resolve(subDir).resolve(savedName).normalize();

        if (!filePath.startsWith(basePath)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaTypeFactory.getMediaType(resource).orElse(MediaType.APPLICATION_OCTET_STREAM))
                .body(resource);
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
    public String write(BoardVO board,
                        @RequestParam("tempKey") String tempKey,
                        @RequestParam(value = "attachFiles", required = false) MultipartFile[] attachFiles,
                        @RequestParam(value = "tagsHidden", required = false) String tagsCsv,
                        @RequestParam("contentHtml") String contentHtml,
                        HttpSession session,
                        HttpServletRequest req) {

        int uid = loginUserId(session);
        if (uid <= 0) return "redirect:/login";

        board.setContent(contentHtml);

        int boardId = formService.write(board, uid, tempKey, attachFiles, tagsCsv);
        return "redirect:" + req.getContextPath() + "/community/detail?board_id=" + boardId;
    }

    // ====== 글 수정 ======
    @PostMapping("/edit")
    public String edit(BoardVO board,
                       @RequestParam("tempKey") String tempKey,
                       @RequestParam(value = "attachFiles", required = false) MultipartFile[] attachFiles,
                       @RequestParam(value = "tagsHidden", required = false) String tagsCsv,
                       @RequestParam("contentHtml") String contentHtml,
                       HttpSession session,
                       HttpServletRequest req) {

        int uid = loginUserId(session);
        if (uid <= 0) return "redirect:/login";

        board.setContent(contentHtml);

        int boardId = formService.edit(board, uid, tempKey, attachFiles, tagsCsv);
        return "redirect:" + req.getContextPath() + "/community/detail?board_id=" + boardId;
    }
}