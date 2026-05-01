package com.rwanda_dash.auth_service.dtos;


import lombok.Data;

@Data
public class OrgContactDto {
    private String email;
    private String phone;
    private String website;
    private String logo;
}
