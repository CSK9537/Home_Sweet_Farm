package org.joonzis.plant.service;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Service;

import io.github.bonigarcia.wdm.WebDriverManager;

@Service
public class CrawlServiceImpl implements CrawlService{
	
	// 드라이버 호출 후 항상 종료!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	
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
	public void insertPlantNames() {
		
		WebDriver driver = driver();
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
		
		try {
			driver.get("https://www.picturethisai.com/ko/wiki");
			System.out.println("1234567890\n1234567890");
			Thread.sleep(5000);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			driver.quit();
		}
		
	}
	// 백과사전 정보 입력(식물 이름 목록 DB 기반으로 백과사전 페이지 이동 후 DB 저장)
	// 관리가이드 정보 입력(식물 이름 목록 DB 기반으로 관리가이드 페이지 이동 후 DB 저장)
}
