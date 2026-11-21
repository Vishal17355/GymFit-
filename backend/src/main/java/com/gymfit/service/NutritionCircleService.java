package com.gymfit.service;

import com.gymfit.exception.DietException;
import jakarta.validation.constraints.*;
import java.time.Clock;
import java.time.Instant;
import java.sql.Timestamp;
import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional
public class NutritionCircleService {
    public record Create(@NotBlank @Size(max=80) String name, @NotBlank @Size(max=40) String displayName,
                         @NotBlank String kind, boolean discoverable) {}
    public record Join(@Size(max=48) String code, @Positive Long circleId, @NotBlank @Size(max=40) String displayName) {}
    public record PostRequest(@NotBlank @Size(max=800) String body, @Positive Long parentId) {}
    public record Reaction(boolean active) {}
    public record Circle(long id,String name,String kind,boolean discoverable,String inviteCode) {}
    public record Post(long id,Long parentId,String author,String body,Instant postedAt,long reactions,boolean reacted) {}
    public record Member(String displayName,long checkIns) {}
    public record Detail(Circle circle,List<Post> feed,List<Member> leaderboard) {}
    private record Stored(long id,String owner,String name,String kind,boolean discoverable,String code) {
        Circle view(String account) { return new Circle(id,name,kind,discoverable,owner.equals(account)?code:null); }
    }

    private final JdbcTemplate db;
    private final Clock clock;
    public NutritionCircleService(JdbcTemplate db,Clock clock) {this.db=db;this.clock=clock;}

