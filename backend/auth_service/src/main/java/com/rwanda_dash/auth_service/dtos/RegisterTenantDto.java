package com.rwanda_dash.auth_service.dtos;

import lombok.Data;

@Data
public class RegisterTenantDto {
    private String organizationName;
    private LocationDto location;
    private OrgContactDto contact;
}
