package com.gymfit;

import com.gymfit.entity.*;
import com.gymfit.recommendation.RecipeNutrition;
import com.gymfit.dto.DietDtos.ProfileRequest;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

class RecipeNutritionTest {
    final RecipeNutrition nutrition=new RecipeNutrition();
    Recipe recipe(){
        Food f=new Food();f.id=1L;f.name="Test soy ingredient";f.calories=100.0;f.protein=10.0;f.carbohydrates=6.0;f.fat=4.0;f.reviewed=true;f.dietType="VEGAN";f.allergens=List.of("soy");
        Recipe r=new Recipe();r.servings=2;RecipeIngredient i=new RecipeIngredient();i.food=f;i.quantity=40;i.recipe=r;r.ingredients.add(i);return r;
    }
    @Test void quantityAndRecipeServingsAreBothApplied(){
        var m=nutrition.calculate(recipe(),1.5,Map.of(1L,2.0));assertEquals(30,m.calories(),.001);assertEquals(3,m.protein(),.001);assertEquals(.6,m.cost(),.001);
        assertEquals(30,nutrition.ingredients(recipe(),1.5).getFirst().quantity());
    }
    @Test void unknownPricesRemainUnknown(){assertNull(nutrition.calculate(recipe(),1,Map.of()).cost());}
    @Test void allergiesAndExclusionsFilterIngredients(){
        var p=NutritionTest.profile(80,"VEGAN","GAIN");
        assertTrue(nutrition.eligible(recipe(),p));
        var allergy=new ProfileRequest(p.age(),p.sexForBmr(),p.heightCm(),p.weightKg(),p.activityLevel(),p.fitnessGoal(),p.dietaryPreference(),null,List.of("soy"),List.of(),List.of(),false,false,Map.of());
        assertFalse(nutrition.eligible(recipe(),allergy));recipe().ingredients.getFirst().food.reviewed=false;
        Recipe unreviewed=recipe();unreviewed.ingredients.getFirst().food.reviewed=false;assertFalse(nutrition.eligible(unreviewed,p));
    }
    @Test void vegetarianRejectsEggsAndMeat(){
        Recipe r=recipe();for(String type:List.of("EGGETARIAN","NON_VEGETARIAN","UNCLASSIFIED")){
            r.ingredients.getFirst().food.dietType=type;assertFalse(nutrition.eligible(r,NutritionTest.profile(80,"VEGETARIAN","GAIN")));
        }
    }
}
