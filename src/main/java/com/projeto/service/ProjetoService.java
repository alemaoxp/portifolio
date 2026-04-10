package com.projeto.service;

import com.projeto.model.Projeto;
import com.projeto.repository.ProjetoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjetoService {

    private final ProjetoRepository repository;

    public ProjetoService(ProjetoRepository repository) {
        this.repository = repository;
    }

    public List<Projeto> listarTodos() {
        return repository.findAll();
    }

    public List<Projeto> listarDestaques() {
        return repository.findByDestaqueTrue();
    }

    public Projeto buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Projeto não encontrado com id: " + id));
    }

    public List<Projeto> buscarPorNome(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome);
    }

    @Transactional
    public Projeto salvar(Projeto projeto) {
        return repository.save(projeto);
    }

    @Transactional
    public Projeto atualizar(Long id, Projeto projetoAtualizado) {
        Projeto projeto = buscarPorId(id);

        projeto.setNome(projetoAtualizado.getNome());
        projeto.setDescricao(projetoAtualizado.getDescricao());
        projeto.setGithubUrl(projetoAtualizado.getGithubUrl());
        projeto.setImageUrl(projetoAtualizado.getImageUrl());
        projeto.setTecnologias(projetoAtualizado.getTecnologias());
        projeto.setDestaque(projetoAtualizado.getDestaque());

        return repository.save(projeto);
    }

    @Transactional
    public void deletar(Long id) {
        Projeto projeto = buscarPorId(id);
        repository.delete(projeto);
    }
}
