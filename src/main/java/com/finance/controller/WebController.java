package com.finance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String index() {
        return "index"; // Главная страница с меню
    }

    @GetMapping("/futurepay")
    public String futurePayments() {
        return "futurepay";
    }

    @GetMapping("/accounts")
    public String accounts() {
        return "accounts"; // Страница управления аккаунтами
    }

    @GetMapping("/marketplaces")
    public String marketplaces() {
        return "marketplaces"; // Страница маркетплейсов
    }

    @GetMapping("/operations")
    public String operations() {
        return "operations"; // Страница операций
    }

    // Дополнительные методы по необходимости
}