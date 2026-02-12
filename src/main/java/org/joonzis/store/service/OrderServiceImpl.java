package org.joonzis.store.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.joonzis.store.dto.OrderDTO;
import org.joonzis.store.dto.PaymentDTO;
import org.joonzis.store.dto.PaymentV1;
import org.joonzis.store.dto.PaymentV2;
import org.joonzis.store.mapper.OrderMapper;
import org.joonzis.store.mapper.ProductMapper;
import org.joonzis.store.mapper.WishListAndShoppingCartMapper;
import org.joonzis.store.vo.OrderCardVO;
import org.joonzis.store.vo.OrderProductListVO;
import org.joonzis.store.vo.OrderTransperVO;
import org.joonzis.store.vo.OrderVO;
import org.joonzis.store.vo.PaymentInfoVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.log4j.Log4j;

@Log4j
@Service
public class OrderServiceImpl implements OrderService{
	@Autowired
	OrderMapper oMapper;
	@Autowired
	WishListAndShoppingCartMapper wMapper;
	@Autowired
	ProductMapper pMapper;
	@Value("${toss.secret.key}")
    private String secretKey;
	
//	@Transactional
//	@Override
//	public int addOrder(String order_id, String paymentkey, String type, String method, String status,
//			Timestamp approvedat, String delivery_addr, int user_id, int use_point, int order_amount, int totalamount, int accumulate_point,
//			PaymentInfoVO paymentInfo, List<OrderProductListVO> products) {
//		int result = 0;
//		List<Integer> soldOutList = new ArrayList<Integer>();
//		
//		// 주문 기본 정보 저장
//		OrderVO order = new OrderVO();
//		order.setOrder_id(order_id);
//		order.setPaymentkey(paymentkey);
//		order.setType(type);
//		order.setMethod(method);
//		order.setStatus(status);
//		order.setApprovedat(approvedat);
//		order.setDelivery_addr(delivery_addr);
//		order.setUser_id(user_id);
//		order.setUse_point(use_point);
//		order.setOrder_amount(order_amount);
//		order.setTotalamount(totalamount);
//		order.setAccumulate_point(accumulate_point);
//		oMapper.insertOrder(order);
//		
//		// 결제 정보 저장
//		if(method.equals("카드")) {
//			oMapper.insertOrderCard((OrderCardVO)paymentInfo);
//		} else if(method.equals("계좌이체")) {
//			oMapper.insertOrderTransper((OrderTransperVO)paymentInfo);
//		} else {
//			// 가상계좌, 휴대폰, 간편결제, 문화상품권, 도서문화상품권, 게임문화상품권
//			// 예외 발생을 시켜야 rollback이 진행
//			throw new RuntimeException("지원하지 않는 결제 수단입니다." + method);
//		}
//		
//		//주문 내역의 상품 리스트 저장
//		if(products.size() > 0) {
//			for (OrderProductListVO orderProductListVO : products) {
//				// 이미 order_id가 들어가 있으려나? 들어가 있으면 이거 안해도 되는데
//				orderProductListVO.setOrder_id(order_id);
//				// 재고 차감
//				if(pMapper.decreaseProductRemain
//						(orderProductListVO.getProduct_id(), orderProductListVO.getProduct_count()) == 1) result += 1;
//				else {
//					soldOutList.add(orderProductListVO.getProduct_id());
//				}
//			}
//			if(products.size() != result) {
//				throw new RuntimeException("주문 하신 상품 중 재고가 부족한 상품이 있습니다. 제품 ID : " + soldOutList);
//			}
//			oMapper.insertOrderProductList(products);
//		} else {
//			throw new RuntimeException("상품 리스트가 비어 있습니다." + products);
//		}
//		
//		// 유저의 장바구니 비우기
//		wMapper.deleteShoppingCartByUserId(user_id);
//		
//		// 유저의 포인트 차감 (추가 예정)
//		
//		return result;
//	}
	
//	@Override
//	public int addOrder(OrderWrapper orderWrapper) {
//		return addOrder(orderWrapper.getOrder_id(), orderWrapper.getPaymentkey(), orderWrapper.getType(),
//				orderWrapper.getMethod(), orderWrapper.getStatus(), orderWrapper.getApprovedat(),
//				orderWrapper.getDelivery_addr(),
//				orderWrapper.getUser_id(), orderWrapper.getUser_point(), orderWrapper.getOrder_amount(),
//				orderWrapper.getTotalamount(), orderWrapper.getAccumulate_point(), orderWrapper.getPayment(), orderWrapper.getProducts());
//	}
	
