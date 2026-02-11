package org.joonzis.store.mapper;

import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.store.dto.OrderDTO;
import org.joonzis.store.vo.OrderCardVO;
import org.joonzis.store.vo.OrderProductListVO;
import org.joonzis.store.vo.OrderTransperVO;
import org.joonzis.store.vo.OrderVO;

public interface OrderMapper {
	public int insertOrder(OrderVO vo);
	public int insertOrderProductList(List<OrderProductListVO> products);
	public int insertOrderCard(OrderCardVO vo);
	public int insertOrderTransper(OrderTransperVO vo);
	
	public OrderVO selectOrder(String order_id);
	
	public int updateOrder(OrderVO vo);
	public int updateOrderProductList(OrderProductListVO vo);
	
	public int deleteOrder(String order_id);
	public int deleteOrderCard(String order_id);
	public int deleteOrderTransper(String order_id);
	public int deleteOrderProductList(String order_id);
	public int deleteOrderProductList(String order_id, int product_id);
	
	// 이 위의 메서드들은 거의 테스트 용도로 작성된 것들이라 이후 필요없다고 판단되면 삭제 가능
	
	public OrderDTO getOrder(String order_id);
	public List<OrderDTO> getOrderList(@Param("data")int data, @Param("type")String type); // 기준 : user, product
	
	// 결제 승인 전
	public int addOrderBeforePay(
			@Param("order_id") String order_id,
			@Param("user_id") int user_id,
			@Param("use_point") int use_point,
			@Param("order_amount")int order_amount,
			@Param("accumulate_point") Integer accumulate_point,
			@Param("delivery_addr") String delivery_addr);
	
	// 결제 승인 후, 혹은 결제 상태 변화(취소 등)
	public int updateAfterPayByOrderId(
			@Param("order_id") String order_id,
			@Param("status")String status,
			@Param("paymentkey") String paymentKey,
			@Param("type") String type,
			@Param("method") String method,
			@Param("totalamount") Integer totalAmount,
			@Param("approvedat") Timestamp approveDat);

	// 결제 취소(API 호출, DB에 Update)
	public int updateCancelOrder(@Param("order_id")String order);
}
