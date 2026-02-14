package org.joonzis.myplant.mapper;

import java.util.List;

import org.joonzis.myplant.dto.MyPlantScheduleDTO;

public interface MyPlantScheduleMapper {
	// 나의 식물 스케쥴 출력
	public List<MyPlantScheduleDTO> getListByMyPlant(int myplant_id);
	// 나의 식물 스케쥴 추가
	public int insert(MyPlantScheduleDTO scdto);
	// 나의 식물 스케쥴 수정
	public int update(MyPlantScheduleDTO scdto);
	// 나의 식물 스케쥴 삭제
	public int delete(int schedule_id);
}
