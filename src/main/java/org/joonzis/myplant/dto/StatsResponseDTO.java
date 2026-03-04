package org.joonzis.myplant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsResponseDTO {
    
    // 프론트엔드에서 data.series 로 접근하는 객체
    private Series series;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Series {
        // 프론트엔드의 METRICS key 값들과 정확히 일치해야 합니다.
        private List<DataPoint> illumination;
        private List<DataPoint> temperature;
        private List<DataPoint> humidity;
        private List<DataPoint> soil_moisture; // JSON 키 매핑을 위해 스네이크 케이스 유지
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DataPoint {
        private String t; // 시간 (예: "2026-03-04T14:00:00")
        private Double v; // 평균 측정값 (데이터가 없을 경우 null을 담기 위해 원시타입 double 대신 래퍼클래스 Double 사용)
    }
}