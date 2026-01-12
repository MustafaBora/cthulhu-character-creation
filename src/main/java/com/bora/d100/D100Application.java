package com.bora.d100;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class D100Application {
	
	private static final Logger logger = LoggerFactory.getLogger(D100Application.class);

	public static void main(String[] args) {
		logger.info("Starting D100 Application...");
		SpringApplication.run(D100Application.class, args);
		logger.info("D100 Application started successfully!");
	}

}
