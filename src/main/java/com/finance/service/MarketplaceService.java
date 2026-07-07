package com.finance.service;

import com.finance.domain.Marketplace;
import com.finance.dto.MarketplaceDto;
import com.finance.repository.MarketplaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketplaceService {

    private final MarketplaceRepository marketplaceRepository;

    @Transactional
    public Marketplace createMarketplace(MarketplaceDto dto) {
        Marketplace marketplace = new Marketplace();
        marketplace.setName(dto.getName());
        marketplace.setComment(dto.getComment());
        marketplace.setWeb(dto.getWeb());
        marketplace.setType(dto.getType());
        marketplace.setDiscountCardId(dto.getDiscountCardId());

        return marketplaceRepository.save(marketplace);
    }

    public List<Marketplace> getAllMarketplaces() {
        return marketplaceRepository.findAll();
    }

    public Marketplace getMarketplaceById(Long id) {
        return marketplaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marketplace not found with id: " + id));
    }
}