package com.gymfit.repository;
import com.gymfit.entity.UserProfile;
import org.springframework.data.jpa.repository.*;
import java.util.*;
import java.time.LocalDate;
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUserId(String userId);
}
