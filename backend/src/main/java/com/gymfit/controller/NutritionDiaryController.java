package com.gymfit.controller;

import com.gymfit.service.NutritionDiaryService;
import com.gymfit.service.NutritionDiaryService.*;
import jakarta.validation.Valid;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/nutrition-diary")
public class NutritionDiaryController {
    private final NutritionDiaryService diary;

    public NutritionDiaryController(NutritionDiaryService diary) { this.diary = diary; }

    @GetMapping public Day day(Principal user, @RequestParam LocalDate date) {
        return diary.day(user.getName(), date);
    }
    @GetMapping("/recent") public List<Entry> recent(Principal user, @RequestParam(defaultValue="false") boolean favorites) {
        return diary.recent(user.getName(), favorites);
    }
    @PostMapping("/entries") public Day add(Principal user, @Valid @RequestBody Add body) {
        return diary.add(user.getName(), body);
    }
    public record Batch(@jakarta.validation.constraints.NotEmpty @jakarta.validation.constraints.Size(max=8)
                        List<@jakarta.validation.constraints.NotNull @Valid Add> entries) {}
    @PostMapping("/entries/batch") public Day batch(Principal user, @Valid @RequestBody Batch body) {
        return diary.batch(user.getName(), body.entries);
    }
    @GetMapping("/recipes") public List<RecipeChoice> recipes() { return diary.recipes(); }
    @PostMapping("/entries/recipe") public Day addRecipe(Principal user, @Valid @RequestBody AddRecipe body) {
        return diary.addRecipe(user.getName(), body);
    }
    @PatchMapping("/entries/{id}") public Day edit(Principal user, @PathVariable long id, @Valid @RequestBody Update body) {
        return diary.edit(user.getName(), id, body);
    }
    @DeleteMapping("/entries/{id}") public Day remove(Principal user, @PathVariable long id) {
        return diary.remove(user.getName(), id);
    }
    @PostMapping("/entries/{id}/repeat") public Day repeat(Principal user, @PathVariable long id, @Valid @RequestBody Repeat body) {
        return diary.repeat(user.getName(), id, body);
    }
    @PutMapping("/water") public Day water(Principal user, @Valid @RequestBody Water body) {
        return diary.water(user.getName(), body);
    }
    @PutMapping("/settings") public Settings settings(Principal user, @Valid @RequestBody Settings body) {
        return diary.settings(user.getName(), body);
    }
}
