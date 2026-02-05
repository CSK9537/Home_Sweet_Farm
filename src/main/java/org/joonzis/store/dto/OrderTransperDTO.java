package org.joonzis.store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderTransperDTO {
	private String bankcode;
	private String bank_name;
	private String settlementstatus;
}
