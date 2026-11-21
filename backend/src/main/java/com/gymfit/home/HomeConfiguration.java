package com.gymfit.home;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
@Configuration
@EnableJpaRepositories(basePackages={"com.gymfit.repository","com.gymfit.home"},considerNestedRepositories=true)
public class HomeConfiguration {}
