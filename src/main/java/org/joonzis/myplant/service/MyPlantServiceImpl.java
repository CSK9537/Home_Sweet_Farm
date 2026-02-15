package org.joonzis.myplant.service;

import java.util.List;

import org.joonzis.myplant.dto.MyPlantDTO;
import org.joonzis.myplant.mapper.MyPlantMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MyPlantServiceImpl implements MyPlantService {
	
	@Autowired
	private MyPlantMapper mpmapper;
	
	// 나의 식물 전체 목록
	@Override
	public List<MyPlantDTO> getMyPlantMainList(int user_id) {
		return mpmapper.myPlantMain(user_id);
	}
	
	// 나의 식물 정보
	@Override
	public MyPlantDTO get(int myplant_id) {
		return mpmapper.get(myplant_id);
	}
	
	// 나의 식물 추가
	@Override
	public String register(MyPlantDTO mpdto) {
		int result = mpmapper.insert(mpdto);
		if(result > 0) {
			return "success";
		}else {
			return "failure";
		}
	}
	
	// 나의 식물 수정
	@Override
	public String modify(MyPlantDTO mpdto) {
		int result = mpmapper.update(mpdto);
		if(result > 0) {
			return "success";
		}else {
			return "failure";
		}
	}
	
	// 나의 식물 삭제
	@Override
	public String remove(int myplant_id) {
		int result = mpmapper.delete(myplant_id);
		if(result > 0) {
			return "success";
		}else {
			return "failure";
		}
	}
	
}
