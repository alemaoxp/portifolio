package com.projeto.controller;

import com.projeto.dto.LoginRequest;
import com.projeto.dto.LoginResponse;
import com.projeto.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticação", description = "API para autenticação e geração de tokens JWT")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    @Operation(summary = "Realizar login", description = "Autentica o usuário e retorna um token JWT")
    @ApiResponse(responseCode = "200", description = "Login realizado com sucesso")
    @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            log.info("Tentativa de login para: {}", request.getEmail());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = tokenProvider.generateToken(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            LoginResponse response = new LoginResponse(
                    jwt,
                    userDetails.getUsername(),
                    userDetails.getAuthorities().iterator().next().getAuthority()
            );

            log.info("Login bem-sucedido para: {}", request.getEmail());
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException ex) {
            log.error("Credenciais inválidas para: {}", request.getEmail());
            return ResponseEntity.status(401).body(Map.of(
                    "message", "Email ou senha incorretos"
            ));
        } catch (Exception ex) {
            log.error("Erro inesperado no login para {}: ", request.getEmail(), ex);
            return ResponseEntity.status(500).body(Map.of(
                    "message", "Erro interno no servidor: " + ex.getMessage()
            ));
        }
    }
}
