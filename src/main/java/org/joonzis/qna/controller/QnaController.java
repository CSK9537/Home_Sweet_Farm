package org.joonzis.qna.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/qna")
@Controller
public class QnaController {
	
	@RequestMapping("")
	public String qnaMain() {
		return "qna/QnaMain";
	}
	
	@RequestMapping("/QnaList")
	public String qnaList() {
		return "qna/QnaList";
	}
}
