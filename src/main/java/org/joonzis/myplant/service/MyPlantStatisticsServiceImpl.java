package org.joonzis.myplant.service;

import org.joonzis.myplant.dto.MyPlantStatisticsDTO;
import org.joonzis.myplant.dto.StatsResponseDTO;
import org.joonzis.myplant.mapper.MyPlantStatisticsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// 1. 날짜 포맷팅을 위한 import 추가
import java.text.SimpleDateFormat; 
import java.util.ArrayList;
import java.util.List;

@Service
public class MyPlantStatisticsServiceImpl implements MyPlantStatisticsService {

    @Autowired
    private MyPlantStatisticsMapper statisticsMapper;

    @Override
    public StatsResponseDTO getPlantStatistics(int myplant_id, String range) {
        List<MyPlantStatisticsDTO> dbData = statisticsMapper.getStatistics(myplant_id, range);

        List<StatsResponseDTO.DataPoint> illuminationList = new ArrayList<>();
        List<StatsResponseDTO.DataPoint> temperatureList = new ArrayList<>();
        List<StatsResponseDTO.DataPoint> humidityList = new ArrayList<>();
        List<StatsResponseDTO.DataPoint> soilMoistureList = new ArrayList<>();

        // 2. 자바스크립트가 인식할 수 있는 ISO 8601 포맷터 생성 (가운데 'T'가 핵심입니다)
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");

        for (MyPlantStatisticsDTO data : dbData) {
            
            // 3. 기존의 .toString() 대신 포맷터를 사용해서 변환
            String timeString = sdf.format(data.getSensing_time()); 

            illuminationList.add(new StatsResponseDTO.DataPoint(timeString, (double) data.getIllumination()));
            temperatureList.add(new StatsResponseDTO.DataPoint(timeString, (double) data.getTemperature()));
            humidityList.add(new StatsResponseDTO.DataPoint(timeString, (double) data.getHumidity()));
            soilMoistureList.add(new StatsResponseDTO.DataPoint(timeString, (double) data.getSoil_moisture()));
        }

        StatsResponseDTO.Series series = new StatsResponseDTO.Series(
                illuminationList, temperatureList, humidityList, soilMoistureList
        );
        return new StatsResponseDTO(series);
    }
}