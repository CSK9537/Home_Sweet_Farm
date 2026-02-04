SELECT * FROM TBL_USER;

desc tbl_user;
INSERT INTO TBL_USER
(USER_ID, NAME) VALUES(USER_ID_SEQ.NEXTVAL, 'dddd');
COMMIT;

SELECT USER_ID, NAME FROM TBL_USER;

--insert
INSERT INTO TBL_USER (USER_ID, USERNAME, NAME, EMAIL, PHONE, PASSWORD)
VALUES (8, 'linwee', '혜린테스트', 'test@test.com', '12345678', 'dummyPw');
COMMIT;

--select(데이터 조회)
SELECT user_id, name
FROM TBL_USER
WHERE user_id = 65;

--delete(데이터 삭제)
DELETE 
FROM TBL_USER
WHERE user_id = 69;
