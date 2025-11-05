package com.example.retail_management.service;

import com.example.retail_management.mapper.ProductMapper;
import com.example.retail_management.model.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductMapper productMapper;
    public ProductService(ProductMapper productMapper) {
        this.productMapper = productMapper;
    }
    public void addProduct(Product product) {
        productMapper.insert(product);
    }
    public void updateProduct(Product product) {
        productMapper.updateById(product);
    }
    public void deleteProduct(Long productId) {
        productMapper.deleteById(productId);
    }
    public Product getProductById(Long productId) {
        return productMapper.selectById(productId);
    }
    public List<Product> getAllProducts() {
        return productMapper.selectList(null);
    }
}
