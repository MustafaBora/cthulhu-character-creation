package com.bora.d100;

import java.util.logging.Logger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class D100Application {
	
	private static final Logger logger = Logger.getLogger(D100Application.class.getName());

	public static void main(String[] args) {
		logger.info("Starting D100 Application...");
		SpringApplication.run(D100Application.class, args);
		logger.info("D100 Application started successfully!");
	}

}
