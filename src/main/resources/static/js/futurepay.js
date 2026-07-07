document.addEventListener('DOMContentLoaded', function() {
    loadFuturePayments();
});

function loadFuturePayments() {
    fetch('/api/operations/futurepay')
        .then(response => response.json())
        .then(payments => {
            const tableBody = document.querySelector('#futurePaymentsTable tbody');
            tableBody.innerHTML = '';

            payments.forEach(payment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${payment.id}</td>
                    <td>${payment.amount}</td>
                    <td>${payment.description}</td>
                    <td>${new Date(payment.dueDate).toLocaleDateString()}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading future payments:', error));
}