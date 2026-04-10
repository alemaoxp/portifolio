package com.projeto.controller;

import com.projeto.model.Projeto;
import com.projeto.service.ProjetoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projetos")
@Tag(name = "Projetos", description = "API para gerenciamento de projetos do portfólio")
public class ProjetoController {

    private final ProjetoService service;

    public ProjetoController(ProjetoService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Listar todos os projetos", description = "Retorna uma lista com todos os projetos cadastrados")
    @ApiResponse(responseCode = "200", description = "Lista de projetos retornada com sucesso")
    public ResponseEntity<List<Projeto>> listarTodos() {
        List<Projeto> projetos = service.listarTodos();
        return ResponseEntity.ok(projetos);
    }

    @GetMapping("/destaques")
    @Operation(summary = "Listar projetos em destaque", description = "Retorna apenas os projetos marcados como destaque")
    @ApiResponse(responseCode = "200", description = "Lista de projetos em destaque retornada com sucesso")
    public ResponseEntity<List<Projeto>> listarDestaques() {
        List<Projeto> destaques = service.listarDestaques();
        return ResponseEntity.ok(destaques);
    }

    @GetMapping("/busca")
    @Operation(summary = "Buscar projetos por nome", description = "Busca projetos que contenham o nome especificado")
    @ApiResponse(responseCode = "200", description = "Lista de projetos encontrados retornada com sucesso")
    public ResponseEntity<List<Projeto>> buscarPorNome(@RequestParam String nome) {
        List<Projeto> projetos = service.buscarPorNome(nome);
        return ResponseEntity.ok(projetos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar projeto por ID", description = "Retorna um projeto específico pelo seu ID")
    @ApiResponse(responseCode = "200", description = "Projeto encontrado")
    @ApiResponse(responseCode = "404", description = "Projeto não encontrado")
    public ResponseEntity<Projeto> buscarPorId(@PathVariable Long id) {
        Projeto projeto = service.buscarPorId(id);
        return ResponseEntity.ok(projeto);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Criar novo projeto", description = "Cadastra um novo projeto no sistema (requer autenticação)")
    @ApiResponse(responseCode = "201", description = "Projeto criado com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    @ApiResponse(responseCode = "403", description = "Sem permissão de acesso")
    public ResponseEntity<Projeto> criar(@Valid @RequestBody Projeto projeto) {
        Projeto criado = service.salvar(projeto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Atualizar projeto", description = "Atualiza os dados de um projeto existente (requer autenticação)")
    @ApiResponse(responseCode = "200", description = "Projeto atualizado com sucesso")
    @ApiResponse(responseCode = "404", description = "Projeto não encontrado")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    @ApiResponse(responseCode = "403", description = "Sem permissão de acesso")
    public ResponseEntity<Projeto> atualizar(@PathVariable Long id,
                                              @Valid @RequestBody Projeto projetoAtualizado) {
        Projeto atualizado = service.atualizar(id, projetoAtualizado);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deletar projeto", description = "Remove um projeto do sistema (requer autenticação)")
    @ApiResponse(responseCode = "204", description = "Projeto deletado com sucesso")
    @ApiResponse(responseCode = "404", description = "Projeto não encontrado")
    @ApiResponse(responseCode = "403", description = "Sem permissão de acesso")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