	@Override
	public OrderDTO getOrderDetail(String order_id) {
		return oMapper.getOrder(order_id);
	}
	@Override
	public List<OrderDTO> getOrderListByProductId(int product_id) {
		return oMapper.getOrderList(product_id, "product");
	}
	@Override
	public List<OrderDTO> getOrderListByUserId(int user_id) {
		return oMapper.getOrderList(user_id, "user");
	}
	@Override
	public int updateOrderState(String order_id, String order_status) {
		int result = 0;
		OrderVO order = oMapper.selectOrder(order_id);
		order.setOrder_status(order_status);
		if(order_status.equals("CANCLE")) {
			log.error("취소는 비즈니스 로직이 따로 존재");
			return result;
		}
		result = oMapper.updateOrder(order);
		return result;
	}
	
	
	@Transactional
	@Override
	public int addOrderBeforePay(String order_id, int user_id, int use_point, int order_amount, Integer accumulate_point,
			String delivery_addr, List<OrderProductListVO> products) throws Exception {
		// 주문 정보 저장
		oMapper.addOrderBeforePay(order_id, user_id, use_point, order_amount, accumulate_point, delivery_addr);
		// 상품 리스트 저장
		for (OrderProductListVO product : products) {
			product.setOrder_id(order_id);
		}
		oMapper.insertOrderProductList(products);
		// 포인트 차감
		
		return 1;
	}	
	
	@Transactional
	@Override
	public int AfterPay(String order_id, String status, String paymentKey, String type, String method,
			Integer totalAmount, String approveDat, PaymentInfoVO paymentInfo) throws Exception {
		// String으로 넘어온 결제 시간을 Timestamp로 파싱
		OffsetDateTime odt = OffsetDateTime.parse(approveDat);
		Timestamp sqlTimestamp = Timestamp.valueOf(odt.toLocalDateTime());
		// 결제 방법에 따라 데이터 저장(카드, 계좌이체)
		if(method.equals("카드") || method.equals("간편결제")) {
			OrderCardVO vo = (OrderCardVO)paymentInfo;
			vo.setApproveno(sqlTimestamp);
			vo.setOrder_id(order_id);
			oMapper.insertOrderCard(vo);
		} else if(method.equals("계좌이체")) {
			OrderTransperVO vo = (OrderTransperVO)paymentInfo;
			vo.setOrder_id(order_id);
			oMapper.insertOrderTransper(vo);
		} else {
			// 가상계좌, 휴대폰, 간편결제, 문화상품권, 도서문화상품권, 게임문화상품권
			// 예외 발생을 시켜야 rollback이 진행
			throw new RuntimeException("지원하지 않는 결제 수단" + method);
		}
		
		// 결제 정보를 주문 정보에 추가
		oMapper.updateAfterPayByOrderId(order_id, status, paymentKey, type, method, totalAmount, sqlTimestamp);
		
		return 0;
	}
	
