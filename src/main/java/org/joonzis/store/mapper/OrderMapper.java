package org.joonzis.store.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.store.dto.OrderDTO;
import org.joonzis.store.vo.OrderCardVO;
import org.joonzis.store.vo.OrderProductListVO;
import org.joonzis.store.vo.OrderTransperVO;
import org.joonzis.store.vo.OrderVO;

public interface OrderMapper {
	
	public int insertOrder(OrderVO vo);
	public int insertOrderProductList(OrderProductListVO vo);
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
	
	public OrderDTO getOrder(String order_id);
	public List<OrderDTO> getOrderList(@Param("data")int data, @Param("type")String type); // 기준 : user, product
	
}
