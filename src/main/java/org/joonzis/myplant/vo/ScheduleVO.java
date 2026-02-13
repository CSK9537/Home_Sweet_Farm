package org.joonzis.myplant.vo;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleVO {
	private int scheduleId;
	private int myplantId;
	private Date scheduleDate;
	private String scheduleDo;

}
