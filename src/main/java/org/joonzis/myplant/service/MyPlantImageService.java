package org.joonzis.myplant.service;

public interface MyPlantImageService {
	public boolean updateImgAddr(String dbSaveString, int myplant_id);
	public String getImgAddr(int myplant_id);
}
