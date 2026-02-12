package org.joonzis.security;

import org.joonzis.user.mapper.UserMapper;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import lombok.extern.log4j.Log4j;

@Log4j
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	private UserMapper userMapper;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		log.warn("Load User By Username: " + username);

		// DB에서 사용자 정보 조회
		// TODO: 현재 selectByUsername은 일부 필드만 가져오므로, 나중에 모든 정보를 가져오는 쿼리로 변경이 필요할 수 있습니다.
		UserVO vo = userMapper.selectByUsername(username);

		if (vo == null) {
			log.error("User not found: " + username);
			throw new UsernameNotFoundException("no user with username " + username);
		}

		log.info("User found: " + vo);
		return new CustomUser(vo);
	}
}