	// 실제 결제 테스트를 진행해보고 테스트가 진행되어야 함
	@Override
	@Transactional // DB 업데이트와 API 호출의 정합성을 위해 추가
	public int cancelOrder(String paymentKey, String reason, String order_id) throws Exception {
	    // 1. API 요청 설정
	    HttpRequest request = HttpRequest.newBuilder()
	            .uri(URI.create("https://api.tosspayments.com/v1/payments/" + paymentKey + "/cancel"))
	            .header("Authorization", "Basic " + Base64.getEncoder().encodeToString((secretKey + ":").getBytes()))
	            .header("Content-Type", "application/json")
	            .POST(HttpRequest.BodyPublishers.ofString("{\"cancelReason\":\"" + reason + "\"}"))
	            .build();

	    // 2. API 호출
	    HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

	    // 3. 응답 처리
	    ObjectMapper objMapper = new ObjectMapper();
	    PaymentDTO payment = null;
	    if (response.statusCode() == 200) {
	        // JSON 파싱
	    	payment = objMapper.readValue(response.body(), PaymentDTO.class);
	    	if(!payment.getCancels().getCancelStatus().equals("DONE"))
	    		throw new RuntimeException("결제 취소가 아직 되지 않음");
	        
	        // 4. DB 상태 업데이트 (아까 만든 매퍼 활용)
	        return oMapper.updateCancelOrder(order_id);
	    } else {
	    	// 에러 객체
			try {
				PaymentV2 errorObj = objMapper.readValue(response.body(), PaymentV2.class);
				log.error("에러 코드 : " + errorObj.getError().getCode());
				log.error("에러 메세지 : " + errorObj.getError().getMessage());
				// 커스텀 Exception을 만들면 에러 메세지를 Controller로 가져가는 것도 가능할 지도?
				return 0;
			} catch (Exception e) {
				try {
					e.printStackTrace();
					PaymentV1 erroobj = objMapper.readValue(response.body(), PaymentV1.class);
					log.error("에러 코드 : "+ erroobj.getCode());
					log.error("에러 메세지 : " + erroobj.getMessage());
					return 0;
				} catch (Exception e2) {
					e2.printStackTrace();
					return 0;
				}
			}
	    }
	}
	@Override
	public String createRandomOrderId() {
		UUID uuid = UUID.randomUUID();
		String orderId = uuid.toString() + "order";
		return orderId;
	}
	@Override
	public PaymentDTO confirmPayment(String paymentKey, String orderId, int amount, int user_id) throws Exception {
		if (secretKey == null || secretKey.contains("${")) {
			log.error("CRITICAL: secretKey가 정상적으로 로드되지 않았습니다! (값: " + secretKey + ")");
			throw new Exception("결제 설정 오류: API 키를 불러올 수 없습니다.");
		}
		
		String trimmedKey = secretKey.trim();
		log.error("인증 시도 중 (Key 길이: " + trimmedKey.length() + ")");

		ObjectMapper bodyMapper = new ObjectMapper();
		Map<String, Object> bodyMap = new HashMap<>();
		bodyMap.put("paymentKey", paymentKey);
		bodyMap.put("orderId", orderId);
		bodyMap.put("amount", amount);
		String requestBody = bodyMapper.writeValueAsString(bodyMap);

		log.error("토스 결제 승인 요청 시작 - URL: https://api.tosspayments.com/v1/payments/confirm");
		log.error("토스 결제 승인 요청 바디: " + requestBody);

		HttpRequest request = HttpRequest.newBuilder()
			    .uri(URI.create("https://api.tosspayments.com/v1/payments/confirm"))
	            .header("Authorization", "Basic " + Base64.getEncoder().encodeToString((trimmedKey + ":").getBytes()))
			    .header("Content-Type", "application/json")
			    .method("POST", HttpRequest.BodyPublishers.ofString(requestBody))
			    .build();
		
		HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
		
		log.error("토스 결제 승인 응답 상태 코드: " + response.statusCode());
		log.error("토스 결제 승인 응답 바디: " + response.body());
		// 결제 승인에 성공했는지, 실패했는지 판단
		ObjectMapper objMapper = new ObjectMapper();
		String responseBody = response.body();
		
		if(response.statusCode() == 200) {
			// 결제 성공
			PaymentDTO payment = objMapper.readValue(responseBody, PaymentDTO.class);
			// 장바구니 지우기
			wMapper.deleteShoppingCartByUserId(user_id);
			return payment;
		} else {
			// 결제 실패
			log.error("토스 결제 승인 실패 - 상태 코드: " + response.statusCode());
			log.error("토스 결제 승인 실패 - 응답 바디: " + responseBody);
			
			if (responseBody == null || responseBody.trim().isEmpty()) {
				log.error("토스 서버에서 빈 응답을 반환했습니다.");
				return null;
			}

			try {
				PaymentV2 errorObj = objMapper.readValue(responseBody, PaymentV2.class);
				log.error("에러 코드 : " + errorObj.getError().getCode());
				log.error("에러 메세지 : " + errorObj.getError().getMessage());
			} catch (Exception e) {
				try {
					PaymentV1 erroobj = objMapper.readValue(responseBody, PaymentV1.class);
					log.error("에러 코드 : "+ erroobj.getCode());
					log.error("에러 메세지 : " + erroobj.getMessage());
				} catch (Exception e2) {
					log.error("에러 JSON 파싱 실패: " + responseBody);
				}
			}
			return null;
		}
		
	}
}
