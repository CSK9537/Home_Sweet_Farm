package org.joonzis.community.service;

import static org.junit.Assert.*;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import javax.sql.DataSource;

import org.joonzis.community.dto.UploadResponseDTO;
import org.joonzis.community.vo.BoardVO;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {
    "file:src/main/webapp/WEB-INF/spring/root-context.xml"
})
@Transactional
public class CommunityFormServiceTest {

  private final CommunityFormService service;
  private final DataSource dataSource;

  private JdbcTemplate jdbc;

  private Path testUploadRoot;
  private Integer testUserId;
  private Integer testCategoryId;

  public CommunityFormServiceTest(CommunityFormService service, DataSource dataSource) {
    this.service = service;
    this.dataSource = dataSource;
  }

  @Before
  public void setUp() throws Exception {
    this.jdbc = new JdbcTemplate(dataSource);

    // 테스트용 업로드 루트(로컬 임시 폴더)로 강제
    this.testUploadRoot = Files.createTempDirectory("hsf-upload-test-");
    ReflectionTestUtils.setField(service, "uploadRoot", testUploadRoot.toString());

    // 테스트용 USER/CATEGORY 확보 (DB에 최소 1건 있어야 함)
    this.testUserId = jdbc.queryForObject("SELECT MIN(USER_ID) FROM TBL_USER", Integer.class);
    assertNotNull("사전조건 실패: TBL_USER에 USER_ID 데이터가 필요합니다.", testUserId);

    this.testCategoryId = jdbc.queryForObject(
        "SELECT MIN(CATEGORY_ID) FROM TBL_CATEGORY WHERE BOARD_TYPE='G' AND IS_ACTIVE='Y'",
        Integer.class
    );
    assertNotNull("사전조건 실패: TBL_CATEGORY에 BOARD_TYPE='G' 활성 카테고리 데이터가 필요합니다.", testCategoryId);
  }

  @After
  public void tearDown() throws Exception {
    if (testUploadRoot != null && Files.exists(testUploadRoot)) {
      Files.walk(testUploadRoot)
           .sorted((a, b) -> b.compareTo(a))
           .forEach(p -> { try { Files.deleteIfExists(p); } catch (Exception ignore) {} });
    }
  }

  // ---------------------------
  // Helpers
  // ---------------------------

  private MockMultipartFile newPng(String name) {
    return new MockMultipartFile("file", name, "image/png",
        ("fake-" + UUID.randomUUID()).getBytes(StandardCharsets.UTF_8));
  }

  private BoardVO newBoardG(String title, String contentHtml) {
    BoardVO b = new BoardVO();
    b.setCategory_id(testCategoryId);
    b.setParent_id(null);
    b.setTitle(title);
    b.setBoard_type("G");
    b.setPrice(null);
    b.setTrade_status(null);
    b.setContent(contentHtml);
    return b;
  }

  private Integer count(String sql, Object... args) {
    return jdbc.queryForObject(sql, Integer.class, args);
  }

  private String one(String sql, Object... args) {
    return jdbc.queryForObject(sql, String.class, args);
  }

  // ---------------------------
  // 1) uploadTempFile 단위 검증
  // ---------------------------

  @Test
  public void uploadTempFile_shouldSaveToTempDir_onlyFileSystem() throws Exception {
    String tempKey = UUID.randomUUID().toString();

    UploadResponseDTO res = service.uploadTempFile(newPng("a.png"), tempKey, "G");

    assertNotNull("uploadTempFile 결과가 null입니다.", res);
    assertNotNull("uploadTempFile.url이 null입니다.", res.getUrl());
    assertNotNull("uploadTempFile.savedName이 null입니다.", res.getSavedName());
    assertNotNull("uploadTempFile.subDir이 null입니다.", res.getSubDir());

    assertTrue("subDir은 _temp/{tempKey} 여야 합니다. actual=" + res.getSubDir(),
        res.getSubDir().equals("_temp/" + tempKey));

    // 실제 파일이 testUploadRoot/board_upload/_temp/tempKey/savedName에 존재해야 함
    Path tempFile = testUploadRoot.resolve("board_upload")
                                 .resolve("_temp")
                                 .resolve(tempKey)
                                 .resolve(res.getSavedName());

    assertTrue("임시 파일이 존재해야 합니다: " + tempFile, Files.exists(tempFile));

    // 메타 파일도 존재(서비스가 .meta 저장하도록 구현한 경우)
    Path metaFile = tempFile.getParent().resolve(res.getSavedName() + ".meta");
    assertTrue("메타 파일이 존재해야 합니다(없다면 ServiceImpl의 writeMeta 확인): " + metaFile,
        Files.exists(metaFile));
  }

