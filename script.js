/* ===========================
   Интерактивність Фону
   =========================== */

// Отримуємо елементи Загального Фону
const gradientElement = document.getElementById('gradient');
const lights = document.querySelectorAll('.page__light');

// Змінні для відстеження позиції курсора
let mouseX = 0;
let mouseY = 0;

// Ітегровані значення для плавного руху
let smoothX = 0;
let smoothY = 0;

/* ===========================
   Відслідкування Руху Курсора
   =========================== */

document.addEventListener('mousemove', (e) => {
    // Отримуємо позицію курсора відносно вікна
    mouseX = e.clientX;
    mouseY = e.clientY;
});

document.addEventListener('mouseleave', () => {
    // Повертаємось до центру, коли курсор покидає вікно
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
});

/* ===========================
   Анімаційний Цикл
   =========================== */

function animateFrame() {
    // Плавна інтерполяція (easing) для натурального руху
    smoothX += (mouseX - smoothX) * 0.08;
    smoothY += (mouseY - smoothY) * 0.08;

    // Обчислюємо відсоток позиції курсора (0 до 1)
    const percentX = smoothX / window.innerWidth;
    const percentY = smoothY / window.innerHeight;

    // Динамічний градієнт, що слідує за курсором
    const gradientX = 30 + percentX * 40; // від 30% до 70%
    const gradientY = 40 + percentY * 30; // від 40% до 70%

    gradientElement.style.background = `
        radial-gradient(
            circle at ${gradientX}% ${gradientY}%,
            rgba(0, 212, 255, 0.08) 0%,
            rgba(0, 153, 204, 0.04) 25%,
            var(--dark-bg) 100%
        ),
        linear-gradient(
            135deg,
            var(--dark-bg) 0%,
            #1a1a2e 50%,
            var(--dark-bg) 100%
        )
    `;

    // Рухаємо світлові ефекти слідом за курсором
    lights.forEach((light, index) => {
        const moveX = (percentX - 0.5) * (30 + index * 20);
        const moveY = (percentY - 0.5) * (30 + index * 20);

        light.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
    });

    // Продовжуємо анімацію в наступному фреймі
    requestAnimationFrame(animateFrame);
}

// Стартуємо анімаційний цикл
animateFrame();

/* ===========================
   Взаємодія з Кнопкою
   =========================== */

const button = document.querySelector('.hero__button');

button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Додаємо блиск ефект під курсором
    button.style.backgroundImage = `
        radial-gradient(
            circle at ${x}px ${y}px,
            rgba(0, 212, 255, 0.3),
            transparent 50%
        )
    `;
});

button.addEventListener('mouseleave', () => {
    button.style.backgroundImage = 'none';
});

const scrollButton = document.getElementById('scrollToSkills');
scrollButton.addEventListener('click', () => {
    const skillsSection = document.querySelector('.skills');
    skillsSection.scrollIntoView({ behavior: 'smooth' });
});

/* ===========================
   Оптимізація для Мобільних
   =========================== */

// Отримуємо ширину вікна для обчислень
window.addEventListener('resize', () => {
    // Центруємо позицію курсора, якщо вікно змінило розмір
    if (window.innerWidth < 768) {
        mouseX = window.innerWidth / 2;
        mouseY = window.innerHeight / 2;
    }
});

// Для сенсорних пристроїв - рухаємо фон за дотиком
if (window.matchMedia('(hover: none)').matches) {
    document.addEventListener('touchmove', (e) => {
        // Використовуємо усередненість дотиків більш обережно
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', () => {
        // Повертаємось до центру
        mouseX = window.innerWidth / 2;
        mouseY = window.innerHeight / 2;
    });
}

console.log('✓ Інтерактивна hero-секція завантажена успішно!');

/* ===========================
   Управління Навичками
   =========================== */

// Стандартні навички
const DEFAULT_SKILLS = [
    {
        id: Date.now() + 1,
        title: 'JavaScript',
        description: 'Сучасний JavaScript з фокусом на ES6+, асинхронне програмування та DOM маніпуляція.'
    },
    {
        id: Date.now() + 2,
        title: 'HTML & CSS',
        description: 'Семантичний HTML, responsивний дизайн, grid, flexbox та сучасні CSS техніки.'
    },
    {
        id: Date.now() + 3,
        title: 'React',
        description: 'Компонентна архітектура, hooks, state management та оптимізація перформансу.'
    },
    {
        id: Date.now() + 4,
        title: 'Node.js',
        description: 'Backend розробка, REST API, middleware та робота з базами даних.'
    }
];

const STORAGE_KEY = 'portfolioSkills';

class SkillsManager {
    constructor() {
        this.skillsGrid = document.getElementById('skillsGrid');
        this.addSkillBtn = document.getElementById('addSkillBtn');
        this.skills = this.loadSkills();
        
        this.addSkillBtn.addEventListener('click', () => this.addSkill());
        this.render();
    }

    loadSkills() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : DEFAULT_SKILLS;
    }

    saveSkills() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.skills));
    }

    addSkill() {
        const title = prompt('Введіть назву навички:');
        if (!title || title.trim() === '') return;

        const description = prompt('Введіть коротко опис навички:');
        if (description === null) return;

        const newSkill = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim() || 'Опис невказано'
        };

        this.skills.push(newSkill);
        this.saveSkills();
        this.render();
        console.log('✓ Навичка додана:', newSkill.title);
    }

    deleteSkill(id) {
        this.skills = this.skills.filter(skill => skill.id !== id);
        this.saveSkills();
        this.render();
        console.log('✓ Навичка видалена');
    }

    toggleSkill(id) {
        const card = document.querySelector(`[data-skill-id="${id}"]`);
        if (card) {
            card.classList.toggle('expanded');
        }
    }

    render() {
        this.skillsGrid.innerHTML = '';
        
        this.skills.forEach(skill => {
            const card = document.createElement('div');
            card.className = 'skill-card';
            card.setAttribute('data-skill-id', skill.id);
            
            card.innerHTML = `
                <div class="skill-card__header">
                    <h3 class="skill-card__title">${this.escapeHtml(skill.title)}</h3>
                    <span class="skill-card__toggle">▼</span>
                </div>
                <p class="skill-card__description">${this.escapeHtml(skill.description)}</p>
                <div class="skill-card__details">
                    <button class="skill-card__delete-btn" data-skill-id="${skill.id}">Видалити навичку</button>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.closest('.skill-card__delete-btn')) return;
                this.toggleSkill(skill.id);
            });

            const deleteBtn = card.querySelector('.skill-card__delete-btn');
            deleteBtn.addEventListener('click', () => this.deleteSkill(skill.id));

            this.skillsGrid.appendChild(card);
        });
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, char => map[char]);
    }
}

const skillsManager = new SkillsManager();
console.log('✓ Система навичок завантажена успішно!');