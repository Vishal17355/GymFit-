package com.gymfit.repository;
import com.gymfit.entity.LegacyDietImport;
import org.springframework.data.jpa.repository.*;
import java.util.*;
import java.time.LocalDate;
public interface LegacyDietImportRepository extends JpaRepository<LegacyDietImport, Long> {
    Optional<LegacyDietImport> findByUserIdAndFingerprint(String userId, String fingerprint);
    Optional<LegacyDietImport> findByIdAndUserId(Long id, String userId);
    List<LegacyDietImport> findByUserIdOrderByImportedAtDesc(String userId);
}
