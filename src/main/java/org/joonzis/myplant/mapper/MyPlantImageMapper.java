package org.joonzis.myplant.mapper;

import org.apache.ibatis.annotations.Param;

public interface MyPlantImageMapper {
	public int updateImgAddr(@Param("dbSaveString") String dbSaveString,
							@Param("myplant_id") int myplant_id);
	public String getImgAddr(int myplant_id);
}
