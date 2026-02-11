package org.joonzis.store.service;

import java.util.List;

import org.joonzis.store.dto.OrderDTO;
import org.joonzis.store.dto.PaymentDTO;
import org.joonzis.store.vo.OrderProductListVO;
import org.joonzis.store.vo.PaymentInfoVO;

public interface OrderService {

//	public int addOrder(String order_id, String paymentkey, String type, String method, String status, String approvedat
//			,String delivery_addr, int user_id, int use_point, int order_amount, int totalamount, int accumulate_point
//			,PaymentInfoVO paymentInfo, List<OrderProductListVO> products);
//	public int addOrder(OrderWrapper orderWrapper);
	public OrderDTO getOrderDetail(String order_id);
	public List<OrderDTO> getOrderListByUserId(int user_id);
	public List<OrderDTO> getOrderListByProductId(int product_id);
	public int updateOrderState(String order_id, String order_status);
	
	public int addOrderBeforePay(
			String order_id, 
			int user_id,
			int use_point,
			int order_amount, 
			Integer accumulate_point, 
			String delivery_addr,
			List<OrderProductListVO> products
			) throws Exception;
	
	public int AfterPay(
			String order_id, 
			String status, 
			String paymentKey, 
			String type, 
			String method, 
			Integer totalAmount, 
			String approveDat,
			PaymentInfoVO paymentInfo
			) throws Exception;
	
	public int cancelOrder(String paymentKey, String reason, String order_id) throws Exception;
	
	public String createRandomOrderId();
	
	public PaymentDTO confirmPayment(String paymentKey, String orderId, int amount) throws Exception;
}
