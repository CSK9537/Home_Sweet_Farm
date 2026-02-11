package org.joonzis.store.vo;

import java.sql.Date;
import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderVO {
	private String order_id;
	private String paymentkey;
	private String type;
	private String method;
	private String status;
	private Timestamp approvedat;
	private int user_id;
	private Date order_date;
	private String order_status;
	private int use_point;
	private int order_amount;
	private int totalamount;
	private int accumulate_point;
	private String delivery_addr;
}
