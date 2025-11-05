package com.example.retail_management.controller;

import com.example.retail_management.model.Order;
import com.example.retail_management.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    @PostMapping
    public void createOrder(@RequestBody Order order) {
        orderService.createOrder(order);
    }
    @PutMapping("/{id}")
    public void updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        orderService.updateOrderStatus(id, status);
    }
}
