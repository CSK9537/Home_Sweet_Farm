package org.joonzis.persisnetence;

import static org.junit.Assert.fail;

import java.sql.Connection;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
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
public class DataSourceTests {
//	@Autowired
//	private DataSource dataSource;
//	@Autowired
//	private SqlSessionFactory sqlSeccionFactory;
//	
//	@Test
//	public void testConnection() {
//		try(Connection conn = dataSource.getConnection()) {
//			log.info("DB 연결 중 : " + conn);
//		} catch (Exception e) {
//			fail(e.getMessage());
//			fail("DB 연결 실패...");
//		}
//		log.info("DB 연결 성공!");
//	}
	
//	@Test
//	public void testMybatis() {
//		try(SqlSession session = sqlSeccionFactory.openSession()){
//			log.info("MyBatis 연결 시도 중 : " + session);
//		} catch (Exception e) {
//			fail("mybatis 테스트 실패... : " + e.getMessage());
//		}
//		log.info("MyBatis 연결 성공!");
//	}
}
