package com.gymfit.integration;

import com.gymfit.dto.DietDtos.ProfileRequest;
import java.util.List;

/** Future adapter boundary. No endpoint/quota/storage permissions are assumed. */
public interface SpoonacularRecipeProvider {
    boolean available();
    List<Long> discoverReviewedLocalRecipeIds(ProfileRequest profile);
}
