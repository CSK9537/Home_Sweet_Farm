package org.joonzis.chatting.dto;


import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomDTO {// 채팅방 리스트
    private int room_id;
    private int other_user_id;
    private String other_user_name;
    private String last_msg;
    private int unread_count;
    private Date created_at;
    private String last_msg_type;
}
