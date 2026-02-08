package org.joonzis.chatting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RoomCreateDTO {
    private int user1_id;
    private int user2_id;
}
