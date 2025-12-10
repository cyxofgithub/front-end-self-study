# Maven 基础速览

## 1. Maven 基本概念

### 1.1 什么是 Maven？

**Maven** 是 Apache 软件基金会的一个开源项目管理和构建工具，主要用于 Java 项目的：

-   **依赖管理**：自动下载和管理项目所需的第三方库（jar 包）
-   **项目构建**：编译、测试、打包、部署等构建流程自动化
-   **项目标准化**：统一的目录结构和项目配置规范
-   **生命周期管理**：定义了一套标准的构建生命周期

### 1.2 Maven 的核心优势

-   **约定优于配置**：遵循标准目录结构，减少配置
-   **依赖管理**：自动解决依赖冲突，管理传递依赖
-   **插件机制**：丰富的插件生态，支持各种构建需求
-   **多模块支持**：支持大型项目的模块化构建

### 1.3 Maven vs Gradle vs Ant

| 特性     | Maven             | Gradle            | Ant              |
| -------- | ----------------- | ----------------- | ---------------- |
| 配置文件 | XML（pom.xml）    | Groovy/Kotlin DSL | XML（build.xml） |
| 依赖管理 | 内置支持          | 内置支持          | 需手动配置       |
| 构建速度 | 中等              | 快（增量构建）    | 慢               |
| 学习曲线 | 中等              | 较陡              | 平缓             |
| 使用场景 | Java 项目主流选择 | Android、现代项目 | 传统项目         |

## 2. Maven 安装与配置

### 2.1 安装 Maven

**Windows：**

1. 下载 Maven：https://maven.apache.org/download.cgi
2. 解压到目录（如 `C:\Program Files\Apache\maven`）
3. 配置环境变量：
    - `MAVEN_HOME` = `C:\Program Files\Apache\maven`
    - `PATH` 添加 `%MAVEN_HOME%\bin`
4. 验证安装：`mvn -v`

**macOS：**

```bash
# 使用 Homebrew 安装
brew install maven

# 验证安装
mvn -v
```

**Linux：**

```bash
# Ubuntu/Debian
sudo apt-get install maven

# CentOS/RHEL
sudo yum install maven

# 验证安装
mvn -v
```

### 2.2 Maven 配置

**本地仓库配置（settings.xml）：**

Maven 默认本地仓库位置：`~/.m2/repository`

修改仓库位置（可选），编辑 `~/.m2/settings.xml`：

```xml
<settings>
    <localRepository>D:/maven-repository</localRepository>
</settings>
```

**镜像配置（加速下载）：**

编辑 `~/.m2/settings.xml`，添加阿里云镜像：

```xml
<settings>
    <mirrors>
        <mirror>
            <id>aliyunmaven</id>
            <mirrorOf>central</mirrorOf>
            <name>阿里云公共仓库</name>
            <url>https://maven.aliyun.com/repository/public</url>
        </mirror>
    </mirrors>
</settings>
```

## 3. Maven 项目结构

### 3.1 标准目录结构

Maven 遵循约定优于配置的原则，标准目录结构如下：

```
项目根目录/
├── pom.xml                    # Maven 配置文件（核心）
├── src/
│   ├── main/                  # 主代码目录
│   │   ├── java/              # Java 源代码
│   │   │   └── com/example/
│   │   │       └── App.java
│   │   └── resources/         # 资源文件（配置文件、静态资源）
│   │       ├── application.properties
│   │       └── log4j2.xml
│   └── test/                  # 测试代码目录
│       ├── java/              # 测试源代码
│       │   └── com/example/
│       │       └── AppTest.java
│       └── resources/         # 测试资源文件
└── target/                    # 编译输出目录（自动生成）
    ├── classes/               # 编译后的 class 文件
    ├── test-classes/          # 测试编译后的 class 文件
    └── *.jar                  # 打包后的 jar 文件
```

### 3.2 目录说明

-   **src/main/java**：项目主代码，编译后输出到 `target/classes`
-   **src/main/resources**：主资源文件，会被复制到 `target/classes`
-   **src/test/java**：测试代码，编译后输出到 `target/test-classes`
-   **src/test/resources**：测试资源文件
-   **target**：构建输出目录，可删除后重新生成

## 4. POM 文件详解

### 4.1 什么是 POM？

