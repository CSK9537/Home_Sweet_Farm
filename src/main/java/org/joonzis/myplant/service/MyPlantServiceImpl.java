package org.joonzis.myplant.service;

import java.io.File;
import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.joonzis.myplant.dto.MyPlantDTO;
import org.joonzis.myplant.dto.MyPlantMainDTO;
import org.joonzis.myplant.mapper.MyPlantImageMapper;
import org.joonzis.myplant.mapper.MyPlantMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MyPlantServiceImpl implements MyPlantService {
	
	@Autowired
	private MyPlantMapper mpmapper;
	@Autowired
	private MyPlantImageMapper mpimapper;
	
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
		return result > 0;
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
	
	private final String IMG_DIR = "\\\\192.168.0.153\\projecthsf\\myplant\\img\\";
	
	@Override
	@Transactional
	public boolean remove(int myplant_id) {
		int result = 0;
		try {
			// 1. DB에서 파일 삭제 전, 저장되어 있는 이미지 파일명 조회
			String savedFileName = mpimapper.getImgAddr(myplant_id); 

			// 2. 연관 데이터 삭제
			mpmapper.deleteMyPlantStatistics(myplant_id);
			mpmapper.deleteMyPlantSchedule(myplant_id);
			
			// 3. 식물 메인 데이터 삭제
			result = mpmapper.delete(myplant_id);

			// 4. DB 데이터가 정상적으로 삭제되었다면, 실제 물리적 이미지 파일 삭제 진행
			if (result > 0 && savedFileName != null && !savedFileName.trim().isEmpty()) {
				// 경로와 파일명을 합쳐서 전체 파일 경로 생성
				String fullPath = IMG_DIR + savedFileName;
				File targetFile = new File(fullPath);
				
				// 해당 경로에 파일이 실제로 존재하는지 확인 후 삭제
				if (targetFile.exists()) {
					boolean isDeleted = targetFile.delete();
					if (!isDeleted) {
						System.out.println("물리적 이미지 파일 삭제 실패: " + fullPath);
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("식물 및 이미지 삭제 중 오류 발생", e);
		}
		
		return result > 0;
	}
}
