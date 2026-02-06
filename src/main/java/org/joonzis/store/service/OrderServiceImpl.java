package org.joonzis.store.service;

import java.util.ArrayList;
import java.util.List;

import org.joonzis.store.dto.OrderDTO;
import org.joonzis.store.dto.OrderWrapper;
import org.joonzis.store.mapper.OrderMapper;
import org.joonzis.store.mapper.ProductMapper;
import org.joonzis.store.mapper.WishListAndShoppingCartMapper;
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
	@Autowired
	WishListAndShoppingCartMapper wMapper;
	@Autowired
	ProductMapper pMapper;
	
	@Transactional
	@Override
	public int addOrder(String order_id, String paymentkey, String type, String method, String status,
			String approvedat, int user_id, int use_point, int order_amount, int totalamount, int accumulate_point,
			PaymentInfoVO paymentInfo, List<OrderProductListVO> products) {
		int result = 0;
		List<Integer> soldOutList = new ArrayList<Integer>();
		
		// 주문 기본 정보 저장
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
			oMapper.insertOrderCard((OrderCardVO)paymentInfo);
		} else if(method.equals("계좌이체")) {
			oMapper.insertOrderTransper((OrderTransperVO)paymentInfo);
		} else {
			// 가상계좌, 휴대폰, 간편결제, 문화상품권, 도서문화상품권, 게임문화상품권
			// 예외 발생을 시켜야 rollback이 진행
			throw new RuntimeException("지원하지 않는 결제 수단입니다." + method);
		}
		
		//주문 내역의 상품 리스트 저장
		if(products.size() > 0) {
			for (OrderProductListVO orderProductListVO : products) {
				// 이미 order_id가 들어가 있으려나? 들어가 있으면 이거 안해도 되는데
				orderProductListVO.setOrder_id(order_id);
				// 재고 차감
				if(pMapper.decreaseProductRemain
						(orderProductListVO.getProduct_id(), orderProductListVO.getProduct_count()) == 1) result += 1;
				else {
					soldOutList.add(orderProductListVO.getProduct_id());
				}
			}
			if(products.size() != result) {
				throw new RuntimeException("주문 하신 상품 중 재고가 부족한 상품이 있습니다. 제품 ID : " + soldOutList);
			}
			oMapper.insertOrderProductList(products);
		} else {
			throw new RuntimeException("상품 리스트가 비어 있습니다." + products);
		}
		
		// 유저의 장바구니 비우기
		wMapper.deleteShoppingCartByUserId(user_id);
		
		// 유저의 포인트 차감 (추가 예정)
		
		return result;
	}
	
	@Override
	public int addOrder(OrderWrapper orderWrapper) {
		return addOrder(orderWrapper.getOrder_id(), orderWrapper.getPaymentkey(), orderWrapper.getType(),
				orderWrapper.getMethod(), orderWrapper.getStatus(), orderWrapper.getApprovedat(),
				orderWrapper.getUser_id(), orderWrapper.getUser_point(), orderWrapper.getOrder_amount(),
				orderWrapper.getTotalamount(), orderWrapper.getAccumulate_point(), orderWrapper.getPayment(), orderWrapper.getProducts());
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
		if(order_status.equals("CANCLE")) {
			// 취소 요청을 위한 비즈니스 로직
			
			// 재고량 되돌리기
			
		}
		result = oMapper.insertOrder(order);
		return result;
	}
}
