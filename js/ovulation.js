

document.addEventListener('DOMContentLoaded', function () {
    calculatorOvulation();
})

function initBecomeMomCalendar() {
    var calendarEl = document.getElementById('calendar-result');
    var memory = {
        events: []
    };

    const monthMap = {
        'January': 'Январь',
        'February': 'Февраль',
        'March': 'Март',
        'April': 'Апрель',
        'May': 'Май',
        'June': 'Июнь',
        'July': 'Июль',
        'August': 'Август',
        'September': 'Сентябрь',
        'October': 'Октябрь',
        'November': 'Ноябрь',
        'December': 'Декабрь'
    };

    if (calendarEl) {
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'ru',
            height: 'auto',
            headerToolbar: {
                left: '',
                center: 'prev,title,next',
                right: ''
            },
            firstDay: 1,
            datesSet: function (event) {
                var titleArr = event.view.title.split(' ');
                var titleEl = calendar.el.querySelector('.fc-toolbar-title');
                if (titleArr.length >= 2) {
                    const monthEn = titleArr[0];
                    const monthRu = monthMap[monthEn] || monthEn;
                    titleEl.innerHTML = `<span><span>${monthRu}</span>, <span class="title-year">${titleArr[1]}</span></span>`;
                }

                const prevBtn = calendarEl.querySelector('.fc-prev-button');
                const nextBtn = calendarEl.querySelector('.fc-next-button');

                prevBtn.innerHTML = `
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.9995 2.66675C23.3632 2.66675 29.3333 8.63611 29.3335 15.9998C29.3335 23.3636 23.3633 29.3337 15.9995 29.3337C8.63586 29.3336 2.6665 23.3634 2.6665 15.9998C2.66668 8.63622 8.63597 2.66692 15.9995 2.66675ZM18.2759 11.0574C17.7877 10.5692 17.0154 10.5395 16.4917 10.9666L16.3901 11.0574L12.7407 14.7068L12.6147 14.8464C12.0294 15.5645 12.0716 16.6235 12.7407 17.2927L16.3901 20.9431C16.9108 21.4637 17.7552 21.4636 18.2759 20.9431C18.7965 20.4224 18.7965 19.5781 18.2759 19.0574L15.2183 15.9998L18.2759 12.9431L18.3667 12.8416C18.7938 12.3179 18.764 11.5455 18.2759 11.0574Z" fill="#FF5A90"/>
                    </svg>
                `;

                nextBtn.innerHTML = `
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.9995 2.66675C23.3632 2.66675 29.3333 8.63611 29.3335 15.9998C29.3335 23.3636 23.3633 29.3337 15.9995 29.3337C8.63586 29.3336 2.6665 23.3634 2.6665 15.9998C2.66668 8.63622 8.63597 2.66692 15.9995 2.66675ZM15.5073 10.9666C14.9837 10.5395 14.2123 10.5694 13.7241 11.0574C13.236 11.5455 13.2052 12.3179 13.6323 12.8416L13.7241 12.9431L16.7808 15.9998L13.7241 19.0574L13.6323 19.1589C13.2053 19.6826 13.236 20.455 13.7241 20.9431C14.2122 21.4309 14.9837 21.4608 15.5073 21.0339L15.6089 20.9431L19.23 17.322L19.3589 17.1794C19.9574 16.4453 19.9142 15.3627 19.23 14.6785L15.6089 11.0574L15.5073 10.9666Z" fill="#FF5A90"/>
                    </svg>
                `;

                setTimeout(function () {
                    var days = Array.prototype.slice.call(calendar.el.querySelectorAll('.fc-daygrid-day.fc-day'));

                    days.forEach(function (day) {
                        var event1 = day.querySelector('.fc-event.fertile-day');
                        var event2 = day.querySelector('.fc-event.ovulation-day');

                        if (event1 || event2) {
                            day.classList.add('fc-has-event');
                        }
                    });
                }, 0);
            }
        });
    }

    return {
        calendar: calendar,
        memory: memory
    };
}

