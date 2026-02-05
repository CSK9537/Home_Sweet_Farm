package org.joonzis.store.dto;

import lombok.Data;

import java.sql.Date;
import java.util.List;

import org.joonzis.store.vo.OrderCardVO;
import org.joonzis.store.vo.OrderTransferVO;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderDTO {
	private String order_id;
	private String paymentkey;
	private String type;		// 결제 타입
	private String method;		// 결제 방법
	
	private OrderCardVO card_info;
	private OrderTransferVO transfer_info;
	
	private List<ProductForListDTO> product_list;
	
	private String issuercode;
	private String issuer_name;
	
	private int user_id;
	private String nickname;
	
	private Date order_date;
	private String status;			// 결제 상태
	private String order_status;	// 주문 상태
	private int use_point;
	private int order_amount;
	private int totalamount;
	private int accumulate_point;
	
}
