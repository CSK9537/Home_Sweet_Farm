package org.joonzis.iot.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("org.joonzis.iot.repository")
public class MyBatisConfig {

}
