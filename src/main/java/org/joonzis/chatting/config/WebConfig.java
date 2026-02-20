package org.joonzis.chatting.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
	    // 기존 업로드 파일 핸들러
	    registry.addResourceHandler("/chat/files/**")
	            .addResourceLocations("file:///C:/upload/files/")
	            .setCachePeriod(0);

	    // JSP, CSS, JS 등 기존 리소스
	    registry.addResourceHandler("/resources/**")
	            .addResourceLocations("/resources/");
	}
}
