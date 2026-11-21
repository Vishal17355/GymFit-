package com.gymfit.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Map;
import javax.sql.DataSource;
import java.time.Clock;
import java.time.LocalDate;
import java.sql.SQLException;

@RestController
public class StatusController {
    private final boolean demo;
    private final DataSource database;
    private final Clock clock;
    public StatusController(@Value("${gymfit.security.demo:false}") boolean demo, DataSource database, Clock clock)
    {
        this.demo=demo;
        this.database=database;
        this.clock=clock;
    }
    @GetMapping("/api/v1/status")
    public Map<String,Object> status()
    {
        return Map.of("service","GymFit Diet API","demoMode",demo,"spoonacularEnabled",false);
    }
    @GetMapping("/api/v1/diet/context")
    public Map<String,Object> context(Principal user) throws SQLException
    {
        try (var connection=database.getConnection()) {
            return Map.of("userId",user.getName(),"demoMode",demo,
                "storage",connection.getMetaData().getDatabaseProductName(),
                "reportingDate",LocalDate.now(clock).toString());
        }
    }
}
