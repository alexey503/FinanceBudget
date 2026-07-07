document.addEventListener('DOMContentLoaded', function() {
    loadAccounts();

    // Toggle форма
    const toggleBtn = document.getElementById('toggleFormBtn');
    const formContainer = document.getElementById('accountFormContainer');
    toggleBtn.addEventListener('click', function() {
        if (formContainer.style.display === 'none') {
            formContainer.style.display = 'block';
            toggleBtn.textContent = 'Скрыть форму';
        } else {
            formContainer.style.display = 'none';
            toggleBtn.textContent = 'Добавить новый';
        }
    });

    // Отправка формы
    document.getElementById('accountForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createAccount();
    });
});

function loadAccounts() {
    fetch('/api/accounts')
        .then(response => response.json())
        .then(accounts => {
            const tableBody = document.querySelector('#accountsTable tbody');
            tableBody.innerHTML = '';

            accounts.forEach(account => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${account.name}</td>
                    <td>${account.balance}</td>
                    <td>${account.type}</td>
                    <td>${account.accountNumber}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading accounts:', error));
}

function createAccount() {
    const accountData = {
        name: document.getElementById('accountName').value,
        balance: parseFloat(document.getElementById('accountBalance').value),
        type: document.getElementById('accountType').value,
        accountNumber: document.getElementById('accountNumber').value,
        ownerId: 1 // Fixed value, as required
    };

    fetch('/api/accounts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData)
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById('accountForm').reset();
        document.getElementById('accountBalance').value = "0.00";
        loadAccounts();
    })
    .catch(error => console.error('Error creating account:', error));
}