package org.joonzis.store.vo;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrderCardVO extends PaymentInfoVO {
	private String order_id;
	
	@com.fasterxml.jackson.annotation.JsonProperty("issuerCode")
	private String issuercode;
	
	@com.fasterxml.jackson.annotation.JsonProperty("acquirerCode")
	private String acquirercode;
	
	@com.fasterxml.jackson.annotation.JsonProperty("number")
	private String cardnumber;
	
	@com.fasterxml.jackson.annotation.JsonProperty("installmentPlanMonths")
	private int installmentplanmonths;
	
	@com.fasterxml.jackson.annotation.JsonProperty("approveNo")
	private Timestamp approveno;
	
	@com.fasterxml.jackson.annotation.JsonProperty("useCardPoint")
	private String usercardpoint;
	
	@com.fasterxml.jackson.annotation.JsonProperty("cardType")
	private String cardtype;
	
	@com.fasterxml.jackson.annotation.JsonProperty("ownerType")
	private String ownertype;
}
