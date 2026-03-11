package org.joonzis.community.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.joonzis.community.dto.CommunityReplyDTO;
import org.joonzis.community.dto.CommunityViewDTO;
import org.joonzis.community.service.CommunityViewService;
import org.joonzis.community.vo.BoardFileVO;
import org.joonzis.community.vo.CategoryVO;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommunityViewController {

    private final CommunityViewService communityViewService;

    @Value("${hsf.upload.root:\\\\192.168.0.153\\\\projecthsf}")
    private String uploadRoot;

    @GetMapping("/view")
    public String view(@RequestParam("board_id") int board_id,
                       Model model,
                       HttpSession session,
                       HttpServletRequest request,
                       HttpServletResponse response) {

        Integer loginUserId = extractLoginUserId(session);
        model.addAttribute("loginUserId", loginUserId);

        CommunityViewDTO board = communityViewService.getBoard(board_id);
        if (board == null) return "redirect:/community/main";

        if (shouldIncreaseView(board_id, request)) {
            communityViewService.increaseViewCount(board_id);
            setViewCookie(board_id, response);
            board = communityViewService.getBoard(board_id);
        }

        CategoryVO category = communityViewService.getCategory(board.getCategory_id());
        List<BoardFileVO> fileList = communityViewService.getFiles(board_id);
        List<CommunityReplyDTO> replyList = communityViewService.getRootReplies(board_id);

        Map<String, Object> nav = communityViewService.getPrevNext(board_id);
        model.addAttribute("prev", nav.get("prev"));
        model.addAttribute("next", nav.get("next"));

        boolean liked = false;
        if (loginUserId != null && loginUserId > 0) {
            liked = communityViewService.isLiked(board_id, loginUserId);
        }

        model.addAttribute("board", board);
        model.addAttribute("category", category);
        model.addAttribute("fileList", fileList);
        model.addAttribute("replyList", replyList);
        model.addAttribute("liked", liked);

        return "community/CommunityView";
    }

    @GetMapping("/file/download")
    public ResponseEntity<Resource> download(@RequestParam("file_id") int fileId) throws IOException {
        BoardFileVO file = communityViewService.getFile(fileId);

        if (file == null) {
            return ResponseEntity.notFound().build();
        }

        if (file.getSaved_name() == null || !file.getSaved_name().matches("[a-zA-Z0-9._-]+")) {
            return ResponseEntity.badRequest().build();
        }

        Path basePath = Paths.get(uploadRoot, "board_upload").toAbsolutePath().normalize();
        Path filePath = basePath.resolve(file.getSub_dir()).resolve(file.getSaved_name()).normalize();

        if (!filePath.startsWith(basePath)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        String originalName = file.getOriginal_name();
        if (originalName == null || originalName.trim().isEmpty()) {
            originalName = file.getSaved_name();
        }

        String encodedName = URLEncoder.encode(originalName, StandardCharsets.UTF_8.name())
                .replaceAll("\\+", "%20");

        String contentDisposition = "attachment; filename=\""
                + encodedName + "\"; filename*=UTF-8''" + encodedName;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(resource.contentLength()))
                .contentType(MediaTypeFactory.getMediaType(originalName)
                        .orElse(MediaType.APPLICATION_OCTET_STREAM))
                .body(resource);
    }

    @PostMapping(value = "/like", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> like(@RequestParam("board_id") int board_id,
                                                    HttpSession session) {

        Integer loginUserId = extractLoginUserId(session);
        Map<String, Object> res = new HashMap<>();

        if (loginUserId == null || loginUserId <= 0) {
            res.put("ok", false);
            res.put("msg", "LOGIN_REQUIRED");
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(res);
        }

        Map<String, Object> likeRes = communityViewService.likeOnce(board_id, loginUserId);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(likeRes);
    }

    @PostMapping(value = "/report", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> report(@RequestParam("board_id") int board_id,
                                                      @RequestParam("reason") String reason,
                                                      HttpSession session) {

        Integer loginUserId = extractLoginUserId(session);
        Map<String, Object> res = new HashMap<>();

        if (loginUserId == null || loginUserId <= 0) {
            res.put("ok", false);
            res.put("msg", "LOGIN_REQUIRED");
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(res);
        }

        communityViewService.report(board_id, loginUserId, reason);
        res.put("ok", true);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(res);
    }

    private boolean shouldIncreaseView(int board_id, HttpServletRequest request) {
        String cookieName = "viewed_board_" + board_id;
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return true;
        for (Cookie c : cookies) {
            if (cookieName.equals(c.getName())) return false;
        }
        return true;
    }

    private void setViewCookie(int board_id, HttpServletResponse response) {
        String cookieName = "viewed_board_" + board_id;
        Cookie ck = new Cookie(cookieName, "Y");
        ck.setPath("/");
        ck.setMaxAge(60 * 60 * 24);
        response.addCookie(ck);
    }

    @SuppressWarnings("unchecked")
    private Integer extractLoginUserId(HttpSession session) {
        Object v = session.getAttribute("loginUserId");
        if (v instanceof Integer) return (Integer) v;
        if (v instanceof Number) return ((Number) v).intValue();
        if (v instanceof String) {
            try {
                return Integer.parseInt((String) v);
            } catch (NumberFormatException e) {
                // ignore
            }
        }

        Object user = session.getAttribute("loginUser");

        if (user instanceof UserVO) {
            return ((UserVO) user).getUser_id();
        }

        if (user instanceof Map) {
            Object id = ((Map<String, Object>) user).get("user_id");
            if (id instanceof Number) return ((Number) id).intValue();
            if (id instanceof String) {
                try {
                    return Integer.parseInt((String) id);
                } catch (NumberFormatException e) {
                    // ignore
                }
            }
        }

        return 0;
    }
}