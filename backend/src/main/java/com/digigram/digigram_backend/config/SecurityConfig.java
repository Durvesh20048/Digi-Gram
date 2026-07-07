//package com.digigram.digigram_backend.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//
//        http
//            .csrf(csrf -> csrf.disable())
//            .cors(cors -> {})
//            .authorizeHttpRequests(auth -> auth
//                .requestMatchers("/api/**").permitAll()   // ✅ ALLOW API
//                .anyRequest().permitAll()
//            )
//            .formLogin(form -> form.disable())  // ✅ DISABLE LOGIN REDIRECT
//            .httpBasic(basic -> basic.disable());
//
//        return http.build();
//    }
//}

