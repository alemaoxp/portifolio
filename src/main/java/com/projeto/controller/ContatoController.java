package com.projeto.controller;

import com.projeto.model.Contato;
import com.projeto.service.ContatoService;
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
@RequestMapping("/api/contatos")
@Tag(name = "Contatos", description = "API para gerenciamento de mensagens de contato")
public class ContatoController {

    private final ContatoService service;

    public ContatoController(ContatoService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Enviar mensagem de contato", description = "Envia uma nova mensagem de contato (público)")
    @ApiResponse(responseCode = "201", description = "Mensagem enviada com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    public ResponseEntity<Contato> enviar(@Valid @RequestBody Contato contato) {
        Contato salvo = service.salvar(contato);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todas as mensagens", description = "Lista todas as mensagens de contato (requer autenticação)")
    @ApiResponse(responseCode = "200", description = "Lista de mensagens retornada com sucesso")
    @ApiResponse(responseCode = "403", description = "Sem permissão de acesso")
    public ResponseEntity<List<Contato>> listarTodos(@RequestParam(required = false) String status) {
        List<Contato> contatos;
        if (status != null && !status.isEmpty()) {
            contatos = service.listarPorStatus(status);
        } else {
            contatos = service.listarTodos();
        }
        return ResponseEntity.ok(contatos);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Atualizar status da mensagem", description = "Atualiza o status de uma mensagem (requer autenticação)")
    @ApiResponse(responseCode = "200", description = "Status atualizado com sucesso")
    @ApiResponse(responseCode = "404", description = "Mensagem não encontrada")
    @ApiResponse(responseCode = "403", description = "Sem permissão de acesso")
    public ResponseEntity<Contato> atualizarStatus(@PathVariable Long id,
                                                     @RequestParam String status) {
        Contato atualizado = service.atualizarStatus(id, status);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deletar mensagem", description = "Remove uma mensagem de contato (requer autenticação)")
    @ApiResponse(responseCode = "204", description = "Mensagem deletada com sucesso")
    @ApiResponse(responseCode = "404", description = "Mensagem não encontrada")
    @ApiResponse(responseCode = "403", description = "Sem permissão de acesso")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
