package org.joonzis.myplant.controller;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.joonzis.myplant.service.MyPlantImageService;
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
@RequestMapping("/myplant/image")
public class MyPlantImageController {
	
	@Autowired
	private MyPlantImageService mpiservice;
	
	private final String UPLOAD_DIR = "\\\\192.168.0.153\\projecthsf\\myplant\\img\\"; // 실제 파일이 저장될 물리 경로

	@PostMapping(value = "/upload", produces = "application/json")
    public ResponseEntity<Map<String, Object>> uploadPhoto(
            @RequestParam("myplant_id") int myplant_id,
            @RequestParam("file") MultipartFile file) { 

        Map<String, Object> response = new HashMap<>();

        if (file.isEmpty()) {
            response.put("status", "error");
            response.put("message", "파일이 비어있습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) {
            dir.mkdirs(); 
        }

        try {
            // =========================================================
            // [추가된 부분] 1. 기존 이미지 삭제 로직
            // =========================================================
            // Service에서 기존 이미지 파일명을 가져옵니다. (메서드명은 실제 구현에 맞게 수정해주세요)
            String oldFileName = mpiservice.getImgAddr(myplant_id); 
            
            // 기존 파일명이 DB에 존재한다면 물리 파일 삭제 시도
            if (oldFileName != null && !oldFileName.isEmpty()) {
                File oldFile = new File(UPLOAD_DIR + oldFileName);
                if (oldFile.exists()) {
                    oldFile.delete(); // 🗑️ 기존 이미지 파일 삭제!
                }
            }
            // =========================================================

            // 2. 새로운 파일명 생성
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
            }

            String uuid = UUID.randomUUID().toString().replace("-", "");
            String dbSaveString = uuid + "." + extension;

            // 3. 새로운 파일 물리적 폴더에 저장
            File dest = new File(UPLOAD_DIR + dbSaveString);
            file.transferTo(dest);

            // 4. DB에 새로운 파일명으로 업데이트
            boolean result = mpiservice.updateImgAddr(dbSaveString, myplant_id);
            if(!result) {
                throw new Exception("이미지 경로 업데이트 DB 오류 발생"); 
            }

            response.put("status", "success");
            response.put("fileUrl", dbSaveString); 
            response.put("myplant_id", myplant_id);

            return ResponseEntity.ok(response);

        } catch (Exception e) { 
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "서버 처리 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
	
	@GetMapping("/show")
	public ResponseEntity<Resource> showImage(@RequestParam("fileName") String fileName) {
		try {
			// 1. 요청받은 파일 이름으로 실제 물리적 경로 생성
			File file = new File(UPLOAD_DIR + fileName);
			
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
