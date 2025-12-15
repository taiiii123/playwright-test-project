package com.example.todoapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDTO {
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "ユーザー名は必須です")
        private String username;
        
        @NotBlank(message = "パスワードは必須です")
        private String password;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank(message = "ユーザー名は必須です")
        @Size(min = 3, max = 50, message = "ユーザー名は3〜50文字である必要があります")
        private String username;
        
        @NotBlank(message = "メールアドレスは必須です")
        @Email(message = "有効なメールアドレスを入力してください")
        private String email;
        
        @NotBlank(message = "パスワードは必須です")
        @Size(min = 8, message = "パスワードは8文字以上である必要があります")
        private String password;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private String username;
        private String email;
    }
}
