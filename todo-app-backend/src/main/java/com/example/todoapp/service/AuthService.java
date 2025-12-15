package com.example.todoapp.service;

import com.example.todoapp.dto.AuthDTO;
import com.example.todoapp.model.User;
import com.example.todoapp.repository.UserRepository;
import com.example.todoapp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    
    @Transactional
    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        // ユーザー名の重複チェック
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("ユーザー名は既に使用されています");
        }
        
        // メールアドレスの重複チェック
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("メールアドレスは既に使用されています");
        }
        
        // 新しいユーザーを作成
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        userRepository.save(user);
        
        // JWTトークンを生成
        String token = jwtUtil.generateToken(user.getUsername());
        
        return new AuthDTO.AuthResponse(token, user.getUsername(), user.getEmail());
    }
    
    @Transactional(readOnly = true)
    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        // 認証を実行
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        
        // ユーザーを取得
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));
        
        // JWTトークンを生成
        String token = jwtUtil.generateToken(user.getUsername());
        
        return new AuthDTO.AuthResponse(token, user.getUsername(), user.getEmail());
    }
}
