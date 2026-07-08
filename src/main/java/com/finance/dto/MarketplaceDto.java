package com.finance.dto;

import lombok.Data;

@Data
public class MarketplaceDto {
    private Long id;
    private String name;
    private String comment;
    private String web;
    private String type;
    private String discountCardId;
}