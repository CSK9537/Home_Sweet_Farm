package org.joonzis.myplant.mapper;

import org.apache.ibatis.annotations.Param;

public interface MyPlantImageMapper {
	public int updateImg(@Param("dbSaveString") String dbSaveString,
							@Param("myplant_id") int myplant_id);
	public String getImg(int myplant_id);
}
