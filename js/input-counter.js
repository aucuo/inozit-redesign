document.querySelectorAll('.counter-el').forEach(counter => {
    const input = counter.querySelector('.counter-el__control');
    const btnDecr = counter.querySelector('.counter-el__btn--decr');
    const btnIncr = counter.querySelector('.counter-el__btn--incr');

    if (!input) return;

    const minValue = parseInt(input.getAttribute('min')) || 2;
    const maxValue = parseInt(input.getAttribute('max')) || 7;

    let value = parseInt(input.placeholder) || minValue;
    value = Math.max(minValue, Math.min(maxValue, value));
    input.value = value;

    function updateButtons() {
        btnDecr.disabled = value <= minValue;
        btnIncr.disabled = value >= maxValue;
    }

    updateButtons();

    // Функция для коррекции значения
    function sanitizeInput(rawValue) {
        // Оставляем только цифры
        const numericValue = rawValue.replace(/[^0-9]/g, '');

        // Парсим как число
        const numValue = parseInt(numericValue);

        if (isNaN(numValue)) return value; // если не число — оставляем предыдущее значение

        // Корректируем по границам
        return Math.max(minValue, Math.min(maxValue, numValue));
    }

    // Обработчики кнопок
    btnDecr.addEventListener('click', (e) => {
        e.preventDefault();
        if (value > minValue) {
            value--;
            input.value = value;
            updateButtons();
        }
    });

    btnIncr.addEventListener('click', (e) => {
        e.preventDefault();
        if (value < maxValue) {
            value++;
            input.value = value;
            updateButtons();
        }
    });

    // Разрешаем ввод, но НЕ делаем обработку сразу
    input.addEventListener('input', () => {
        // Можно добавить подсветку или класс, если нужно
    });

    // Проверяем и корректируем только при потере фокуса
    input.addEventListener('blur', () => {
        const correctedValue = sanitizeInput(input.value);
        input.value = correctedValue;
        value = correctedValue;
        updateButtons();
    });

    // Разрешаем вставку, но очищаем от нецифровых символов
    input.addEventListener('paste', (e) => {
        const pasteData = e.clipboardData.getData('text/plain');
        const numericData = pasteData.replace(/[^0-9]/g, '');
        document.execCommand('insertText', false, numericData);
        e.preventDefault();
    });
});