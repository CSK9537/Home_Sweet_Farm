package org.joonzis.store.dto;

import org.joonzis.store.vo.OrderCardVO;
import org.joonzis.store.vo.OrderTransperVO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class PaymentDTO {
	private String paymentKey;
	private String type;
	private String orderId;
	private String orderName;	// 예시 : 생수 외 1건 
	private String method;
	private int totalAmount;
	private String status;
	private String requestedAt;
	private CancelDTO cancels;
	private OrderCardVO card;
	private OrderTransperVO transfer;
	
	
	@NoArgsConstructor
	@AllArgsConstructor
	@Getter
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class CancelDTO{
		private int cancelAmount;
		private String cancelReason;
		private String canceldAt;
		private String cancelStatus;
	}
}
