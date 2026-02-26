package org.joonzis.community.scheduler;

import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class TempUploadCleanupScheduler {

  @Value("${hsf.upload.root:\\\\192.168.0.153\\\\projecthsf}")
  private String uploadRoot;

  // 임시폴더 TTL(시간) - 기본 24시간
  @Value("${hsf.temp.ttl.hours:24}")
  private int ttlHours;

  // 30분마다 정리(원하면 조절)
  @Scheduled(cron = "0 */30 * * * *")
  public void cleanupTempUploads() {
    Path tempRoot = Paths.get(uploadRoot, "board_upload", "_temp");
    if (!Files.exists(tempRoot) || !Files.isDirectory(tempRoot)) return;

    final Instant cutoff = Instant.now().minus(Duration.ofHours(ttlHours));

    try (DirectoryStream<Path> stream = Files.newDirectoryStream(tempRoot)) {
      for (Path tempKeyDir : stream) {
        if (!Files.isDirectory(tempKeyDir)) continue;

        Instant lastModified = getLastModifiedInstant(tempKeyDir);
        if (lastModified == null) continue;

        // TTL 지난 폴더만 삭제
        if (lastModified.isBefore(cutoff)) {
          deleteDirectoryRecursive(tempKeyDir);
        }
      }
    } catch (IOException e) {
      // 로그 처리(프로젝트 로깅 정책에 맞게 변경)
      System.err.println("[TempCleanup] scan failed: " + e.getMessage());
    }
  }

  private Instant getLastModifiedInstant(Path dir) {
    try {
      return Files.getLastModifiedTime(dir).toInstant();
    } catch (IOException e) {
      return null;
    }
  }

  private void deleteDirectoryRecursive(Path dir) {
    try {
      Files.walkFileTree(dir, new SimpleFileVisitor<Path>() {
        @Override
        public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
          Files.deleteIfExists(file);
          return FileVisitResult.CONTINUE;
        }

        @Override
        public FileVisitResult postVisitDirectory(Path d, IOException exc) throws IOException {
          Files.deleteIfExists(d);
          return FileVisitResult.CONTINUE;
        }
      });
    } catch (IOException e) {
      // 로그 처리(프로젝트 로깅 정책에 맞게 변경)
      System.err.println("[TempCleanup] delete failed: " + dir + " / " + e.getMessage());
    }
  }
}