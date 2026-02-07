package org.joonzis.store.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderCardDTO {
	private String issuercode;
	private String issuer_name;
	private String cardnumber;
	private String approveno;
}
