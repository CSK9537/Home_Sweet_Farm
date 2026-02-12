package org.joonzis.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.joonzis.user.vo.UserVO;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import lombok.Getter;

@Getter
public class CustomUser extends User {

	private static final long serialVersionUID = 1L;
	private UserVO user;
	
	// 소셜 로그인 시 프로필 정보 등을 담기 위한 맵
	private Map<String, Object> attributes;

	public CustomUser(String username, String password, Collection<? extends GrantedAuthority> authorities) {
		super(username, password, authorities);
	}
	
	// 소셜 로그인 용 생성자 (OAuth2User 구현 시 사용될 구조)
	public CustomUser(UserVO vo, Map<String, Object> attributes) {
		super(vo.getUsername(), vo.getPassword(), getAuthorities(vo));
		this.user = vo;
		this.attributes = attributes;
	}

	public CustomUser(UserVO vo) {
		super(vo.getUsername(), vo.getPassword(), getAuthorities(vo));
		this.user = vo;
	}

	private static Collection<? extends GrantedAuthority> getAuthorities(UserVO vo) {
		List<GrantedAuthority> authList = new ArrayList<>();
		
		// 권한(auth_id) 매핑
		if (vo.getAuth_id() == 1) {
			authList.add(new SimpleGrantedAuthority("ROLE_USER"));
		} else {
			authList.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
		}
		
		// 등급(grade_id) 매핑
		if (vo.getGrade_id() == 1) {
			authList.add(new SimpleGrantedAuthority("GRADE_NOMAL"));
		} else if (vo.getGrade_id() == 2) {
			authList.add(new SimpleGrantedAuthority("GRADE_GOSU"));
		} else if (vo.getGrade_id() == 3) {
			authList.add(new SimpleGrantedAuthority("GRADE_EXPERT"));
		}
		
		return authList;
	}
}
