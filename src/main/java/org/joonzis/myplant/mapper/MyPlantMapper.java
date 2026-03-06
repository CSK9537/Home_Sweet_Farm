package org.joonzis.myplant.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.myplant.dto.MyPlantDTO;
import org.joonzis.myplant.dto.MyPlantMainDTO;


public interface MyPlantMapper {
	// 나의 식물 전체 목록 출력
	public List<MyPlantMainDTO> myPlantMain(int user_id);
	// 나의 식물 하나 출력
	public MyPlantMainDTO get(int myplant_id);
	// 나의 식물 추가
	public int insert(MyPlantDTO mpdto);
	// 나의 식물 수정
	public int updateMyPlantName(@Param("myplant_id") int myplant_id, @Param("myplant_name") String myplant_name);
	
	// 나의 식물 삭제
	// 나의 식물 상태 데이터 삭제
	public void deleteMyPlantStatistics(int myplant_id);
	// 나의 식물 일정 삭제
	public void deleteMyPlantSchedule(int myplant_id);
	// 나의 식물(메인테이블) 삭제
	public int delete(int myplant_id);
}
