package org.joonzis.chatting.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat")
public class FileController {

    // 🚩 153번 컴퓨터의 실제 네트워크 경로로 수정
    private final String UPLOAD_DIR = "\\\\192.168.0.153\\projecthsf\\chat_upload\\";

    @GetMapping("/files/{filename:.+}")
    public void serveFile(@PathVariable String filename, HttpServletResponse response) throws IOException {
        File file = new File(UPLOAD_DIR, filename);

        if (!file.exists()) {
            System.out.println("[DEBUG] 파일을 찾을 수 없음: " + file.getAbsolutePath());
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        Path path = file.toPath();
        String contentType = Files.probeContentType(path);
        
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        response.setContentType(contentType); 
        Files.copy(path, response.getOutputStream());
        response.flushBuffer();
    }
}
