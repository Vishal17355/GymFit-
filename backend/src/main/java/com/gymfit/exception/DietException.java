package com.gymfit.exception;

import org.springframework.http.HttpStatus;

public class DietException extends RuntimeException {
    public final HttpStatus status;
    public final String code;
    public DietException(HttpStatus status, String code, String message) { super(message); this.status = status; this.code = code; }
    public static DietException missing(String message) { return new DietException(HttpStatus.NOT_FOUND, "NOT_FOUND", message); }
    public static DietException invalid(String message) { return new DietException(HttpStatus.UNPROCESSABLE_ENTITY, "PLAN_NOT_POSSIBLE", message); }
}
