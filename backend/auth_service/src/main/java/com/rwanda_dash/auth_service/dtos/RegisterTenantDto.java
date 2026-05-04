package com.rwanda_dash.auth_service.dtos;

import jakarta.validation.Valid;
// import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
// import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterTenantDto {
    
    @NotBlank(message = "Organization name is required")
    private String organizationName;

    @Valid
    @NotNull(message = "Location information is required")
    private LocationDto location;

    @Valid
    @NotNull(message = "Contact information is required")
    private OrgContactDto contact;

    @Valid
    @NotNull(message = "User information is required")
    private RegisterUserDto user;
}
