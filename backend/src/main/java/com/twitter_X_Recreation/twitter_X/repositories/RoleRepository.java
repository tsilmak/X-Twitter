package com.twitter_X_Recreation.twitter_X.repositories;

import com.twitter_X_Recreation.twitter_X.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findRoleByAuthority(String authority);
}
