package com.gymfit.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymfit.exception.DietException;
import com.gymfit.service.NutritionDiaryService.*;
import jakarta.validation.constraints.*;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.*;
import java.time.*;
import java.util.*;
import java.util.regex.Pattern;
import javax.imageio.ImageIO;
import javax.imageio.stream.MemoryCacheImageInputStream;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional
public class NutritionExtrasService {
    public record SaveMeal(@NotBlank @Size(max=90) String name, @NotNull LocalDate date,
                           @NotBlank String mealSlot) {}
    public record Template(long id, String name, List<Entry> items) {}
    public record Description(@NotBlank @Size(max=400) String text) {}
    public record Match(String input, String query, Double grams, List<com.gymfit.dto.DietDtos.FoodView> candidates) {}
    public record Reminder(@NotBlank String kind,
        @NotBlank @jakarta.validation.constraints.Pattern(regexp="(?:[01][0-9]|2[0-3]):[0-5][0-9]") String time) {}
    public record Photo(long id, LocalDate date, String caption) {}
    public record ActivityRow(@NotNull LocalDate date, @Min(0) @Max(150000) int steps,
                              @Min(0) @Max(1440) int activeMinutes) {}
    public record Insights(Double proteinPercent, Double fiberPercent, Double waterPercent, int entries, int missingFiber) {}

    private static final Pattern PORTION = Pattern.compile("(?i)^(\\d+(?:\\.\\d+)?)\\s*(kg|grams?|g)\\s+(?:of\\s+)?(.+)$");
    private static final Set<String> REMINDERS = Set.of("BREAKFAST","LUNCH","DINNER","SNACK","WEIGH_IN");
    private final JdbcTemplate db;
    private final ObjectMapper json;
    private final NutritionDiaryService diary;
    private final FoodService foods;
    private final Clock clock;

    public NutritionExtrasService(JdbcTemplate db, ObjectMapper json, NutritionDiaryService diary, FoodService foods, Clock clock) {
        this.db=db; this.json=json; this.diary=diary; this.foods=foods; this.clock=clock;
    }

    public List<Template> templates(String owner) {
        return db.query("SELECT id,name,items_json FROM nutrition_meal_templates WHERE owner_id=? ORDER BY id DESC LIMIT 50",
            (rs,i) -> new Template(rs.getLong(1),rs.getString(2),decode(rs.getString(3))),owner);
    }

    public Template saveMeal(String owner, SaveMeal request) {
        var items=diary.day(owner,request.date).entries().stream().filter(e->e.mealSlot().equals(request.mealSlot)).toList();
        if(items.isEmpty()||items.size()>30) throw DietException.invalid("Choose a meal containing 1–30 logged foods.");
        if(templates(owner).size()>=50) throw DietException.invalid("Remove a template before saving another.");
        long id=insert("INSERT INTO nutrition_meal_templates(owner_id,name,items_json) VALUES (?,?,?)",
            owner,request.name.trim(),encode(items));
        return new Template(id,request.name.trim(),items);
    }

    public Day repeat(String owner,long id,Repeat request) {
        var items=db.query("SELECT items_json FROM nutrition_meal_templates WHERE owner_id=? AND id=?",
            (rs,i)->decode(rs.getString(1)),owner,id).stream().findFirst()
            .orElseThrow(()->DietException.missing("Meal template not found."));
        return diary.copyMeal(owner,request,items);
    }

    public void removeTemplate(String owner,long id) {
        if(db.update("DELETE FROM nutrition_meal_templates WHERE owner_id=? AND id=?",owner,id)==0)
            throw DietException.missing("Meal template not found.");
    }

    public List<Match> describe(Description request) {
        var parts=Arrays.stream(request.text.strip().split("(?i)\\s*(?:[,+;]|\\band\\b)\\s*"))
            .map(String::strip).filter(s->!s.isBlank()).toList();
        if(parts.isEmpty()||parts.size()>8) throw DietException.invalid("Describe up to eight foods separated by commas.");
        var result=new ArrayList<Match>();
        for(String part:parts) {
            String cleaned=part.replaceFirst("(?i)^(?:i (?:ate|had)|for (?:breakfast|lunch|dinner)(?: i had)?)\\s+","");
            var matcher=PORTION.matcher(cleaned);
            Double grams=null; String query=cleaned;
            if(matcher.matches()) {
                double parsed=Double.parseDouble(matcher.group(1))*(matcher.group(2).equalsIgnoreCase("kg")?1000:1);
                if(parsed>=.1&&parsed<=2000) grams=parsed;
                query=matcher.group(3).strip();
            }
            var candidates=foods.search(query,true).foods().stream().filter(f->f.calories()!=null&&f.protein()!=null
                &&f.carbohydrates()!=null&&f.fat()!=null&&"g".equals(f.servingUnit())).limit(5).toList();
            result.add(new Match(part,query,grams,candidates));
        }
        return result;
    }

    public Insights insights(String owner, LocalDate date) {
        var day=diary.day(owner,date);
        int unknown=(int)day.entries().stream().filter(e->e.nutrients().fiber()==null).count();
        return new Insights(day.targets()==null||day.entries().isEmpty()?null:percent(day.totals().protein(),day.targets().protein()),
            day.settings().fiberGoalG()==null||day.entries().isEmpty()||unknown>0?null:percent(day.totals().fiber(),day.settings().fiberGoalG()),
            percent(day.waterMl(),day.settings().waterGoalMl()),day.entries().size(),unknown);
    }

