package com.example.todoapp.repository;

import com.example.todoapp.model.Todo;
import com.example.todoapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    
    List<Todo> findByUserOrderByCreatedAtDesc(User user);
    
    Optional<Todo> findByIdAndUser(Long id, User user);
    
    List<Todo> findByUserAndCompleted(User user, Boolean completed);
}
