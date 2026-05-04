package com.rwanda_dash.auth_service.dtos;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OrgContactDto {
    @NotBlank(message = "Email is required")
    @Email(regexp = ".+[@].+[\\.].+", message = "Must be a valid email format (e.g., admin@example.com)")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{7,15}$", message = "Phone number is invalid")
    private String phone;

    private String website;
    private String logo;
}
