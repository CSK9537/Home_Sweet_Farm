package org.joonzis.plant.mapper;

import java.util.List;

import org.joonzis.plant.dto.PlantDTO;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import lombok.extern.log4j.Log4j;

@Log4j
@RunWith(SpringJUnit4ClassRunner.class) 
@ContextConfiguration( 
		"file:src/main/webapp/WEB-INF/spring/root-context.xml")
public class PlantMapperTests {
	
	@Autowired
	private PlantMapper pmapper;
	
//	@Test
//	public void insertPlantInfoTest() {
//		log.info("insert plant info test...");
//		try {
//			PlantDTO pdto = new PlantDTO();
//			pdto.setPlant_name("Epipremnum aureum");
//			pdto.setPlant_name_kor("스킨답서스");
//			pdto.setPlant_description("스킨답서스(Epipremnum aureum)은 세계에서 가장 인기 있는 화초로, 대한민국에서는 국민 화초라고 불릴 정도로 많이 키웁니다. 키우기가 쉬워 입문자에게 좋습니다. 스킨답서스는 공기 정화 효과도 있지만 생명력과 번식력이 강해 야생에서는 생태계를 파괴하는 주범으로 여겨지기도 해, 일부 지역에서는 '악마의 덩굴(Devil's ivy)'라고 이름까지 붙였다고 합니다. 또한 독성이 있으니 절대로 식용해서는 안 되는 식물입니다.");
//			pdto.setPlant_species("스킨답서스 (Epipremnum aureum)");
//			pdto.setPlant_genus("에피프렘넘속");
//			pdto.setPlant_family("천남성과");
//			pdto.setPlant_order("택사목");
//			pdto.setPlant_class("백합식물강");
//			pdto.setPlant_phylum("관속식물");
//			pdto.setPlant_toxicity("인간 및 애완동물에게 유독");
//			pdto.setPlant_lifespan("다년생");
//			pdto.setPlant_type("덩굴, 허브");
//			pdto.setPlant_height("30cm to 20m");
//			pdto.setPlant_spread("20cm to 30cm");
//			pdto.setPlant_stemcolor("초록색, 노란색, 크림색");
//			pdto.setPlant_leafcolor("초록색, 노란색, 여러가지색");
//			pdto.setPlant_leaftype("상록수");
//			pdto.setPlant_flowercolor("초록색");
//			pdto.setPlant_flowersize("2.5cm");
//			pdto.setPlant_bloomtime("한여름, 늦여름");
//			pdto.setPlant_fruitcolor(null);
//			pdto.setPlant_harvesttime("중추, 늦가을");
//			pdto.setPlant_temperature_imin(20);
//			pdto.setPlant_temperature_imax(41);
//			pdto.setPlant_dormancy("비휴면");
//			pdto.setPlant_growthseason(null);
//			pdto.setPlant_growthrate("보통");
//			pdto.setPlant_culture_epv("오우곤 카즈 라는 공기 중의 포름 알데히드를 효과적으로 정화 할 수있는 강력한 공기 정화 작용과 불순물 흡착 능력을 갖추고 있습니다.");
//			pdto.setPlant_culture_ev(null);
//			pdto.setPlant_culture_biv(null);
//			pdto.setPlant_culture_gu("스킨답서스 은 뛰어난 관엽 식물이며, 실내 장식에 적합합니다.");
//			pdto.setPlant_culture_symbolism("행복");
//			pdto.setPlant_culture_if("스킨답서스 은 행복의 상징입니다. 포름 알데히드를 흡수 할 수 있다고 생각이 식물을 몇 화분을 집에 두는 것을 좋아하는 사람은 많이 있습니다. 효과가 있을까요? 새롭게 단장 된 객실에서 스킨답서스 은 벤젠, 트리클로로 에틸렌, 포름 알데히드 흡수에 도움이되지만, 이에 만 의존하여 모든 유해 가스를 제거 할 수 없습니다. 그러나 강한 생명력이 있기 때문에 포름 알데히드를 설탕과 아미노산으로 변환하거나, 복사기 나 프린터에서 배출되는 벤젠을 분해 할 수 있습니다. 따라서 가정이나 사무실에 스킨답서스 화분을 일부두기에는 여전히 많은 장점이 있습니다.");
//			int result = pmapper.insertPlantInfo(pdto);
//			if(result > 0) {
//				log.info("success!!!");
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void getPlantIdListTest() {
//		log.info("get plant id list test...");
//		try {
//			List<Integer> list = pmapper.getPlantIdList();
//			int lastindex = list.size() - 1;
//			log.info(list.get(lastindex) + "...");
//			log.info("success!!!");
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void getPlantListByRankTest() {
//		log.info("get plant list by rank test...");
//		try {
//			List<PlantDTO> pdtolist = pmapper.getPlantListByRank(100);
//			int i = 0;
//			for(PlantDTO pdto : pdtolist) {
//				log.info(++i);
//				log.info(pdto);
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void getPlantListByRandomTest() {
//		log.info("get plant list by random test...");
//		try {
//			List<PlantDTO> pdtolist = pmapper.getPlantListByRandom(3350, 3);
//			int i = 0;
//			for(PlantDTO pdto : pdtolist) {
//				log.info(++i);
//				log.info(pdto);
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void getPlantIdTest() {
//		log.info("get plant id test...");
//		try {
//			log.info(pmapper.getPlantId("Monstera deliciosa"));
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void getPlantInfoTest() {
//		log.info("get plant info test...");
//		
//		int plant_id = 100;
//		
//		try {
//			PlantDTO pdto = pmapper.getPlantInfo(plant_id);
//			log.info(pdto.getPlant_name());
//			log.info(pdto.getPlant_name_kor());
//			log.info(pdto.getPlant_description());
//			log.info("success!!!");
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
}
