## Spring 核心（IoC、AOP）速览

### 1. Spring 框架基本概念

**Spring 框架**：Java/Kotlin 企业级应用开发框架，提供 IoC 容器、AOP、事务管理等核心功能。

**核心优势：**

-   **解耦**：通过 IoC 降低代码耦合度
-   **简化开发**：提供大量开箱即用的功能
-   **企业级支持**：事务、安全、缓存等

**Spring 核心模块：**

-   **Spring Core**：IoC 容器和依赖注入
-   **Spring AOP**：面向切面编程
-   **Spring Context**：应用上下文
-   **Spring Bean**：Bean 管理和生命周期

### 2. IoC（控制反转）和 DI（依赖注入）

**IoC（Inversion of Control）**：控制反转，将对象的创建和管理交给 Spring 容器，而不是由程序员手动创建。

**DI（Dependency Injection）**：依赖注入，IoC 的一种实现方式，通过构造函数、setter 方法或字段注入依赖。

**传统方式 vs Spring 方式：**

```java
// ❌ 传统方式：手动创建对象，耦合度高
public class UserService {
    private UserRepository userRepository;

    public UserService() {
        this.userRepository = new UserRepository();  // 硬编码依赖
    }
}

// ✅ Spring 方式：由容器管理，解耦
@Service
public class UserService {
    private UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {  // 依赖注入
        this.userRepository = userRepository;
    }
}
```

### 3. Spring Bean 基本概念

**Bean**：Spring 容器管理的对象，由 Spring 创建、组装和管理。

**Bean 的作用域（Scope）：**

```java
// 单例模式（默认）：整个应用只有一个实例
@Component
@Scope("singleton")  // 或 @Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class UserService {
    // ...
}

// 原型模式：每次获取都创建新实例
@Component
@Scope("prototype")  // 或 @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class UserService {
    // ...
}

// 请求作用域：每个 HTTP 请求一个实例（Web 环境）
@Component
@Scope("request")
public class UserService {
    // ...
}

// 会话作用域：每个 HTTP 会话一个实例（Web 环境）
@Component
@Scope("session")
public class UserService {
    // ...
}
```

### 4. 核心注解

#### 4.1 组件注解（Component Stereotypes）

```java
// @Component：通用组件，Spring 会扫描并注册为 Bean
@Component
public class UserService {
    // ...
}

// @Service：业务逻辑层，语义上表示服务类
@Service
public class UserService {
    // ...
}

// @Repository：数据访问层，通常用于 DAO
@Repository
public class UserRepository {
    // ...
}

// @Controller：Web 控制器层（Spring MVC）
@Controller
public class UserController {
    // ...
}

// @RestController：RESTful API 控制器（@Controller + @ResponseBody）
@RestController
public class UserController {
    // ...
}
```

**注解区别：**

-   `@Component`、`@Service`、`@Repository`、`@Controller` 功能相同，都是注册 Bean
-   区别在于**语义**：让代码更清晰，表明组件的职责
-   `@Repository` 还会自动处理数据访问异常

#### 4.2 依赖注入注解

```java
// @Autowired：自动注入依赖（最常用）
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;  // 字段注入

    // 或构造函数注入（推荐）
    private UserRepository userRepository;
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 或 setter 注入
    private UserRepository userRepository;
    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}

// @Qualifier：当有多个同类型 Bean 时，指定具体注入哪个
@Service
public class UserService {
    @Autowired
    @Qualifier("userRepositoryImpl")
    private UserRepository userRepository;
}

// @Resource：JSR-250 标准注解，按名称注入
@Service
public class UserService {
    @Resource(name = "userRepository")
    private UserRepository userRepository;
}

// @Value：注入配置值或简单值
@Service
public class UserService {
    @Value("${app.name}")
    private String appName;

    @Value("100")
    private int maxUsers;
}
```

**注入方式对比：**

| 注入方式     | 优点                     | 缺点               | 推荐度     |
| ------------ | ------------------------ | ------------------ | ---------- |
| 构造函数注入 | 强制依赖、不可变、易测试 | 参数多时冗长       | ⭐⭐⭐⭐⭐ |
| Setter 注入  | 可选依赖、灵活           | 可能遗漏必需依赖   | ⭐⭐⭐     |
| 字段注入     | 代码简洁                 | 难以测试、隐藏依赖 | ⭐⭐       |

