package org.joonzis.myplant.service;

import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.joonzis.myplant.dto.MyPlantDTO;
import org.joonzis.myplant.dto.MyPlantMainDTO;
import org.joonzis.myplant.mapper.MyPlantMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MyPlantServiceImpl implements MyPlantService {
	
	@Autowired
	private MyPlantMapper mpmapper;
	
	// 등록일 계산
	private long calcDayPassed(Date rdate) {
		LocalDate regdate = rdate.toLocalDate();
		LocalDate today = LocalDate.now();
		long day_passed = ChronoUnit.DAYS.between(regdate, today);
		return day_passed;
	}
	
	// 나의 식물 전체 목록
	@Override
	public List<MyPlantMainDTO> getMyPlantMainList(int user_id) {
		List<MyPlantMainDTO> mpmdtolist = mpmapper.myPlantMain(user_id);
		for(MyPlantMainDTO mpmdto : mpmdtolist) {
			Date regdate = mpmdto.getMyplant_regdate();
			mpmdto.setDay_passed(calcDayPassed(regdate));
		};
		return mpmdtolist;
	}
	
	// 나의 식물 정보
	@Override
	public MyPlantMainDTO get(int myplant_id) {
		MyPlantMainDTO mpmdto = mpmapper.get(myplant_id);
		Date regdate = mpmdto.getMyplant_regdate();
		mpmdto.setDay_passed(calcDayPassed(regdate));
		return mpmdto;
	}
	
	// 나의 식물 추가
	@Override
	public boolean register(MyPlantDTO mpdto) {
		int result = mpmapper.insert(mpdto);
		if(result > 0) {
			return true;
		}else {
			return false;
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
	public boolean remove(int myplant_id) {
		int result = mpmapper.delete(myplant_id);
		if(result > 0) {
			return true;
		}else {
			return false;
		}
	}
}
