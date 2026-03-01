package org.joonzis.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class EmailCheckRequestDto {
	private String username;
	private String email;
	private String mode;
}
