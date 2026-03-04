package org.joonzis.community.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.joonzis.community.dto.CommunityListDTO;
import org.joonzis.community.service.CommunityListService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommunityListController {

  private final CommunityListService communityListService;

  private String buildThumbUrl(HttpServletRequest req, String savedName) {
    if (savedName == null || savedName.trim().isEmpty()) return null;
    String ctx = req.getContextPath();
    return ctx + "/upload/community/" + savedName;
  }

  @GetMapping("/list")
  public String list(HttpServletRequest req,
                     Model model,
                     @RequestParam(value = "type", required = false, defaultValue = "FREE") String type,
                     @RequestParam(value = "q", required = false) String q,
                     @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                     @RequestParam(value = "size", required = false, defaultValue = "12") int size) {

    Map<String, Object> data = communityListService.getList(type, q, page, size);

    @SuppressWarnings("unchecked")
    List<CommunityListDTO> posts = (List<CommunityListDTO>) data.get("posts");

    // img 최종 조립: thumbSavedName -> /upload/community/...
    // (DTO에 thumbSavedName 필드 추가한 경우 가장 깔끔)
    if (posts != null) {
      for (CommunityListDTO p : posts) {
        // thumbSavedName 있으면 img로 변환
        try {
          java.lang.reflect.Method getThumbSavedName = p.getClass().getMethod("getThumbSavedName");
          Object saved = getThumbSavedName.invoke(p);
          if (saved != null) {
            p.setImg(buildThumbUrl(req, saved.toString()));
          }
        } catch (Exception ignore) {
          // DTO에 필드 추가 전이면 img는 null 유지 → JSP 기본이미지 출력
        }
      }
    }

    model.addAttribute("posts", posts);
    model.addAttribute("total", data.get("total"));
    model.addAttribute("page", data.get("page"));
    model.addAttribute("size", data.get("size"));

    return "community/CommunityList";
  }

  /**
   * CommunityList.jsp가 현재 /community/detail?id=... 로 링크를 걸고 있어서
   * 기존 CommunityViewController(/community/view?board_id=...)로 호환 리다이렉트.
   * (JSP 링크를 /community/view로 바꾸면 이 메서드는 삭제해도 됨)
   */
  @GetMapping("/detail")
  public String detailCompat(@RequestParam("id") int id) {
    return "redirect:/community/view?board_id=" + id;
  }
}