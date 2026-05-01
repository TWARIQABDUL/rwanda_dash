package com.rwanda_dash.auth_service.controlers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rwanda_dash.auth_service.dtos.RegisterTenantDto;
import com.rwanda_dash.auth_service.dtos.RegisterUserDto;
import com.rwanda_dash.auth_service.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/platform-admin")
    public void registerPlatformAdmin(@RequestBody RegisterTenantDto registerTenantDto) {
        authService.registerPlatform(registerTenantDto);
    }

    @PostMapping("/register/user")
    public void registerUser(@RequestBody RegisterUserDto registerUserDto) {
        authService.registerUser(registerUserDto);
    }

    
}
