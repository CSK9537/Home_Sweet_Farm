package org.joonzis.store.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderCardVO extends PaymentInfoVO {
	private String order_id;
	private String issuercode;
	private String acquirercode;
	private String cardnumber;
	private int installmentplanmonths;
	private String approveno;
	private String usercardpoint;
	private String cardtype;
	private String ownertype;
}
