package com.rwanda_dash.auth_service.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rwanda_dash.auth_service.entity.User;


@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    
    // Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
}
