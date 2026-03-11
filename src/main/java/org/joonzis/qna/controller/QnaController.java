package org.joonzis.qna.controller;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.joonzis.community.dto.UploadResponseDTO;
import org.joonzis.community.service.CommunityFormService;
import org.joonzis.community.vo.BoardVO;
import org.joonzis.qna.dto.QnaViewDTO;
import org.joonzis.qna.service.QnaListService;
import org.joonzis.qna.service.QnaMainService;
import org.joonzis.qna.service.QnaViewService;
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

@RequestMapping("/qna")
@Controller
@RequiredArgsConstructor
public class QnaController {
    @Value("${hsf.upload.root:\\\\192.168.0.153\\\\projecthsf}")
    private String uploadRoot;
    
    private final QnaMainService qnaMainService;
    private final QnaListService qnaListService;
    private final QnaViewService qnaViewService;
    private final CommunityFormService formService;

    @RequestMapping("")
    public String qnaMain(
            HttpServletRequest request,
            Model model,
            @RequestParam(value = "faqPage", required = false) Integer faqPage,
            @RequestParam(value = "waitingPage", required = false) Integer waitingPage,
            @RequestParam(value = "waitingSort", required = false) String waitingSort
    ) {
        int fp = (faqPage == null || faqPage < 1) ? 1 : faqPage;
        int wp = (waitingPage == null || waitingPage < 1) ? 1 : waitingPage;
        String sort = (waitingSort == null || waitingSort.trim().isEmpty()) ? "recent" : waitingSort;

        qnaMainService.fillQnaMainModel(model, fp, wp, sort, request.getContextPath());
        return "qna/QnaMain";
    }

    @GetMapping("/QnaList")
    public String qnaList(
            Model model,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "q", required = false) String query,
            @RequestParam(value = "sortKey", defaultValue = "created") String sortKey,
            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir
    ) {
        qnaListService.fillQnaListModel(model, page, category, query, sortKey, sortDir);
        return "qna/QnaList";
    }

    private int loginUserId(HttpSession session) {
        UserVO user = (UserVO) session.getAttribute("loginUser");
        return (user != null) ? user.getUser_id() : -1;
    }

    @GetMapping("/ask")
    public String qnaForm(
    		@RequestParam(defaultValue = "insert") String mode,
    		@RequestParam(required = false) Integer board_id,
    		@RequestParam(defaultValue = "Q") String boardType,
    		HttpSession session,
    		Model model) {
    	
    	int user_id = loginUserId(session);
    	if(user_id == -1) {
    		return "redirect:/user/loginView";
    	}
    	
    	if(mode.equals("update") && board_id != null) {
    		BoardVO board = formService.getBoardById(board_id);
    		model.addAttribute("board", board);
    	}
    	
    	model.addAttribute("mode", mode);
    	model.addAttribute("boardType", boardType);
    	model.addAttribute("tempKey", UUID.randomUUID().toString());
    	
    	return "qna/QnaForm";
    }

    // ====== 선업로드 ======
    @PostMapping(value = "/upload", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<UploadResponseDTO> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tempKey") String tempKey,
            @RequestParam("boardType") String boardType) {
        UploadResponseDTO res = formService.uploadTempFile(file, tempKey, boardType);
        return ResponseEntity.ok(res);
    }

    // ====== 파일 스트리밍 ======
    @GetMapping("/file")
    @ResponseBody
    public ResponseEntity<Resource> file(
            @RequestParam("subDir") String subDir,
            @RequestParam("savedName") String savedName) {
        try {
            Path path = Paths.get(uploadRoot, subDir, savedName);
            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = MediaTypeFactory.getMediaType(resource).orElse(MediaType.APPLICATION_OCTET_STREAM).toString();

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ====== 해시태그 추천 ======
    @GetMapping(value = "/suggest-tags", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<String> suggest(
            @RequestParam("q") String q,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return formService.suggestHashtags(q, limit);
    }

    // ====== 글 등록 ======
    @PostMapping("/write")
    public String write(BoardVO board,
                        @RequestParam("tempKey") String tempKey,
                        @RequestParam(value="tagNames", required=false) String tagNames,
                        @RequestParam("contentHtml") String contentHtml,
                        HttpSession session,
                        HttpServletRequest req) {
        int userId = loginUserId(session);
        if (userId == -1) return "redirect:/user/loginView";

        board.setUser_id(userId);
        board.setContent(contentHtml);

        formService.write(board, userId, tempKey, null, tagNames);
        return "redirect:/qna/QnaList";
    }

    // ====== 글 수정 ======
    @PostMapping("/edit")
    public String edit(BoardVO board,
                       @RequestParam("tempKey") String tempKey,
                       @RequestParam(value="tagNames", required=false) String tagNames,
                       @RequestParam("contentHtml") String contentHtml,
                       HttpSession session,
                       HttpServletRequest req) {
        int userId = loginUserId(session);
        if (userId == -1) return "redirect:/user/loginView";

        board.setUser_id(userId);
        board.setContent(contentHtml);

        formService.edit(board, userId, tempKey, null, tagNames);
        return "redirect:/qna/detail?qna_id=" + board.getBoard_id();
    }

    @GetMapping("/people")
    public String qnaPeople(HttpServletRequest request, Model model) {
        Map<String, Object> result = qnaMainService.getActiveUsersJson(1, request.getContextPath());
        model.addAllAttributes(result);
        return "qna/QnaPeople";
    }

    @GetMapping(value = "/people/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getPeopleList(
            @RequestParam(defaultValue = "1") int page,
            HttpServletRequest request) {
        String ctx = request.getContextPath();
        Map<String, Object> result = qnaMainService.getActiveUsersJson(page, ctx);
        return ResponseEntity.ok(result);
    }
    
    // ===== 질문글 상세 보기 ======
    @GetMapping("/detail")
    public String qnaDetail(@RequestParam("qna_id") int qna_id, Model model, HttpSession session) {
        QnaViewDTO qnaView = qnaViewService.getQnaView(qna_id);
        
        if (qnaView == null) {
            return "redirect:/qna/QnaList";
        }
        
        model.addAttribute("board", qnaView.getBoard());
        model.addAttribute("answerList", qnaView.getAnswerList());
        model.addAttribute("replyList", qnaView.getReplyList());
        
        // 로그인 정보 (JSP에서 사용 예정)
        UserVO loginUser = (UserVO) session.getAttribute("loginUser");
        if (loginUser != null) {
            model.addAttribute("loginUserId", loginUser.getUser_id());
        }
        
        return "qna/QnaView";
    }
    
    // =====답변 달기=====
    @PostMapping(
    		value="/AnswerWrite",
    		produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> answerAdd(
    		HttpSession session,
    		@RequestParam String content,
    		@RequestParam int parentId){
    	UserVO user = (UserVO)session.getAttribute("loginUser");
    	if(user == null) return new ResponseEntity<String>("need login",HttpStatus.BAD_GATEWAY);
    	int uid = user.getUser_id();
    	String title = "QnaAnswer" + UUID.randomUUID().toString();
    	
    	int result = qnaViewService.registerAnswer(uid, title, content, parentId);
    	if(result > 0) {
    		return new ResponseEntity<String>("success", HttpStatus.OK);
    	} else {
    		return new ResponseEntity<String>("fail", HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    }
}