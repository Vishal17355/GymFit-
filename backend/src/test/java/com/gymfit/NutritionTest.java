package com.gymfit;

import com.gymfit.dto.DietDtos.*;
import com.gymfit.service.NutritionService;
import com.gymfit.exception.DietException;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

class NutritionTest {
    static ProfileRequest profile(double weight,String diet,String goal) {
        return new ProfileRequest(24,"male",175,weight,"MODERATE",goal,diet,null,List.of(),List.of(),List.of(),false,false,Map.of());
    }
    private final NutritionService service=new NutritionService(300,250,1500,4000);
    @Test void bmrTdeeAndProtein() {
        Nutrition n=service.calculate(profile(80,"VEGETARIAN","GAIN"));
        assertEquals(1778.8,n.bmr()); assertEquals(2757.1,n.tdee()); assertEquals(3007.1,n.calories()); assertEquals(160,n.protein());
        assertEquals(n.calories(),n.protein()*4+n.carbs()*4+n.fat()*9,1);
    }
    @Test void femaleAndMaintenance() {
        var p=profile(80,"VEGAN","MAINTAIN");
        var female=new ProfileRequest(p.age(),"female",p.heightCm(),p.weightKg(),p.activityLevel(),p.fitnessGoal(),p.dietaryPreference(),null,p.allergies(),p.excludedFoods(),p.availableFoods(),false,false,Map.of());
        var n=service.calculate(female);assertEquals(1612.8,n.bmr());assertEquals(n.tdee(),n.calories());assertEquals(128,n.protein());
    }
    @Test void moderateLossAndDifferentWeights() {
        var n=service.calculate(profile(80,"VEGETARIAN","LOSS"));assertEquals(2457.1,n.calories());
        assertNotEquals(n.calories(),service.calculate(profile(60,"VEGETARIAN","LOSS")).calories());
    }
    @Test void specialRequirementsDoNotReceiveAutomaticPlans() {
        var p=profile(80,"VEGETARIAN","GAIN");
        for(var flags:List.of(new ProfileRequest(16,"male",175,80,"MODERATE","GAIN","VEGETARIAN",null,List.of(),List.of(),List.of(),false,false,Map.of()),
            new ProfileRequest(24,"female",175,80,"MODERATE","GAIN","VEGETARIAN",null,List.of(),List.of(),List.of(),true,false,Map.of()),
            new ProfileRequest(24,"male",175,80,"MODERATE","GAIN","VEGETARIAN",null,List.of(),List.of(),List.of(),false,true,Map.of())))
            assertThrows(DietException.class,()->service.calculate(flags));
    }
    @Test void extremeConfigurationIsRejected(){assertThrows(IllegalStateException.class,()->new NutritionService(1000,250,1500,4000));}
}
