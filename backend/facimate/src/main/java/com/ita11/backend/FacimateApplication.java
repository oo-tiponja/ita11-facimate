package com.ita11.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class FacimateApplication {
	public static void main(String[] args) {
		SpringApplication.run(FacimateApplication.class, args);
	}
}
