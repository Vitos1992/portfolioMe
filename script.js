/* =========================== Интерактивність Фону =========================== */

// Отримуємо елементи Загального Фону
const gradientElement = document.getElementById('gradient');
const lights = document.querySelectorAll('.page__light');

// Змінні для відстеження позиції курсора
let mouseX = 0;
let mouseY = 0;

// Ітегровані значення для плавного руху
let smoothX = 0;
let smoothY = 0;

/* =========================== Відслідкування Руху Курсора =========================== */

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

/* =========================== Анімаційний Цикл =========================== */

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

/* =========================== Взаємодія з Кнопкою =========================== */

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

/* =========================== Оптимізація для Мобільних =========================== */

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

/* =========================== Управління Навичками =========================== */

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
        const lang = localStorage.getItem('currentLanguage') || 'uk';
        
        const titlePrompt = lang === 'uk' 
            ? 'Введіть назву навички:' 
            : 'Enter skill name:';
        const descriptionPrompt = lang === 'uk' 
            ? 'Введіть коротко опис навички:' 
            : 'Enter skill description:';
        const noDescriptionMsg = lang === 'uk' 
            ? 'Опис невказано' 
            : 'No description provided';

        const title = prompt(titlePrompt);
        if (!title || title.trim() === '') return;

        const description = prompt(descriptionPrompt);
        if (description === null) return;

        const newSkill = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim() || noDescriptionMsg
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
        const lang = localStorage.getItem('currentLanguage') || 'uk';
        const deleteButtonText = lang === 'uk' ? 'Видалити навичку' : 'Delete skill';
        
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
                    <button class="skill-card__delete-btn" data-skill-id="${skill.id}">${deleteButtonText}</button>
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
window.skillsManager = skillsManager;
console.log('✓ Система навичок завантажена успішно!');

/* =========================== Управління Проектами =========================== */

const DEFAULT_PROJECTS = [
    {
        id: Date.now() + 100,
        title: 'Portfolio Website',
        description: 'Персональний веб-сайт портфоліо з інтерактивними секціями, адаптивним дизайном та темним режимом.',
        image: 'https://via.placeholder.com/400x200?text=Portfolio+Website',
        link: 'https://github.com'
    },
    {
        id: Date.now() + 101,
        title: 'Task Manager App',
        description: 'Додаток для керування завданнями з localStorage, фільтрацією та сортуванням.',
        image: 'https://via.placeholder.com/400x200?text=Task+Manager',
        link: 'https://github.com'
    },
    {
        id: Date.now() + 102,
        title: 'Weather Dashboard',
        description: 'Інтерактивна панель погоди з інтеграцією API, прогнозом та візуалізацією даних.',
        image: 'https://via.placeholder.com/400x200?text=Weather+Dashboard',
        link: 'https://github.com'
    }
];

const PROJECTS_STORAGE_KEY = 'portfolioProjects';

class ProjectsManager {
    constructor() {
        this.projectsGrid = document.getElementById('projectsGrid');
        this.addProjectBtn = document.getElementById('addProjectBtn');
        this.projects = this.loadProjects();
        
        this.addProjectBtn.addEventListener('click', () => this.addProject());
        this.render();
    }

    loadProjects() {
        const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : DEFAULT_PROJECTS;
    }

