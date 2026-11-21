package com.gymfit.repository;
import com.gymfit.entity.Recipe;
import org.springframework.data.jpa.repository.*;
import java.util.*;
import java.time.LocalDate;
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    @EntityGraph(attributePaths = {"ingredients", "ingredients.food"})
    List<Recipe> findAllByOrderById();
}
