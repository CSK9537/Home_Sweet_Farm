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

    private final String UPLOAD_DIR = "C:/upload/files/";

    @GetMapping("/files/{filename:.+}")
    public void serveFile(@PathVariable String filename, HttpServletResponse response) throws IOException {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        Path path = file.toPath();
        response.setContentType(Files.probeContentType(path)); // image/jpeg 등
        Files.copy(path, response.getOutputStream());
        response.flushBuffer();
    }
}
