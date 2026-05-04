package com.rwanda_dash.auth_service.dtos;

import lombok.Data;

@Data
public class TenantRegisterResponse {
    private String message;
    private String status;

    public TenantRegisterResponse(String message, String status) {
        this.message = message;
        this.status = status;
    }
}
