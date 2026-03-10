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
    private String other_user_username;
    private String other_user_nickname;
    private String last_msg;
    private int unread_count;
    private Date created_at;
    private String last_msg_type;
    private String other_user_profile;
    private int other_user_grade_id;
}