    public List<Reminder> reminders(String owner) {
        return db.query("SELECT kind,local_time FROM nutrition_reminders WHERE owner_id=? ORDER BY local_time",
            (rs,i)->new Reminder(rs.getString(1),rs.getString(2)),owner);
    }
    public List<Reminder> reminder(String owner,Reminder request) {
        if(!REMINDERS.contains(request.kind)) throw DietException.invalid("Choose a meal or weigh-in reminder.");
        db.update("INSERT INTO nutrition_reminders(owner_id,kind,local_time) VALUES (?,?,?) ON DUPLICATE KEY UPDATE local_time=?",
            owner,request.kind,request.time,request.time);
        return reminders(owner);
    }
    public List<Reminder> removeReminder(String owner,String kind) {
        db.update("DELETE FROM nutrition_reminders WHERE owner_id=? AND kind=?",owner,kind);
        return reminders(owner);
    }

    public List<Photo> photos(String owner) {
        return db.query("SELECT id,photo_date,caption FROM nutrition_progress_photos WHERE owner_id=? ORDER BY photo_date DESC,id DESC LIMIT 60",
            (rs,i)->new Photo(rs.getLong(1),rs.getObject(2,LocalDate.class),rs.getString(3)),owner);
    }
    public Photo photo(String owner,LocalDate date,String caption,byte[] uploaded) {
        validDate(date);
        if(caption.length()>180||photos(owner).size()>=60) throw DietException.invalid("Use a shorter caption or remove an older photo.");
        byte[] jpg=cleanImage(uploaded);
        long id=insert("INSERT INTO nutrition_progress_photos(owner_id,photo_date,caption,image_bytes) VALUES (?,?,?,?)",
            owner,date,caption.strip(),jpg);
        return new Photo(id,date,caption.strip());
    }
    public byte[] image(String owner,long id) {
        return db.query("SELECT image_bytes FROM nutrition_progress_photos WHERE owner_id=? AND id=?",
            (rs,i)->rs.getBytes(1),owner,id).stream().findFirst().orElseThrow(()->DietException.missing("Photo not found."));
    }
    public void removePhoto(String owner,long id) {
        if(db.update("DELETE FROM nutrition_progress_photos WHERE owner_id=? AND id=?",owner,id)==0)
            throw DietException.missing("Photo not found.");
    }

    public List<ActivityRow> activity(String owner) {
        return db.query("SELECT log_date,steps,active_minutes FROM nutrition_activity WHERE owner_id=? ORDER BY log_date DESC LIMIT 60",
            (rs,i)->new ActivityRow(rs.getObject(1,LocalDate.class),rs.getInt(2),rs.getInt(3)),owner);
    }
    public List<ActivityRow> importActivity(String owner,List<ActivityRow> rows) {
        if(rows.isEmpty()||rows.size()>90||rows.stream().map(ActivityRow::date).distinct().count()!=rows.size())
            throw DietException.invalid("Import 1–90 rows with one row per date.");
        for(var row:rows) {
            validDate(row.date);
            db.update("""
                INSERT INTO nutrition_activity(owner_id,log_date,steps,active_minutes) VALUES (?,?,?,?)
                ON DUPLICATE KEY UPDATE steps=?,active_minutes=?""",
                owner,row.date,row.steps,row.activeMinutes,row.steps,row.activeMinutes);
        }
        return activity(owner);
    }

    private static byte[] cleanImage(byte[] source) {
        if(source.length==0||source.length>5_000_000) throw DietException.invalid("Choose a JPEG or PNG under 5 MB.");
        try(var input=new MemoryCacheImageInputStream(new ByteArrayInputStream(source))) {
            var readers=ImageIO.getImageReaders(input);
            if(!readers.hasNext()) throw DietException.invalid("Choose a JPEG or PNG image.");
            var reader=readers.next();
            try {
                if(!Set.of("JPEG","PNG").contains(reader.getFormatName().toUpperCase(Locale.ROOT)))
                    throw DietException.invalid("Choose a JPEG or PNG image.");
                reader.setInput(input,true,true);
                int width=reader.getWidth(0),height=reader.getHeight(0);
                if(width>6000||height>6000||(long)width*height>18_000_000)
                    throw DietException.invalid("Image dimensions are too large.");
                var parameters=reader.getDefaultReadParam();
                int sample=Math.max(1,(Math.max(width,height)+1599)/1600);
                parameters.setSourceSubsampling(sample,sample,0,0);
                var read=reader.read(0,parameters);
                var clean=new BufferedImage(read.getWidth(),read.getHeight(),BufferedImage.TYPE_INT_RGB);
                var graphics=clean.createGraphics();
                try { graphics.drawImage(read,0,0,Color.WHITE,null); } finally { graphics.dispose(); }
                var buffer=new ByteArrayOutputStream();
                if(!ImageIO.write(clean,"JPEG",buffer)) throw DietException.invalid("Could not re-encode the image.");
                return buffer.toByteArray();
            } finally { reader.dispose(); }
        } catch(IOException invalid) { throw DietException.invalid("Could not read that image."); }
    }
    private void validDate(LocalDate date) {
        if(date.isAfter(LocalDate.now(clock))||date.isBefore(LocalDate.of(1900,1,1))) throw DietException.invalid("Choose today or a past date.");
    }
    private static Double percent(double value,double target) { return target>0?Math.round(value/target*1000)/10.0:null; }
    private String encode(List<Entry> list) {
        try { return json.writeValueAsString(list); } catch(IOException e) { throw new IllegalStateException(e); }
    }
    private List<Entry> decode(String data) {
        try { return json.readValue(data,new TypeReference<>(){}); } catch(IOException e) { throw new IllegalStateException(e); }
    }
    private long insert(String sql,Object... values) {
        var keys=new GeneratedKeyHolder();
        db.update(connection->{var statement=connection.prepareStatement(sql,new String[]{"id"});
            for(int i=0;i<values.length;i++) statement.setObject(i+1,values[i]); return statement;},keys);
        return Objects.requireNonNull(keys.getKey()).longValue();
    }
}
