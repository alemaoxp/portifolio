package com.projeto.config;

import com.projeto.model.Usuario;
import com.projeto.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initData(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Criar usuário admin se não existir
            String adminEmail = "admin@portfolio.com";
            if (usuarioRepository.findByEmail(adminEmail).isEmpty()) {
                Usuario admin = new Usuario();
                admin.setEmail(adminEmail);
                admin.setSenha(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                usuarioRepository.save(admin);
                log.info("✅ Usuário admin criado: {}", adminEmail);
            } else {
                log.info("✅ Usuário admin já existe: {}", adminEmail);
            }

            // Listar todos os usuários
            long count = usuarioRepository.count();
            log.info("📊 Total de usuários no banco: {}", count);
        };
    }
}
