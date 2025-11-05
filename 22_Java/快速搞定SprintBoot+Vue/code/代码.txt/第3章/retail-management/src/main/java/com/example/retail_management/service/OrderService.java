package com.example.retail_management.service;

import com.example.retail_management.mapper.OrderMapper;
import com.example.retail_management.mapper.ProductMapper;
import com.example.retail_management.model.Order;
import com.example.retail_management.model.Product;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {
    private final OrderMapper orderMapper;
    private final ProductMapper productMapper;
    public OrderService(OrderMapper orderMapper, ProductMapper productMapper) {
        this.orderMapper = orderMapper;
        this.productMapper = productMapper;
    }
    @Transactional
    public void createOrder(Order order) {
        // 检查产品库存，如果库存足够，则创建订单
        Product product = productMapper.selectById(order.getProductId());
        if (product != null && product.getStock() >= order.getQuantity()) {
            product.setStock(product.getStock() - order.getQuantity());
// 减少库存
            productMapper.updateById(product); // 更新产品信息
            orderMapper.insert(order); // 创建订单
        } else {
            // 处理库存不足的情况，如抛出异常
            throw new RuntimeException("Insufficient stock for product: " +
                    order.getProductId());
        }
    }
    @Transactional
    public void updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderMapper.selectById(orderId);
        if (order != null) {order.setStatus(newStatus);
            orderMapper.updateById(order);
        } else {
            // 处理订单不存在的情况，如抛出异常
            throw new RuntimeException("Order not found: " + orderId);
        }
    }
}
