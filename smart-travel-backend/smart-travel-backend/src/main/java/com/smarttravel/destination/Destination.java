package com.smarttravel.destination;

import java.math.BigDecimal;

public record Destination(
        Long id,
        String name,
        String country,
        String category,
        BigDecimal price,
        String duration,
        double rating,
        String image,
        String tag,
        String description
) {}