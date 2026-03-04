package org.joonzis.myplant.service;

import org.joonzis.myplant.dto.MyPlantStatisticsDTO;
import org.joonzis.myplant.dto.StatsResponseDTO;
import org.joonzis.myplant.mapper.MyPlantStatisticsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.ToIntFunction;
import java.util.stream.Collectors;

@Service
public class MyPlantStatisticsServiceImpl implements MyPlantStatisticsService{
	@Autowired
	private MyPlantStatisticsMapper statisticsMapper;
	
	@Override
	public StatsResponseDTO getPlantStatistics(int myplant_id, String range) {
		List<MyPlantStatisticsDTO> rawData = statisticsMapper.findSensorDataByMyplantId(myplant_id);

        // Date 타입인 sensing_time을 LocalDateTime으로 변환 후 시간 단위로 자름
        Map<LocalDateTime, List<MyPlantStatisticsDTO>> groupedData = rawData.stream()
                .filter(data -> data.getSensing_time() != null) // null 데이터 안전망
                .collect(Collectors.groupingBy(
                        data -> truncateTime(convertToLocalDateTime(data.getSensing_time()), range),
                        TreeMap::new,
                        Collectors.toList()
                ));

        List<StatsResponseDTO.DataPoint> illuminationList = new ArrayList<>();
        List<StatsResponseDTO.DataPoint> temperatureList = new ArrayList<>();
        List<StatsResponseDTO.DataPoint> humidityList = new ArrayList<>();
        List<StatsResponseDTO.DataPoint> soilMoistureList = new ArrayList<>();

        for (Map.Entry<LocalDateTime, List<MyPlantStatisticsDTO>> entry : groupedData.entrySet()) {
            String timeString = entry.getKey().toString();
            List<MyPlantStatisticsDTO> group = entry.getValue();

            Double avgIllum = calculateAverage(group, MyPlantStatisticsDTO::getIllumination);
            Double avgTemp  = calculateAverage(group, MyPlantStatisticsDTO::getTemperature);
            Double avgHum   = calculateAverage(group, MyPlantStatisticsDTO::getHumidity);
            Double avgSoil  = calculateAverage(group, MyPlantStatisticsDTO::getSoil_moisture);

            illuminationList.add(new StatsResponseDTO.DataPoint(timeString, avgIllum));
            temperatureList.add(new StatsResponseDTO.DataPoint(timeString, avgTemp));
            humidityList.add(new StatsResponseDTO.DataPoint(timeString, avgHum));
            soilMoistureList.add(new StatsResponseDTO.DataPoint(timeString, avgSoil));
        }

        StatsResponseDTO.Series series = new StatsResponseDTO.Series(
                illuminationList, temperatureList, humidityList, soilMoistureList
        );
        return new StatsResponseDTO(series);
    }

    private Double calculateAverage(List<MyPlantStatisticsDTO> group, ToIntFunction<MyPlantStatisticsDTO> extractor) {
    	double sum = 0;
        int count = 0;
        
        for (MyPlantStatisticsDTO dto : group) {
            int val = extractor.applyAsInt(dto);
            sum += val;
            count++;
        }
        
        // count가 0일 경우(그룹에 데이터가 없을 경우) null 반환, 아니면 소수점 첫째 자리까지 반올림
        return count == 0 ? null : Math.round((sum / count) * 10.0) / 10.0;
    }

    // Date 객체를 LocalDateTime으로 안전하게 변환하는 헬퍼 메서드
    private LocalDateTime convertToLocalDateTime(Date date) {
        if (date instanceof java.sql.Timestamp) {
            return ((java.sql.Timestamp) date).toLocalDateTime();
        }
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    private LocalDateTime truncateTime(LocalDateTime time, String range) {
        if (time == null) return null;
        switch (range.toUpperCase()) {
            case "HOURLY":  return time.truncatedTo(ChronoUnit.HOURS);
            case "DAILY":   return time.truncatedTo(ChronoUnit.DAYS);
            case "MONTHLY": return time.withDayOfMonth(1).truncatedTo(ChronoUnit.DAYS);
            default:        return time;
        }
    }
}
