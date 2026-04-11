package com.projeto.repository;

import com.projeto.model.Contato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContatoRepository extends JpaRepository<Contato, Long> {

    List<Contato> findAllByOrderByCriadoEmDesc();

    List<Contato> findByStatusOrderByCriadoEmDesc(String status);
}