### 5. Bean 的配置方式

#### 5.1 注解配置（推荐）

```java
// 配置类
@Configuration
@ComponentScan(basePackages = "com.example")
public class AppConfig {
    // ...
}

// 或使用 Spring Boot 的自动配置
@SpringBootApplication  // 包含 @Configuration、@ComponentScan、@EnableAutoConfiguration
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

#### 5.2 XML 配置（传统方式）

```xml
<!-- applicationContext.xml -->
<beans xmlns="http://www.springframework.org/schema/beans">
    <bean id="userService" class="com.example.UserService">
        <property name="userRepository" ref="userRepository"/>
    </bean>

    <bean id="userRepository" class="com.example.UserRepository"/>
</beans>
```

#### 5.3 Java 配置类

```java
@Configuration
public class AppConfig {
    @Bean
    public UserRepository userRepository() {
        return new UserRepository();
    }

    @Bean
    public UserService userService() {
        return new UserService(userRepository());
    }
}
```

### 6. Bean 的生命周期

```java
@Component
public class UserService implements InitializingBean, DisposableBean {

    // 1. 构造函数
    public UserService() {
        System.out.println("1. 构造函数执行");
    }

    // 2. 属性注入
    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        System.out.println("2. 属性注入");
        this.userRepository = userRepository;
    }

    // 3. BeanPostProcessor.postProcessBeforeInitialization

    // 4. @PostConstruct 注解方法
    @PostConstruct
    public void init() {
        System.out.println("4. @PostConstruct 执行");
    }

    // 5. InitializingBean.afterPropertiesSet
    @Override
    public void afterPropertiesSet() {
        System.out.println("5. afterPropertiesSet 执行");
    }

    // 6. BeanPostProcessor.postProcessAfterInitialization

    // 7. Bean 使用中...

    // 8. @PreDestroy 注解方法
    @PreDestroy
    public void destroy() {
        System.out.println("8. @PreDestroy 执行");
    }

    // 9. DisposableBean.destroy
    @Override
    public void destroy() throws Exception {
        System.out.println("9. destroy 执行");
    }
}
```

**生命周期关键点：**

1. **实例化**：调用构造函数创建对象
2. **属性注入**：注入依赖
3. **初始化**：`@PostConstruct`、`afterPropertiesSet()`
4. **使用**：Bean 可用
5. **销毁**：`@PreDestroy`、`destroy()`

### 7. AOP（面向切面编程）

**AOP 概念**：将横切关注点（如日志、事务、安全）从业务逻辑中分离出来，通过切面统一处理。

**核心术语：**

-   **切面（Aspect）**：横切关注点的模块化
-   **连接点（Join Point）**：程序执行过程中的某个点（如方法调用）
-   **切点（Pointcut）**：匹配连接点的表达式
-   **通知（Advice）**：在切点上执行的动作
-   **目标对象（Target）**：被代理的对象

#### 7.1 AOP 通知类型

```java
@Aspect
@Component
public class LoggingAspect {

    // 前置通知：方法执行前
    @Before("execution(* com.example.service.*.*(..))")
    public void beforeMethod(JoinPoint joinPoint) {
        System.out.println("方法执行前：" + joinPoint.getSignature().getName());
    }

    // 后置通知：方法正常返回后
    @AfterReturning(pointcut = "execution(* com.example.service.*.*(..))", returning = "result")
    public void afterReturning(JoinPoint joinPoint, Object result) {
        System.out.println("方法返回：" + result);
    }

    // 异常通知：方法抛出异常后
    @AfterThrowing(pointcut = "execution(* com.example.service.*.*(..))", throwing = "ex")
    public void afterThrowing(JoinPoint joinPoint, Exception ex) {
        System.out.println("方法异常：" + ex.getMessage());
    }

    // 最终通知：方法执行后（无论成功或异常）
    @After("execution(* com.example.service.*.*(..))")
    public void afterMethod(JoinPoint joinPoint) {
        System.out.println("方法执行完成");
    }

    // 环绕通知：可以控制方法是否执行
    @Around("execution(* com.example.service.*.*(..))")
    public Object aroundMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("环绕通知 - 方法执行前");
        try {
            Object result = joinPoint.proceed();  // 执行目标方法
            System.out.println("环绕通知 - 方法执行后");
            return result;
        } catch (Exception e) {
            System.out.println("环绕通知 - 方法异常");
            throw e;
        }
    }
}
```

#### 7.2 切点表达式（Pointcut Expression）

```java
@Aspect
@Component
public class LoggingAspect {

