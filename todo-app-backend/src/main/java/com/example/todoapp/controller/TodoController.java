package com.example.todoapp.controller;

import com.example.todoapp.dto.TodoDTO;
import com.example.todoapp.model.User;
import com.example.todoapp.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {
    
    private final TodoService todoService;
    
    @GetMapping
    public ResponseEntity<List<TodoDTO.Response>> getAllTodos(
            @AuthenticationPrincipal User user
    ) {
        List<TodoDTO.Response> todos = todoService.getAllTodos(user);
        return ResponseEntity.ok(todos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getTodoById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        try {
            TodoDTO.Response todo = todoService.getTodoById(id, user);
            return ResponseEntity.ok(todo);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createTodo(
            @Valid @RequestBody TodoDTO.CreateRequest request,
            @AuthenticationPrincipal User user
    ) {
        try {
            TodoDTO.Response todo = todoService.createTodo(request, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(todo);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTodo(
            @PathVariable Long id,
            @Valid @RequestBody TodoDTO.UpdateRequest request,
            @AuthenticationPrincipal User user
    ) {
        try {
            TodoDTO.Response todo = todoService.updateTodo(id, request, user);
            return ResponseEntity.ok(todo);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        try {
            todoService.deleteTodo(id, user);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Todoが削除されました");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<?> toggleComplete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        try {
            TodoDTO.Response todo = todoService.toggleComplete(id, user);
            return ResponseEntity.ok(todo);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
}
