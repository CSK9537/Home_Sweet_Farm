package org.joonzis.chatting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomSearchResultDTO {
	private int room_id;
	private Long search_msg_id;
    private String otherUserName;
    private int otherUserId;
}
