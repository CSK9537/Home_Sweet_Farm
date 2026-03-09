package org.joonzis.user.controller;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpSession;

import org.joonzis.user.service.MypageService;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/user")
public class ProfileImageController {
	
	@Autowired
	private MypageService mpservice;
	
	private final String IMG_DIR = "\\\\192.168.0.153\\projecthsf\\user\\profile_image\\"; // 실제 파일이 저장될 물리 경로

	@PostMapping(value = "/uploadProfile", produces = "application/json")
    public ResponseEntity<Map<String, Object>> uploadPhoto(@RequestParam("profileImage") MultipartFile file,
    														HttpSession session) { 
		UserVO user = (UserVO)session.getAttribute("loginUser");
		Map<String, Object> response = new HashMap<>();
		
		if(user == null) {
			response.put("status", "error");
            response.put("message", "유저 정보가 없습니다.");
            return ResponseEntity.badRequest().body(response);
		}
		
		int user_id = user.getUser_id();
		

        if (file.isEmpty()) {
            response.put("status", "error");
            response.put("message", "파일이 비어있습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        File dir = new File(IMG_DIR);
        if (!dir.exists()) {
            dir.mkdirs(); 
        }

        try {
            // Service에서 기존 이미지 파일명을 가져옵니다.
            String oldFileName = mpservice.getProfile(user_id); 
            
            // 기존 파일명이 DB에 존재한다면 물리 파일 삭제 시도
            if (oldFileName != null && !oldFileName.isEmpty()) {
                File oldFile = new File(IMG_DIR + oldFileName);
                if (oldFile.exists()) {
                    oldFile.delete(); // 🗑️ 기존 이미지 파일 삭제!
                }
            }

            // 새로운 파일명 생성
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
            }

            String uuid = UUID.randomUUID().toString().replace("-", "");
            String dbSaveString = uuid + "." + extension;

            // 새로운 파일 물리적 폴더에 저장
            File dest = new File(IMG_DIR + dbSaveString);
            file.transferTo(dest);

            // DB에 새로운 파일명으로 업데이트
            boolean result = mpservice.updateProfile(user_id, dbSaveString);
            if(!result) {
                throw new Exception("이미지 경로 업데이트 DB 오류 발생"); 
            }

            response.put("status", "success");
            response.put("fileUrl", dbSaveString); 
            response.put("user_id", user_id);

            return ResponseEntity.ok(response);

        } catch (Exception e) { 
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "서버 처리 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
	
	@GetMapping("/getProfile")
	public ResponseEntity<Resource> showImage(@RequestParam("fileName") String fileName) {
		try {
			// 1. 요청받은 파일 이름으로 실제 물리적 경로 생성
			File file = new File(IMG_DIR + fileName);
			
			// 2. 파일이 존재하지 않으면 404 에러 반환 (엑스박스 방지)
			if (!file.exists()) {
				return ResponseEntity.notFound().build();
			}

			// 3. 파일을 스프링의 Resource 객체로 변환 (메모리를 효율적으로 사용하며 스트리밍)
			Resource resource = new FileSystemResource(file);

			// 4. 브라우저가 이미지로 인식할 수 있도록 MIME 타입(Content-Type) 설정
			Path path = file.toPath();
			String mimeType = Files.probeContentType(path);
			
			// probeContentType이 타입을 인식하지 못할 경우 기본 이미지 타입으로 설정
			if (mimeType == null) {
				mimeType = "image/jpeg"; 
			}

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.parseMediaType(mimeType));

			// 5. 파일 데이터와 헤더를 브라우저로 전송!
			return new ResponseEntity<>(resource, headers, HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}