    // 匹配所有方法
    @Before("execution(* *(..))")

    // 匹配 com.example.service 包下所有类的所有方法
    @Before("execution(* com.example.service.*.*(..))")

    // 匹配 UserService 类的所有方法
    @Before("execution(* com.example.service.UserService.*(..))")

    // 匹配所有返回 String 的方法
    @Before("execution(String *(..))")

    // 匹配所有 public 方法
    @Before("execution(public * *(..))")

    // 匹配特定方法名
    @Before("execution(* findUser(..))")

    // 使用 @annotation 匹配带有特定注解的方法
    @Before("@annotation(com.example.annotation.Log)")
    public void logMethod(JoinPoint joinPoint) {
        // ...
    }

    // 组合多个切点
    @Before("execution(* com.example.service.*.*(..)) && @annotation(Log)")
    public void logAnnotatedMethods(JoinPoint joinPoint) {
        // ...
    }
}
```

**切点表达式语法：**

```
execution(modifiers-pattern? ret-type-pattern declaring-type-pattern?name-pattern(param-pattern) throws-pattern?)
```

-   `modifiers-pattern`：访问修饰符（public、private 等）
-   `ret-type-pattern`：返回类型
-   `declaring-type-pattern`：类路径
-   `name-pattern`：方法名
-   `param-pattern`：参数类型
-   `throws-pattern`：异常类型

#### 7.3 自定义注解 + AOP

```java
// 1. 定义自定义注解
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogExecutionTime {
}

// 2. 在方法上使用注解
@Service
public class UserService {
    @LogExecutionTime
    public User findUser(Long id) {
        // 业务逻辑
        return userRepository.findById(id);
    }
}

// 3. 定义切面处理注解
@Aspect
@Component
public class LogExecutionTimeAspect {
    @Around("@annotation(com.example.annotation.LogExecutionTime)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long end = System.currentTimeMillis();
        System.out.println(joinPoint.getSignature() + " 执行时间：" + (end - start) + "ms");
        return result;
    }
}
```

### 8. 实际应用示例

#### 8.1 完整的 Service 层示例

```java
// Repository 层
@Repository
public class UserRepository {
    public User findById(Long id) {
        // 数据库查询逻辑
        return new User(id, "Alice");
    }
}

// Service 层
@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUser(Long id) {
        return userRepository.findById(id);
    }
}

// Controller 层
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }
}
```

#### 8.2 事务管理示例

```java
@Service
@Transactional  // 类级别：所有方法都开启事务
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 方法级别：覆盖类级别配置
    @Transactional(rollbackFor = Exception.class)
    public void createUser(User user) {
        userRepository.save(user);
        // 如果抛出异常，事务会回滚
    }

    @Transactional(readOnly = true)  // 只读事务，性能更好
    public User findUser(Long id) {
        return userRepository.findById(id);
    }
}
```

**事务传播行为：**

-   `REQUIRED`（默认）：如果当前有事务，加入；没有则新建
-   `REQUIRES_NEW`：总是新建事务
-   `SUPPORTS`：有事务则加入，没有则不使用事务
-   `NOT_SUPPORTED`：不使用事务
-   `MANDATORY`：必须在事务中，否则抛异常
-   `NEVER`：不能在事务中，否则抛异常
-   `NESTED`：嵌套事务

#### 8.3 AOP 日志示例

```java
@Aspect
@Component
public class LoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Around("execution(* com.example.service.*.*(..))")
    public Object logMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        logger.info("方法调用：{}，参数：{}", methodName, Arrays.toString(args));

        try {
            Object result = joinPoint.proceed();
            logger.info("方法返回：{}，结果：{}", methodName, result);
            return result;
        } catch (Exception e) {
            logger.error("方法异常：{}，异常信息：{}", methodName, e.getMessage());
            throw e;
        }
    }
}
```

### 9. Spring Boot 中的自动配置

**@SpringBootApplication 包含：**

-   `@Configuration`：标识为配置类
-   `@ComponentScan`：自动扫描组件
-   `@EnableAutoConfiguration`：启用自动配置

**自动配置原理：**

1. Spring Boot 启动时扫描 `META-INF/spring.factories`
2. 加载 `@EnableAutoConfiguration` 指定的配置类
3. 根据条件注解（`@ConditionalOnClass`、`@ConditionalOnProperty` 等）决定是否生效

```java
// 自定义自动配置
@Configuration
@ConditionalOnClass(UserService.class)
@ConditionalOnProperty(prefix = "app", name = "enabled", havingValue = "true")
public class UserServiceAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean
    public UserService userService() {
        return new UserService();
    }
}
```

### 10. 常见问题与最佳实践

#### 10.1 循环依赖问题

```java
// ❌ 循环依赖：UserService 依赖 OrderService，OrderService 依赖 UserService
@Service
public class UserService {
    @Autowired
    private OrderService orderService;  // 循环依赖
}

