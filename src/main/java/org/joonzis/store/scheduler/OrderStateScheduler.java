package org.joonzis.store.scheduler;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.List;

import org.joonzis.store.dto.PaymentDTO;
import org.joonzis.store.dto.PaymentV1;
import org.joonzis.store.dto.PaymentV2;
import org.joonzis.store.mapper.OrderMapper;
import org.joonzis.store.service.OrderService;
import org.joonzis.store.vo.PaymentInfoVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.apachecommons.CommonsLog;

@CommonsLog
@Component
public class OrderStateScheduler {
	@Autowired
	OrderMapper mapper;
	@Autowired
	OrderService service;
	
	@Value("${toss.secret.key}")
    private String secretKey;
	
	private HttpRequest request;
	private HttpResponse<String> response;
	// 30분마다 정리(원하면 조절)
	@Scheduled(cron = "0 */30 * * * *")
	@Transactional
	public void CheckingOrderStates() {
		// 1. 결제 상태가 READY인 주문 내역의 OrderId 가져오기
		List<String> orderIdList = mapper.getOrderIdWithoutOrderStateIsDone();
		PaymentDTO payment = null;
		String statusCode = null;
		// 2. OrderId로 토스 페이먼츠 결제 조회 api호출
		for (String orderId : orderIdList) {
			request = HttpRequest.newBuilder()
					.uri(URI.create(("https://api.tosspayments.com/v1/payments/orders/" + orderId)))
		            .header("Authorization", "Basic " + Base64.getEncoder().encodeToString((secretKey + ":").getBytes()))
					.method("GET", HttpRequest.BodyPublishers.noBody())
					.build();
			try {
				response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
				System.out.println(response.body());
				// 통신이 성공적으로 이루어지면 response.body()에는 Payment 객체가 들어오거나 오류 코드가 들어옴
				statusCode = "";
				try {
					payment = jsonParseToPayment(PaymentDTO.class, response);
					if(payment == null) {
						log.error("payment 객체가 비어있음 : 통신 오류(response.statusCode() != 200)");
						statusCode = jsonParsePaymentErrorObj(response);
					}
					statusCode = payment.getStatus();
				} catch (JsonMappingException e) {
					statusCode = jsonParsePaymentErrorObj(response);
				} catch (JsonProcessingException e) {
					statusCode = jsonParsePaymentErrorObj(response);
				} catch (Exception e) {
					e.printStackTrace();
				}finally {
					// 3. 토스가 반환한 값에 따라 처리
					// 3-1 DONE인 경우 -> 이미 결제 됨, 우리 DB의 결제 상태를 업데이트해야함
					// 3-2 토스 결과 X 또는 아래와 같은 경우의 처리
					/* x 					-> response.body() = {"code":"NOT_FOUND_PAYMENT","message":"존재하지 않는 결제 정보 입니다."}
					 * READY 				-> 초기 상태(사용자가 그냥 창을 닫은 경우)
					 * IN_PROGRESS 			-> 결제 승인 API만 호출(결제 완료 전)
					 * WAITTING_FOR_DEPOSIT -> 가상계좌 방식의 결제인 경우, 사용자가 아직 입금하지 않은 상태
					 * ABORTED 				-> 결제 승인 실패
					 * EXPIRED 				-> 결제 유효 시간 30분이 지난 상태(IN_PROGRESS에서 결제 승인 API를 호출하지 않고 30분이 경과)
					 * */ 
					switch (statusCode) {
					case "NOT_FOUND_PAYMENT":
					case "ABORTED":
					case "EXPIRED":
						mapper.deleteOrderProductList(orderId);
						mapper.deleteOrderCard(orderId);
						mapper.deleteOrderTransper(orderId);
						mapper.deleteOrder(orderId);
						break;
					case "IN_PROGRESS":
						PaymentInfoVO paymentInfo;
						try {
							paymentInfo = payment.getCard();
						} catch (Exception e2) {
							paymentInfo = payment.getTransfer();
						}
						try {
							service.AfterPay(orderId, 
									statusCode, 
									payment.getPaymentKey(), 
									payment.getType(), 
									payment.getMethod(), 
									payment.getTotalAmount(), 
									payment.getRequestedAt(), 
									paymentInfo);							
						} catch (Exception e2) {
							e2.printStackTrace();
						}
						break;
					default: //DONE, WAITTING_FOR_DEPOSIT, READY 인 경우
						
						OffsetDateTime odt = OffsetDateTime.parse(payment.getRequestedAt());
						Timestamp approveDat = Timestamp.valueOf(odt.toLocalDateTime());
						
						mapper.updateAfterPayByOrderId(
								orderId, 
								statusCode, 
								payment.getPaymentKey(), 
								payment.getType(), 
								payment.getMethod(), 
								payment.getTotalAmount(), 
								approveDat);
						break;
					}
				}
			} catch (IOException e) {
				e.printStackTrace();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}			
		}
	}
	
	// 통신 응답을 Payment객체로 파싱
	private <T> T jsonParseToPayment(Class<T> paraClass, HttpResponse<String> response) throws JsonMappingException, JsonProcessingException{
		ObjectMapper objMapper = new ObjectMapper();
		T result = null;
		if(response.statusCode() == 200) {
			result = objMapper.readValue(response.body(), paraClass);
		}
		return result;
	}
	// 통신 응답을 Payment 객체로 파싱하다가 오류가 나면, 그 객체는 오류 객체라는 뜻이므로 오류 객체로 파싱하는 이 함수를 사용
	private String jsonParsePaymentErrorObj(HttpResponse<String> response){
		ObjectMapper objMapper = new ObjectMapper();
		// 에러 객체
		String resultCode;
		try {
			PaymentV2 errorObj = objMapper.readValue(response.body(), PaymentV2.class);
			resultCode = errorObj.getError().getCode();
			log.error("에러 코드 : " + errorObj.getError().getCode());
			log.error("에러 메세지 : " + errorObj.getError().getMessage());
			
			return resultCode;
		} catch (JsonProcessingException e1) {
			try {
				e1.printStackTrace();
				PaymentV1 erroobj = objMapper.readValue(response.body(), PaymentV1.class);
				resultCode = erroobj.getCode();
				log.error("에러 코드 : "+ erroobj.getCode());
				log.error("에러 메세지 : " + erroobj.getMessage());
				return resultCode;
			} catch (Exception e2) {
				e2.printStackTrace();
				return null;
			}
		}
	}
}
