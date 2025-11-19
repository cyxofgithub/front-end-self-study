package com.example.mpcodegen.service.impl;

import com.example.mpcodegen.entity.Orders;
import com.example.mpcodegen.mapper.OrdersMapper;
import com.example.mpcodegen.service.IOrdersService;
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
public class OrdersServiceImpl extends ServiceImpl<OrdersMapper, Orders> implements IOrdersService {

}
