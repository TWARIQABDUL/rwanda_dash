package com.rwanda_dash.auth_service.service;

import com.rwanda_dash.auth_service.dtos.LoginRequest;
import com.rwanda_dash.auth_service.dtos.LoginResponse;
import com.rwanda_dash.auth_service.dtos.RegisterTenantDto;
import com.rwanda_dash.auth_service.dtos.RegisterUserDto;
import com.rwanda_dash.auth_service.dtos.TenantRegisterResponse;
import com.rwanda_dash.auth_service.entity.Tenant;
import com.rwanda_dash.auth_service.entity.User;
import com.rwanda_dash.auth_service.repositories.TenantRepository;
import com.rwanda_dash.auth_service.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    
    // EDGE CASE FIX 1: Inject the PasswordEncoder
    private final PasswordEncoder passwordEncoder; 

    private final JwtService jwtService;

    @Transactional // Ensures that if the database crashes halfway, it rolls back safely
    public TenantRegisterResponse registerPlatform(RegisterTenantDto registerTenantDto) {
        log.info("Registering platform with data: {}", registerTenantDto);

         if (tenantRepository.existsByOrganizationNameIgnoreCase(registerTenantDto.getOrganizationName()) 
            || tenantRepository.existsByContactEmail(registerTenantDto.getContact().getEmail())) {
            throw new RuntimeException("An organization with this name or email already exists!");
        }
        if (userRepository.existsByEmail(registerTenantDto.getUser().getEmail())) {
            return new TenantRegisterResponse("An User with this email already exists!", "Error");
        }
        Tenant tenant = new Tenant();
        User user = new User();
        
        tenant.setOrganizationName(registerTenantDto.getOrganizationName());
        tenant.setLocation(registerTenantDto.getLocation());
        tenant.setContact(registerTenantDto.getContact());
        user.setEmail(registerTenantDto.getUser().getEmail());
        user.setPhone(registerTenantDto.getUser().getPhone());
        user.setFirstName(registerTenantDto.getUser().getFirstName());

        user.setLastName(registerTenantDto.getUser().getLastName());
        user.setRole(User.UserRole.SELLER_OWNER);
        user.setStatus(User.Status.INACTIVE);
        user.setPassword(passwordEncoder.encode(registerTenantDto.getUser().getPassword()));
        
        tenantRepository.save(tenant);
        user.setTenantId(tenant);
        userRepository.save(user);

        String verificationToken = jwtService.generateVerificationToken(registerTenantDto.getUser().getEmail());
        log.info("Verification token: {}", verificationToken);

        log.info("Tenant saved successfully with ID: {}", tenant.getId());

        
        
        TenantRegisterResponse response = new TenantRegisterResponse(
            "Tenant registered successfully check your email to verify your account",
            tenant.getStatus().toString()
        );
        
        return response;
    }

    @Transactional
    public void registerUser(RegisterUserDto dto) {
        
        // EDGE CASE FIX 2: Gracefully handle duplicate emails
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("An account with this email already exists!");
        }

        User user = new User();

        // EDGE CASE FIX 3: Explicit Role Handling (Requires 'role' in your DTO)
        // Instead of guessing the role, we require the frontend to tell us.
        User.UserRole requestedRole = dto.getRole();
        user.setRole(requestedRole);

        if (requestedRole == User.UserRole.INDEPENDENT_DRIVER) {
            user.setTenantId(null); // Drivers have no organization
        } else {
            // EDGE CASE FIX 4: Prevent Sellers from registering without a tenant
            if (dto.getTenantId() == null) {
                throw new RuntimeException("Organization ID is missing! Sellers must belong to a Tenant.");
            }
            
            Tenant tenant = tenantRepository.findById(dto.getTenantId())
                    .orElseThrow(() -> new RuntimeException("Organization not found with ID: " + dto.getTenantId()));
            
            user.setTenantId(tenant);
            }
        
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        
        // EDGE CASE FIX 1 (Applied): Secure the password
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        
        user.setStatus(User.Status.ACTIVE);

        userRepository.save(user);
        log.info("User saved successfully with ID: {}", user.getId());
    }

    @Transactional
    public TenantRegisterResponse verifyTenant(String token) {
        
        try {
            String email=jwtService.extractEmailFromVerificationToken(token);

            // Tenant tenant = tenantRepository.findByContactEmail(email)
            //         .orElseThrow(() -> new RuntimeException("Organization not found with email: " + email));

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Organization not found with email: " + email));
            Tenant tenant = tenantRepository.findById(user.getTenantId().getId())
                    .orElseThrow(() -> new RuntimeException("Organization not found with email: " + email));
            tenant.setStatus(Tenant.Status.ACTIVE);
            user.setStatus(User.Status.ACTIVE);
            tenantRepository.save(tenant);
            userRepository.save(user);
            
            
            log.info("Tenant verified successfully with email: {}", email);
            TenantRegisterResponse response = new TenantRegisterResponse(
                "Tenant verified successfully",
                Tenant.Status.ACTIVE.toString()
            );
            return response;
        } catch (Exception e) {
            log.error("Tenant verification failed", e);
            throw new RuntimeException("Invalid or expired verification token");
        }
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        Map<String,Object> claims = new HashMap<>();
        claims.put("user_id", user.getId());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole());
        if(user.getTenantId()!=null){
            claims.put("tenant_id", user.getTenantId().getId());
        }
        if (user.getStatus() == User.Status.INACTIVE) {
            throw new RuntimeException("Account is not activated please check your email to verify your account");
        }
        
        String token = jwtService.generateToken(user);
        LoginResponse resp = new LoginResponse(
            "Login successful",
            token,
            user.getStatus().toString(),
            claims
        );
        return resp;
    }


}