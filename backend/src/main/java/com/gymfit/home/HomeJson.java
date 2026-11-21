package com.gymfit.home;
import com.fasterxml.jackson.databind.*;
import org.springframework.stereotype.Component;
import java.util.*;
@Component
public class HomeJson {
 private final ObjectMapper mapper;
 public HomeJson(ObjectMapper mapper){this.mapper=mapper;}
 public String write(Object value){try{return mapper.writeValueAsString(value);}catch(Exception e){throw new IllegalStateException("Cannot save workout data",e);}}
 public <T>T read(String value,Class<T> type){try{return mapper.readValue(value,type);}catch(Exception e){throw new IllegalStateException("Cannot read saved workout data",e);}}
 public <T>List<T> list(String value,Class<T> type){try{return mapper.readValue(value,mapper.getTypeFactory().constructCollectionType(ArrayList.class,type));}catch(Exception e){throw new IllegalStateException("Cannot read saved workout list",e);}}
}
