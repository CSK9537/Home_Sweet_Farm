package org.joonzis.store.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderTransferVO {
	private String order_id;
	private String bankcode;
	private String settlementstatus;
}
