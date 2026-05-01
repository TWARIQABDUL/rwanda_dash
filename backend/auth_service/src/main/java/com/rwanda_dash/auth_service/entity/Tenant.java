package com.rwanda_dash.auth_service.entity;

import com.rwanda_dash.auth_service.dtos.LocationDto;
import com.rwanda_dash.auth_service.dtos.OrgContactDto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Tenant {

    public enum Status {
        ACTIVE,
        INACTIVE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Use camelCase! Spring Boot will automatically make the column "organization_name"
    private String organizationName; 

    // Tell JPA that the fields inside this class should be columns in the Tenant table
    @Embedded 
    private LocationDto location;

    @Embedded
    private OrgContactDto contact;

    // Force JPA to save the word "INACTIVE" instead of the number 1
    @Enumerated(EnumType.STRING)
    private Status status = Status.INACTIVE;
}