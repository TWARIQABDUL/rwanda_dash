package com.rwanda_dash.auth_service.service;

import com.rwanda_dash.auth_service.dtos.RegisterTenantDto;
import com.rwanda_dash.auth_service.dtos.RegisterUserDto;
import com.rwanda_dash.auth_service.entity.Tenant;
import com.rwanda_dash.auth_service.entity.User;
import com.rwanda_dash.auth_service.repositories.TenantRepository;
import com.rwanda_dash.auth_service.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;

    public void registerPlatform(RegisterTenantDto registerTenantDto) {
        log.info("Registering platform with data: {}", registerTenantDto);

        // Map DTO to Entity
        Tenant tenant = new Tenant();
        tenant.setOrganizationName(registerTenantDto.getOrganizationName());
        tenant.setLocation(registerTenantDto.getLocation());
        tenant.setContact(registerTenantDto.getContact());

        // Save the Entity
        tenantRepository.save(tenant);

        log.info("Tenant saved successfully with ID: {}", tenant.getId());
    }

    public void registerUser(RegisterUserDto registerUserDto) {
        User user = new User();

        if (registerUserDto.getTenantId() == null) {
            user.setRole(User.UserRole.INDEPENDENT_DRIVER);
        } else {
            // Fetch the tenant object from the database using the ID
            Tenant tenant = tenantRepository.findById(registerUserDto.getTenantId())
                    .orElseThrow(() -> new RuntimeException("Tenant not found with id: " + registerUserDto.getTenantId()));
            user.setTenantId(tenant);
            user.setRole(User.UserRole.SELLER_OWNER);
        }
        
        user.setFirstName(registerUserDto.getFirstName());
        user.setLastName(registerUserDto.getLastName());
        user.setEmail(registerUserDto.getEmail());
        user.setPhone(registerUserDto.getPhone());
        user.setPassword(registerUserDto.getPassword());
        user.setStatus(User.Status.ACTIVE);

        // Save the Entity
        userRepository.save(user);

        log.info("User saved successfully with ID: {}", user.getId());
    }
}
