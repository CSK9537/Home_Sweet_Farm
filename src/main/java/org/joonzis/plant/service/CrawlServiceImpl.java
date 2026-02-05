package org.joonzis.plant.service;

import java.time.Duration;
import java.util.List;

import org.joonzis.plant.mapper.CrawlMapper;
import org.joonzis.plant.mapper.GuideMapper;
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
	@Autowired
	private GuideMapper gmapper;
	
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
		// 명시적 대기를 위한 객체 생성
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
							String plant_name = names[1].replace("'", "_").replace(" ", "_");
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
		// 명시적 대기를 위한 객체 생성
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(4));
		
		try {
			for(String plant : list) {
				
				driver.get("https://www.picturethisai.com/ko/wiki/" + plant + ".html");
				
				PlantVO pvo = new PlantVO();
//				
				// 식물 이름 set
//				WebElement plant_name = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector("")
//					));
				
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
//					if(categories[0].contains("종")) {
//						pvo.setplant_ categories[1];
//					}
				}
				
				// 주요 특징 그룹
				WebElement key_facts = wait.until(ExpectedConditions.visibilityOfElementLocated(
					By.cssSelector(".key-facts")
					));
				// 문화
				WebElement culture = wait.until(ExpectedConditions.visibilityOfElementLocated(
					By.cssSelector(".layout-wrap-items")
					));
				
//				WebElement plant_toxicity = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_lifespan = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_type = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_height = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_spread = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_stemcolor = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_leafcolor = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_leaftype = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_flowercolor = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_flowersize = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_bloomtime = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_fruitcolor = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_harvesttime = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_temperature_imin = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_temperature_imax = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_dormancy = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_growthseason = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_growthrate = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
				
				
				
				
//				WebElement plant_culture_epv = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_culture_ev = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_culture_biv = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_culture_gu = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_culture_symbolism = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
//				WebElement plant_culture_if = wait.until(ExpectedConditions.visibilityOfElementLocated(
//					By.cssSelector(".description-main-left-title")
//					));
				
			}
			
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
