package com.rwanda_dash.auth_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "users") // "user" is a reserved keyword in PostgreSQL, so we name the table "users"
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id")
    private Tenant tenantId;
    
    private String firstName; // translated to first_name
    private String lastName;  // translated to last_name
    private String email;
    private String phone;
    private String password;
    @Enumerated(EnumType.STRING)
    private UserRole role;
    @Enumerated(EnumType.STRING)
    private Status status;

    public enum UserRole {
        PLATFORM_ADMIN,  // You (has maximum power, tenant_id = null)
        SELLER_OWNER,    // Owns an org (tenant_id = NOT null)
        SELLER_STAFF,    // Works for an org (tenant_id = NOT null)
        INDEPENDENT_DRIVER // Works for themselves (tenant_id = null)
    }

    public enum Status {
        ACTIVE,
        INACTIVE
    }
}