    saveProjects() {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(this.projects));
    }

    addProject() {
        const lang = localStorage.getItem('currentLanguage') || 'uk';
        
        const titlePrompt = lang === 'uk' 
            ? 'Введіть назву проекту:' 
            : 'Enter project name:';
        const descriptionPrompt = lang === 'uk' 
            ? 'Введіть опис проекту:' 
            : 'Enter project description:';
        const imagePrompt = lang === 'uk' 
            ? 'Введіть URL зображення (або залиште порожним):' 
            : 'Enter image URL (or leave empty):';
        const linkPrompt = lang === 'uk' 
            ? 'Введіть посилання на проект:' 
            : 'Enter project link:';
        const noDescriptionMsg = lang === 'uk' 
            ? 'Опис невказано' 
            : 'No description provided';

        const title = prompt(titlePrompt);
        if (!title || title.trim() === '') return;

        const description = prompt(descriptionPrompt);
        if (description === null) return;

        const image = prompt(imagePrompt);
        if (image === null) return;

        const link = prompt(linkPrompt);
        if (link === null) return;

        const newProject = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim() || noDescriptionMsg,
            image: image.trim() || 'https://via.placeholder.com/400x200?text=Project',
            link: link.trim() || 'https://github.com'
        };

        this.projects.push(newProject);
        this.saveProjects();
        this.render();
        console.log('✓ Проект додан:', newProject.title);
    }

    deleteProject(id) {
        this.projects = this.projects.filter(project => project.id !== id);
        this.saveProjects();
        this.render();
        console.log('✓ Проект видалений');
    }

    toggleProject(id) {
        const card = document.querySelector(`[data-project-id="${id}"]`);
        if (card) {
            card.classList.toggle('expanded');
        }
    }

    render() {
        this.projectsGrid.innerHTML = '';
        const lang = localStorage.getItem('currentLanguage') || 'uk';
        const deleteButtonText = lang === 'uk' ? 'Видалити проект' : 'Delete project';
        const viewProjectText = lang === 'uk' ? 'Переглянути проект' : 'View project';
        
        this.projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-project-id', project.id);
            
            card.innerHTML = `
                <img src="${this.escapeHtml(project.image)}" alt="${this.escapeHtml(project.title)}" class="project-card__image">
                <div class="project-card__content">
                    <div class="project-card__header">
                        <h3 class="project-card__title">${this.escapeHtml(project.title)}</h3>
                        <span class="project-card__toggle">▼</span>
                    </div>
                    <p class="project-card__description">${this.escapeHtml(project.description)}</p>
                    <div class="project-card__details">
                        <a href="${this.escapeHtmlAttribute(project.link)}" target="_blank" rel="noopener noreferrer" class="project-card__link">${viewProjectText}</a>
                        <button class="project-card__delete-btn" data-project-id="${project.id}">${deleteButtonText}</button>
                    </div>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.closest('.project-card__delete-btn') || e.target.closest('.project-card__link')) return;
                this.toggleProject(project.id);
            });

            const deleteBtn = card.querySelector('.project-card__delete-btn');
            deleteBtn.addEventListener('click', () => this.deleteProject(project.id));

            this.projectsGrid.appendChild(card);
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

    escapeHtmlAttribute(text) {
        return text.replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }
}

const projectsManager = new ProjectsManager();
window.projectsManager = projectsManager;

console.log('✓ Система проектів завантажена успішно!');

/* =========================== Інтерактивність About-Секції =========================== */

const aboutImage = document.querySelector('.about__image');

if (aboutImage) {
    // Додаємо легкий блиск при наведенні
    aboutImage.addEventListener('mousemove', (e) => {
        const rect = aboutImage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Динамічна тінь слідом за курсором
        const rotateX = (y / rect.height - 0.5) * 10;
        const rotateY = (x / rect.width - 0.5) * -10;

        aboutImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    aboutImage.addEventListener('mouseleave', () => {
        // Повертаємося до нормального стану
        aboutImage.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
}

console.log('✓ About-секція завантажена успішно!');

/* =========================== Переключення Мови (UA/EN) =========================== */

let currentLanguage = localStorage.getItem('currentLanguage') || 'uk';

const langToggle = document.getElementById('langToggle');

// Встановити мову при завантаженні
if (currentLanguage === 'en') {
    document.documentElement.lang = 'en';
    updateLanguage('en');
}

langToggle.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'uk' ? 'en' : 'uk';
    localStorage.setItem('currentLanguage', currentLanguage);
    document.documentElement.lang = currentLanguage;
    updateLanguage(currentLanguage);
});

function updateLanguage(lang) {
    // Обновляємо title сторінки
    const titleElement = document.querySelector('title');
    if (titleElement && titleElement.hasAttribute('data-uk') && titleElement.hasAttribute('data-en')) {
        document.title = lang === 'uk' ? titleElement.getAttribute('data-uk') : titleElement.getAttribute('data-en');
    }

    // Обновляємо текстові елементи
    const elements = document.querySelectorAll('[data-uk][data-en]');
    
    elements.forEach(element => {
        if (lang === 'uk') {
            element.textContent = element.getAttribute('data-uk');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });

    // Обновляємо alt атрибути для зображень
    const images = document.querySelectorAll('[data-uk-alt][data-en-alt]');
    images.forEach(image => {
        image.alt = lang === 'uk' ? image.getAttribute('data-uk-alt') : image.getAttribute('data-en-alt');
    });

    // Перерисовуємо карточки навичок з новою мовою
    if (window.skillsManager) {
        window.skillsManager.render();
    }

    // Перерисовуємо карточки проектів з новою мовою
    if (window.projectsManager) {
        window.projectsManager.render();
    }

    console.log(`✓ Мова змінена на: ${lang === 'uk' ? 'Українська' : 'English'}`);
}

console.log('✓ Система переключення мови завантажена успішно!');