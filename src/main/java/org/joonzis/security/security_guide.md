# Spring Security 통합 가이드 및 로드맵

이 문서는 Home_Sweet_Farm 프로젝트에 적용된 스프링 시큐리티의 구성 요소와 향후 확장 방향(소셜 로그인 등)을 정리한 가이드입니다.

---

## 1. 지금까지의 주요 변경점 및 수정 이유

### 🛡️ 보안 인프라 완전 복원 및 "Permissive Mode" 도입
*   **변경 내용**: `web.xml`에서 주석 처리되었던 `springSecurityFilterChain`을 복구하고, 모든 요청을 허용(`permitAll`)하도록 설정했습니다.
*   **수정 이유**: 보안 설정을 완전히 제거하기보다, 인프라는 유지하되 현재 개발에 방해되지 않도록 "모든 문을 열어둔 상태"로 유지하여 향후 보안 기능 추가 시 재작업을 최소화하기 위함입니다.
*   **해결된 문제**: 로그인 시 발생하던 **403 Forbidden(CSRF 에러)**을 CSRF 비활성화를 통해 해결했습니다.

### 👤 사용자 정의 인증 모델 (CustomUser) 도입
*   **변경 내용**: 시큐리티 기본 `User` 클래스를 확장한 `CustomUser`와 DB 연동을 위한 `CustomUserDetailsService`를 구현했습니다.
*   **수정 이유**: 시큐리티 세션 내에 단순히 아이디/비밀번호뿐만 아니라 닉네임, 등급 등 우리 서비스만의 추가 유저 정보(`UserVO`)를 보관하기 위해서입니다.

---

## 2. 주요 코드 및 클래스의 역할

### 📁 `org.joonzis.security`
*   **`CustomUser.java`**: 
    - 시큐리티가 사용하는 세션 바구니입니다.
    - 내부에 `UserVO` 멤버 변수를 가지고 있어, 어디서든 로그인한 사람의 닉네임, 이메일 등을 바로 꺼낼 수 있게 설계되었습니다.
    - 특히 `attributes` 맵을 포함하여 나중에 소셜 로그인 정보가 들어올 자리를 미리 마련했습니다.
*   **`CustomUserDetailsService.java`**:
    - "DB를 어디서 읽어올까?"를 담당합니다.
    - `UserMapper`를 통해 DB에서 유저 정보를 조회하고, 시큐리티가 이해할 수 있는 `CustomUser` 객체로 변환해서 돌려줍니다.

### 📄 `security-context.xml`
*   **`roleHierarchy`**: "관리자는 일반 유저의 권한을 포함한다"는 상하관계를 정의합니다.
*   **`webSecurityExpressionHandler`**: 위의 계층 구조를 JSP나 Java 코드의 시큐리티 표현식(`hasRole` 등)이 이해할 수 있도록 도와주는 통번역기 역할을 합니다.

---

## 3. 향후 기능 확장 가이드

### 🔑 권한 제어 (RBAC) 추가 시
*   **Java**: 메소드 위에 `@PreAuthorize("hasRole('ROLE_ADMIN')")` 어노테이션을 붙여서 컨트롤러 접근을 막을 수 있습니다.
*   **JSP**: `<sec:authorize access="hasRole('ROLE_USER')">` 태그로 특정 버튼이나 메뉴를 권한에 따라 보여주거나 숨길 수 있습니다.

### 🌐 소셜 로그인 (Passwordless) API 추가 시 (Next Step)
1.  **라이브러리 활성화**: `pom.xml` 하단에 주석 처리된 `spring-security-oauth2-client` 및 `jose` 라이브러리 주석을 해제합니다.
2.  **서비스 구현**: `CustomOAuth2UserService`를 새로 만들어, 소셜(카카오/네이버)에서 인증 성공 시 넘겨주는 정보를 받아 `CustomUser`에 채워주는 로직을 작성합니다.
3.  **CustomUser 연동**: `CustomUser`가 `OAuth2User` 인터페이스를 추가로 `implements` 하도록 수정하면, 일반 로그인 유저와 소셜 로그인 유저를 컨트롤러에서 동일한 타입으로 취급할 수 있습니다.
4.  **설정 추가**: `security-context.xml`에 주석 처리된 `<security:oauth2-login>` 설정을 활성화하고 API 키(Client ID/Secret)를 등록합니다.

---

## 💡 개발 시 팁
- JSP 최상단에는 반드시 `<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>` 선언이 있어야 시큐리티 태그를 쓸 수 있습니다.
- 현재 `selectByUsername` 쿼리에 `password`, `auth_id`, `grade_id` 필드가 모두 포함되어야 실제 로그인 및 권한 인계가 가능합니다.
