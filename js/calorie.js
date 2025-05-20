// Список продуктов из JSON
const products = [
    { name: "Макароны с яйцом", proteins: 10, fats: 3, carbs: 70, calories: 350 },
    { name: "Майонез Calve Легкий", proteins: 1, fats: 25, carbs: 2, calories: 230 },
    { name: "Хлеб 8 Злаков", proteins: 9, fats: 3, carbs: 45, calories: 247 },
    { name: "Колбаса вареная диетическая", proteins: 12, fats: 5, carbs: 1, calories: 120 },
    { name: "Рис белый", proteins: 7, fats: 0.5, carbs: 78, calories: 345 },
    { name: "Куриное яйцо", proteins: 13, fats: 11, carbs: 1, calories: 155 }
];

let currentList = [];

// Элементы DOM
const productInput = document.querySelector('.calorie__product input[name="product"]');
const numberInput = document.querySelector('.calorie__weight input[name="weight"]');
const searchResults = document.querySelector('.search-results');
const tableBody = document.querySelector('table tbody');
const totalRow = document.querySelector('.total-row');

// Функция фильтрации и отображения результатов
function showSearchResults(query) {
    if (!query.trim()) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        return;
    }

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    searchResults.innerHTML = '';
    searchResults.style.display = filtered.length ? 'block' : 'none';

    filtered.forEach(product => {
        const item = document.createElement('div');
        item.className = 'search-results-item';
        item.textContent = product.name;
        item.addEventListener('click', () => {
            // Установка выбранного продукта в input
            productInput.value = product.name;

            searchResults.style.display = 'none';
        });
        searchResults.appendChild(item);
    });
}

// Автоподстановка при вводе
productInput.addEventListener('input', () => {
    showSearchResults(productInput.value);
});

// Добавление продукта в таблицу
function addProductToTable(product) {
    const row = document.createElement('tr');
    const proteinsTotal = (product.proteins * product.weight / 100).toFixed(2);
    const fatsTotal = (product.fats * product.weight / 100).toFixed(2);
    const carbsTotal = (product.carbs * product.weight / 100).toFixed(2);
    const caloriesTotal = (product.calories * product.weight / 100).toFixed(2);

    row.dataset.name = product.name;

    row.innerHTML = `
        <td>${currentList.length + 1}</td>
        <td data-align="left">${product.name}</td>
        <td>${product.weight}</td>
        <td>${proteinsTotal}</td>
        <td>${fatsTotal}</td>
        <td>${carbsTotal}</td>
        <td>${caloriesTotal}</td>
        <td class="delete-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM9.70711 8.29289C9.31658 7.90237 8.68342 7.90237 8.29289 8.29289C7.90237 8.68342 7.90237 9.31658 8.29289 9.70711L10.5858 12L8.29289 14.2929C7.90237 14.6834 7.90237 15.3166 8.29289 15.7071C8.68342 16.0976 9.31658 16.0976 9.70711 15.7071L12 13.4142L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L13.4142 12L15.7071 9.70711C16.0976 9.31658 16.0976 8.68342 15.7071 8.29289C15.3166 7.90237 14.6834 7.90237 14.2929 8.29289L12 10.5858L9.70711 8.29289Z" fill="#FF5A90"/>
            </svg>
        </td>
    `;
    row.querySelector('.delete-button').addEventListener('click', () => {
        tableBody.removeChild(row);
        updateTotal();
        updateNumbers();
    });

    tableBody.insertBefore(row, totalRow);
    currentList.push(product);
    updateTotal();
}

function updateNumbers() {
    const rows = tableBody.querySelectorAll('tr:not(.total-row)');
    rows.forEach((row, index) => {
        row.querySelector('td').textContent = index + 1;
    });
}

// Обновление итоговой строки
function updateTotal() {
    let totalWeight = 0, totalProteins = 0, totalFats = 0, totalCarbs = 0, totalCalories = 0;

    Array.from(tableBody.querySelectorAll('tr')).forEach(row => {
        if (!row.classList.contains('total-row')) {
            const cells = row.querySelectorAll('td');
            if (cells.length > 1) {
                const weight = parseFloat(cells[2].textContent) || 0;
                const proteins = parseFloat(cells[3].textContent) || 0;
                const fats = parseFloat(cells[4].textContent) || 0;
                const carbs = parseFloat(cells[5].textContent) || 0;
                const calories = parseFloat(cells[6].textContent) || 0;

                totalWeight += weight;
                totalProteins += proteins;
                totalFats += fats;
                totalCarbs += carbs;
                totalCalories += calories;
            }
        }
    });

    const totalCells = totalRow.querySelectorAll('td');
    totalCells[2].textContent = totalWeight.toFixed(0);
    totalCells[3].textContent = totalProteins.toFixed(2);
    totalCells[4].textContent = totalFats.toFixed(2);
    totalCells[5].textContent = totalCarbs.toFixed(2);
    totalCells[6].textContent = totalCalories.toFixed(2);

    // Итого на 100 г
    const footerRow = document.querySelector('table thead:last-of-type tr');
    const footerCells = footerRow.querySelectorAll('th, td');
    footerCells[3].textContent = (totalProteins / totalWeight * 100).toFixed(2);
    footerCells[4].textContent = (totalFats / totalWeight * 100).toFixed(2);
    footerCells[5].textContent = (totalCarbs / totalWeight * 100).toFixed(2);
    footerCells[6].textContent = (totalCalories / totalWeight * 100).toFixed(2);
}

// Отправка формы
document.querySelector('.calorie__form').addEventListener('submit', e => {
    e.preventDefault();

    // Получаем значения из форм
    const query = productInput.value.trim();
    const grams = parseInt(numberInput.value) || 100;

    // Проверяем, что продукт выбран из списка
    const selectedProduct = products.find(p => p.name === query);

    if (selectedProduct && grams > 0) {
        addProductToTable({ ...selectedProduct, weight: grams });
        productInput.value = '';
        numberInput.value = '';
    } else {
        alert("Выберите продукт из списка и укажите корректный вес.");
    }
});