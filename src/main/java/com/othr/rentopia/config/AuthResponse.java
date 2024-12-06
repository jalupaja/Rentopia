package com.othr.rentopia.config;

import java.io.Serializable;

public class AuthResponse implements Serializable {
    private String message;
    private String Jwt;
    private boolean Status;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getJwt() {
        return Jwt;
    }

    public void setJwt(String jwt) {
        Jwt = jwt;
    }

    public boolean getStatus() {
        return Status;
    }

    public void setStatus(boolean status) {
        Status = status;
    }
}