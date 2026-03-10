package org.joonzis.community.controller;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.joonzis.community.dto.UploadResponseDTO;
import org.joonzis.community.service.CommunityFormService;
import org.joonzis.community.vo.BoardVO;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
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
        Object v = session.getAttribute("loginUser");
        if (v instanceof UserVO) {
            return ((UserVO) v).getUser_id();
        }
        return 0;
    }

    @GetMapping("/form")
    public String form(
            @RequestParam(defaultValue = "insert") String mode,
            @RequestParam(required = false) Integer board_id,
            @RequestParam(defaultValue = "G") String boardType,
            HttpSession session,
            Model model
    ) {
        int uid = loginUserId(session);

        String tempKey = UUID.randomUUID().toString();

        model.addAttribute("mode", mode);
        model.addAttribute("tempKey", tempKey);
        model.addAttribute("editTags", "");

        if ("edit".equalsIgnoreCase(mode)) {
            if (uid <= 0) return "redirect:/user/login";
            if (board_id == null) return "redirect:/community/main";

            BoardVO post = formService.getBoardById(board_id);
            if (post == null) return "redirect:/community/main";

            boolean isOwner = formService.isOwner(board_id, uid);

            model.addAttribute("post", post);
            model.addAttribute("isOwner", isOwner);
            model.addAttribute("boardType", post.getBoard_type());
            model.addAttribute("tempKey", tempKey);

            return "community/CommunityForm";
        }

        model.addAttribute("boardType", boardType);
        model.addAttribute("tempKey", tempKey);

        return "community/CommunityForm";
    }

    @PostMapping(
            value = "/upload",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseBody
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tempKey") String tempKey,
            @RequestParam("boardType") String boardType,
            HttpServletRequest req
    ) {
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

    @GetMapping("/file")
    public ResponseEntity<Resource> file(
            @RequestParam("subDir") String subDir,
            @RequestParam("savedName") String savedName
    ) throws IOException {

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

    @GetMapping("/hashtag/suggest")
    public ResponseEntity<java.util.List<String>> suggest(
            @RequestParam("q") String q,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(formService.suggestHashtags(q, limit));
    }

    @PostMapping("/write")
    public String write(BoardVO board,
                        @RequestParam("tempKey") String tempKey,
                        @RequestParam(value = "attachFiles", required = false) MultipartFile[] attachFiles,
                        @RequestParam(value = "tagsHidden", required = false) String tagsCsv,
                        @RequestParam("contentHtml") String contentHtml,
                        HttpSession session,
                        HttpServletRequest req) {

        int uid = loginUserId(session);
        if (uid <= 0) return "redirect:/user/login";

        board.setContent(contentHtml);

        int boardId = formService.write(board, uid, tempKey, attachFiles, tagsCsv);
        return "redirect:" + req.getContextPath() + "/qna/view?board_id=" + boardId;
    }

    @PostMapping("/edit")
    public String edit(BoardVO board,
                       @RequestParam("tempKey") String tempKey,
                       @RequestParam(value = "attachFiles", required = false) MultipartFile[] attachFiles,
                       @RequestParam(value = "tagsHidden", required = false) String tagsCsv,
                       @RequestParam("contentHtml") String contentHtml,
                       HttpSession session,
                       HttpServletRequest req) {

        int uid = loginUserId(session);
        if (uid <= 0) return "redirect:/user/login";

        board.setContent(contentHtml);

        int boardId = formService.edit(board, uid, tempKey, attachFiles, tagsCsv);
        return "redirect:" + req.getContextPath() + "/community/view?board_id=" + boardId;
    }
}