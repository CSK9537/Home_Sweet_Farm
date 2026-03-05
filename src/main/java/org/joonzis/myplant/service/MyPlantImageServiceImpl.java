package org.joonzis.myplant.service;

import org.joonzis.myplant.mapper.MyPlantImageMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MyPlantImageServiceImpl implements MyPlantImageService{
	@Autowired
	private MyPlantImageMapper mpimapper;
	
	@Override
	public boolean updateImgAddr(String dbSaveString, int myplant_id) {
		return mpimapper.updateImgAddr(dbSaveString, myplant_id) > 0;
	}
	
	@Override
	public String getImgAddr(int myplant_id) {
	    String fileName = mpimapper.getImgAddr(myplant_id);
	    // DB에 저장된 이미지가 없으면 빈 문자열 반환
	    if (fileName == null || fileName.isEmpty()) {
	        return "";
	    }
	    return fileName;
	}
}
