package org.joonzis.user.controller;

import java.io.File;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

import org.joonzis.user.service.MypageService;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
	@Autowired
	private ServletContext servletContext;
	
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
	        // 1. 외부 저장소(IMG_DIR)에서 요청된 파일 확인
	        File file = new File(IMG_DIR + fileName);
	        Resource resource;
	        String mimeType;

	        if (file.exists()) {
	            resource = new FileSystemResource(file);
	            mimeType = Files.probeContentType(file.toPath());
	        } else {
	            // 2. 파일이 없으면 webapp/resources/image/default_profile.png 참조
	            String defaultPath = servletContext.getRealPath("/resources/image/default_profile.png");
	            File defaultFile = new File(defaultPath);

	            if (defaultFile.exists()) {
	                resource = new FileSystemResource(defaultFile);
	                mimeType = "image/png"; // 또는 Files.probeContentType(defaultFile.toPath());
	            } else {
	                return ResponseEntity.notFound().build();
	            }
	        }

	        // 3. MIME 타입 방어 코드 및 응답 반환
	        if (mimeType == null) mimeType = "image/jpeg";

	        return ResponseEntity.ok()
	                .header(HttpHeaders.CONTENT_TYPE, mimeType)
	                .body(resource);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}
}
