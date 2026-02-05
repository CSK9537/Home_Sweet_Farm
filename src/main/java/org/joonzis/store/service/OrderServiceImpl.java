package org.joonzis.store.service;

import java.util.List;

import org.joonzis.store.dto.OrderDTO;
import org.joonzis.store.mapper.OrderMapper;
import org.joonzis.store.vo.OrderCardVO;
import org.joonzis.store.vo.OrderProductListVO;
import org.joonzis.store.vo.OrderTransperVO;
import org.joonzis.store.vo.OrderVO;
import org.joonzis.store.vo.PaymentInfoVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.log4j.Log4j;

@Log4j
@Service
public class OrderServiceImpl implements OrderService{
	@Autowired
	OrderMapper oMapper;
	
	
	@Transactional
	@Override
	public int addOrder(String order_id, String paymentkey, String type, String method, String status,
			String approvedat, int user_id, int use_point, int order_amount, int totalamount, int accumulate_point,
			PaymentInfoVO paymentInfo, List<OrderProductListVO> products) {
		int result = 0;
		
		// 주문 내역 저장
		OrderVO order = new OrderVO();
		order.setOrder_id(order_id);
		order.setPaymentkey(paymentkey);
		order.setType(type);
		order.setMethod(method);
		order.setStatus(status);
		order.setApprovedat(approvedat);
		order.setUser_id(user_id);
		order.setUse_point(use_point);
		order.setOrder_amount(order_amount);
		order.setTotalamount(totalamount);
		order.setAccumulate_point(accumulate_point);
		oMapper.insertOrder(order);
		
		// 결제 정보 저장
		if(method.equals("카드")) {
			result = oMapper.insertOrderCard((OrderCardVO)paymentInfo);
		} else if(method.equals("계좌이체")) {
			result = oMapper.insertOrderTransper((OrderTransperVO)paymentInfo);
		} else {
			// 가상계좌, 휴대폰, 간편결제, 문화상품권, 도서문화상품권, 게임문화상품권
			// 예외 발생을 시켜야 rollback 진행
			throw new RuntimeException("지원하지 않는 결제 수단입니다." + method);
		}
		
		//주문 내역의 상품 리스트 저장
		// batch insert(?) 사용 고려
		if(products.size() > 0) {
			for (OrderProductListVO orderProductListVO : products) {
				orderProductListVO.setOrder_id(order_id);
				oMapper.insertOrderProductList(orderProductListVO);
			}
		} else {
			throw new RuntimeException("상품 리스트가 비어 있습니다." + products);
		}
		
		// 유저의 장바구니 비우기
		// 유저의 포인트 차감 (추가 예정)		
		
		return result;
	}
	
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
		switch (order_status) {
		case "CANCLE":
			// 결제 취소 요청
		case "SHIPPING":
			//재고 차감
		default:
			break;
		}
		result = oMapper.insertOrder(order);
		return result;
	}
}
