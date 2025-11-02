package com.twitter_X_Recreation.twitter_X.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    private final String FRONT_END_ORIGIN;

    public CorsConfiguration(@Value("${spring.web.cors.allowed-origins}") String frontEndOrigin) {
        this.FRONT_END_ORIGIN = frontEndOrigin;
        System.out.println("frontendorigin"+ frontEndOrigin);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(FRONT_END_ORIGIN)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}