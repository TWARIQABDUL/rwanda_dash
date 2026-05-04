package com.rwanda_dash.auth_service.dtos;

import java.util.Map;

import lombok.Data;
@Data
public class LoginResponse {
    private String message;
    private String token;
    private String status;
    private Map<String, Object> userDetails;
    
    public LoginResponse(String message, String token, String status, Map<String, Object> userDetails) {
        this.message = message;
        this.token = token;
        this.status = status;
        this.userDetails = userDetails;
    }
    
}
