package org.joonzis.common.error;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.log4j.Log4j;

@Controller
@Log4j
public class ProjectErrorController{

	@RequestMapping("/error404")
	public String handle404(HttpServletRequest request, Model model) {
		log.warn(this.getClass().getName() + "404 에러 발생!");
		log.warn("요청한 URL을 찾을 수 없음!");
		log.warn("JSP 파일 이름 확인할 것! 또는 servlet-context.xml에 스캔 설정을 확인할 것!");
		Map<String,String> errorInfo = ErrorHelper.logForError(request);
		errorInfo.forEach((key, value) -> {
			log.warn(key + " : " + value);
		});
		model.addAllAttributes(errorInfo);
		return "error/error404";
	}
	
	@RequestMapping("/error405")
	public String handle405 (HttpServletRequest request, Model model) {
		log.warn(this.getClass().getName() + "405 에러 발생!");
		log.warn("URL은 존재하지만, 사용한 HTTP Method가 허용되지 않음!");
		log.warn("프론트의 form의 method가 Controller에 요청과 일치하는지 확인할 것!(Post, Get, Put, Delete 등)");
		Map<String,String> errorInfo = ErrorHelper.logForError(request);
		errorInfo.forEach((key,value) -> {
			log.warn(key + " : " + value);
		});
		model.addAllAttributes(errorInfo);
		return "error/error404";
	}
	@RequestMapping("/error400")
	public String handle400 (HttpServletRequest request, Model model) {
		log.warn(this.getClass().getName() + "400 에러 발생!");
		log.warn("요청 파라미터가 잘못되어 서버가 이해하지 못함!");
		log.warn("프론트에서 넘겨준 데이터와 서버가 받아야하는 데이터 타입이 불일치 또는 @Vaild 어노테이션(유효성 검사)의 조건에 맞지 않을 때!");
		Map<String,String> errorInfo = ErrorHelper.logForError(request);
		errorInfo.forEach((key,value) -> {
			log.warn(key + " : " + value);
		});
		model.addAllAttributes(errorInfo);
		return "error/error404";
	}
	@RequestMapping("/error403")
	public String handle403 (HttpServletRequest request, Model model) {
		log.warn(this.getClass().getName() + "403 에러 발생!");
		log.warn("서버가 요청을 이해했지만, 승인을 거부함!");
		log.warn("시큐리티의 권한 문제이므로 Role 확인! 또는 CSRF 토큰 누락일 가능성 있음!");
		Map<String,String> errorInfo = ErrorHelper.logForError(request);
		errorInfo.forEach((key,value) -> {
			log.error(key + " : " + value);
		});
		model.addAllAttributes(errorInfo);
		// ip 추적
		String ip = request.getHeader("X-Forwarded-For");
		if (ip == null) ip = request.getRemoteAddr();
		log.warn("🚨 권한 없는 접근 시도! IP: " + ip + " / URI: " + errorInfo.get("requestUri"));
		return "error/error404";
	}
	@RequestMapping("/error415")
	public String handle415 (HttpServletRequest request, Model model) {
		log.warn(this.getClass().getName() + "415 에러 발생!");
		log.warn("클라이언트가 보낸 Content-Type을 서버가 처리할 수 없음!");
		log.warn("JSON 데이터를 프론트가 보냈는데, 컨트롤러에서는 @RequestBody를 빼먹었는지 확인! 또는 Jackson 라이브러리의 문제인지 확인!");
		Map<String,String> errorInfo = ErrorHelper.logForError(request);
		errorInfo.forEach((key,value) -> {
			log.warn(key + " : " + value);
		});
		model.addAllAttributes(errorInfo);
		return "error/error404";
	}
	@RequestMapping("/error500")
	public String handle500 (HttpServletRequest request, Model model) {
		log.error(this.getClass().getName() + "500 에러 발생!");
		log.error("서버 내부 로직의 문제! 로그에 찍히는 type(예외의 종)을 확인하여 코드 수정을 해야 함!");
		Map<String,String> errorInfo = ErrorHelper.logForError(request);
		errorInfo.forEach((key,value) -> {
			log.error(key + " : " + value);
		});
		model.addAllAttributes(errorInfo);
		return "error/error404";
	}
}
