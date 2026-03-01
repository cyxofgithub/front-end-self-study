## Spring Boot 基础语法速览

### 1. 项目结构与依赖

Spring Boot 项目通常使用 Maven 或 Gradle 管理依赖，标准目录结构：

```
src/
  main/
    java/
      com/example/demo/
        DemoApplication.java    # 主启动类
        controller/             # 控制器层
        service/               # 服务层
        repository/            # 数据访问层
        entity/                # 实体类
    resources/
      application.properties   # 配置文件
```

Maven 依赖示例（`pom.xml`）：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

### 2. 主启动类

```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

-   `@SpringBootApplication`：组合注解，包含 `@Configuration`、`@EnableAutoConfiguration`、`@ComponentScan`

### 3. REST 控制器（Controller）

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return new User(id, "Alice");
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        // 创建用户逻辑
        return user;
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        // 更新用户逻辑
        return user;
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        // 删除用户逻辑
    }
}
```

常用注解：

-   `@RestController`：组合了 `@Controller` 和 `@ResponseBody`，返回 JSON
-   `@RequestMapping`：定义基础路径
-   `@GetMapping`、`@PostMapping`、`@PutMapping`、`@DeleteMapping`：HTTP 方法映射
-   `@PathVariable`：路径变量
-   `@RequestBody`：请求体（JSON 转对象）
-   `@RequestParam`：查询参数，如 `?name=Alice`

### 4. 服务层（Service）

```java
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("用户不存在"));
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}
```

-   `@Service`：标识服务层组件
-   `@Autowired`：自动注入依赖（Spring 5.1+ 可省略，使用构造器注入更推荐）

### 5. 数据访问层（Repository）

使用 Spring Data JPA：

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 方法命名查询
    List<User> findByName(String name);

    // 自定义查询
    @Query("SELECT u FROM User u WHERE u.email = ?1")
    User findByEmail(String email);
}
```

-   `@Repository`：标识数据访问层
-   `JpaRepository<T, ID>`：提供 CRUD 方法（`save`, `findById`, `delete` 等）
-   方法命名自动生成查询：`findByName` → `SELECT * FROM user WHERE name = ?`

### 6. 实体类（Entity）

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String email;

    // 构造器、getter/setter
    public User() {}

    public User(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    // getter/setter 方法...
}
```

常用注解：

-   `@Entity`：标识 JPA 实体
-   `@Table`：指定表名
-   `@Id`：主键
-   `@GeneratedValue`：主键生成策略
-   `@Column`：列配置

实体类（Entity Class）是用于映射数据库表结构的 Java 类，每个实体类的对象通常对应数据库中的一行数据。它们的主要作用是：

-   将数据库表结构映射为面向对象的类结构，实现“数据库-对象”的桥梁；
-   方便通过对象方式对数据进行操作（如增删改查），减少手写 SQL；
-   支持 JPA、Hibernate 等 ORM 框架，实现对象关系映射，降低开发复杂度。

简单来说，实体类用于描述业务数据的结构和属性，是数据持久化的关键载体。

### 7. 配置文件

`application.properties`：

```properties
# 服务器端口
server.port=8080

# 数据库配置
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA 配置
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

`application.yml`（更推荐）：

```yaml
server:
    port: 8080

spring:
    datasource:
        url: jdbc:mysql://localhost:3306/mydb
        username: root
        password: 123456
        driver-class-name: com.mysql.cj.jdbc.Driver

    jpa:
        hibernate:
            ddl-auto: update
        show-sql: true
```

### 8. 依赖注入方式

```java
// 方式1：字段注入（不推荐）
@Autowired
private UserService userService;

// 方式2：构造器注入（推荐）
private final UserService userService;
public UserController(UserService userService) {
    this.userService = userService;
}

// 方式3：Setter 注入
@Autowired
public void setUserService(UserService userService) {
    this.userService = userService;
}
```

### 9. 异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.status(500).body(e.getMessage());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleNotFound(EntityNotFoundException e) {
        return ResponseEntity.status(404).body("资源不存在");
    }
}
```

-   `@RestControllerAdvice`：全局异常处理器
-   `@ExceptionHandler`：处理特定异常

### 10. 请求参数验证

```java
public class User {
    @NotBlank(message = "姓名不能为空")
    private String name;

    @Email(message = "邮箱格式不正确")
    private String email;

    @Min(value = 0, message = "年龄不能小于0")
    private Integer age;
}

@PostMapping("/users")
public User createUser(@Valid @RequestBody User user) {
    return userService.save(user);
}
```

-   `@Valid`：启用验证
-   `@NotBlank`、`@Email`、`@Min` 等：验证注解

### 11. 日志使用

```java
@RestController
public class UserController {
    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @GetMapping("/users/{id}")
    public User getUser(@PathVariable Long id) {
        log.info("查询用户，ID: {}", id);
        log.debug("调试信息");
        log.error("错误信息");
        return userService.findById(id);
    }
}
```

或使用 Lombok（简化代码）：

```java
@Slf4j
@RestController
public class UserController {
    @GetMapping("/users/{id}")
    public User getUser(@PathVariable Long id) {
        log.info("查询用户，ID: {}", id);
        return userService.findById(id);
    }
}
```

### 12. 常用 Starter 依赖

```xml
<!-- Web 开发 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- 数据库 JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- MySQL 驱动 -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>

<!-- Redis -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<!-- 测试 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
</dependency>
```

### 13. 配置文件多环境

```yaml
# application.yml
spring:
    profiles:
        active: dev

---
# application-dev.yml
server:
    port: 8080

---
# application-prod.yml
server:
    port: 8081
```

### 14. 完整示例：用户管理 API

```java
// Entity
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    // getter/setter...
}

// Repository
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

// Service
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("用户不存在"));
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}

// Controller
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }
}
```

### 推荐学习顺序

1. **基础入门**：理解 Spring Boot 项目结构、主启动类、常用注解（`@RestController`、`@Service`、`@Repository`）
2. **REST API 开发**：掌握 Controller 层开发，HTTP 方法映射、请求参数处理
3. **数据访问**：学习 JPA 实体类、Repository 接口、数据库配置
4. **依赖注入**：理解 `@Autowired`、构造器注入、组件扫描
5. **配置文件**：掌握 `application.properties/yml`、多环境配置
6. **进阶功能**：异常处理、参数验证、日志、缓存、安全等

掌握以上内容即可参与 Spring Boot 项目开发。详见 [Spring Boot 官方文档](https://spring.io/projects/spring-boot)。
