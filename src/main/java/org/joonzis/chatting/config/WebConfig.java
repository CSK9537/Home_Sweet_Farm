package org.joonzis.chatting.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	public void addResourceHandlers(ResourceHandlerRegistry registry) {
	    registry.addResourceHandler("/chat/files/**")
	            .addResourceLocations("file://///192.168.0.153/projecthsf/chat_upload/")
	            .setCachePeriod(0);
	}
}
