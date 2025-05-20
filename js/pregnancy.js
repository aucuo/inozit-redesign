document.addEventListener("DOMContentLoaded", function () {
    const options = document.getElementById('stepOptions');
    const stepDate = document.getElementById('stepDate');
    const stepResult = document.getElementById('stepResult');
    const infoBlock = document.getElementById('infoBlock');
    const dateTitle = document.getElementById('dateTitle');
    const dateInput = document.getElementById('dateInput');
    const calculateBtn = document.getElementById('calculateBtn');

    const dueDateEl = document.getElementById('dueDate');
    const weekEl = document.getElementById('week');
    const factEl = document.getElementById('fact');
    const illustrationEl = document.getElementById('illustration');

    // Пример фактов
    const weekFacts = {
        2: "Крохи пока нет, он еще не зачат",
        3: "Произошло зачатие ребенка",
        4: "Эмбрион перешел к формированию лепестков",
        5: "Кроха размером с семя кунжута",
        6: "Кроха размером с горошинку",
        7: "Кроха размером с чернику",
        8: "Кроха размером с малину",
        9: "Кроха размером с виноградинку",
        10: "Кроха размером со сливу",
        11: "Кроха размером с инжир",
        12: "Кроха размером с лайм",
        13: "Кроха размером с нектарин",
        14: "Кроха размером с яблочко",
        15: "Кроха размером с лимон",
        16: "Кроха размером с авокадо",
        17: "Кроха размером с апельсин",
        18: "Кроха размером с грушу",
        19: "Кроха размером с томат",
        20: "Кроха размером с банан",
        21: "Кроха размером с гранат",
        22: "Кроха размером с папайю",
        23: "Кроха размером с манго",
        24: "Кроха размером с грейпфрут",
        25: "Кроха размером с капусту",
        26: "Кроха размером с кукурузу",
        27: "Кроха размером со свёклу",
        28: "Кроха размером с баклажан",
        29: "Кроха размером с брокколи",
        30: "Кроха размером с капусту",
        31: "Кроха размером с кокос",
        32: "Кроха размером с кабачок",
        33: "Кроха размером с ананас",
        34: "Кроха размером с дыню",
        35: "Кроха размером с дыню",
        36: "Кроха размером с головку салата",
        37: "Кроха размером с тыкву",
        38: "Кроха размером с дыню",
        39: "Кроха размером с дыню",
        40: "Кроха размером с арбуз"
    };

    // Парсинг URL-параметров
    const urlParams = new URLSearchParams(window.location.search);
    const step = urlParams.get('step'); // 'options', 'date', 'result'
    const type = urlParams.get('type'); // 'lmp' или 'conception'
    const dateStr = urlParams.get('date'); // формат 'dd.MM.yyyy'

    // Скрыть все шаги
    options.style.display = 'none';
    stepDate.style.display = 'none';
    stepResult.style.display = 'none';
    infoBlock.style.display = 'none';

    // Показываем нужный этап
    if (step === 'result') {
        // Если результат — сразу показываем
        showResult();
        showDateStep(type);
        infoBlock.style.display = 'flex';
    } else if (step === 'date' && type) {
        // Если этап с датой и тип выбран
        showDateStep(type);
    } else {
        // По умолчанию — показываем выбор метода
        options.style.display = 'flex';
    }

    // Функция: показать форму ввода даты
    function showDateStep(selectedType) {
        if (selectedType === 'lmp') {
            dateTitle.textContent = 'Дата начала последнего менструального цикла';
        } else {
            dateTitle.textContent = 'Предполагаемая дата зачатия';
        }

        // Заполняем дату, если указана
        if (dateStr) {
            dateInput.value = dateStr;
        }

        options.style.display = 'none';
        stepDate.style.display = 'flex';
    }

    // Функция: показать результат
    function showResult() {
        if (!type || !dateStr) {
            alert('Для отображения результата нужны тип и дата.');
            return;
        }

        const [day, month, year] = dateStr.split('.');
        const selectedDate = new Date(`${year}-${month}-${day}`);

        if (isNaN(selectedDate)) {
            alert('Неверный формат даты.');
            return;
        }

        let dueDate, week;

        if (type === 'lmp') {
            dueDate = new Date(selectedDate);
            dueDate.setDate(dueDate.getDate() + 280);

            const now = new Date();
            const diffDays = Math.floor((now - selectedDate) / (1000 * 60 * 60 * 24));
            week = Math.floor(diffDays / 7) + 1;
        } else {
            dueDate = new Date(selectedDate);
            dueDate.setDate(dueDate.getDate() + 266);

            const now = new Date();
            const diffDays = Math.floor((now - selectedDate) / (1000 * 60 * 60 * 24));
            week = Math.floor(diffDays / 7) + 1;
        }

        if (week < 2 || week > 40) {
            alert('Недопустимый срок беременности.');
            return;
        }

        // Форматируем дату как DD.MM.YYYY
        const formatter = new Intl.DateTimeFormat('ru-RU');
        const formattedDueDate = formatter.format(dueDate);

        dueDateEl.textContent = formattedDueDate;
        weekEl.textContent = `${week} неделя`;
        factEl.textContent = weekFacts[week] || 'Информация о размере малыша пока недоступна.';
        illustrationEl.src = `./img/content/pregnancy/pregnancy-illustration-${Math.min(week, 40)}.svg`;

        stepDate.style.display = 'flex';
        stepResult.style.display = 'flex';
        infoBlock.style.display = 'flex';
    }

    // Обработчики кнопок "Выбор метода"
    document.querySelectorAll('.pregnancy__option').forEach(option => {
        option.addEventListener('click', () => {
            const type = option.getAttribute('data-type');
            window.location.href = `?step=date&type=${type}`;
        });
    });

    // Обработка нажатия на "Рассчитать"
    calculateBtn.addEventListener('click', () => {
        const rawDate = dateInput.value.trim();
        if (!rawDate) return;

        const [day, month, year] = rawDate.split('.');
        const selectedDate = new Date(`${year}-${month}-${day}`);

        if (isNaN(selectedDate)) {
            alert('Введите корректную дату.');
            return;
        }

        // Форматируем дату обратно в dd.MM.yyyy
        const formattedDate = `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;

        const isLMP = dateTitle.textContent.includes("начала последнего");
        let week;

        const now = new Date();
        const diffDays = Math.floor((now - selectedDate) / (1000 * 60 * 60 * 24));
        week = Math.floor(diffDays / 7) + 1;

        if (week < 2 || week > 40) {
            alert('Невозможная неделя беременности. Пожалуйста, проверьте введённую дату.');
            return;
        }

        // Перенаправление с данными
        window.location.href = `?step=result&type=${isLMP ? 'lmp' : 'conception'}&date=${formattedDate}&week=${week}`;
    });

    // Повторный расчет
    document.querySelector('.pregnancy__btn--repeat')?.addEventListener('click', () => {
        window.location.href = `?step=options`;
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');

    getCurrentWeekFromURL();

    // Получаем текущую неделю из URL
    function getCurrentWeekFromURL() {
        const params = new URLSearchParams(window.location.search);
        let week = parseInt(params.get('week')) || 21; // по умолчанию 21
        const btnPrev = document.getElementById('btnPrev');
        const btnNext = document.getElementById('btnNext');

        // Скрываем/показываем кнопки
        btnPrev.style.opacity = (week > 2) ? '1' : '0';
        btnNext.style.opacity = (week < 40) ? '1' : '0';
        btnPrev.disabled = week <= 2;
        btnNext.disabled = week >= 40;
        return Math.min(40, Math.max(2, week)); // ограничиваем диапазон 2–40
    }

    // Обновляем заголовок и URL
    function updateInfoContent(week) {
        // Обновляем URL: сохраняем все параметры, меняем только week
        const url = new URL(window.location.href);

        if (week >= 2 && week <= 40) {
            url.searchParams.set('week', week);
        } else {
            url.searchParams.delete('week');
        }

        // Перезагружаем страницу с новым week
        window.location.href = url.toString();
    }
    // Навигация ←
    btnPrev.addEventListener('click', () => {
        let currentWeek = getCurrentWeekFromURL();
        if (currentWeek > 2) {
            updateInfoContent(currentWeek - 1);
        }
    });

    // Навигация →
    btnNext.addEventListener('click', () => {
        let currentWeek = getCurrentWeekFromURL();
        if (currentWeek < 40) {
            updateInfoContent(currentWeek + 1);
        }
    });
});