package com.exam.handler;

import java.util.ArrayList;
import java.util.List;

import cn.dev33.satoken.stp.StpUtil;
import org.springframework.stereotype.Component;
import cn.dev33.satoken.stp.StpInterface;

/**
 * 自定义权限验证接口扩展
 */
@Component    // 保证此类被SpringBoot扫描，完成Sa-Token的自定义权限验证扩展
public class StpHandler implements StpInterface {

    public static String getId() {
        String s = StpUtil.getLoginId().toString();
        s = s.replace("[", "");
        return s.split(", ")[0];
    }

    public static String getRole() {
        String s = StpUtil.getLoginId().toString();
        s = s.replace("]", "");
        return s.split(", ")[1];
    }

    public static List<String> getArray(String s) {
        List<String> list = new ArrayList<>();
        s = s.replace("[", "");
        s = s.replace("]", "");
        list.add(s.split(", ")[0]);
        list.add(s.split(", ")[1]);
        return list;
    }

    /**
     * 返回一个账号所拥有的权限码集合
     */
    @Override
    public List<String> getPermissionList(Object loginId, String loginType) {
        // 本list仅做模拟，实际项目中要根据具体业务逻辑来查询权限
        return getArray(loginId.toString());
    }

    /**
     * 返回一个账号所拥有的角色标识集合 (权限与角色可分开校验)
     */
    @Override
    public List<String> getRoleList(Object loginId, String loginType) {
        // 本list仅做模拟，实际项目中要根据具体业务逻辑来查询角色
        System.out.println(loginId);
        System.out.println(loginType);
        List<String> list = new ArrayList<String>();
        list.add("admin");
        list.add("super-admin");
        return list;
    }

}

