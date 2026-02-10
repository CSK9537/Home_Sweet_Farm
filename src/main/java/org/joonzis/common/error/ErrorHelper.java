package org.joonzis.common.error;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import lombok.extern.log4j.Log4j;

@Log4j
public class ErrorHelper {
	
	public static Map<String, String> logForError(HttpServletRequest request) {
		Map<String,String> map = new HashMap<String, String>();
		map.put("msg", "상세 에러 메시지가 없습니다.");
		map.put("type", "N/A");
		// 발생한 예외 꺼내기
		Throwable throwable = (Throwable) request.getAttribute("javax.servlet.error.exception");
		// 예외가 있는 경우
		if(throwable != null) {
			String msg = throwable.getMessage();			// 예외 메세지
			map.put("msg", msg);
			String type = throwable.getClass().getName();	// 예외 종류 (클래스 타입)
			map.put("type", type);
		}
		// 에러가 발생한 원래 페이지의 URL
		Object requestUri = request.getAttribute("javax.servlet.error.request_uri");
		map.put("requestUri", requestUri.toString());
		return map;
	}
}
