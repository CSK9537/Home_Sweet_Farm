package org.joonzis.plant.service;

import java.time.Duration;
import java.util.List;

import org.joonzis.plant.mapper.CrawlMapper;
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
	// 백과사전 정보 입력(식물 이름 목록 DB 기반으로 백과사전 페이지 이동 후 DB 저장)
	// 관리가이드 정보 입력(식물 이름 목록 DB 기반으로 관리가이드 페이지 이동 후 DB 저장)
}