**POM（Project Object Model）** 是 Maven 项目的核心配置文件，通常命名为 `pom.xml`，位于项目根目录。

POM 文件定义了：

-   项目基本信息（groupId、artifactId、version）
-   项目依赖（dependencies）
-   构建配置（build）
-   插件配置（plugins）

### 4.2 基础 POM 示例

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- 项目坐标（唯一标识） -->
    <groupId>com.example</groupId>
    <artifactId>my-project</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <!-- 项目名称和描述 -->
    <name>My Project</name>
    <description>这是一个示例项目</description>

    <!-- 属性配置 -->
    <properties>
        <java.version>17</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <!-- 依赖管理 -->
    <dependencies>
        <!-- 依赖项 -->
    </dependencies>

    <!-- 构建配置 -->
    <build>
        <plugins>
            <!-- 插件配置 -->
        </plugins>
    </build>
</project>
```

### 4.3 坐标（Coordinates）

Maven 使用三个坐标唯一标识一个项目或依赖：

-   **groupId**：组织或公司标识（如 `com.example`、`org.springframework`）
-   **artifactId**：项目名称（如 `my-project`、`spring-boot-starter-web`）
-   **version**：版本号（如 `1.0.0`、`3.3.0`）

**示例：**

```xml
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-web</artifactId>
<version>3.3.0</version>
```

完整坐标：`org.springframework.boot:spring-boot-starter-web:3.3.0`

### 4.4 版本号规范

-   **SNAPSHOT**：开发版本，如 `1.0.0-SNAPSHOT`（不稳定，可能随时更新）
-   **RELEASE**：正式版本，如 `1.0.0`、`2.1.3`（稳定版本）
-   **语义化版本**：`主版本号.次版本号.修订号`（如 `3.2.1`）

## 5. 依赖管理

依赖是项目运行 / 编译时需要的 “原材料”（如第三方库、框架），供项目代码直接使用；

### 5.1 添加依赖

在 `pom.xml` 的 `<dependencies>` 标签中添加依赖：

```xml
<dependencies>
    <!-- Spring Boot Web Starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>3.3.0</version>
    </dependency>

    <!-- MySQL 驱动 -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>8.0.33</version>
    </dependency>

    <!-- Lombok（编译时生成代码） -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.30</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

### 5.2 依赖作用域（Scope）

依赖的作用域决定了依赖在哪些阶段可用：

| Scope        | 说明                         | 示例场景            |
| ------------ | ---------------------------- | ------------------- |
| **compile**  | 默认值，编译和运行时都可用   | 大部分依赖          |
| **provided** | 编译时可用，运行时由容器提供 | Servlet API、Lombok |
| **runtime**  | 运行时可用，编译时不需要     | JDBC 驱动           |
| **test**     | 仅在测试时可用               | JUnit、Mockito      |
| **system**   | 需要显式指定路径（不推荐）   | 本地 jar 包         |

**示例：**

```xml
<!-- 测试依赖 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <version>3.3.0</version>
    <scope>test</scope>
</dependency>

<!-- 编译时依赖（运行时由 JDK 提供） -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>4.0.1</version>
    <scope>provided</scope>
</dependency>
```

### 5.3 传递依赖

Maven 会自动解析传递依赖。例如：

```
项目 A 依赖 B
B 依赖 C
→ A 会自动引入 C（传递依赖）
```

**依赖树查看：**

```bash
mvn dependency:tree
```

**排除传递依赖：**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.3.0</version>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

### 5.4 依赖冲突解决

当多个依赖引入同一个库的不同版本时，Maven 使用**最短路径优先**和**第一声明优先**原则。

**手动指定版本（推荐）：**

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.15.2</version>
</dependency>
```

**查看依赖冲突：**

```bash
mvn dependency:tree -Dverbose
```

## 6. 父 POM 和继承

### 6.1 使用父 POM

Spring Boot 项目通常继承 `spring-boot-starter-parent`：

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.0</version>
    <relativePath/> <!-- 从仓库查找，不从本地查找 -->
</parent>

<groupId>com.example</groupId>
<artifactId>my-project</artifactId>
<version>1.0.0-SNAPSHOT</version>
```

**父 POM 的作用：**

-   统一管理依赖版本（无需指定版本号）
-   统一构建配置（Java 版本、编码等）
-   统一插件配置

