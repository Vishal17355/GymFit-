package com.gymfit.service;

import com.gymfit.dto.DietDtos.ProfileRequest;
import com.gymfit.entity.UserProfile;
import com.gymfit.exception.DietException;
import com.gymfit.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service @Transactional
public class ProfileService {
    private final UserProfileRepository profiles;
    private final FoodRepository foods;
    public ProfileService(UserProfileRepository profiles, FoodRepository foods) { this.profiles = profiles; this.foods = foods; }
    public ProfileRequest get(String userId) { return view(entity(userId)); }
    public Optional<ProfileRequest> find(String userId) { return profiles.findByUserId(userId).map(ProfileService::view); }
    public UserProfile entity(String userId) { return profiles.findByUserId(userId).orElseThrow(() -> DietException.missing("Complete your diet profile first.")); }
    public ProfileRequest save(String userId, ProfileRequest request, boolean create) {
        var existing = profiles.findByUserId(userId);
        if (create && existing.isPresent()) throw new DietException(HttpStatus.CONFLICT, "PROFILE_EXISTS", "A profile already exists. Use update.");
        if (!create && existing.isEmpty()) throw DietException.missing("No diet profile exists yet.");
        if (foods.findAllById(request.pricesPer100g().keySet()).size() != request.pricesPer100g().size())
            throw DietException.invalid("A price references an unknown food.");
        UserProfile p = existing.orElseGet(UserProfile::new);
        p.userId = userId; p.age = request.age(); p.sexForBmr = request.sexForBmr(); p.heightCm = request.heightCm(); p.weightKg = request.weightKg();
        p.activityLevel = request.activityLevel(); p.fitnessGoal = request.fitnessGoal(); p.dietaryPreference = request.dietaryPreference(); p.dailyBudget = request.dailyBudget();
        p.allergies = normalize(request.allergies()); p.excludedFoods = normalize(request.excludedFoods()); p.availableFoods = normalize(request.availableFoods());
        p.pregnantOrBreastfeeding = request.pregnantOrBreastfeeding(); p.medicalDietRequired = request.medicalDietRequired();
        p.pricesPer100g.clear(); p.pricesPer100g.putAll(request.pricesPer100g());
        return view(profiles.saveAndFlush(p));
    }
    public static ProfileRequest view(UserProfile p) {
        return new ProfileRequest(p.age, p.sexForBmr, p.heightCm, p.weightKg, p.activityLevel, p.fitnessGoal, p.dietaryPreference,
            p.dailyBudget, List.copyOf(p.allergies), List.copyOf(p.excludedFoods), List.copyOf(p.availableFoods),
            p.pregnantOrBreastfeeding, p.medicalDietRequired, Map.copyOf(p.pricesPer100g));
    }
    private static List<String> normalize(List<String> values) { return values.stream().map(s -> s.trim().toLowerCase(Locale.ROOT)).distinct().toList(); }
}
