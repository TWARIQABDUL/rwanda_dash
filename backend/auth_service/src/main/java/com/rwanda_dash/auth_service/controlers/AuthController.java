package com.rwanda_dash.auth_service.controlers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rwanda_dash.auth_service.dtos.LoginRequest;
import com.rwanda_dash.auth_service.dtos.LoginResponse;
import com.rwanda_dash.auth_service.dtos.RegisterTenantDto;
import com.rwanda_dash.auth_service.dtos.RegisterUserDto;
import com.rwanda_dash.auth_service.dtos.TenantRegisterResponse;
import com.rwanda_dash.auth_service.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/platform-admin")
    public ResponseEntity<TenantRegisterResponse> registerPlatformAdmin(@Valid @RequestBody RegisterTenantDto registerTenantDto) {
        log.info("Registering platform with data: {}", registerTenantDto);
        TenantRegisterResponse response = authService.registerPlatform(registerTenantDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<TenantRegisterResponse> verifyTenant(@RequestBody Map<String,String> reqToken){
        TenantRegisterResponse response = authService.verifyTenant(reqToken.get("token"));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/register/user")
    public void registerUser(@RequestBody RegisterUserDto registerUserDto) {
        
        authService.registerUser(registerUserDto);
    }

    
}
