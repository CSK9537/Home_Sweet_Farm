package org.joonzis.user.service;


import org.joonzis.user.mapper.MypageMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.log4j.Log4j;

@Log4j
@Service
public class MypageServiceImpl implements MypageService{
	
	@Autowired
	private MypageMapper mypagemapper;

}