  // ---------------------------
  // 2) write 단위 검증(이미지 없이) : Board insert만 확인
  // ---------------------------

//  @Test
//  public void write_withoutImages_shouldInsertBoard_onlyDB() {
//    String tempKey = UUID.randomUUID().toString();
//
//    BoardVO b = newBoardG("write_withoutImages", "<p>no images</p>");
//    int boardId = service.write(b, testUserId, tempKey, null, null);
//
//    assertTrue("boardId는 0보다 커야 합니다.", boardId > 0);
//
//    assertEquals("TBL_BOARD에 1건이 있어야 합니다.",
//        Integer.valueOf(1),
//        count("SELECT COUNT(*) FROM TBL_BOARD WHERE BOARD_ID = ?", boardId)
//    );
//
//    assertEquals("이미지가 없으므로 TBL_BOARD_FILE(EDITOR)은 0건이어야 합니다.",
//        Integer.valueOf(0),
//        count("SELECT COUNT(*) FROM TBL_BOARD_FILE WHERE BOARD_ID=? AND FILE_KIND='EDITOR' AND IS_ACTIVE='Y'", boardId)
//    );
//
//    String dbContent = one("SELECT CONTENT FROM TBL_BOARD WHERE BOARD_ID=?", boardId);
//    assertTrue("본문이 저장되어야 합니다.", dbContent.contains("no images"));
//  }
//
//  // ---------------------------
//  // 3) write + 이미지 : DB 파일 insert 검증
//  // ---------------------------
//
//  @Test
//  public void write_withTempImage_shouldInsertBoardFile_EDITOR_inDB() {
//    String tempKey = UUID.randomUUID().toString();
//
//    UploadResponseDTO up = service.uploadTempFile(newPng("b.png"), tempKey, "G");
//    BoardVO b = newBoardG("write_withTempImage_DB", "<p><img src=\"" + up.getUrl() + "\"/></p>");
//
//    int boardId = service.write(b, testUserId, tempKey, null, null);
//
//    assertEquals("EDITOR 파일은 1건이어야 합니다.",
//        Integer.valueOf(1),
//        count("SELECT COUNT(*) FROM TBL_BOARD_FILE WHERE BOARD_ID=? AND FILE_KIND='EDITOR' AND IS_ACTIVE='Y'", boardId)
//    );
//
//    assertEquals("최종 확정 후 TEMP_KEY는 NULL이어야 합니다.",
//        Integer.valueOf(0),
//        count("SELECT COUNT(*) FROM TBL_BOARD_FILE WHERE BOARD_ID=? AND TEMP_KEY IS NOT NULL", boardId)
//    );
//
//    String subDir = one("SELECT SUB_DIR FROM TBL_BOARD_FILE WHERE BOARD_ID=? AND FILE_KIND='EDITOR'", boardId);
//    assertFalse("최종 저장된 SUB_DIR은 _temp/* 이면 안 됩니다. actual=" + subDir,
//        subDir.startsWith("_temp/"));
//  }
//
//  // ---------------------------
//  // 4) write + 이미지 : 본문 치환 검증(_temp -> final)
//  // ---------------------------
//
//  @Test
//  public void write_withTempImage_shouldRewriteContent_removeTempPath() {
//    String tempKey = UUID.randomUUID().toString();
//
//    UploadResponseDTO up = service.uploadTempFile(newPng("c.png"), tempKey, "G");
//    BoardVO b = newBoardG("write_withTempImage_contentRewrite", "<p>x</p><img src=\"" + up.getUrl() + "\"><p>y</p>");
//
//    int boardId = service.write(b, testUserId, tempKey, null, null);
//
//    String dbContent = one("SELECT CONTENT FROM TBL_BOARD WHERE BOARD_ID=?", boardId);
//
//    assertFalse("본문에 _temp 경로가 남으면 안 됩니다. content=" + dbContent,
//        dbContent.contains("_temp/"));
//
//    // savedName이 본문에 존재하는지도 확인(치환은 됐지만 이미지 자체는 남아야 함)
//    assertTrue("본문에 savedName이 포함되어야 합니다(이미지 링크 유지).",
//        dbContent.contains(up.getSavedName()));
//  }
//
//  // ---------------------------
//  // 5) write + 이미지 : 파일 이동 검증(파일시스템)
//  // ---------------------------
//
//  @Test
//  public void write_withTempImage_shouldMoveFileToFinalDir_andRemoveTempDir() throws Exception {
//    String tempKey = UUID.randomUUID().toString();
//
//    UploadResponseDTO up = service.uploadTempFile(newPng("d.png"), tempKey, "G");
//
//    Path tempFile = testUploadRoot.resolve("board_upload")
//                                 .resolve("_temp")
//                                 .resolve(tempKey)
//                                 .resolve(up.getSavedName());
//    assertTrue("사전조건: temp 파일이 존재해야 합니다.", Files.exists(tempFile));
//
//    BoardVO b = newBoardG("write_withTempImage_moveFile", "<p><img src=\"" + up.getUrl() + "\"/></p>");
//    int boardId = service.write(b, testUserId, tempKey, null, null);
//
//    String subDir = one("SELECT SUB_DIR FROM TBL_BOARD_FILE WHERE BOARD_ID=? AND FILE_KIND='EDITOR'", boardId);
//    String saved = one("SELECT SAVED_NAME FROM TBL_BOARD_FILE WHERE BOARD_ID=? AND FILE_KIND='EDITOR'", boardId);
//
//    Path finalFile = testUploadRoot.resolve("board_upload")
//                                  .resolve(subDir.replace("/", java.io.File.separator))
//                                  .resolve(saved);
//
//    assertTrue("최종 파일이 존재해야 합니다: " + finalFile, Files.exists(finalFile));
//
//    Path tempDir = testUploadRoot.resolve("board_upload").resolve("_temp").resolve(tempKey);
//    assertFalse("submit 후 temp 폴더는 정리되어야 합니다: " + tempDir, Files.exists(tempDir));
//  }
}