package com.gymfit;

import com.fasterxml.jackson.databind.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.time.Clock;
import java.time.LocalDate;
import java.util.*;
import javax.imageio.ImageIO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.*;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test")
class NutritionExtrasIntegrationTest {
    private static final String TOOLS="/api/v1/nutrition-tools";
    private static final String DIARY="/api/v1/nutrition-diary";
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired Clock clock;

    @DynamicPropertySource static void database(DynamicPropertyRegistry registry) {
        String url=System.getenv("GYMFIT_TEST_DB_URL");
        if(url==null)return;
        registry.add("spring.datasource.url",()->url);
        registry.add("spring.datasource.username",()->System.getenv("GYMFIT_TEST_DB_USERNAME"));
        registry.add("spring.datasource.password",()->System.getenv().getOrDefault("GYMFIT_TEST_DB_PASSWORD",""));
    }

    @Test void descriptionBatchAndMealTemplateAreExplicitAndAccountScoped()throws Exception {
        String owner=account(),other=account(),date=LocalDate.now(clock).toString();
        var matches=call(post(TOOLS+"/describe"),owner,Map.of("text","I ate 100 g banana and 40 g oats"),200);
        assertEquals(2,matches.size());assertEquals(40,matches.get(1).path("grams").asInt());
        var unmatched=call(post(TOOLS+"/describe"),owner,Map.of("text","foods with no matching name in catalog"),200);
        assertEquals(0,unmatched.get(0).path("candidates").size());assertTrue(unmatched.get(0).path("grams").isNull());
        assertEquals(0,call(get(DIARY).param("date",date),owner,null,200).path("entries").size());
        List<Map<String,Object>> entries=new ArrayList<>();
        for(var match:matches) entries.add(Map.of("date",date,"mealSlot","BREAKFAST","foodId",match.path("candidates").get(0).path("id").asLong(),"grams",match.path("grams").asDouble()));
        var mixed=new ArrayList<>(entries);mixed.add(Map.of("date",date,"mealSlot","INVALID","grams",100,"foodId",entries.getFirst().get("foodId")));
        call(post(DIARY+"/entries/batch"),owner,Map.of("entries",mixed),422);
        assertEquals(0,call(get(DIARY).param("date",date),owner,null,200).path("entries").size());
        var day=call(post(DIARY+"/entries/batch"),owner,Map.of("entries",entries),200);
        var template=call(post(TOOLS+"/templates"),owner,Map.of("name","Oats and banana","date",date,"mealSlot","BREAKFAST"),200);
        long id=template.path("id").asLong();
        call(post(TOOLS+"/templates/"+id+"/log"),other,Map.of("date",date,"mealSlot","LUNCH"),404);
        var copied=call(post(TOOLS+"/templates/"+id+"/log"),owner,Map.of("date",date,"mealSlot","LUNCH"),200);
        assertEquals(4,copied.path("entries").size());
        assertEquals(2*day.path("totals").path("calories").asDouble(),copied.path("totals").path("calories").asDouble(),0.01);
        assertEquals(4,call(get(TOOLS+"/insights").param("date",date),owner,null,200).path("entries").asInt());
        call(delete(TOOLS+"/templates/"+id),owner,null,204);
    }

    @Test void remindersActivityAndPhotoPermissionsPersist()throws Exception {
        String owner=account(),other=account(),date=LocalDate.now(clock).toString();
        call(put(TOOLS+"/reminders"),owner,Map.of("kind","WEIGH_IN","time","07:15"),200);
        call(put(TOOLS+"/reminders"),owner,Map.of("kind","WEIGH_IN","time","09:10"),200);
        assertEquals("09:10",call(get(TOOLS+"/reminders"),owner,null,200).get(0).path("time").asText());
        assertEquals(0,call(get(TOOLS+"/reminders"),other,null,200).size());
        call(put(TOOLS+"/reminders"),owner,Map.of("kind","DINNER","time","28:15"),400);
        var row=Map.of("date",date,"steps",4100,"activeMinutes",24);
        call(put(TOOLS+"/activity"),owner,Map.of("rows",List.of(row,row)),422);
        call(put(TOOLS+"/activity"),owner,Map.of("rows",List.of(row)),200);
        assertEquals(4100,call(get(TOOLS+"/activity"),owner,null,200).get(0).path("steps").asInt());
        assertEquals(0,call(get(TOOLS+"/activity"),other,null,200).size());
        var output=new ByteArrayOutputStream();
        ImageIO.write(new BufferedImage(10,10,BufferedImage.TYPE_INT_RGB),"PNG",output);
        var photo=multipart(TOOLS+"/photos").file(new MockMultipartFile("file","test.png","image/png",output.toByteArray())).param("date",date).param("caption","Synthetic test");
        long id=call(photo,owner,null,200).path("id").asLong();
        mvc.perform(get(TOOLS+"/photos/"+id).with(user(owner))).andExpect(status().isOk())
            .andExpect(content().contentType("image/jpeg")).andExpect(header().string("Cache-Control","no-store"));
        call(get(TOOLS+"/photos/"+id),other,null,404);
        call(delete(TOOLS+"/photos/"+id),other,null,404);
        call(delete(TOOLS+"/photos/"+id),owner,null,204);
    }

    @Test void householdInvitesAndSocialActionsEnforceMembership()throws Exception {
        String owner=account(),member=account(),outsider=account();
        var space=call(post(TOOLS+"/circles"),owner,Map.of("name","Private room","displayName","Organizer","kind","HOUSEHOLD","discoverable",true),200).path("circle");
        long id=space.path("id").asLong();String route=TOOLS+"/circles/"+id;
        assertFalse(space.path("discoverable").asBoolean());
        call(get(route),outsider,null,404);
        call(post(TOOLS+"/circles/join"),outsider,Map.of("circleId",id,"displayName","Outsider"),404);
        var joined=call(post(TOOLS+"/circles/join"),member,Map.of("code",space.path("inviteCode").asText(),"displayName","Guest"),200);
        assertTrue(joined.path("circle").path("inviteCode").isNull());
        long postId=call(post(route+"/posts"),owner,Map.of("body","Cooked at home"),200).path("feed").get(0).path("id").asLong();
        call(post(route+"/posts"),member,Map.of("body","Well done","parentId",postId),200);
        call(put(route+"/posts/"+postId+"/reaction"),outsider,Map.of("active",true),404);
        call(put(route+"/posts/"+postId+"/reaction"),member,Map.of("active",true),200);
        var feed=call(put(route+"/posts/"+postId+"/reaction"),member,Map.of("active",true),200);
        assertEquals(2,feed.path("feed").size());assertEquals(1,feed.path("feed").get(1).path("reactions").asInt());
        assertEquals(1,feed.path("leaderboard").get(0).path("checkIns").asInt());
        var publicGroup=call(post(TOOLS+"/circles"),owner,Map.of("name","Public test group","displayName","Organizer","kind","GROUP","discoverable",true),200).path("circle");
        assertTrue(publicGroup.path("discoverable").asBoolean());
        assertTrue(call(get(TOOLS+"/circles/discover"),outsider,null,200).findValuesAsText("name").contains("Public test group"));
    }

    private static String account(){return "nutrition-test-"+UUID.randomUUID();}
    private JsonNode call(MockHttpServletRequestBuilder request,String owner,Object body,int expected)throws Exception {
        if(body!=null)request.contentType("application/json").content(json.writeValueAsString(body));
        var response=mvc.perform(request.with(user(owner))).andExpect(status().is(expected)).andReturn().getResponse();
        return json.readTree(response.getContentAsString());
    }
}
