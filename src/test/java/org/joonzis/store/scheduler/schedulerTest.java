package org.joonzis.store.scheduler;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import lombok.extern.log4j.Log4j;

@Log4j
@RunWith(SpringJUnit4ClassRunner.class) 
@ContextConfiguration( 
		"file:src/main/webapp/WEB-INF/spring/root-context.xml")
public class schedulerTest {
	@Autowired
	OrderStateScheduler sc;
	
	@Test
	public void Test() {
		sc.CheckingOrderStates();
	}
	
//	@Test
//	public void doneTest() {
//		HttpRequest request = HttpRequest.newBuilder()
//			    .uri(URI.create("https://api.tosspayments.com/v1/payments/orders/cb8ccac3-44f8-4560-b4be-26417ffd34ddorder"))
//			    .header("Authorization", "Basic dGVzdF9za196WExrS0V5cE5BcldtbzUwblgzbG1lYXhZRzVSOg==")
//			    .method("GET", HttpRequest.BodyPublishers.noBody())
//			    .build();
//			HttpResponse<String> response;
//			try {
//				response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
//				System.out.println(response.body());
//			} catch (IOException | InterruptedException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//	}
}