function calculatorOvulation() {
    var cld = initBecomeMomCalendar();
    var calendar = cld.calendar;
    var memory = cld.memory;
    var step = 6;
    var maxMonth;

    $('.ovulation').on('click', '.fc-next-button', function (e) {
        var self = this;
        var $parent = $(self).closest('.ovulation');
        var form = $parent.find('.js-ovulation-form')[0];
        var cDuration = +form.querySelector('[name="c-duration"]').value;
        var mDuration = +form.querySelector('[name="m-duration"]').value;
        var cFirstDay = moment(form.querySelector('[name="c-first-day"]').value, 'DD.MM.YYYY');

        if (cDuration && mDuration && cFirstDay.isValid()) {
            var montsCount = Math.ceil(moment(calendar.getDate()).diff(cFirstDay, 'months', true));

            if (montsCount % 4 === 0 && montsCount > maxMonth) {
                maxMonth = montsCount;
                getEvents(cDuration, mDuration, cFirstDay.toDate(), step);
                showResultCalendar($parent, calcCalendarEvents(cDuration, step));
            }
        }
    });

    $('.js-ovulation-form').on('submit', function (e) {
        e.preventDefault();
        var self = this;
        var $parent = $(self).closest('.ovulation');
        var cDuration = +self.querySelector('[name="c-duration"]').value;
        var mDuration = +self.querySelector('[name="m-duration"]').value;
        var cFirstDay = moment(self.querySelector('[name="c-first-day"]').value, 'DD.MM.YYYY');

        if (memory.events.length) {
            memory.events.length = 0;

            calendar.getEvents().forEach(function (event) {
                event.remove();
            });
        }

        if (cDuration && mDuration && cFirstDay.isValid()) {
            calendar.gotoDate(cFirstDay.toDate());
            var montsCount = Math.ceil(moment(calendar.getDate()).diff(cFirstDay, 'months', true));

            if (montsCount >= 0) {
                maxMonth = montsCount;
                getEvents(cDuration, mDuration, cFirstDay.toDate(), step);
                showResultCalendar($parent, calcCalendarEvents(cDuration, step));
            }
        }
    });

    function calcCalendarEvents(cDuration, step) {
        var monthRender = step || 1;

        return function () {
            memory.events.forEach(function (event, i) {
                if (typeof event === 'object' && event !== null && i >= memory.events.length - cDuration * monthRender) {
                    calendar.addEvent(event);
                }
            });

            calendar.render();
        };
    }

    function getEvents(cycDuration, minsDuration, cycFirstDay, step) {
        var d = Array(cycDuration);
        var monthRender = step || 1;
        var k = memory.events.length;
        k = k ? k + 1 : k;

        for (var j = 0; j < cycDuration; j++) {
            if (j >= cycDuration - 18 && j < cycDuration - 11 - 4 || j > cycDuration - 11 - 4 && j < cycDuration - 11) {
                d[j] = 'fertile-day';
            }

            if (j < minsDuration) {
                d[j] = 'menstruation-day';
            }

            if (j === cycDuration - 11 - 4) {
                d[j] = 'ovulation-day';
            }
        }

        for (var i = 0; i < monthRender; i++) {
            for (var j = 0; j < cycDuration; j++) {
                if (d[j]) {
                    var event = getEvent(k, d[j], cycFirstDay);
                    memory.events.push(event);
                } else if (j === cycDuration - 1) {
                    memory.events.push('last');
                } else {
                    memory.events.push(null);
                }
                k++;
            }
        }
    }

    function getEvent(k, clsName, cycFirstDay) {
        return {
            id: k,
            start: moment(cycFirstDay, 'DD.MM.YYYY').add(k, 'days').format('YYYY-MM-DD'),
            end: moment(cycFirstDay, 'DD.MM.YYYY').add(k, 'days').format('YYYY-MM-DD'),
            display: clsName ? 'background' : 'none',
            classNames: clsName
        };
    }

    function reflow(element) {
        return element.offsetHeight;
    }

    function showResultCalendar($parent, cb) {
        if (!$parent.hasClass('result')) {
            if (calendar) {
                calendar.render();
                $(calendar.el).css('opacity', 0);
            }

            typeof cb === 'function' && cb();

            $parent.addClass('result').find('.calcualator__result').fadeIn(function () {
                if (calendar) {
                    calendar.render();
                    reflow(calendar.el);
                    $(calendar.el).css('opacity', 1);
                }
            });
        } else {
            typeof cb === 'function' && cb();
        }
    }
}