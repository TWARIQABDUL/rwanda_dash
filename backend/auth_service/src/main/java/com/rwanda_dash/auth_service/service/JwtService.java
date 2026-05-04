package com.rwanda_dash.auth_service.service;

import com.rwanda_dash.auth_service.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    // Pulls the secret key from your application.properties
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    // Pulls the login expiration time from your application.properties
    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    // ==========================================
    // 1. STANDARD LOGIN TOKEN
    // ==========================================
    public String generateToken(User user) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", user.getId());
        extraClaims.put("role", user.getRole().name());
        
        // Correctly checks the Tenant object before extracting its ID
        if (user.getTenantId() != null) {
            extraClaims.put("tenantId", user.getTenantId().getId());
        }

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ==========================================
    // 2. EMAIL VERIFICATION TOKEN
    // ==========================================
    public String generateVerificationToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        // STRICT LOCK: This token can never be used to log in
        claims.put("purpose", "EMAIL_VERIFICATION"); 

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email) // Binds the token strictly to THIS exact email
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 600000))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ==========================================
    // 3. EXTRACT & VALIDATE VERIFICATION TOKEN
    // ==========================================
    public String extractEmailFromVerificationToken(String token) {
        try {
            // This method automatically checks the signature math and expiration date!
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Security Check: Did they try to send a normal login token here?
            if (!"EMAIL_VERIFICATION".equals(claims.get("purpose"))) {
                throw new RuntimeException("Invalid token purpose");
            }

            return claims.getSubject(); // Returns the email safely
            
        } catch (Exception e) {
            // Catches expired tokens, tampered tokens, or bad signatures
            throw new RuntimeException("Verification link is invalid or has expired.");
        }
    }

    // ==========================================
    // 4. CRYPTOGRAPHIC KEY GENERATOR
    // ==========================================
    private Key getSignInKey() {
        // Decodes the Base64 string from your properties file into a byte array
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        // Generates the HMAC SHA-256 key required for secure signing
        return Keys.hmacShaKeyFor(keyBytes);
    }
}