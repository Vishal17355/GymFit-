package com.gymfit.exception;

import com.gymfit.dto.DietDtos.ApiError;
import org.slf4j.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import java.time.Instant;
import java.util.*;

@RestControllerAdvice
public class ApiExceptionHandler {
    private static final Logger LOG = LoggerFactory.getLogger(ApiExceptionHandler.class);
    @ExceptionHandler(DietException.class)
    ResponseEntity<ApiError> diet(DietException e) { return response(e.status, e.code, e.getMessage(), Map.of()); }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError> validation(MethodArgumentNotValidException e) {
        Map<String, String> fields = new LinkedHashMap<>();
        e.getBindingResult().getFieldErrors().forEach(f -> fields.put(f.getField(), f.getDefaultMessage()));
        return response(HttpStatus.BAD_REQUEST, "VALIDATION", "Please check the supplied fields.", fields);
    }
    @ExceptionHandler({HttpMessageNotReadableException.class, HandlerMethodValidationException.class})
    ResponseEntity<ApiError> malformed(Exception e) { return response(HttpStatus.BAD_REQUEST, "VALIDATION", "Invalid request format or parameters.", Map.of()); }
    @ExceptionHandler({ObjectOptimisticLockingFailureException.class, DataIntegrityViolationException.class})
    ResponseEntity<ApiError> conflict(Exception e) { return response(HttpStatus.CONFLICT, "CONFLICT", "The data changed or already exists. Reload and try again.", Map.of()); }
    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiError> unexpected(Exception e) {
        LOG.error("Diet API request failed ({})", e.getClass().getSimpleName());
        return response(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "The request could not be completed.", Map.of());
    }
    private ResponseEntity<ApiError> response(HttpStatus status, String code, String message, Map<String, String> fields) {
        return ResponseEntity.status(status).body(new ApiError(code, message, fields, Instant.now()));
    }
}
