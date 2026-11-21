package com.gymfit.controller;

import com.gymfit.service.*;
import com.gymfit.service.NutritionExtrasService.*;
import com.gymfit.service.NutritionCircleService.*;
import com.gymfit.service.NutritionDiaryService.Repeat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController @RequestMapping("/api/v1/nutrition-tools")
public class NutritionExtrasController {
    private final NutritionExtrasService tools;
    private final NutritionCircleService circles;
    public NutritionExtrasController(NutritionExtrasService tools,NutritionCircleService circles) {this.tools=tools;this.circles=circles;}
    @GetMapping("/templates") public List<Template> templates(Principal p) {return tools.templates(p.getName());}
    @PostMapping("/templates") public Template template(Principal p,@Valid @RequestBody SaveMeal body) {return tools.saveMeal(p.getName(),body);}
    @PostMapping("/templates/{id}/log") public Object log(Principal p,@PathVariable long id,@Valid @RequestBody Repeat body) {return tools.repeat(p.getName(),id,body);}
    @DeleteMapping("/templates/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void deleteTemplate(Principal p,@PathVariable long id) {tools.removeTemplate(p.getName(),id);}
    @PostMapping("/describe") public List<Match> describe(@Valid @RequestBody Description body) {return tools.describe(body);}
    @GetMapping("/insights") public Insights insights(Principal p,@RequestParam LocalDate date) {return tools.insights(p.getName(),date);}
    @GetMapping("/reminders") public List<Reminder> reminders(Principal p) {return tools.reminders(p.getName());}
    @PutMapping("/reminders") public List<Reminder> reminders(Principal p,@Valid @RequestBody Reminder body) {return tools.reminder(p.getName(),body);}
    @DeleteMapping("/reminders/{kind}") public List<Reminder> removeReminder(Principal p,@PathVariable String kind) {return tools.removeReminder(p.getName(),kind);}
    @GetMapping("/photos") public List<Photo> photos(Principal p) {return tools.photos(p.getName());}
    @PostMapping(value="/photos",consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public Photo photo(Principal p,@RequestParam LocalDate date,@RequestParam(defaultValue="") String caption,@RequestParam MultipartFile file)throws java.io.IOException {
        return tools.photo(p.getName(),date,caption,file.getBytes());
    }
    @GetMapping("/photos/{id}") public ResponseEntity<byte[]> image(Principal p,@PathVariable long id) {
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).cacheControl(CacheControl.noStore()).body(tools.image(p.getName(),id));
    }
    @DeleteMapping("/photos/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void deletePhoto(Principal p,@PathVariable long id) {tools.removePhoto(p.getName(),id);}
    public record ActivityImport(@NotEmpty @Size(max=90) List<@Valid ActivityRow> rows) {}
    @GetMapping("/activity") public List<ActivityRow> activity(Principal p) {return tools.activity(p.getName());}
    @PutMapping("/activity") public List<ActivityRow> activity(Principal p,@Valid @RequestBody ActivityImport body) {return tools.importActivity(p.getName(),body.rows);}
    @GetMapping("/circles") public List<Circle> circles(Principal p) {return circles.mine(p.getName());}
    @GetMapping("/circles/discover") public List<Circle> discover() {return circles.discover();}
    @PostMapping("/circles") public Detail create(Principal p,@Valid @RequestBody Create body) {return circles.create(p.getName(),body);}
    @PostMapping("/circles/join") public Detail join(Principal p,@Valid @RequestBody Join body) {return circles.join(p.getName(),body);}
    @GetMapping("/circles/{id}") public Detail circle(Principal p,@PathVariable long id) {return circles.detail(p.getName(),id);}
    @PostMapping("/circles/{id}/posts") public Detail post(Principal p,@PathVariable long id,@Valid @RequestBody PostRequest body) {return circles.post(p.getName(),id,body);}
    @PutMapping("/circles/{id}/posts/{post}/reaction") public Detail reaction(Principal p,@PathVariable long id,@PathVariable long post,@RequestBody Reaction body) {return circles.react(p.getName(),id,post,body.active());}
}
