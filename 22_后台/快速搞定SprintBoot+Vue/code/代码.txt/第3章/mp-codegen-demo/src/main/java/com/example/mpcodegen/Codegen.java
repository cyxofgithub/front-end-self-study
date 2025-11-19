package com.example.mpcodegen;

import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.config.rules.DbColumnType;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;
import java.sql.Types;
import java.util.Collections;

public class Codegen {
    private static String projectPath = "C:\\Users\\liuwei\\Desktop\\Code\\mp-codegen-demo";
    public static void main(String[] args) {
        FastAutoGenerator.create("jdbc:mysql://localhost:3306/mydb", "root", "root")
                .globalConfig(builder -> {
                    builder.author("liu") // 设置作者
                            .outputDir(projectPath+"/src/main/java"); // 指定输出目录
                })
                .dataSourceConfig(builder -> builder.typeConvertHandler((globalConfig, typeRegistry, metaInfo) -> {
                    int typeCode = metaInfo.getJdbcType().TYPE_CODE;
                    if (typeCode == Types.SMALLINT) {
                        // 自定义类型转换
                        return DbColumnType.INTEGER;
                    }
                    return typeRegistry.getColumnType(metaInfo);

                }))
                .packageConfig(builder -> {
                    builder.parent("com.example.mpcodegen") // 设置父包名
                            .pathInfo(Collections.singletonMap(OutputFile.xml, projectPath+"/src/main/resources/mapper")); // 设置mapperXml生成路径
                })
                .strategyConfig(builder -> {
                    builder.addInclude("users","orders")// 设置需要生成的表名
                    .controllerBuilder().enableRestStyle().enableHyphenStyle().enableFileOverride()
                            .entityBuilder().enableFileOverride()
                            .mapperBuilder().enableFileOverride()
                            .serviceBuilder().enableFileOverride();
                })
                .templateEngine(new FreemarkerTemplateEngine()) // 使用Freemarker引擎模板，默认的是Velocity引擎模板
                .execute();
    }
}