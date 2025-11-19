package com.exam.domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GradeChartsDTO<T,V> {
    private List<T> label;
    private List<V> yAxisData;
}
