document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы DOM
    const toggleBtn = document.getElementById('toggleFormBtn');
    const formContainer = document.getElementById('marketplaceFormContainer');
    const marketplaceForm = document.getElementById('marketplaceForm');
    const marketplaceTableBody = document.querySelector('#marketplacesTable tbody');

    // Загрузка данных при открытии
        loadMarketplaces();

    // Обработчик кнопки "Добавить новый"
    toggleBtn.addEventListener('click', function() {
        const isHidden = formContainer.style.display === 'none' ||
                        formContainer.style.display === '';

        formContainer.style.display = isHidden ? 'block' : 'none';
        toggleBtn.textContent = isHidden ? 'Скрыть форму' : 'Добавить новый';
    });

    // Обработчик отправки формы
    marketplaceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createMarketplace();
    });

    // Добавляем обработчик изменения выпадающего списка
    document.getElementById('marketplaceType').addEventListener('change', function() {
        const customTypeField = document.getElementById('customType');
        customTypeField.style.display = this.value === 'Другой' ? 'block' : 'none';
    });

    // Функция загрузки данных
async function loadMarketplaces() {
    try {
        const response = await fetch('/api/marketplaces');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
}
        const marketplaces = await response.json();
        console.log('Received data:', marketplaces);

        renderMarketplaces(marketplaces);
    } catch (error) {
            console.error('Error loading marketplaces:', error);
        marketplaceTableBody.innerHTML = `<tr><td colspan="5">Ошибка загрузки: ${error.message}</td></tr>`;
}
}

    // Функция отрисовки данных
function renderMarketplaces(marketplaces) {
    marketplaceTableBody.innerHTML = '';

    if (marketplaces && marketplaces.length > 0) {
        marketplaces.forEach(mp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${mp.name || '-'}</td>
                <td>${mp.comment || '-'}</td>
                <td>${mp.web ? `<a href="${mp.web}" target="_blank">${mp.web}</a>` : '-'}</td>
                <td>${mp.type || '-'}</td>
                <td>${mp.discountCardId || '-'}</td>
            `;
            marketplaceTableBody.appendChild(row);
        });
    } else {
        marketplaceTableBody.innerHTML = '<tr><td colspan="5">Нет данных для отображения</td></tr>';
    }
}

    // Функция создания маркетплейса
async function createMarketplace() {
        const selectedType = document.getElementById('marketplaceType').value;
        const customType = document.getElementById('customType').value;

        const marketplaceData = {
            name: document.getElementById('marketplaceName').value,
            comment: document.getElementById('marketplaceComment').value,
            web: document.getElementById('marketplaceWeb').value,
            type: selectedType === 'Другой' ? customType : selectedType,
            discountCardId: document.getElementById('marketplaceDiscountCard').value || null
    };

    try {
        const response = await fetch('/api/marketplaces', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(marketplaceData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Success:', result);

        // Обновляем список и сбрасываем форму
        loadMarketplaces();
        marketplaceForm.reset();
            formContainer.style.display = 'none';
            toggleBtn.textContent = 'Добавить новый';
    } catch (error) {
        console.error('Error:', error);
        alert(`Ошибка при создании маркетплейса: ${error.message}`);
}
}
});
