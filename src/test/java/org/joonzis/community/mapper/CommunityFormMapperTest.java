package org.joonzis.community.mapper;

import static org.junit.Assert.*;

import java.util.List;
import java.util.UUID;

import javax.sql.DataSource;

import org.joonzis.community.vo.BoardFileVO;
import org.joonzis.community.vo.BoardVO;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {
    "file:src/main/webapp/WEB-INF/spring/root-context.xml"
})
@Transactional
public class CommunityFormMapperTest {

//  private final CommunityFormMapper mapper;
//  private final DataSource dataSource;
//
//  private JdbcTemplate jdbc;
//
//  private Integer testUserId;
//  private Integer testCategoryId;
//
//  public CommunityFormMapperTest(CommunityFormMapper mapper, DataSource dataSource) {
//    this.mapper = mapper;
//    this.dataSource = dataSource;
//  }
//
//  @Before
//  public void setUp() {
//    this.jdbc = new JdbcTemplate(dataSource);
//
//    // ✅ 테스트에 사용할 USER_ID 1개 확보
//    this.testUserId = jdbc.queryForObject(
//        "SELECT MIN(USER_ID) FROM TBL_USER",
//        Integer.class
//    );
//    assertNotNull("TBL_USER에 USER_ID 데이터가 필요합니다.", testUserId);
//
//    // ✅ G 게시판 카테고리 1개 확보 (없으면 활성 카테고리 데이터 먼저 넣어야 함)
//    this.testCategoryId = jdbc.queryForObject(
//        "SELECT MIN(CATEGORY_ID) FROM TBL_CATEGORY WHERE BOARD_TYPE = 'G' AND IS_ACTIVE = 'Y'",
//        Integer.class
//    );
//    assertNotNull("TBL_CATEGORY에 BOARD_TYPE='G' 활성 카테고리 데이터가 필요합니다.", testCategoryId);
//  }
//
//  @Test
//  public void selectSeq_and_insertBoard_and_selectBoardById_and_ownerCheck() {
//    // 1) SEQ 선발급
//    int boardId = mapper.selectBoardSeqNextVal();
//    assertTrue("SEQ_TBL_BOARD.NEXTVAL은 0보다 커야 합니다.", boardId > 0);
//
//    // 2) insertBoard
//    BoardVO board = new BoardVO();
//    board.setBoard_id(boardId);
//    board.setUser_id(testUserId);
//    board.setCategory_id(testCategoryId);
//    board.setParent_id(null);
//    board.setTitle("MapperTest title");
//    board.setContent("<p>MapperTest content</p>");
//    board.setBoard_type("G");
//    board.setPrice(null);
//    board.setTrade_status(null);
//
//    int ins = mapper.insertBoard(board);
//    assertEquals("insertBoard는 1행 삽입이어야 합니다.", 1, ins);
//
//    // 3) selectBoardById
//    BoardVO loaded = mapper.selectBoardById(boardId);
//    assertNotNull("insert 후 selectBoardById 결과는 null이면 안 됩니다.", loaded);
//    assertEquals(boardId, loaded.getBoard_id());
//    assertEquals(testUserId.intValue(), loaded.getUser_id());
//    assertEquals(testCategoryId.intValue(), loaded.getCategory_id().intValue());
//    assertEquals("G", loaded.getBoard_type());
//    assertEquals("MapperTest title", loaded.getTitle());
//
//    // 4) selectBoardOwnerUserId
//    Integer owner = mapper.selectBoardOwnerUserId(boardId);
//    assertNotNull("owner 조회 결과가 null이면 안 됩니다.", owner);
//    assertEquals(testUserId, owner);
//  }
//
//  @Test
//  public void insertBoardFile_shouldAllowNullBoardId_whenTempUpload() {
//    // 선업로드(임시) 구조: BOARD_ID NULL 가능해야 함
//    BoardFileVO f = new BoardFileVO();
//    f.setBoard_id(null); // 임시 업로드이므로 null
//    f.setOriginal_name("img.png");
//    f.setSaved_name(UUID.randomUUID().toString().replace("-", "") + ".png");
//    f.setContent_type("image/png");
//    f.setFile_size(123);
//    f.setTemp_key(UUID.randomUUID().toString());
//    f.setSub_dir("_temp/" + f.getTemp_key());
//    f.setFile_kind("EDITOR");
//    f.setIs_active("Y");
//    f.setIs_thumbnail("N");
//
//    int ins = mapper.insertBoardFile(f);
//    assertEquals("insertBoardFile은 1행 삽입이어야 합니다.", 1, ins);
//
//    // DB에서 BOARD_ID NULL로 들어갔는지 확인
//    Integer cnt = jdbc.queryForObject(
//        "SELECT COUNT(*) FROM TBL_BOARD_FILE WHERE SAVED_NAME = ? AND BOARD_ID IS NULL AND TEMP_KEY IS NOT NULL",
//        Integer.class,
//        f.getSaved_name()
//    );
//    assertEquals(Integer.valueOf(1), cnt);
//  }
//
//  @Test
//  public void hashtagSuggest_shouldWork_ifHashtagTableHasData() {
//    // 데이터가 없을 수도 있으니, 최소 1개 보장 후 테스트
//    // (중복 삽입 방지를 위해 같은 값 있으면 skip)
//    String tag = "테스트태그";
//
//    Integer exists = jdbc.queryForObject(
//        "SELECT COUNT(*) FROM TBL_BOARD_HASHTAG_LIST WHERE BOARD_HASHTAG_NAME = ?",
//        Integer.class,
//        tag
//    );
//
//    if (exists == 0) {
//      // PK 시퀀스가 있다고 가정 (없으면 너 DB 구성에 맞춰 수정)
//      // SEQ_TBL_BOARD_HASHTAG_LIST 또는 SEQ_TBL_BOARD_HASHTAG 가 있을 수 있음
//      // 우선 "가장 흔한 형태"로 시도: SEQ_TBL_BOARD_HASHTAG_LIST
//      // 만약 네 DB에 이름이 다르면 이 insert만 네 시퀀스명으로 바꾸면 됨.
//      jdbc.update(
//          "INSERT INTO TBL_BOARD_HASHTAG_LIST (BOARD_HASHTAG_ID, BOARD_HASHTAG_NAME, IS_ACTIVE, REG_DATE) " +
//          "VALUES (SEQ_TBL_BOARD_HASHTAG_LIST.NEXTVAL, ?, 'Y', SYSDATE)",
//          tag
//      );
//    }
//
//    // mapper suggest 실행
//    List<String> res = mapper.selectHashtagSuggest("테", 10);
//    assertNotNull(res);
//    assertTrue("추천 결과에 '" + tag + "'가 포함되어야 합니다.", res.contains(tag));
//  }
}