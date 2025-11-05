package com.example.film_review.controller;

import com.example.film_review.model.Comment;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    // 根据电影 ID 获取评论
    @GetMapping("/{movieId}")
    public ResponseEntity<List<Comment>> getCommentsByMovieId(@PathVariable Long movieId) {
        List<Comment> comments = Comment.getCommentsByMovieId(movieId);
        if (!comments.isEmpty()) {
            return ResponseEntity.ok(comments);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    // 添加评论
    @PostMapping
    public ResponseEntity<?> addComment(@Valid @RequestBody Comment comment,
                                        BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors().
                    get(0).getDefaultMessage());
        }
        Comment.addComment(comment);
        return ResponseEntity.ok(comment);
    }
}
