package org.joonzis.chatting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomDTO {
    private int room_id;
    private int other_user_id;
    private String other_user_name;
    private String last_msg;
    private int unread_count;
    
}
