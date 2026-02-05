package org.joonzis.plant.service;

import java.time.Duration;
import java.util.List;

import org.joonzis.plant.mapper.CrawlMapper;
import org.joonzis.plant.mapper.PlantMapper;
import org.joonzis.plant.vo.PlantVO;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.github.bonigarcia.wdm.WebDriverManager;

@Service
public class CrawlServiceImpl implements CrawlService{
	
	// 드라이버 호출 후 항상 종료!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	
	// 매퍼
	@Autowired
	private CrawlMapper cmapper;
	@Autowired
	private PlantMapper pmapper;
	
	// 드라이버 생성 및 설정
	private WebDriver driver() {
		ChromeOptions options = new ChromeOptions();
//		options.addArguments("--headless=new");
		options.addArguments("--disable-gpu");
		options.addArguments("--no-sandbox");
		options.addArguments("--window-size=1920,1080");
		options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36");
		
		WebDriverManager.chromedriver().setup();
		WebDriver driver = new ChromeDriver(options);
		return driver;
	}
	
	// 식물 이름 목록 DB 저장
	@Override
	public void insertPlantNames(List<String> list) {
		
		WebDriver driver = driver();
		// 명시적 대기를 위한 객체 생성(최대 대기 시간)
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(3));
		
		try {
			driver.get("https://www.picturethisai.com/ko/wiki");
			
			// 검색창 버튼 선택 후 클릭
			WebElement searchTrigger = wait.until(ExpectedConditions.elementToBeClickable(
					By.cssSelector(".header-wrap-top-main-content-search-wrap-text")
					));
			searchTrigger.click();
			
			// 실제 검색 기능이 있는 요소 선택
			WebElement realInput = wait.until(ExpectedConditions.visibilityOfElementLocated(
					By.cssSelector("#search")
					));
			
			for(String aplant : list) {
				
				try {
					// 검색어 입력
					realInput.clear();
					Thread.sleep(1000);
					realInput.sendKeys(aplant);
					realInput.sendKeys(" ");
					
					// 검색 창의 리스트 요소들
					By resultListSelector = By.cssSelector(".search_result_item");
					wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(resultListSelector));
					
					// 검색 결과 있는 경우 찾은 요소
					List<WebElement> results = driver.findElements(resultListSelector);
					
					// 각 리스트에서 한글만
					for(WebElement ele : results) {
						String result = ele.getText();
						// result가 줄띄기 포함
						String[] names = result.split("\\n");
						if(names[0].matches(".*[ㄱ-ㅎㅏ-ㅣ가-힣]+.*")) {
							String plant_name = names[1];
							// DB 저장
							cmapper.insertSearchPlantNames(plant_name);
						}
					}
					// try문 종료
				} catch (org.openqa.selenium.TimeoutException e) {
					continue;
				}
				
			} // for문 종료
			// try문 종료
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			driver.quit();
		}
		
	}
	
	// 백과사전 전체 정보 입력(식물 이름 목록 DB 기반으로 PictureThis 백과사전 페이지 이동 후 DB 저장)
	@Override
	public void insertTotalPlantData(List<String> list) {
		
		WebDriver driver = driver();
		// 명시적 대기를 위한 객체 생성(최대 대기 시간)
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(3));
		
		try {
			
			for(String plant_name : list) {
				
				try {
					
					String middleUrl = plant_name.replace(" ", "_").replace("'", "_");
					driver.get("https://www.picturethisai.com/ko/wiki/" + middleUrl + ".html");
					
					PlantVO pvo = new PlantVO();
					
					// 식물 영어 이름 set
					pvo.setPlant_name(plant_name);
					
					// 식물 한글 이름 set
					WebElement plant_name_kor = wait.until(ExpectedConditions.visibilityOfElementLocated(
							By.cssSelector(".description-main-left-title")
							));
					pvo.setPlant_name_kor(plant_name_kor.getText());
					
					// 설명 set
					WebElement plant_description = wait.until(ExpectedConditions.visibilityOfElementLocated(
							By.cssSelector(".des-content")
							));
					pvo.setPlant_description(plant_description.getText());
					
					// 학명 그룹
					WebElement plant_scientific_names = wait.until(ExpectedConditions.visibilityOfElementLocated(
							By.cssSelector(".scientific-name-items")
							));
					// 학명 그룹 분류 및 set
					List<WebElement> plant_scientific_name = plant_scientific_names.findElements(By.cssSelector(".scientific-name-item"));
					for(WebElement category : plant_scientific_name) {
						String[] categories = category.getText().split("\\n");		
						if(categories[0].contains("종")) {
							pvo.setPlant_species(categories[1]);
						}
						if(categories[0].contains("속")) {
							pvo.setPlant_genus(categories[1]);
						}
						if(categories[0].contains("과")) {
							pvo.setPlant_family(categories[1]);
						}
						if(categories[0].contains("목")) {
							pvo.setPlant_order(categories[1]);
						}
						if(categories[0].contains("강")) {
							pvo.setPlant_class(categories[1]);
						}
						if(categories[0].contains("문")) {
							pvo.setPlant_phylum(categories[1]);
						}
					}
					
					// 주요 특징 그룹
					WebElement key_facts = wait.until(ExpectedConditions.visibilityOfElementLocated(
							By.cssSelector(".key-facts")
							));
					// 주요 특징 분류 및  set
					List<WebElement> key_facts_contents = key_facts.findElements(By.cssSelector(".key-fact-content"));
					for(WebElement category : key_facts_contents) {
						String[] categories = category.getText().split("\\n");
						if(categories[1].equals("독성")) {
							pvo.setPlant_toxicity(categories[0]);
						}
						if(categories[1].equals("수명")) {
							pvo.setPlant_lifespan(categories[0]);
						}
						if(categories[1].equals("종류")) {
							pvo.setPlant_type(categories[0]);
						}
						if(categories[1].equals("식물 높이")) {
							pvo.setPlant_height(categories[0]);
						}
						if(categories[1].equals("꼭대기 지름")) {
							pvo.setPlant_spread(categories[0]);
						}
						if(categories[1].equals("줄기 색상")) {
							pvo.setPlant_stemcolor(categories[0]);
						}
						if(categories[1].equals("잎 색깔")) {
							pvo.setPlant_leafcolor(categories[0]);
						}
						if(categories[1].equals("잎 종류")) {
							pvo.setPlant_leaftype(categories[0]);
						}
						if(categories[1].equals("꽃 색깔")) {
							pvo.setPlant_flowercolor(categories[0]);
						}
						if(categories[1].equals("꽃 지름")) {
							pvo.setPlant_flowersize(categories[0]);
						}
						if(categories[1].equals("개화 시기")) {
							pvo.setPlant_bloomtime(categories[0]);
						}
						if(categories[1].equals("과일 색")) {
							pvo.setPlant_fruitcolor(categories[0]);
						}
						if(categories[1].equals("수확 시기")) {
							pvo.setPlant_harvesttime(categories[0]);
						}
						if(categories[1].equals("이상적인 온도")) {
							String[] temperature = categories[0].split(" ");
							pvo.setPlant_temperature_imin(Integer.parseInt(temperature[0]));
							pvo.setPlant_temperature_imax(Integer.parseInt(temperature[2]));
						}
						if(categories[1].equals("휴면")) {
							pvo.setPlant_dormancy(categories[0]);
						}
						if(categories[1].equals("성장기")) {
							pvo.setPlant_growthseason(categories[0]);
						}
						if(categories[1].equals("성장률")) {
							pvo.setPlant_growthrate(categories[0]);
						}
					}
					
					// 아래쪽 항목에서 문화 항목 찾기 및 상세 내용 set
					List<WebElement> bottoms = wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(
							By.cssSelector(".layout-wrap")
							));
					for(WebElement layout : bottoms) {
						if(layout.findElement(By.cssSelector(".layout-wrap-title")).getText().equals("문화")) {
							List<WebElement> cultureitems = layout.findElements(By.cssSelector(".layout-wrap-item-content"));
							for(WebElement category : cultureitems) {
								String[] categories = category.getText().split("\\n");
								if(categories[0].contains("환경")) {
									pvo.setPlant_culture_epv(categories[1]);
								}
								if(categories[0].contains("경제")) {
									pvo.setPlant_culture_ev(categories[1]);
								}
								if(categories[0].contains("미용")) {
									pvo.setPlant_culture_biv(categories[1]);
								}
								if(categories[0].contains("정원")) {
									pvo.setPlant_culture_gu(categories[1]);
								}
								if(categories[0].contains("상징")) {
									pvo.setPlant_culture_symbolism(categories[1]);
								}
								if(categories[0].contains("사실")) {
									pvo.setPlant_culture_if(categories[1]);
								}
							}
						}
					}
					
					// DB 저장
					pmapper.insertPlantInfo(pvo);
					
					// try문 종료
				} catch (org.openqa.selenium.TimeoutException e) {
					continue;
				}
				
			} // for문 종료
			// try문 종료
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			driver.quit();
		}
		
	}
	
	// 관리가이드 전체 정보 입력(식물 이름 목록 DB 기반으로 PictureThis 관리가이드 페이지 이동 후 DB 저장)
	@Override
	public void insertTotalGuideData(List<String> list) {
		
	}
}
