package com.projeto.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projeto.model.Projeto;
import com.projeto.service.ProjetoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.bean.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProjetoController.class)
class ProjetoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjetoService projetoService;

    @Autowired
    private ObjectMapper objectMapper;

    private Projeto projeto;

    @BeforeEach
    void setUp() {
        projeto = new Projeto();
        projeto.setId(1L);
        projeto.setNome("Projeto Teste");
        projeto.setDescricao("Descrição do projeto");
        projeto.setGithubUrl("https://github.com/teste");
        projeto.setDestaque(true);
    }

    @Test
    void deveListarTodosProjetos() throws Exception {
        List<Projeto> projetos = Arrays.asList(projeto, new Projeto());
        when(projetoService.listarTodos()).thenReturn(projetos);

        mockMvc.perform(get("/api/projetos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));

        verify(projetoService, times(1)).listarTodos();
    }

    @Test
    void deveListarProjetosEmDestaque() throws Exception {
        when(projetoService.listarDestaques()).thenReturn(List.of(projeto));

        mockMvc.perform(get("/api/projetos/destaques"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nome").value("Projeto Teste"));

        verify(projetoService, times(1)).listarDestaques();
    }

    @Test
    void deveBuscarProjetoPorId() throws Exception {
        when(projetoService.buscarPorId(1L)).thenReturn(projeto);

        mockMvc.perform(get("/api/projetos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nome").value("Projeto Teste"));

        verify(projetoService, times(1)).buscarPorId(1L);
    }

    @Test
    void deveRetornar404QuandoProjetoNaoEncontrado() throws Exception {
        when(projetoService.buscarPorId(99L)).thenThrow(new jakarta.persistence.EntityNotFoundException("Projeto não encontrado"));

        mockMvc.perform(get("/api/projetos/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deveCriarProjetoQuandoAutenticado() throws Exception {
        when(projetoService.salvar(any(Projeto.class))).thenReturn(projeto);

        mockMvc.perform(post("/api/projetos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projeto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Projeto Teste"));

        verify(projetoService, times(1)).salvar(any(Projeto.class));
    }

    @Test
    void deveRetornar401QuandoNaoAutenticado() throws Exception {
        mockMvc.perform(post("/api/projetos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projeto)))
                .andExpect(status().isUnauthorized());

        verify(projetoService, never()).salvar(any());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deveAtualizarProjetoQuandoAutenticado() throws Exception {
        Projeto projetoAtualizado = new Projeto();
        projetoAtualizado.setNome("Projeto Atualizado");
        projetoAtualizado.setDescricao("Descrição atualizada");

        when(projetoService.atualizar(eq(1L), any(Projeto.class))).thenReturn(projetoAtualizado);

        mockMvc.perform(put("/api/projetos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projetoAtualizado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Projeto Atualizado"));

        verify(projetoService, times(1)).atualizar(eq(1L), any(Projeto.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deveDeletarProjetoQuandoAutenticado() throws Exception {
        doNothing().when(projetoService).deletar(1L);

        mockMvc.perform(delete("/api/projetos/1"))
                .andExpect(status().isNoContent());

        verify(projetoService, times(1)).deletar(1L);
    }
}
