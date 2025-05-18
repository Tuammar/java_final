package com.example.demo.service;

import com.example.demo.dto.auth.AuthResponse;
import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Check if alias is already in use
        if (userRepository.existsByAlias(request.getAlias())) {
            throw new IllegalArgumentException("Alias is already in use");
        }

        // Create user entity
        User user = User.builder()
                .id(UUID.randomUUID())
                .name(request.getName())
                .surname(request.getSurname())
                .patronymic(request.getPatronymic())
                .alias(request.getAlias())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER") // Default role
                .build();

        // Save user
        userRepository.save(user);

        // Create claims with user role
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole());

        // Generate JWT token
        String token = jwtService.generateToken(extraClaims, 
                new org.springframework.security.core.userdetails.User(
                user.getAlias(),
                user.getPassword(),
                java.util.Collections.singletonList(
                        new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole())
                )
        ));

        // Return token
        return AuthResponse.builder()
                .token(token)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getAlias(),
                        request.getPassword()
                )
        );

        // Fetch user details
        User user = userRepository.findByAlias(request.getAlias())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        // Create claims with user role
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole());

        // Generate JWT token
        String token = jwtService.generateToken(extraClaims, 
                new org.springframework.security.core.userdetails.User(
                user.getAlias(),
                user.getPassword(),
                java.util.Collections.singletonList(
                        new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole())
                )
        ));

        // Return token
        return AuthResponse.builder()
                .token(token)
                .build();
    }
} 