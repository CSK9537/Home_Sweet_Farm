package org.joonzis.qna.controller;

import javax.servlet.http.HttpServletRequest;

import org.joonzis.qna.service.QnaListService;
import org.joonzis.qna.service.QnaMainService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.RequiredArgsConstructor;

import lombok.RequiredArgsConstructor;

@RequestMapping("/qna")
@Controller
@RequiredArgsConstructor
public class QnaController {

    private final QnaMainService qnaMainService;
    private final QnaListService qnaListService;

    @RequestMapping("")
    public String qnaMain(
            HttpServletRequest request,
            Model model,
            Integer faqPage,
            Integer waitingPage,
            String waitingSort
    ) {
        int fp = (faqPage == null || faqPage < 1) ? 1 : faqPage;
        int wp = (waitingPage == null || waitingPage < 1) ? 1 : waitingPage;
        String sort = (waitingSort == null || waitingSort.trim().isEmpty()) ? "recent" : waitingSort;

        String ctx = request.getContextPath();

        // QnaMain.jsp에서 사용하는 모델 키들 그대로 세팅
        qnaMainService.fillQnaMainModel(model, fp, wp, sort, ctx);

        return "qna/QnaMain";
    }

    @RequestMapping("/QnaList")
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
    
    private Integer loginUserId(HttpSession session) {
    	UserVO user = (UserVO)session.getAttribute("loginUser");
    	int user_id = 0;
    	if(user == null) return null;
    	user_id = user.getUser_id();
    	return user_id;
    }
    
    @GetMapping("/ask")
    public String qnaForm(
    		@RequestParam(defaultValue = "insert") String mode,
    		@RequestParam(required = false) Integer board_id,
    		@RequestParam(defaultValue = "Q") String boardType,
    		HttpSession session,
    		Model model) {
    	
    	// 임시 로그인 확인
    	Integer uid = loginUserId(session);
    	if(uid == null) return "redirect:/user/login";
    	
    	String tempKey = UUID.randomUUID().toString();
    	model.addAttribute("mode", mode);
    	model.addAttribute("tempKey",tempKey);
    	
    	BoardVO question = null;
    	boolean isOwner = false;
    	if("edit".equalsIgnoreCase(mode)) {
    		if(board_id == null || board_id.equals("")) return "redirect:/qna";
    		
    		// 질문 글 데이터 가져오기
    		question = formService.getBoardById(board_id);
    		// 작성자인지 확인 여부
    		isOwner = formService.isOwner(board_id, uid);
    		
    		model.addAttribute("question", question);
    		model.addAttribute("isOwner", isOwner);
    		boardType = question.getBoard_type();
    	}
    	model.addAttribute("boardType", boardType);
    	return "qna/QnaForm";
    }
    
    // ====== 선업로드 ======
    @PostMapping( 
    		value= "/upload",
    		produces = MediaType.APPLICATION_JSON_VALUE)
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

        Integer uid = loginUserId(session);
        if (uid == null) return "redirect:/user/login";

        board.setContent(contentHtml);

        int boardId = formService.write(board, uid, tempKey, attachFiles, tagsCsv);
        return "redirect:" + req.getContextPath() + "/qna/detail?board_id=" + boardId;
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

        Integer uid = loginUserId(session);
        if (uid == null) return "redirect:/user/login";

        board.setContent(contentHtml);

        int boardId = formService.edit(board, uid, tempKey, attachFiles, tagsCsv);
        return "redirect:" + req.getContextPath() + "/qna/detail?board_id=" + boardId;
    }
    
    // ===== 질문글 상세 보기 ======
    @GetMapping("/detail")
    public String qnaDetail() {
    	return "qna/QnaView";
    }
}