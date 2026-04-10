package com.projeto.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Portfólio API - Gabriel Santana")
                        .version("1.0.0")
                        .description("API REST para gerenciamento de projetos do portfólio\n\n" +
                                "**Endpoints públicos:**\n" +
                                "- GET /api/projetos - Listar todos os projetos\n" +
                                "- GET /api/projetos/{id} - Buscar projeto por ID\n" +
                                "- GET /api/projetos/destaques - Projetos em destaque\n" +
                                "- GET /api/projetos/busca?nome= - Buscar por nome\n\n" +
                                "**Endpoints protegidos (requer autenticação):**\n" +
                                "- POST /api/projetos - Criar projeto\n" +
                                "- PUT /api/projetos/{id} - Atualizar projeto\n" +
                                "- DELETE /api/projetos/{id} - Deletar projeto\n" +
                                "- POST /api/auth/login - Login e geração de token JWT")
                        .contact(new Contact()
                                .name("Gabriel Santana")
                                .email("contato@gabrielsantana.dev")
                                .url("https://github.com/alemaoxp"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .name("Bearer Authentication")
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Insira o token JWT obtido no endpoint /api/auth/login")));
    }
}
