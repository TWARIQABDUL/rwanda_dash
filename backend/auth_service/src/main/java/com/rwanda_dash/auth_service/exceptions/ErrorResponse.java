package com.rwanda_dash.auth_service.exceptions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
    private String message;
    private String error;
    private Map<String, String> validationErrors;

    public ErrorResponse(String message, String error) {
        this.message = message;
        this.error = error;
    }
}
