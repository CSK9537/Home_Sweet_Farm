package org.joonzis.store.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class PaymentV2 {
	private String version;
	private String trasceId;
	private PaymentV1 error;
}
