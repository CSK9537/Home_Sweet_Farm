package org.joonzis.store.dto;

import java.util.List;

import org.joonzis.store.vo.OrderProductListVO;
import org.joonzis.store.vo.PaymentInfoVO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderWrapper {
	private String order_id, paymentkey, type, method, status, approvedat;
	private int user_id, user_point, order_amount, totalamount, accumulate_point;
	private PaymentInfoVO Payment;
	private List<OrderProductListVO> products;
}
