package org.joonzis.store.service;

import java.util.List;

import org.joonzis.store.dto.OrderDTO;
import org.joonzis.store.dto.OrderWrapper;
import org.joonzis.store.vo.OrderProductListVO;
import org.joonzis.store.vo.PaymentInfoVO;

public interface OrderService {

	public int addOrder(String order_id, String paymentkey, String type, String method, String status, String approvedat
			,int user_id, int use_point, int order_amount, int totalamount, int accumulate_point
			,PaymentInfoVO paymentInfo, List<OrderProductListVO> products);
	public int addOrder(OrderWrapper orderWrapper);
	public OrderDTO getOrderDetail(String order_id);
	public List<OrderDTO> getOrderListByUserId(int user_id);
	public List<OrderDTO> getOrderListByProductId(int product_id);
	public int updateOrderState(String order_id, String order_status);
}
