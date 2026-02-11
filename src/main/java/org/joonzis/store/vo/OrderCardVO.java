package org.joonzis.store.vo;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@JsonIgnoreProperties
public class OrderCardVO extends PaymentInfoVO {
	private String order_id;
	private String issuercode;
	private String acquirercode;
	private String cardnumber;
	private int installmentplanmonths;
	private Timestamp approveno;
	private String usercardpoint;
	private String cardtype;
	private String ownertype;
}
