package com.bora.d100.repository;

import com.bora.d100.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface UserRepository extends JpaRepository<User, Long>
{
    boolean existsByEmail(String email);
    User findByEmail(String email);
}
