package org.joonzis.iot.repository;

import java.util.List;

import org.joonzis.iot.dto.MyPlantMainDTO;
import org.joonzis.iot.vo.MyPlantVO;

public interface MyPlantMapper {
	// 메인
	List<MyPlantMainDTO> selectMyPlantMain(int userId);
	
	
	// 목록
	List<MyPlantVO> getList(int userId);
	
	// 단건 조회
	MyPlantVO get(int nyplnatId);
	
	// 등록
	int insert(MyPlantVO vo);
	
	// 수정
	int update(MyPlantVO vo);
	
	// 삭제
	int delete(int myplantId);
}
