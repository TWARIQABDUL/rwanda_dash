package com.rwanda_dash.auth_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rwanda_dash.auth_service.entity.User;


@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    
}
