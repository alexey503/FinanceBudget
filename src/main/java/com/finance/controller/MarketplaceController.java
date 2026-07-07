package com.finance.controller;

import com.finance.domain.Marketplace;
import com.finance.dto.MarketplaceDto;
import com.finance.service.MarketplaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marketplaces")
public class MarketplaceController {

    private final MarketplaceService marketplaceService;

    @Autowired
    public MarketplaceController(MarketplaceService marketplaceService) {
        this.marketplaceService = marketplaceService;
    }

    @PostMapping
    public ResponseEntity<Marketplace> createMarketplace(@RequestBody MarketplaceDto marketplaceDto) {
        Marketplace createdMarketplace = marketplaceService.createMarketplace(marketplaceDto);
        return ResponseEntity.ok(createdMarketplace);
    }

    @GetMapping
    public ResponseEntity<List<Marketplace>> getAllMarketplaces() {
        List<Marketplace> marketplaces = marketplaceService.getAllMarketplaces();
        return ResponseEntity.ok(marketplaces);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Marketplace> getMarketplaceById(@PathVariable Long id) {
        Marketplace marketplace = marketplaceService.getMarketplaceById(id);
        return ResponseEntity.ok(marketplace);
    }
}