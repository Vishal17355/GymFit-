package com.gymfit.entity;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.List;

@Converter
public class StringListConverter implements AttributeConverter<List<String>, String> {
    private static final ObjectMapper JSON = new ObjectMapper();
    public String convertToDatabaseColumn(List<String> values) {
        try { return JSON.writeValueAsString(values == null ? List.of() : values); }
        catch (Exception e) { throw new IllegalArgumentException("Cannot store list", e); }
    }
    public List<String> convertToEntityAttribute(String value) {
        try { return value == null ? List.of() : JSON.readValue(value, new TypeReference<>() {}); }
        catch (Exception e) { throw new IllegalArgumentException("Invalid stored list", e); }
    }
}
