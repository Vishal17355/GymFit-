package com.gymfit.integration;

import com.gymfit.dto.DietDtos.ProfileRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DisabledSpoonacularProvider implements SpoonacularRecipeProvider {
    public DisabledSpoonacularProvider(@Value("${spoonacular.api.enabled:false}") boolean enabled) {
        if (enabled) throw new IllegalStateException("Spoonacular adapter is not licensed/configured yet. Keep SPOONACULAR_ENABLED=false.");
    }
    public boolean available() { return false; }
    public List<Long> discoverReviewedLocalRecipeIds(ProfileRequest profile) { return List.of(); }
}
