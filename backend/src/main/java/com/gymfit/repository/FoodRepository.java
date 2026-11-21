package com.gymfit.repository;
import com.gymfit.entity.Food;
import org.springframework.data.jpa.repository.*;
import java.util.*;
import java.time.LocalDate;
public interface FoodRepository extends JpaRepository<Food, Long> {
    Optional<Food> findBySourceAndExternalFoodId(String source, String externalFoodId);
    List<Food> findTop30ByNameContainingIgnoreCaseOrderById(String name);
    List<Food> findByReviewedTrueOrderById();
}
