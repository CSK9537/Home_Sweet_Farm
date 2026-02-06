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
    private String other_user_name = "상대 계정"; // placeholder
    private String last_msg;
    private int unread_count;
    
    public ChatRoomDTO(int room_id, int other_user_id, String last_msg, int unread_count) {
        this.room_id = room_id;
        this.other_user_id = other_user_id;
        this.last_msg = last_msg;
        this.unread_count = unread_count;
    }
}
