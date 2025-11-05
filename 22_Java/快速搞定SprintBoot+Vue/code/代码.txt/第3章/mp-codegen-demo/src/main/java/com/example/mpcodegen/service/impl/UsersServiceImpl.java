package com.example.mpcodegen.service.impl;

import com.example.mpcodegen.entity.Users;
import com.example.mpcodegen.mapper.UsersMapper;
import com.example.mpcodegen.service.IUsersService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author liu
 * @since 2024-06-02
 */
@Service
public class UsersServiceImpl extends ServiceImpl<UsersMapper, Users> implements IUsersService {

}
