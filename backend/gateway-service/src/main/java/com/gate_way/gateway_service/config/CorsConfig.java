package com.gate_way.gateway_service.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // 1. Allow your frontend origins (Update these to match your React/Flutter local ports)
        corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173")); 
        
        // 2. Allow all HTTP methods
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // 3. Allow all headers (Crucial for Authorization and Content-Type)
        corsConfig.addAllowedHeader("*");
        
        // 4. Expose headers to the frontend (Optional, but good if you send custom response headers)
        corsConfig.setExposedHeaders(Arrays.asList("Authorization"));
        
        // 5. Allow credentials (Crucial if you ever switch back to HttpOnly Cookies)
        corsConfig.setAllowCredentials(true);

        // Apply this configuration to ALL routes ("/**") going through the gateway
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
