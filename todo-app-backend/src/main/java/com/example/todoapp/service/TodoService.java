package com.example.todoapp.service;

import com.example.todoapp.dto.TodoDTO;
import com.example.todoapp.model.Todo;
import com.example.todoapp.model.User;
import com.example.todoapp.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {
    
    private final TodoRepository todoRepository;
    
    @Transactional(readOnly = true)
    public List<TodoDTO.Response> getAllTodos(User user) {
        return todoRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public TodoDTO.Response getTodoById(Long id, User user) {
        Todo todo = todoRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Todoが見つかりません"));
        return convertToResponse(todo);
    }
    
    @Transactional
    public TodoDTO.Response createTodo(TodoDTO.CreateRequest request, User user) {
        Todo todo = new Todo();
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setCompleted(request.getCompleted() != null ? request.getCompleted() : false);
        todo.setUser(user);
        
        Todo savedTodo = todoRepository.save(todo);
        return convertToResponse(savedTodo);
    }
    
    @Transactional
    public TodoDTO.Response updateTodo(Long id, TodoDTO.UpdateRequest request, User user) {
        Todo todo = todoRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Todoが見つかりません"));
        
        if (request.getTitle() != null) {
            todo.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            todo.setDescription(request.getDescription());
        }
        if (request.getCompleted() != null) {
            todo.setCompleted(request.getCompleted());
        }
        
        Todo updatedTodo = todoRepository.save(todo);
        return convertToResponse(updatedTodo);
    }
    
    @Transactional
    public void deleteTodo(Long id, User user) {
        Todo todo = todoRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Todoが見つかりません"));
        todoRepository.delete(todo);
    }
    
    @Transactional
    public TodoDTO.Response toggleComplete(Long id, User user) {
        Todo todo = todoRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Todoが見つかりません"));
        
        todo.setCompleted(!todo.getCompleted());
        Todo updatedTodo = todoRepository.save(todo);
        return convertToResponse(updatedTodo);
    }
    
    private TodoDTO.Response convertToResponse(Todo todo) {
        return new TodoDTO.Response(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.getCompleted(),
                todo.getCreatedAt(),
                todo.getUpdatedAt()
        );
    }
}
