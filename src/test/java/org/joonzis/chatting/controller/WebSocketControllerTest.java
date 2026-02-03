package org.joonzis.chatting.controller;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.joonzis.chatting.config.WebSocketConfig;
import org.joonzis.chatting.service.ChatService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;


@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = {
	    "file:src/main/webapp/WEB-INF/spring/root-context.xml",
	    "file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
	})
public class WebSocketControllerTest {

	@Autowired
    private WebSocketStompClient stompClient;
	
    private StompSession stompSession;

    @Before
    public void setup() throws Exception {
        // 2️⃣ STOMP 클라이언트 생성
        List<Transport> transports = new ArrayList<>();
        transports.add(new WebSocketTransport(new StandardWebSocketClient()));
        SockJsClient sockJsClient = new SockJsClient(transports);

        stompClient = new WebSocketStompClient(sockJsClient);
        stompClient.setMessageConverter(new MappingJackson2MessageConverter());

        // 3️⃣ 서버에 연결
        stompSession = stompClient.connect(
            "ws://localhost:8080/ws-chat", 
            new StompSessionHandlerAdapter(){}
        ).get(1, TimeUnit.SECONDS);
    }

    @Test
    public void connectServer() throws Exception {
        String url = "ws://localhost:8080/ws-chat"; // WebSocket 엔드포인트
        StompSession session = stompClient.connect(url, new StompSessionHandlerAdapter() {}).get(1, TimeUnit.SECONDS);

        assertNotNull(session);
        assertTrue(session.isConnected());
    }
}



