package com.rwanda_dash.auth_service.dtos;

import com.rwanda_dash.auth_service.entity.User.UserRole;

import lombok.Data;

@Data
public class RegisterUserDto {
    private Long tenantId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;
    private UserRole role;
    
}
