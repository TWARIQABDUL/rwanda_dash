package com.gate_way.gateway_service.config;

import com.gate_way.gateway_service.filters.AuthenticationFilterGatewayFilterFactory;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder, AuthenticationFilterGatewayFilterFactory authFilter) {
        return builder.routes()
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        // Apply your custom security filter here!
                        .filters(f -> f.filter(authFilter.apply(new AuthenticationFilterGatewayFilterFactory.Config())))
                        .uri("http://localhost:8086"))
                .build();
    }
}