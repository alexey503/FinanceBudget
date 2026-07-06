package com.finance.domain;

import com.finance.domain.Marketplace;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

/**
 * Информация о чеке/квитанции по операции
 */
@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Receipt {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Уникальный идентификатор чека

    private String receiptNumber;  // Номер чека (ФН, ФД, ФП)
    private String imageUrl;       // Ссылка на изображение чека
    private String receiptUri;     // URI для доступа к электронному чеку
    private double totalAmount;    // Сумма по чеку
    
    @ManyToOne
    @JoinColumn(name = "marketplace_id")
    private Marketplace marketplace;  // Магазин, где был выдан чек

    private List<String> items;  // Список товаров в чеке

    // Дополнительные поля для чеков
    private String fiscalSign;     // Фискальный признак документа
    private String fiscalDocument; // Номер фискального документа
    private String fiscalDrive;    // Номер фискального накопителя
}
