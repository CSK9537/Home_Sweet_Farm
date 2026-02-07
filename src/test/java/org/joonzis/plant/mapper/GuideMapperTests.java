package org.joonzis.plant.mapper;

import org.joonzis.plant.vo.GuideVO;
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
public class GuideMapperTests {
	
	@Autowired
	private GuideMapper gmapper;
	
//	@Test
//	public void insertGuideInfoTest() {
//		log.info("insert guide info...");
//		try {
//			GuideVO gvo = new GuideVO();
//			gvo.setPlant_id(1);
//			gvo.setGuide_caretip("스킨답서스은 그 강인함과 최소한의 관리 요구로 인해 인기 있는 실내 식물입니다. 이 식물은 간접광에서 잘 자라지만 낮은 조명 조건도 견딜 수 있어 다양한 실내 환경에 적응할 수 있습니다. 특별한 관리 사항으로는 뿌리 썩음을 방지하기 위해 물주기 사이에 표면 토양이 마르게 하는 것과 자주 잎을 닦아 광합성 효율을 유지하는 것입니다. 지나치게 물을 주는 것은 관리자가 흔히 저지르는 실수입니다.");
//			gvo.setGuide_toughness("어려움");
//			gvo.setGuide_carelevel("보통");
//			gvo.setGuide_caredifficulty("쉬움");
//			gvo.setGuide_lifespan("다년생");
//			gvo.setGuide_watering_schedule("매주");
//			gvo.setGuide_sunlight_requirements("충분한 그늘");
//			gvo.setGuide_soil_type("포팅 믹스, 정원 토양");
//			gvo.setGuide_soil_ph("6-7");
//			gvo.setGuide_planting_time("사계절");
//			gvo.setGuide_hardinesszone("10-13");
//			gvo.setGuide_toxicity("사람 & 반려동물에게 유독함");
//			gvo.setGuide_wartering_humiditylevel("높은 습도");
//			gvo.setGuide_wartering_content("스킨답서스은 열대 숲의 높은 습도에서 잘 자라며, 물빠짐이 충분하지 않으면서도 일정한 수분을 요구하도록 적응했습니다. 이 식물은 물의 필요성에서 균형을 이루며, 건조한 기간을 견디지만 정기적인 물주기를 선호합니다. 무성한 외관을 유지하기 위해 매주 물을 주어야 합니다. 일반적으로 실내에서 기르는 상록 식물인 스킨답서스은 고향 환경의 습기 있는 조건을 재현하기 위해 가끔씩 물방울을 뿌려주는 것이 좋습니다.");
//			gvo.setGuide_sunlight_tolerance("부분 햇빛");
//			gvo.setGuide_sunlight_content("스킨답서스은 밝고 간접적인 조명에서 잘 자라지만 낮은 조명 수준도 견딜 수 있습니다. 이상적인 조명은 분산된 햇빛이 있는 완전한 그늘로, 잎이 직사광선에 노출되어 타버리지 않도록 합니다. 스킨답서스은 부분적으로 햇빛에 적응할 수 있지만 성장은 더 느릴 수 있으며, 잎의 변색이 덜 두드러질 수 있습니다. 실내에서 기를 경우 스킨답서스은 필터된 빛의 창가 근처에 두어야 하며, 실외에 놓을 경우 직사광선으로부터 보호되는 곳에 위치해야 최적의 건강과 외관을 유지할 수 있습니다.");
//			gvo.setGuide_temperature_imin(20);
//			gvo.setGuide_temperature_imax(41);
//			gvo.setGuide_temperature_tmin(5);
//			gvo.setGuide_temperature_tmax(45);
//			gvo.setGuide_temperature_content("스킨답서스은 온도 변화에 대해 적당한 내성을 지닌 식물로, 5℃ (41℉)까지의 추위와 45℃ (113℉)까지의 더위를 견딥니다. 이러한 회복력은 보호가 필요한 추위와 극한의 더위에서의 관리에 영향을 미칩니다. 추위 스트레스의 증상으로는 잎이 노랗게 변하고 시들어가는 것이 있으며, 과열은 잎이 타고 시드는 원인이 될 수 있습니다. 온도 극단을 완화하기 위해 겨울철에는 식물을 보호하고, 더운 날씨에는 충분한 그늘과 수분을 제공해야 합니다.");
//			gvo.setGuide_soil_composition("양토, 백악질, 점토, 모래, 사양토");
//			gvo.setGuide_soil_content("스킨답서스은 뿌리 썩음을 방지하기 위해 배수가 잘 되는 토양에서 잘 자랍니다. 적합한 토양 혼합물은 분갈이 상토 1부와 퍼라이트나 굵은 모래 1부를 결합하여 공기透過성을 높이는 것입니다. 지속적인 양분 공급을 위해 1년에 두 번 느린 방출 비료를 포함시킵니다. 퍼라이트가 없다면 후막으로 대체할 수 있습니다. 추천한 토양 혼합물의 기능을 지원하기 위해 화분에는 배수 구멍이 있어야 합니다.");
//			gvo.setGuide_fertilizing_content("스킨답서스을 비료주기는 활발한 성장 단계인 봄과 여름에 4-6주마다 진행하며, 고른 비율의 고질소 액체 비료를 권장 비율의 절반으로 희석하여 사용합니다. 이는 강한 성장과 무성한 잎을 촉진합니다. 가을과 겨울에는 성장이 느려지므로 2-3개월에 한 번으로 줄입니다. 비료 과다 사용은 스킨답서스에 해를 입힐 수 있으며, 갈색 잎끝이 그 신호입니다. 뿌리 화상을 방지하기 위해 습한 토양에 비료를 적용하십시오. 스킨답서스이 휴면 상태이거나 건강이 좋지 않을 때는 회복할 때까지 비료를 주지 마십시오.");
//			gvo.setGuide_pruning_time("봄, 여름, 가을");
//			gvo.setGuide_pruning_benefits("활발한 성장, 모양 유지");
//			gvo.setGuide_pruning_content("스킨답서스은 매력적인 심장 모양의 잎을 가진 내구성이 강한 덩굴식물입니다. 봄 초에서 말기까지 전정하여 더 풍성한 성장을 촉진하고, 늘어지는 줄기나 손상된 부분을 제거합니다. 깨끗하고 날카로운 가위를 사용하여 잎 마디 바로 위에서 자르십시오. 정기적인 전정은 크기를 관리하고 더 조밀한 잎사귀를 유도하는 데 도움이 됩니다. 또한 전체 식물 건강에 유익하며, 미적 향상과 해충 침입을 예방합니다. 일관된 관리로 스킨답서스을 생기 있고 번성하게 유지할 수 있습니다.");
//			gvo.setGuide_propagation_time("봄, 여름");
//			gvo.setGuide_propagation_type("가지치기, 층화번식");
//			gvo.setGuide_propagation_content("아라세과에 속하는 스킨답서스은 낮은 조명 조건에서 잘 자라는 능력으로 인해 실내 식물 애호가들 사이에서 인기가 높습니다. 스킨답서스을 번식하려면 최소 1개의 마디와 몇 개의 건강한 잎이 있는 줄기 절단을 해야 합니다. 줄기를 물에 담그는 것은 일반적인 방법으로, 뿌리 발달을 시각적으로 관찰할 수 있게 합니다. 뿌리가 형성되면 절단을 성공적으로 분갈이 할 수 있습니다. 번식의 성공률은 일반적으로 식물의 강인한 특성과 다양한 실내 환경에 대한 적응력 덕분에 높습니다.");
//			gvo.setGuide_transplanting_time("봄 중순, 늦은 봄, 중추, 늦가을");
//			gvo.setGuide_transplanting_content("스킨답서스을(를) 이식하기 가장 좋은 시기는 중봄부터 늦봄 또는 중가을부터 늦가을까지입니다. 이 시기는 식물이 온화한 온도에서 뿌리를 내릴 수 있도록 도와줍니다. 스킨답서스에 적합한 밝고 배수가 잘 되는 위치를 선택하십시오. 이식 시 뿌리 덩어리를 부드럽게 풀어 최적의 성장을 유도합니다.");
//			gvo.setGuide_planting_content("실내 - 화분:실내에서 잘 자라는 스킨답서스은 가정 환경에 쉽게 적응합니다. 식물이 스트레스를 받지 않게 조심스럽게 화분을 회전시켜 고르게 성장하게 하세요.\r\n" + 
//					"실외 - 화분:스킨답서스을 실외 화분에 두는 경우, 가혹한 조건으로부터 보호가 필요할 수 있습니다. 최적의 건강을 위해 필요시 덮개 아래로 옮기세요.\r\n" + 
//					"실외 - 땅에 심기:자연 서식지에서 스킨답서스은 나무를 쉽게 오릅니다. 실외 지면에 심을 때 덩굴이 늘어질 공간이 충분히 확보되도록 하세요.");
//			gvo.setGuide_repotting_schedule("매년 한 번");
//			gvo.setGuide_repotting_content("스킨답서스은 덩굴성 잎 식물로, 매년 분갈이를 해 주어야 활발한 성장을 유지할 수 있습니다. 분갈이는 봄에 하는 것이 가장 좋으며, 이는 활동적인 성장기에 맞춰 뿌리와 잎의 빠른 발달을 촉진합니다. 성장할 공간을 위해 직경이 2인치 더 큰 화분을 선택합니다. 분갈이 후에는 간접광을 제공하고, 새로운 환경에 쉽게 적응할 수 있도록 일상적인 관리법을 따릅니다.");
//			gvo.setGuide_harvest_time(null);
//			gvo.setGuide_harvest_content("스킨답서스은 관상용 잎 식물입니다. 더 많은 잎과 좋은 색깔을 가진 가지를 선택하고, 날카로운 가위를 사용하여 가지를 기울여 잘라놓고, 투명한 물에 담가 감상할 수 있습니다.");
//			int result = gmapper.insertGuideInfo(gvo);
//			if(result > 0) {
//				log.info("success!!!");
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
}
