package org.joonzis.store.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@JsonIgnoreProperties
public class OrderTransperVO extends PaymentInfoVO{
	private String order_id;
	private String bankcode;
	private String settlementstatus;
}
