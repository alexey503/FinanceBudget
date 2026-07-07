document.addEventListener('DOMContentLoaded', function() {
    loadOperations();

    document.getElementById('operationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createOperation();
    });
});

function loadOperations() {
    fetch('/api/operations')
        .then(response => response.json())
        .then(operations => {
            const tableBody = document.querySelector('#operationsTable tbody');
            tableBody.innerHTML = '';

            operations.forEach(operation => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${operation.id}</td>
                    <td>${operation.amount}</td>
                    <td>${operation.description}</td>
                    <td>${new Date(operation.date).toLocaleString()}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading operations:', error));
}

function createOperation() {
    const operationData = {
        amount: document.getElementById('operationAmount').value,
        description: document.getElementById('operationDescription').value
    };

    fetch('/api/operations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(operationData)
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById('operationForm').reset();
        loadOperations();
    })
    .catch(error => console.error('Error creating operation:', error));
}