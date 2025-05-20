
document.addEventListener("DOMContentLoaded", function () {
    calendarForm();
    claendarMask();
});

function claendarMask() {
    const input = document.querySelector('.js-calendar-input');

    if (!input)
        return;

    // Применяем маску с помощью IMask
    const maskOptions = {
        mask: '00.00.0000'
    };

    const mask = IMask(input, maskOptions);
}

function calendarForm() {
    const buttons = document.querySelectorAll('.calendar-form .js-calendar');
    if (!buttons.length) return;

    buttons.forEach(button => {
        const container = button.closest('.calendar-form');
        const input = container.querySelector('.js-calendar-input');
        const datePickerEl = container.querySelector('.datepicker-here');

        const picker = new AirDatepicker(input, {
            container: datePickerEl,
            position(){},
            prevHtml: `
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9998 2.6665C8.63604 2.6665 2.6665 8.63604 2.6665 15.9998C2.6665 23.3636 8.63604 29.3332 15.9998 29.3332C23.3636 29.3332 29.3332 23.3636 29.3332 15.9998C29.3332 8.63604 23.3636 2.6665 15.9998 2.6665ZM18.2756 20.9422C18.7638 20.454 18.7947 19.6817 18.3674 19.158L18.2756 19.0575L15.2189 15.9998L18.2756 12.9422L18.3674 12.8416C18.7947 12.3179 18.7638 11.5457 18.2756 11.0575C17.7873 10.5692 17.0151 10.5383 16.4914 10.9657L16.3908 11.0575L12.7404 14.7069L12.6144 14.8455C12.0287 15.5637 12.071 16.6234 12.7404 17.2928L16.3908 20.9422L16.4914 21.034C17.0151 21.4613 17.7873 21.4304 18.2756 20.9422Z" fill="#FF5A90"/>
                </svg>
            `,
            nextHtml: `
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9998 2.6665C8.63604 2.6665 2.6665 8.63604 2.6665 15.9998C2.6665 23.3636 8.63604 29.3332 15.9998 29.3332C23.3636 29.3332 29.3332 23.3636 29.3332 15.9998C29.3332 8.63604 23.3636 2.6665 15.9998 2.6665ZM13.7241 11.0575C13.2034 11.5782 13.2034 12.4215 13.7241 12.9422L16.7817 15.9998L13.7241 19.0575L13.6323 19.158C13.205 19.6817 13.2359 20.454 13.7241 20.9422C14.2123 21.4304 14.9846 21.4613 15.5083 21.034L15.6089 20.9422L19.23 17.3211L19.3589 17.1795C19.9575 16.4453 19.9142 15.3629 19.23 14.6785L15.6089 11.0575C15.0882 10.5368 14.2448 10.5368 13.7241 11.0575Z" fill="#FF5A90"/>
                </svg>
            `,
            onShow: () => {
                button.textContent = 'Закрыть';
            },
            onHide: () => {
                button.textContent = 'Календарь';
            },
            onSelect: () => {
                picker.hide();
            }
        });

        // Переключаем активное состояние кнопки
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // предотвращаем клик вне
            button.classList.toggle('active');

            if (picker.visible)
                picker.hide();
            else
                picker.show();
        });

        // Закрытие по клику вне области
        document.addEventListener('click', (e) => {
            const isClickInside = container.contains(e.target);
            if (!isClickInside && picker.visible) {
                picker.hide();
                button.classList.remove('active');
            }
        });

        // Закрытие по Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && picker.visible) {
                picker.hide();
                button.classList.remove('active');
            }
        });
    });
}