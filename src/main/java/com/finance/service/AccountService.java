package com.finance.service;

import com.finance.domain.Account;
import com.finance.dto.AccountDto;
import com.finance.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    @Transactional
    public Account createAccount(AccountDto dto) {
        Account account = new Account();
        account.setName(dto.getName());
        account.setBalance(dto.getBalance());
        account.setAccountNumber(dto.getAccountNumber());
        account.setType(dto.getType());
        account.setOwnerId(dto.getOwnerId());

        return accountRepository.save(account);
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Account getAccountById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
    }

    @Transactional
    public Account updateAccount(Long id, AccountDto dto) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));

        account.setName(dto.getName());
        account.setBalance(dto.getBalance());
        account.setAccountNumber(dto.getAccountNumber());
        account.setType(dto.getType());
        account.setOwnerId(dto.getOwnerId());

        return accountRepository.save(account);
    }

    @Transactional
    public void deleteAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));

        accountRepository.delete(account);
    }
}