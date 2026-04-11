package com.projeto.service;

import com.projeto.model.Contato;
import com.projeto.repository.ContatoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ContatoService {

    private final ContatoRepository repository;

    public ContatoService(ContatoRepository repository) {
        this.repository = repository;
    }

    public List<Contato> listarTodos() {
        return repository.findAllByOrderByCriadoEmDesc();
    }

    public List<Contato> listarPorStatus(String status) {
        return repository.findByStatusOrderByCriadoEmDesc(status);
    }

    public Contato buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contato não encontrado com id: " + id));
    }

    @Transactional
    public Contato salvar(Contato contato) {
        return repository.save(contato);
    }

    @Transactional
    public Contato atualizarStatus(Long id, String status) {
        Contato contato = buscarPorId(id);
        contato.setStatus(status);
        return repository.save(contato);
    }

    @Transactional
    public void deletar(Long id) {
        Contato contato = buscarPorId(id);
        repository.delete(contato);
    }
}
