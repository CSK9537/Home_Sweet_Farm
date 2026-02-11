package org.joonzis.iot.controller;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import java.security.Principal;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = {
	    "file:src/main/webapp/WEB-INF/spring/root-context.xml",
	    "file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
	    })
public class MyPlantControllerTests {
	
	
	@Autowired
	private WebApplicationContext ctx;
	private MockMvc mockMvc;
	
	
	@Before
	public void setup() {
		mockMvc = MockMvcBuilders.webAppContextSetup(ctx).build();
	}
	
	  @Test
	    public void listTest() throws Exception {

	        mockMvc.perform(get("/myplant/list")
	                .principal(new Principal() {
	                    @Override
	                    public String getName() {
	                        return "1";
	                    }
	                }))
	                .andExpect(status().isOk())
	                .andExpect(view().name("myplant/list"));
	    }
}