@Service
public class OrderService {
    @Autowired
    private UserService userService;  // 循环依赖
}

// ✅ 解决方案1：使用 @Lazy 延迟初始化
@Service
public class UserService {
    @Autowired
    @Lazy
    private OrderService orderService;
}

// ✅ 解决方案2：使用构造函数注入 + @Lazy
@Service
public class UserService {
    private final OrderService orderService;

    public UserService(@Lazy OrderService orderService) {
        this.orderService = orderService;
    }
}

// ✅ 解决方案3：重构代码，消除循环依赖（最佳方案）
```

#### 10.2 Bean 创建失败

**常见原因：**

-   缺少 `@Component` 等注解，Spring 未扫描到
-   依赖的 Bean 不存在
-   构造函数参数不匹配
-   循环依赖未解决

**排查方法：**

```java
// 查看所有注册的 Bean
@Autowired
private ApplicationContext applicationContext;

public void listBeans() {
    String[] beanNames = applicationContext.getBeanDefinitionNames();
    Arrays.stream(beanNames).forEach(System.out::println);
}
```

#### 10.3 最佳实践

1. **优先使用构造函数注入**：强制依赖、不可变、易测试
2. **合理使用作用域**：默认单例，需要多实例时使用 prototype
3. **避免循环依赖**：通过重构代码消除
4. **使用 `@ComponentScan` 指定包路径**：避免扫描不必要的包
5. **AOP 切点表达式要精确**：避免误切其他方法
6. **事务方法要 public**：`@Transactional` 对 private 方法无效

### 11. IoC vs AOP 对比

| 特性         | IoC                    | AOP                      |
| ------------ | ---------------------- | ------------------------ |
| **目的**     | 解耦对象创建和依赖管理 | 分离横切关注点           |
| **实现方式** | 依赖注入、Bean 容器    | 代理模式、动态代理       |
| **关注点**   | 对象之间的关系         | 横切逻辑（日志、事务等） |
| **使用场景** | 所有 Spring 应用       | 日志、事务、安全、缓存等 |

### 12. Spring 与 Spring Boot 的关系

**Spring Framework**：核心框架，提供 IoC、AOP 等基础功能。

**Spring Boot**：基于 Spring Framework 的快速开发框架，提供：

-   自动配置（Auto Configuration）
-   起步依赖（Starter Dependencies）
-   内嵌服务器（Embedded Server）
-   生产就绪特性（Actuator）

```java
// Spring Boot 应用入口
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 推荐学习顺序

1. **IoC 基础**：理解控制反转和依赖注入的概念，掌握 `@Component`、`@Autowired` 等注解
2. **Bean 管理**：学习 Bean 的作用域、生命周期、配置方式
3. **注解深入**：掌握 `@Service`、`@Repository`、`@Controller` 等组件注解的区别和使用
4. **AOP 基础**：理解面向切面编程的概念，掌握切点表达式和通知类型
5. **AOP 实践**：学习使用 AOP 实现日志、事务管理等实际功能
6. **Spring Boot 集成**：了解 Spring Boot 的自动配置和起步依赖
7. **最佳实践**：学习避免循环依赖、合理使用作用域等最佳实践

掌握以上内容即可参与基于 Spring 框架的项目开发。建议通过实际项目练习，加深对 IoC 和 AOP 的理解。详见 [Spring 官方文档](https://spring.io/projects/spring-framework) 或 [Spring Boot 官方文档](https://spring.io/projects/spring-boot)。
