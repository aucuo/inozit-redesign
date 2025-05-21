document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.imt__form');
    const heightInput = form.querySelector('input[name="height"]');
    const weightInput = form.querySelector('input[name="weight"]');
    const resultBlock = document.querySelector('.imt__result');
    const resultText = document.querySelector('.imt__result-text');
    const repeatBtn = document.querySelector('.imt__btn--repeat');

    // SVG иконки
    const iconGreen = document.querySelector('.imt__result-icon--green');
    const iconRed = document.querySelector('.imt__result-icon--red');

    function calculateIMT(height, weight) {
        if (!height || !weight || height <= 0 || weight <= 0) return null;

        const heightMeters = height / 100;
        const imt = weight / (heightMeters ** 2);
        return imt.toFixed(1);
    }

    function getIMTCategory(imt) {
        if (imt <= 16) {
            return 'Выраженный дефицит массы тела';
        } else if (imt <= 18.5) {
            return 'Недостаточная (дефицит) масса тела';
        } else if (imt <= 25) {
            return 'Норма';
        } else if (imt <= 30) {
            return 'Выше нормы';
        } else if (imt <= 35) {
            return 'Ожирение I степени';
        } else if (imt <= 40) {
            return 'Ожирение II степени';
        } else {
            return 'Ожирение III степени (морбидное)';
        }
    }

    function showResult(imt, category) {
        resultText.textContent = `${imt} — ${category}`;
        resultBlock.style.display = 'flex';
        form.style.display = 'none';

        // Показываем нужную иконку
        if (category === 'Норма') {
            iconGreen.style.display = 'block';
            iconRed.style.display = 'none';
        } else {
            iconGreen.style.display = 'none';
            iconRed.style.display = 'block';
        }

        highlightTableRow(category);
    }

    [heightInput, weightInput].map(input => {
        input.addEventListener('input', function (e) {
            if (this.value.length > 3) this.value = this.value.slice(0, 3)
        })
    })

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        const imt = calculateIMT(height, weight);

        if (!imt) {
            alert('Введите корректные значения роста и веса.');
            return;
        }

        const category = getIMTCategory(parseFloat(imt));
        showResult(imt, category);
    });

    repeatBtn.addEventListener('click', () => {
        // form.reset();
        resultText.textContent = '';
        resultBlock.style.display = 'none';
        form.style.display = 'flex';

        iconGreen.style.display = 'none';
        iconRed.style.display = 'none';

        removeHighlight();
    });

    const tableRows = document.querySelectorAll('tr[data-category]');
    function highlightTableRow(category) {
        removeHighlight();

        tableRows.forEach(row => {
            if (row.getAttribute('data-category') === category) {
                row.setAttribute('data-highlighted', '');
            }
        });
    }

    function removeHighlight() {
        tableRows.forEach(row => {
            row.removeAttribute('data-highlighted');
        });
    }
});