package org.joonzis.myplant.service;

public interface MyPlantImageService {
	public boolean updateImg(String dbSaveString, int myplant_id);
	public String getImg(int myplant_id);
}
