package com.example.film_review.controller;

import com.example.film_review.model.Movie;
import com.example.film_review.service.FileStorageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    private final FileStorageService fileStorageService;
    private final String uploadDir;

    // 构造函数：注入 FileStorageService 和上传目录路径
    @Autowired
    public MovieController(FileStorageService fileStorageService, @Value
            ("${file.upload-dir}") String uploadDir) {
        this.fileStorageService = fileStorageService;
        this.uploadDir = uploadDir;
    }

    // 上传电影海报
    @PostMapping("/{id}/uploadPoster")
    public ResponseEntity<String> uploadPoster(@PathVariable Long id,
                                               @RequestParam("file") MultipartFile file) {
        try {
            // 存储文件并获取文件名
            String fileName = fileStorageService.storeFile(file);
            // 获取电影实体并更新海报 URL
            Movie movie = Movie.getMovieById(id);
            if (movie != null) {
                String posterUrl = "/api/movies/posters/" + fileName;
                movie.setPosterUrl(posterUrl);
                // 返回海报的下载 URL
                return ResponseEntity.ok(posterUrl);
            } else {
                // 如果电影不存在，返回 404
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            // 处理文件存储相关异常
            return ResponseEntity.internalServerError().body("上传海报失败:"
                    + e.getMessage());
        }
    }
    // 下载电影海报
    @GetMapping("/posters/{filename:.+\\.\\w+}")
    public ResponseEntity<?> downloadPoster(@PathVariable String filename) {
        try {
            // 构建文件路径
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            // 检查资源是否存在且可读
            if (resource.exists() || resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                // 返回资源和相应的内容类型
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .body(resource);
            } else {
                // 如果文件不存在，返回 404
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            // 处理文件读取相关异常
            return ResponseEntity.internalServerError().body("无法下载文件:"
                    + e.getMessage());
        }
    }

    // 获取所有电影
    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        List<Movie> movies = Movie.getAllMovies();
        return ResponseEntity.ok(movies);
    }
    // 根据 ID 获取电影
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        Movie movie = Movie.getMovieById(id);
        if (movie != null) {
            return ResponseEntity.ok(movie);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    // 添加电影
    @PostMapping
    public ResponseEntity<?> addMovie(@Valid @RequestBody Movie movie,
                                      BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors().
                    get(0).getDefaultMessage());
        }
        Movie.addMovie(movie);
        return ResponseEntity.ok(movie);
    }
    // 根据 ID 删除电影
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        Movie movie = Movie.getMovieById(id);
        if (movie != null) {
            Movie.deleteMovie(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}