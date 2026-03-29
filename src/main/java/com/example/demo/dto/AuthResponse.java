package com.example.demo.dto;

public class AuthResponse {
    private String email;
    private String fullName;
    private String role;
    private Long id;
    private String token;

    public AuthResponse() {}

    public AuthResponse(String email, String fullName, String role, Long id, String token) {
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.id = id;
        this.token = token;
    }

    // Manual Builder
    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private String email;
        private String fullName;
        private String role;
        private Long id;
        private String token;

        public AuthResponseBuilder email(String email) { this.email = email; return this; }
        public AuthResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public AuthResponseBuilder role(String role) { this.role = role; return this; }
        public AuthResponseBuilder id(Long id) { this.id = id; return this; }
        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponse build() {
            return new AuthResponse(email, fullName, role, id, token);
        }
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
