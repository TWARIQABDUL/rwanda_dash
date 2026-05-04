package com.rwanda_dash.auth_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rwanda_dash.auth_service.entity.Tenant;

import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {

    boolean existsByOrganizationNameIgnoreCase(String organizationName);
    Optional<Tenant> findByContactEmail(String email);
    boolean existsByContactEmail(String email);

}
