package com.projeto.service;

import com.projeto.model.Projeto;
import com.projeto.repository.ProjetoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjetoServiceTest {

    @Mock
    private ProjetoRepository repository;

    @InjectMocks
    private ProjetoService service;

    private Projeto projeto;

    @BeforeEach
    void setUp() {
        projeto = new Projeto();
        projeto.setId(1L);
        projeto.setNome("Projeto Teste");
        projeto.setDescricao("Descrição do projeto de teste");
        projeto.setGithubUrl("https://github.com/teste/projeto");
        projeto.setDestaque(true);
    }

    @Test
    void deveListarTodosProjetos() {
        when(repository.findAll()).thenReturn(Arrays.asList(projeto, new Projeto()));

        List<Projeto> projetos = service.listarTodos();

        assertNotNull(projetos);
        assertEquals(2, projetos.size());
        verify(repository, times(1)).findAll();
    }

    @Test
    void deveListarProjetosEmDestaque() {
        when(repository.findByDestaqueTrue()).thenReturn(List.of(projeto));

        List<Projeto> destaques = service.listarDestaques();

        assertNotNull(destaques);
        assertEquals(1, destaques.size());
        assertTrue(destaques.get(0).getDestaque());
        verify(repository, times(1)).findByDestaqueTrue();
    }

    @Test
    void deveBuscarProjetoPorId() {
        when(repository.findById(1L)).thenReturn(Optional.of(projeto));

        Projeto encontrado = service.buscarPorId(1L);

        assertNotNull(encontrado);
        assertEquals(1L, encontrado.getId());
        assertEquals("Projeto Teste", encontrado.getNome());
        verify(repository, times(1)).findById(1L);
    }

    @Test
    void deveLancarExcecaoQuandoProjetoNaoEncontrado() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.buscarPorId(99L));
        verify(repository, times(1)).findById(99L);
    }

    @Test
    void deveBuscarProjetoPorNome() {
        when(repository.findByNomeContainingIgnoreCase("Teste")).thenReturn(List.of(projeto));

        List<Projeto> resultados = service.buscarPorNome("Teste");

        assertNotNull(resultados);
        assertEquals(1, resultados.size());
        verify(repository, times(1)).findByNomeContainingIgnoreCase("Teste");
    }

    @Test
    void deveSalvarProjeto() {
        when(repository.save(any(Projeto.class))).thenReturn(projeto);

        Projeto salvo = service.salvar(projeto);

        assertNotNull(salvo);
        assertEquals("Projeto Teste", salvo.getNome());
        verify(repository, times(1)).save(projeto);
    }

    @Test
    void deveAtualizarProjeto() {
        Projeto projetoAtualizado = new Projeto();
        projetoAtualizado.setNome("Projeto Atualizado");
        projetoAtualizado.setDescricao("Nova descrição");
        projetoAtualizado.setGithubUrl("https://github.com/novo/projeto");
        projetoAtualizado.setDestaque(false);

        when(repository.findById(1L)).thenReturn(Optional.of(projeto));
        when(repository.save(any(Projeto.class))).thenReturn(projetoAtualizado);

        Projeto resultado = service.atualizar(1L, projetoAtualizado);

        assertNotNull(resultado);
        assertEquals("Projeto Atualizado", resultado.getNome());
        assertEquals("Nova descrição", resultado.getDescricao());
        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(any(Projeto.class));
    }

    @Test
    void deveDeletarProjeto() {
        when(repository.findById(1L)).thenReturn(Optional.of(projeto));
        doNothing().when(repository).delete(projeto);

        assertDoesNotThrow(() -> service.deletar(1L));

        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).delete(projeto);
    }

    @Test
    void deveLancarExcecaoAoDeletarProjetoInexistente() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.deletar(99L));
        verify(repository, never()).delete(any());
    }
}