### 6.2 依赖版本管理

父 POM 中定义的依赖版本可以在子项目中直接使用，无需指定版本：

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.0</version>
</parent>

<dependencies>
    <!-- 无需指定版本，使用父 POM 管理的版本 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

## 7. Maven 生命周期和命令

### 7.1 生命周期阶段

Maven 定义了三个标准的生命周期：

**1. Clean 生命周期：**

-   `clean`：清理 `target` 目录

**2. Default 生命周期（主要）：**

-   `validate`：验证项目配置
-   `compile`：编译源代码
-   `test`：运行测试
-   `package`：打包（jar/war）
-   `verify`：验证打包结果
-   `install`：安装到本地仓库
-   `deploy`：部署到远程仓库

**3. Site 生命周期：**

-   `site`：生成项目文档站点

### 7.2 常用 Maven 命令

```bash
# 清理并编译
mvn clean compile

# 运行测试
mvn test

# 打包（生成 jar/war）
mvn package

# 安装到本地仓库
mvn install

# 跳过测试打包
mvn package -DskipTests

# 查看依赖树
mvn dependency:tree

# 查看依赖信息
mvn dependency:analyze

# 运行 Spring Boot 应用
mvn spring-boot:run
```

### 7.3 命令组合

```bash
# 清理、编译、测试、打包、安装（完整流程）
mvn clean install

# 只编译，不运行测试
mvn clean compile -DskipTests

# 打包并跳过测试
mvn clean package -DskipTests
```

## 8. 插件配置

插件是 Maven 执行构建生命周期（编译、打包、测试、部署等）的 “工具”，由 Maven 调用完成特定构建操作。

### 8.1 编译器插件

配置 Java 编译版本：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.11.0</version>
            <configuration>
                <source>17</source>
                <target>17</target>
                <encoding>UTF-8</encoding>
            </configuration>
        </plugin>
    </plugins>
</build>
```

### 8.2 Spring Boot 插件

用于打包可执行 jar 和运行应用：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <version>3.3.0</version>
        </plugin>
    </plugins>
</build>
```

**功能：**

-   打包成可执行 jar（包含所有依赖）
-   运行应用：`mvn spring-boot:run`
-   生成启动脚本

### 8.3 其他常用插件

**资源插件（复制资源文件）：**

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-resources-plugin</artifactId>
    <version>3.3.1</version>
    <configuration>
        <encoding>UTF-8</encoding>
    </configuration>
</plugin>
```

**Surefire 插件（运行测试）：**

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.1.2</version>
    <configuration>
        <skipTests>false</skipTests>
    </configuration>
</plugin>
```

## 9. 多模块项目

### 9.1 项目结构

```
parent-project/
├── pom.xml                    # 父 POM（packaging: pom）
├── module-a/
│   ├── pom.xml               # 子模块 A
│   └── src/
├── module-b/
│   ├── pom.xml               # 子模块 B
│   └── src/
└── module-common/
    ├── pom.xml               # 公共模块
    └── src/
```

### 9.2 父 POM 配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project>
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>parent-project</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>  <!-- 父项目必须是 pom -->

    <modules>
        <module>module-a</module>
        <module>module-b</module>
        <module>module-common</module>
    </modules>

    <!-- 统一管理依赖版本 -->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>3.3.0</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>
```

### 9.3 子模块配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project>
    <modelVersion>4.0.0</modelVersion>

    <!-- 继承父 POM -->
    <parent>
        <groupId>com.example</groupId>
        <artifactId>parent-project</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>module-a</artifactId>
    <packaging>jar</packaging>

    <dependencies>
        <!-- 引用兄弟模块 -->
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>module-common</artifactId>
            <version>${project.version}</version>
        </dependency>
    </dependencies>
</project>
```

## 10. 配置文件管理

### 10.1 资源文件过滤

在 `pom.xml` 中配置资源过滤，支持占位符替换：

```xml
<build>
    <resources>
        <resource>
            <directory>src/main/resources</directory>
            <filtering>true</filtering>
        </resource>
    </resources>
</build>
```

在 `application.properties` 中使用占位符：

```properties
app.name=${project.name}
app.version=${project.version}
```

### 10.2 Profile 多环境配置

