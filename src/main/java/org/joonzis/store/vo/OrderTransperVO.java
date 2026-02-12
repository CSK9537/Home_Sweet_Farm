package org.joonzis.store.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrderTransperVO extends PaymentInfoVO{
	private String order_id;
	
	@com.fasterxml.jackson.annotation.JsonProperty("bankCode")
	private String bankcode;
	
	@com.fasterxml.jackson.annotation.JsonProperty("settlementStatus")
	private String settlementstatus;
}
