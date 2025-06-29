// Добавьте этот код в ваш modules.js

// Мобильный календарь класс
export class MobileCustomCalendar {
    constructor(inputElement, calendarElement, options = {}) {
        this.input = inputElement;
        this.calendar = calendarElement;
        this.overlay = this.createOverlay();
        this.options = options;
        this.selectedDate = null;
        this.currentDate = new Date();
        this.isOpen = false;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }

    createOverlay() {
        let overlay = document.getElementById('calendarOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'calendarOverlay';
            overlay.className = 'calendar-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9998;
                display: none;
            `;
            document.body.appendChild(overlay);
        }
        return overlay;
    }

    init() {
        this.addMobileStyles();
        this.createCalendar();
        this.bindEvents();
        
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
        });
    }

    addMobileStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .custom-date-input {
                -webkit-tap-highlight-color: transparent;
                font-size: 16px !important; /* Предотвращает зум на iOS */
                -webkit-appearance: none;
                -moz-appearance: none;
            }

            .calendar-day {
                min-height: 44px !important;
                min-width: 44px !important;
            }

            .calendar-nav {
                min-width: 44px !important;
                min-height: 44px !important;
                padding: 12px !important;
            }

            @media (max-width: 768px) {
                .custom-calendar {
                    position: fixed !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    width: 90vw !important;
                    max-width: 320px !important;
                    margin-top: 0 !important;
                    z-index: 9999 !important;
                }

                .calendar-overlay.active {
                    display: block !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        // Поддержка touch и click событий
        const openEvents = ['click', 'touchstart'];
        
        openEvents.forEach(eventType => {
            this.input.addEventListener(eventType, (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggle();
            }, { passive: false });
        });

        // События календаря
        ['click', 'touchstart'].forEach(eventType => {
            this.calendar.addEventListener(eventType, (e) => {
                this.handleCalendarEvent(e);
            }, { passive: false });
        });

        // Закрытие по overlay
        ['click', 'touchstart'].forEach(eventType => {
            this.overlay.addEventListener(eventType, () => {
                this.close();
            });
        });

        // Закрытие для desktop
        document.addEventListener('click', (e) => {
            if (!this.calendar.contains(e.target) && 
                e.target !== this.input && 
                !this.isMobile) {
                this.close();
            }
        });

        // Блокируем скролл при открытом календаре на мобильных
        document.addEventListener('touchmove', (e) => {
            if (this.isOpen && this.isMobile) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    handleCalendarEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.target.classList.contains('calendar-nav')) {
            const action = e.target.dataset.action;
            if (action === 'prev') {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            } else if (action === 'next') {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            }
            this.createCalendar();
        }

        if (e.target.classList.contains('calendar-day') && 
            !e.target.classList.contains('disabled') && 
            !e.target.classList.contains('other-month')) {
            
            const dateStr = e.target.dataset.date;
            const [year, month, day] = dateStr.split('-').map(Number);
            this.selectedDate = new Date(year, month, day);
            
            this.input.value = this.formatDate(this.selectedDate);
            this.close();
            
            if (this.options.onChange) {
                this.options.onChange(this.selectedDate);
            }
        }
    }

    createCalendar() {
        const today = new Date();
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Получаем локализацию из localStorage
        const clientLang = localStorage.getItem('clientLang') || 'english';
        const monthNames = this.getMonthNames(clientLang);
        const dayNames = this.getDayNames(clientLang);

        this.calendar.innerHTML = `
            <div class="calendar-header">
                <button class="calendar-nav" data-action="prev">‹</button>
                <div class="calendar-month">${monthNames[month]} ${year}</div>
                <button class="calendar-nav" data-action="next">›</button>
            </div>
            <div class="calendar-weekdays">
                ${dayNames.map(day => `<div class="calendar-weekday">${day}</div>`).join('')}
            </div>
            <div class="calendar-days">
                ${this.generateDays(year, month)}
            </div>
        `;
    }

    getMonthNames(lang) {
        const months = {
            'english': ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'],
            'russian': ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                       'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            'thai': ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
        };
        return months[lang] || months['english'];
    }

    getDayNames(lang) {
        const days = {
            'english': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            'russian': ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            'thai': ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']
        };
        return days[lang] || days['english'];
    }

    generateDays(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const today = new Date();
        
        let mondayStart = firstDay.getDay() - 1;
        if (mondayStart < 0) mondayStart = 6;

        let html = '';
        
        // Дни предыдущего месяца
        const prevMonth = new Date(year, month - 1, 0);
        for (let i = mondayStart - 1; i >= 0; i--) {
            const day = prevMonth.getDate() - i;
            html += `<div class="calendar-day other-month disabled">${day}</div>`;
        }

        // Дни текущего месяца
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const currentDay = new Date(year, month, day);
            const isToday = currentDay.toDateString() === today.toDateString();
            const isPast = currentDay < today.setHours(0,0,0,0);
            const isSelected = this.selectedDate && currentDay.toDateString() === this.selectedDate.toDateString();
            
            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (isPast) classes += ' disabled';
            if (isSelected) classes += ' selected';

            html += `<div class="${classes}" data-date="${year}-${month}-${day}">${day}</div>`;
        }

        // Дни следующего месяца
        const totalCells = mondayStart + lastDay.getDate();
        const remainingCells = 42 - totalCells;
        for (let day = 1; day <= remainingCells && day <= 14; day++) {
            html += `<div class="calendar-day other-month disabled">${day}</div>`;
        }

        return html;
    }

    formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    open() {
        this.calendar.style.display = 'block';
        if (this.isMobile) {
            this.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        this.isOpen = true;
        this.createCalendar();
    }

    close() {
        this.calendar.style.display = 'none';
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    setMinDate(date) {
        this.minDate = date;
        if (this.isOpen) {
            this.createCalendar();
        }
    }
}

// Функция инициализации мобильного календаря для турниров
export function initializeMobileCalendarForTournaments() {
    const dateFromInput = document.getElementById('dateFromInput');
    const dateUntilInput = document.getElementById('dateUntilInput');
    
    // Создаем контейнеры для календарей, если их нет
    let calendarFrom = document.getElementById('calendarFrom');
    let calendarUntil = document.getElementById('calendarUntil');
    
    if (!calendarFrom) {
        calendarFrom = document.createElement('div');
        calendarFrom.id = 'calendarFrom';
        calendarFrom.className = 'custom-calendar';
        dateFromInput.parentNode.appendChild(calendarFrom);
    }
    
    if (!calendarUntil) {
        calendarUntil = document.createElement('div');
        calendarUntil.id = 'calendarUntil';
        calendarUntil.className = 'custom-calendar';
        dateUntilInput.parentNode.appendChild(calendarUntil);
    }

    // Инициализируем календари
    const calendarFromInstance = new MobileCustomCalendar(dateFromInput, calendarFrom, {
        onChange: function(date) {
            calendarUntilInstance.setMinDate(date);
            
            if (calendarUntilInstance.selectedDate && calendarUntilInstance.selectedDate < date) {
                dateUntilInput.value = '';
                calendarUntilInstance.selectedDate = null;
                showMobileNotification('End date was cleared because it was earlier than start date');
            }
            
            // Вызываем фильтрацию турниров
            if (typeof filterTournaments === 'function') {
                filterTournaments();
            }
        }
    });

    const calendarUntilInstance = new MobileCustomCalendar(dateUntilInput, calendarUntil, {
        onChange: function(date) {
            if (calendarFromInstance.selectedDate && date < calendarFromInstance.selectedDate) {
                showMobileNotification('End date cannot be earlier than start date');
                dateUntilInput.value = '';
                calendarUntilInstance.selectedDate = null;
                return;
            }
            
            // Вызываем фильтрацию турниров
            if (typeof filterTournaments === 'function') {
                filterTournaments();
            }
        }
    });

    return { calendarFromInstance, calendarUntilInstance };
}

// Функция для показа мобильных уведомлений
function showMobileNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ff6b35;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        animation: slideInTop 0.3s ease-out;
        max-width: 90vw;
        text-align: center;
    `;

    // Добавляем стили анимации, если их еще нет
    if (!document.getElementById('mobile-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'mobile-notification-styles';
        style.textContent = `
            @keyframes slideInTop {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            @keyframes slideOutTop {
                from { transform: translateX(-50%) translateY(0); opacity: 1; }
                to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutTop 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}