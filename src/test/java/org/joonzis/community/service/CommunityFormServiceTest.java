package org.joonzis.community.service;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import org.joonzis.community.vo.BoardVO;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.log4j.Log4j;

@Log4j
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {
		"file:src/main/webapp/WEB-INF/spring/root-context.xml"})
public class CommunityFormServiceTest {
	@Autowired
	CommunityFormService communityFormService;
	
	 // 게시글 등록
//    @Test
//    public void writeTest() {
//    	 // given
//        int loginUserId = 221;
//        String tempKey = "TEST_TEMP_KEY";
//        String tagsCsv = "#해시태그";
//
//        BoardVO board = new BoardVO();
//        board.setUser_id(loginUserId);
//        board.setTitle("TEST_TITLE_NO_FILES");
//        board.setContent("TEST_CONTENT_NO_FILES");
//
//        // 프로젝트 규칙에 맞게 값 세팅 (NOT NULL 컬럼 있으면 반드시 채워야 함)
//        board.setBoard_type("G");
//        board.setCategory_id(120);
//        board.setParent_id(null);
//        board.setPrice(null);
//        board.setTrade_status(null);
//        board.setIs_active("Y");
//        board.setIs_selected("N");
//
//        MultipartFile[] attachFiles = new MultipartFile[0];
//
//        // when
//        try {
//            communityFormService.write(board, loginUserId, tempKey, attachFiles, tagsCsv);
//
//            // then
//            // selectKey/useGeneratedKeys로 board_id를 채우는 구조라면 통과
//            // 만약 구조상 board_id를 안 채우면, 여기 assert는 주석 처리하고 “예외 없음”만 확인해도 됨
//            assertTrue("board_id가 채워지지 않았습니다. (selectKey/useGeneratedKeys 설정 확인)",
//                    board.getBoard_id() > 0);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            fail("write() 중 예외 발생: " + e.getMessage());
//        }
//    }
//	
	// 게시글 수정
    @Test
    public void write_withFiles_shouldInsertBoardAndFiles() {
        // given
        int loginUserId = 221;
        String tempKey = "TEST_TEMP_KEY_FILES";
        String tagsCsv = "#수정";

        BoardVO board = new BoardVO();
        board.setUser_id(loginUserId);
        board.setTitle("수정");
        board.setContent("수정");

        board.setBoard_type("G");
        board.setCategory_id(120);
        board.setParent_id(null);
        board.setPrice(null);
        board.setTrade_status(null);
        board.setIs_active("Y");
        board.setIs_selected("N");

        // “첨부파일 형태” 더미 (MultipartFile)
        MockMultipartFile file1 = new MockMultipartFile(
                "attachFiles",              // name (컨트롤러 파라미터명과 같게 하는 게 제일 안전)
                "test1.png",                // original filename
                "image/png",                // content-type
                "PNG_DUMMY_BYTES".getBytes()
        );

        MockMultipartFile file2 = new MockMultipartFile(
                "attachFiles",
                "test2.jpg",
                "image/jpeg",
                "JPG_DUMMY_BYTES".getBytes()
        );

        MultipartFile[] attachFiles = new MultipartFile[] { file1, file2 };

        // when
        try {
            communityFormService.write(board, loginUserId, tempKey, attachFiles, tagsCsv);

            // then
            assertTrue("board_id가 채워지지 않았습니다. (selectKey/useGeneratedKeys 설정 확인)",
                    board.getBoard_id() > 0);

            // 파일 테이블 insert까지 검증하려면,
            // 1) BoardFileMapper/Repository를 @Autowired 해서 board_id로 조회 후 count 체크
            // 2) 또는 communityFormService에 “첨부파일 저장 결과”를 리턴하도록 설계
            // 둘 중 하나가 필요함 (현재 테스트만으론 '예외 없이 저장 로직이 수행됨'까지만 확실)

        } catch (Exception e) {
            e.printStackTrace();
            fail("write() (withFiles) 중 예외 발생: " + e.getMessage());
        }
    }
}