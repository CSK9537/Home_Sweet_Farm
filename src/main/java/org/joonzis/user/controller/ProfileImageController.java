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
import org.springframework.util.StringUtils;
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
	public ResponseEntity<Resource> showImage(@RequestParam(value = "fileName", required = false) String fileName) {
	    try {
	        File targetFile = null;

	        // 1. 파라미터가 존재할 경우 외부 저장소에서 파일 확인
	        if (StringUtils.hasText(fileName)) {
	            // [보안] 경로 탐색(Directory Traversal) 공격 방지
	            if (fileName.contains("..") || fileName.contains("/") || fileName.contains("\\")) {
	                return ResponseEntity.badRequest().build();
	            }

	            File requestedFile = new File(IMG_DIR, fileName);
	            if (requestedFile.exists() && requestedFile.isFile()) {
	                targetFile = requestedFile;
	            }
	        }

	        // 2. 파일명이 없거나, 요청한 파일이 존재하지 않으면 기본 이미지로 폴백(Fallback)
	        if (targetFile == null) {
	            String defaultPath = servletContext.getRealPath("/resources/image/default_profile.png");
	            if (defaultPath != null) {
	                targetFile = new File(defaultPath);
	            }
	        }

	        // 3. 최종 파일이 없으면 404 Not Found 반환
	        if (targetFile == null || !targetFile.exists()) {
	            return ResponseEntity.notFound().build();
	        }

	        // 4. MIME 타입 확인 및 응답 생성
	        Resource resource = new FileSystemResource(targetFile);
	        String mimeType = Files.probeContentType(targetFile.toPath());
	        
	        if (mimeType == null) {
	            mimeType = "image/jpeg"; // 기본 MIME 타입 방어
	        }

	        return ResponseEntity.ok()
	                .header(HttpHeaders.CONTENT_TYPE, mimeType)
	                .body(resource);

	    } catch (Exception e) {
	        // e.printStackTrace(); // 실제 운영에서는 log.error()를 사용하는 것을 권장합니다.
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}
}
