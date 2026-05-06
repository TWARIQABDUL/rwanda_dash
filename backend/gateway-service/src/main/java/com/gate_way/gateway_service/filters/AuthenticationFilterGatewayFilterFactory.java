package com.gate_way.gateway_service.filters;

import io.jsonwebtoken.Claims;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import com.gate_way.gateway_service.utils.JwtUtil;
import com.gate_way.gateway_service.utils.RouteValidator;

@Component
public class AuthenticationFilterGatewayFilterFactory extends AbstractGatewayFilterFactory<AuthenticationFilterGatewayFilterFactory.Config> {

    public static class Config {
        // Configuration properties can go here if needed
    }

    @Autowired
    private RouteValidator validator;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilterGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {

        System.out.println("AuthenticationFilterGatewayFilterFactory applied");
        
        return ((exchange, chain) -> {
            
            // 1. Check if the route actually requires authentication
            if (validator.isSecured.test(exchange.getRequest())) {
                
                // 2. Check if the Authorization header is missing
                List<String> authHeaders = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);
                if (authHeaders == null || authHeaders.isEmpty()) {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }

                // 3. Extract the token
                String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    authHeader = authHeader.substring(7); // Remove "Bearer "
                }

                try {
                    // 4. Validate token and extract the data payload
                    Claims claims = jwtUtil.validateTokenAndGetClaims(authHeader);

                    // 5. THE MAGIC: Mutate the request! 
                    // Add the user data as headers so downstream services know who is calling
                    exchange.getRequest().mutate()
                            .header("X-User-Id", String.valueOf(claims.get("userId")))
                            .header("X-User-Role", String.valueOf(claims.get("role")))
                            .header("X-Tenant-Id", claims.get("tenantId") != null ? String.valueOf(claims.get("tenantId")) : "")
                            .build();

                } catch (Exception e) {
                    // Token is expired, invalid, or tampered with
                    exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                    return exchange.getResponse().setComplete();
                }
            }
            
            // 6. Forward the request to the destination microservice
            return chain.filter(exchange);
        });
    }

}
