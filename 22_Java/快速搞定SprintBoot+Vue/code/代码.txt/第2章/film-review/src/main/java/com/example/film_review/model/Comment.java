package com.example.film_review.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Comment {
    private Long id;
    @Valid
    private Movie movie;
    @NotBlank(message = "评论内容不能为空")
    @Size(max = 500, message = "评论内容长度不能超过 500 个字符")
    private String content;
    @NotNull(message = "评分不能为空")
    @Min(value = 1, message = "评分至少为 1")
    @Max(value = 5, message = "评分不能超过 5")
    private Integer rating;
    // 使用静态列表模拟数据库
    private static List<Comment> comments = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public static List<Comment> getComments() {
        return comments;
    }

    public static void setComments(List<Comment> comments) {
        Comment.comments = comments;
    }

    @Override
    public String toString() {
        return "Comment{" +
                "id=" + id +
                ", movie=" + movie +
                ", content='" + content + '\'' +
                ", rating=" + rating +
                '}';
    }

    // 使用静态方法来模拟数据库操作
    public static List<Comment> getCommentsByMovieId(Long movieId) {
        return comments.stream()
                .filter(comment -> comment.getMovie().getId().equals(movieId))
                .collect(Collectors.toList());
    }
    public static void addComment(Comment comment) {
        comment.setId((long) (comments.size() + 1)); // 简单的 ID 赋值逻辑
        comments.add(comment);
    }
}