    public List<Circle> mine(String owner) {
        return db.query("SELECT c.* FROM nutrition_circles c JOIN nutrition_circle_members m ON m.circle_id=c.id WHERE m.account_id=? ORDER BY c.id DESC",
            (rs,i)->stored(rs).view(owner),owner);
    }
    public List<Circle> discover() {
        return db.query("SELECT * FROM nutrition_circles WHERE discoverable=TRUE AND kind='GROUP' ORDER BY id DESC LIMIT 40",
            (rs,i)->stored(rs).view(""));
    }
    public Detail create(String owner,Create request) {
        if(!Set.of("GROUP","HOUSEHOLD").contains(request.kind)) throw DietException.invalid("Choose a group or household.");
        if(mine(owner).size()>=30) throw DietException.invalid("This account is already in 30 circles.");
        var keys=new GeneratedKeyHolder();
        db.update(connection->{
            var statement=connection.prepareStatement("INSERT INTO nutrition_circles(owner_id,name,kind,discoverable,invite_code) VALUES (?,?,?,?,?)",new String[]{"id"});
            statement.setString(1,owner);statement.setString(2,request.name.strip());statement.setString(3,request.kind);
            statement.setBoolean(4,request.kind.equals("GROUP")&&request.discoverable);
            statement.setString(5,UUID.randomUUID().toString().replace("-",""));return statement;
        },keys);
        long id=Objects.requireNonNull(keys.getKey()).longValue();
        addMember(id,owner,request.displayName);
        return detail(owner,id);
    }
    public Detail join(String owner,Join request) {
        if((request.code==null)==(request.circleId==null)) throw DietException.invalid("Choose a group or enter an invitation code.");
        var found=request.circleId!=null
            ? db.query("SELECT * FROM nutrition_circles WHERE id=? AND discoverable=TRUE AND kind='GROUP'",(rs,i)->stored(rs),request.circleId)
            : db.query("SELECT * FROM nutrition_circles WHERE invite_code=?",(rs,i)->stored(rs),request.code.strip());
        var circle=found.stream().findFirst().orElseThrow(()->DietException.missing("Circle not found."));
        if(!member(owner,circle.id)&&mine(owner).size()>=30) throw DietException.invalid("This account is already in 30 circles.");
        addMember(circle.id,owner,request.displayName);
        return detail(owner,circle.id);
    }
    public Detail detail(String owner,long id) {
        assertMember(owner,id);
        var circle=db.query("SELECT * FROM nutrition_circles WHERE id=?",(rs,i)->stored(rs),id).getFirst();
        var feed=db.query("""
            SELECT p.id,p.parent_id,m.display_name,p.body,p.posted_at,
              (SELECT COUNT(*) FROM nutrition_circle_reactions r WHERE r.post_id=p.id) AS reactions,
              EXISTS(SELECT 1 FROM nutrition_circle_reactions r WHERE r.post_id=p.id AND r.account_id=?) AS reacted
            FROM nutrition_circle_posts p JOIN nutrition_circle_members m ON m.circle_id=p.circle_id AND m.account_id=p.author_id
            WHERE p.circle_id=? ORDER BY p.id DESC LIMIT 100""",
            (rs,i)->new Post(rs.getLong(1),rs.getObject(2,Long.class),rs.getString(3),rs.getString(4),
                rs.getTimestamp(5).toInstant(),rs.getLong(6),rs.getBoolean(7)),owner,id);
        var leaderboard=db.query("""
            SELECT m.display_name,COUNT(p.id) AS check_ins FROM nutrition_circle_members m
            LEFT JOIN nutrition_circle_posts p ON p.circle_id=m.circle_id AND p.author_id=m.account_id AND p.parent_id IS NULL
            WHERE m.circle_id=? GROUP BY m.account_id,m.display_name ORDER BY check_ins DESC,m.display_name LIMIT 30""",
            (rs,i)->new Member(rs.getString(1),rs.getLong(2)),id);
        return new Detail(circle.view(owner),feed,leaderboard);
    }
    public Detail post(String owner,long id,PostRequest request) {
        assertMember(owner,id);
        if(request.parentId!=null) {
            childOf(id,request.parentId);
            Long count=db.queryForObject("SELECT COUNT(*) FROM nutrition_circle_posts WHERE id=? AND parent_id IS NULL",Long.class,request.parentId);
            if(count!=1) throw DietException.invalid("Reply to a check-in, not another reply.");
        }
        db.update("INSERT INTO nutrition_circle_posts(circle_id,author_id,parent_id,body,posted_at) VALUES (?,?,?,?,?)",
            id,owner,request.parentId,request.body.strip(),Timestamp.from(clock.instant()));
        return detail(owner,id);
    }
    public Detail react(String owner,long id,long post,boolean active) {
        assertMember(owner,id);
        childOf(id,post);
        if(active) db.update("""
            INSERT INTO nutrition_circle_reactions(post_id,account_id) VALUES (?,?)
            ON DUPLICATE KEY UPDATE post_id=post_id""",post,owner);
        else db.update("DELETE FROM nutrition_circle_reactions WHERE post_id=? AND account_id=?",post,owner);
        return detail(owner,id);
    }
    private boolean member(String owner,long id) {
        return db.queryForObject("SELECT COUNT(*) FROM nutrition_circle_members WHERE account_id=? AND circle_id=?",Long.class,owner,id)>0;
    }
    private void assertMember(String owner,long id) {
        if(!member(owner,id)) throw DietException.missing("Circle not found.");
    }
    private void childOf(long circle,long post) {
        if(db.queryForObject("SELECT COUNT(*) FROM nutrition_circle_posts WHERE circle_id=? AND id=?",Long.class,circle,post)==0)
            throw DietException.missing("Check-in not found.");
    }
    private void addMember(long id,String owner,String name) {
        db.update("""
            INSERT INTO nutrition_circle_members(circle_id,account_id,display_name) VALUES (?,?,?)
            ON DUPLICATE KEY UPDATE display_name=display_name""",id,owner,name.strip());
    }
    private static Stored stored(java.sql.ResultSet rs) throws java.sql.SQLException {
        return new Stored(rs.getLong("id"),rs.getString("owner_id"),rs.getString("name"),rs.getString("kind"),
            rs.getBoolean("discoverable"),rs.getString("invite_code"));
    }
}