**定义 Profile：**

```xml
<profiles>
    <profile>
        <id>dev</id>
        <properties>
            <env>development</env>
            <db.url>jdbc:mysql://localhost:3306/dev_db</db.url>
        </properties>
        <activation>
            <activeByDefault>true</activeByDefault>
        </activation>
    </profile>

    <profile>
        <id>prod</id>
        <properties>
            <env>production</env>
            <db.url>jdbc:mysql://prod-server:3306/prod_db</db.url>
        </properties>
    </profile>
</profiles>
```

**激活 Profile：**

```bash
# 使用 -P 参数
mvn clean package -Pprod

# 或在 settings.xml 中配置
```

## 11. 常见问题与解决方案

### 11.1 依赖下载失败

**问题：** 依赖下载缓慢或失败

**解决方案：**

1. 配置国内镜像（阿里云、腾讯云等）
2. 检查网络连接
3. 清理本地仓库：`mvn clean` 或删除 `~/.m2/repository`

### 11.2 版本冲突

**问题：** 多个依赖引入同一库的不同版本

**解决方案：**

1. 使用 `mvn dependency:tree` 查看依赖树
2. 在 `pom.xml` 中显式指定版本
3. 使用 `<exclusions>` 排除冲突依赖

### 11.3 编码问题

**问题：** 编译时出现中文乱码

**解决方案：**

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
</properties>
```

### 11.4 打包时包含测试

**问题：** 打包时不想运行测试

**解决方案：**

```bash
# 跳过测试
mvn package -DskipTests

# 或跳过测试编译
mvn package -Dmaven.test.skip=true
```

## 12. Spring Boot 项目中的 Maven

### 12.1 典型 Spring Boot POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- 继承 Spring Boot 父 POM -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.0</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>
    <description>Demo project for Spring Boot</description>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <!-- Web Starter -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- 数据库 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
        </dependency>

        <!-- 测试 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 12.2 Spring Boot Starter 说明

Spring Boot Starter 是一组预配置的依赖集合：

-   **spring-boot-starter-web**：Web 开发（Spring MVC、Tomcat）
-   **spring-boot-starter-data-jpa**：JPA 数据访问
-   **spring-boot-starter-data-redis**：Redis 支持
-   **spring-boot-starter-test**：测试框架（JUnit、Mockito）
-   **spring-boot-starter-validation**：参数验证
-   **spring-boot-starter-security**：安全框架

## 13. 最佳实践

### 13.1 依赖管理建议

1. **统一版本管理**：使用父 POM 或 `dependencyManagement` 统一管理版本
2. **避免版本冲突**：定期检查依赖树，及时解决冲突
3. **合理使用 Scope**：正确设置依赖作用域，减少打包体积
4. **定期更新依赖**：关注安全更新，及时升级依赖版本

### 13.2 项目结构建议

1. **遵循标准目录结构**：使用 Maven 标准目录，便于团队协作
2. **模块化设计**：大型项目使用多模块结构
3. **资源文件管理**：配置文件放在 `src/main/resources`
4. **测试代码分离**：测试代码放在 `src/test`，与主代码分离

### 13.3 构建优化建议

1. **使用镜像加速**：配置国内 Maven 镜像，提高下载速度
2. **跳过不必要的测试**：生产构建时使用 `-DskipTests`
3. **清理构建**：定期执行 `mvn clean`，避免缓存问题
4. **使用 Profile**：通过 Profile 管理多环境配置

## 14. 推荐学习顺序

1. **基础概念**：理解 Maven 的作用、POM 文件结构、坐标概念
2. **安装配置**：掌握 Maven 安装、环境变量配置、镜像配置
3. **项目结构**：熟悉标准目录结构，理解各目录作用
4. **依赖管理**：学会添加依赖、理解 Scope、解决依赖冲突
5. **生命周期**：掌握常用 Maven 命令（compile、package、install）
6. **插件使用**：了解常用插件（编译器、Spring Boot 插件）
7. **多模块项目**：学习父 POM、子模块配置
8. **实际应用**：在 Spring Boot 项目中实践 Maven 配置

掌握以上内容即可参与基于 Maven 的 Java 项目开发。建议通过实际项目练习，加深理解。详见 [Maven 官方文档](https://maven.apache.org/guides/)。
