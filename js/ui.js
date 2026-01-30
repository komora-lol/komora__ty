/**
 * UI - Handles DOM Rendering
 */
class UI {
    constructor(store) {
        this.store = store;
        this.appContainer = document.getElementById('app');
        this.applySettings();
    }

    applySettings() {
        const settings = this.store.getSettings();

        // Theme
        document.documentElement.setAttribute('data-theme', settings.theme);

        // Gender Theme
        const user = this.store.getUser();
        document.documentElement.setAttribute('data-gender', user.gender || 'male');

        // Font Size
        const sizes = {
            'small': '14px',
            'medium': '16px',
            'large': '18px'
        };
        document.documentElement.style.fontSize = sizes[settings.fontSize] || '16px';

        // Animations
        if (settings.animations === false) {
            document.documentElement.style.setProperty('--ease-out-back', 'linear');
            // We could disable animations via CSS class too
        }
    }

    renderLayout(activePage, title, content) {
        const user = this.store.getUser();

        this.appContainer.innerHTML = `
            <header class="app-header">
                <div class="header-left">
                    <h3 style="font-family: var(--font-heading);">${title}</h3>
                </div>
                
                <!-- Search Bar -->
                <div class="search-container" style="flex-grow: 1; max-width: 400px; margin: 0 2rem; position: relative;">
                    <i class="ph ph-magnifying-glass" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); transition: color 0.3s;"></i>
                    <input type="text" id="global-search" placeholder="Search lessons, tools..." 
                           style="width: 100%; padding: 0.8rem 1rem 0.8rem 2.8rem; border-radius: 20px; border: 1px solid var(--border); background: var(--bg-panel); color: var(--text-main); font-family: var(--font-main); transition: all 0.3s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.02);"
                           onfocus="this.style.boxShadow='0 5px 15px rgba(108, 92, 231, 0.15)'; this.style.borderColor='var(--primary)';"
                           onblur="this.style.boxShadow='0 2px 5px rgba(0,0,0,0.02)'; this.style.borderColor='var(--border)';"
                           onkeyup="app.ui.handleSearch(event)">
                </div>

                <div style="display: flex; gap: 1.5rem; align-items: center;">
                    
                    <!-- Notification Bell -->
                    <div class="notification-container" onclick="this.querySelector('.notification-dropdown').classList.toggle('active')">
                        <i class="ph ph-bell notification-bell"></i>
                        <div class="notification-badge">1</div>
                        
                        <div class="notification-dropdown glass-panel">
                            <h4 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">Notifications</h4>
                            
                            <div class="notification-item" style="display: flex; gap: 1rem; padding: 0.5rem; border-radius: var(--radius-sm); transition: background 0.2s; cursor: default;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255, 118, 117, 0.1); color: #ff7675; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <i class="ph ph-warning-circle" style="font-size: 1.2rem;"></i>
                                </div>
                                <div>
                                    <h5 style="margin-bottom: 0.2rem; margin-top: 0; color: #d63031;">Upcoming Exam</h5>
                                    <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Mathematics Mid-term in 3 days.</p>
                                </div>
                            </div>
                             <div style="margin-top: 1rem; text-align: center;">
                                <button class="btn-xs" style="width: 100%;">Mark all as read</button>
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <button class="btn btn-primary" id="theme-toggle" style="width: 40px; height: 40px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                            <i class="ph ph-moon" style="font-size: 1.2rem;"></i>
                        </button>
                        
                        <!-- Profile Brief -->
                        <div style="display: flex; align-items: center; gap: 0.8rem; cursor: pointer;" onclick="app.ui.renderProfile()">
                             <div style="text-align: right; display: none; @media(min-width: 768px){ display: block; }">
                                <div style="font-weight: 700; font-size: 0.9rem; font-family: var(--font-heading);">${user.name}</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted);">${user.grade}</div>
                            </div>
                            <div class="avatar-ring" style="width: 42px; height: 42px; border-radius: 50%; padding: 2px; border: 2px solid var(--primary);">
                                <img src="${user.avatar}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main class="dashboard-grid" style="margin-top: 2rem;">
                <aside class="sidebar" style="width: 80px;">
                    <div class="sidebar-cells glass-panel">
                        <!-- Main Navigation -->
                        ${this.getSidebarItem('dashboard', 'squares-four', 'Dashboard', activePage)}
                        ${this.getSidebarItem('schedule', 'calendar', 'Schedule', activePage)}
                        ${this.getSidebarItem('documents', 'folder', 'Resources', activePage)}
                        ${this.getSidebarItem('notes', 'notebook', 'Notes', activePage)}
                        
                        <!-- Divider -->
                        <div class="sidebar-divider" style="height: 2px; background: var(--border); margin: 0.5rem 0; width: 100%; border-radius: 2px;"></div>

                        <!-- System / Preferences -->
                        ${this.getSidebarItem('tips', 'lightbulb', 'Study Tips', activePage)}
                        ${this.getSidebarItem('prayers', 'mosque', 'Daily Prayers', activePage)}
                        ${this.getSidebarItem('sport', 'sneaker-move', 'Daily Sport', activePage)}
                        ${this.getSidebarItem('settings', 'gear', 'Settings', activePage)}
                        <div class="icon-cell ${activePage === 'profile' ? 'active' : ''}" data-tooltip="Profile" onclick="app.ui.renderProfile()">
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: #ddd; overflow: hidden;">
                                <img src="${user.avatar}" alt="Profile" style="width: 100%; height: 100%;">
                            </div>
                        </div>
                    </div>
                </aside>

                <section class="page-content animate-slide-up" style="position: relative;">
                    ${content}
                </section>
            </main>

            <footer class="app-footer">
                <div class="footer-content">
                    <p style="font-weight: 600;">Made Khalil ❤️ Welcome students</p>
                    <p style="font-size: 0.9rem;">&copy; ${new Date().getFullYear()} All Rights Reserved.</p>
                    <div class="social-links">
                        <a href="#" class="social-link"><i class="ph ph-github-logo"></i></a>
                        <a href="#" class="social-link"><i class="ph ph-twitter-logo"></i></a>
                        <a href="#" class="social-link"><i class="ph ph-instagram-logo"></i></a>
                    </div>
                </div>
            </footer>
        `;

        this.bindEvents();
        this.initKineticEffects();
    }

    getSidebarItem(id, icon, tooltip, activePage) {
        const isActive = id === activePage ? 'active' : '';
        // capitalize first letter for method name
        const methodName = 'render' + id.charAt(0).toUpperCase() + id.slice(1);
        return `
            <div class="icon-cell ${isActive}" data-tooltip="${tooltip}" onclick="app.ui.${methodName}()">
                <i class="ph ph-${icon}"></i>
            </div>
        `;
    }

    renderDashboard() {
        // Redesigned Dashboard
        const user = this.store.getUser();

        const content = `
            <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-end;">
                 <div>
                    <h2 id="dynamic-greeting" style="margin-bottom: 0.5rem; font-size: 2.2rem; font-family: var(--font-heading); color: var(--text-main); font-weight: 700;">Welcome back, ${user.name} 👋</h2>
                    <p style="color: var(--text-muted); font-size: 1.1rem;">Ready to achieve your goals today?</p>
                 </div>
                 <div class="glass-panel" style="padding: 0.5rem 1.5rem; font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; color: var(--primary); box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <span id="live-clock">--:--</span>
                 </div>
            </div>

            <section class="goals-section">
                <!-- Visual Reminder -->


                <div class="glass-panel goal-card">
                    <i class="ph ph-target" style="font-size: 2rem; color: var(--primary);"></i>
                    <div>
                        <h4>Set Your Goals</h4>
                        <p>Define clear objectives to stay focused and motivated.</p>
                    </div>
                </div>
                <div class="glass-panel goal-card">
                    <i class="ph ph-chart-line-up" style="font-size: 2rem; color: var(--secondary);"></i>
                    <div>
                        <h4>Track Progress</h4>
                        <p>Monitor your improvements and celebrate small wins.</p>
                    </div>
                </div>
                <div class="glass-panel goal-card">
                    <i class="ph ph-brain" style="font-size: 2rem; color: var(--accent);"></i>
                    <div>
                        <h4>Master Skills</h4>
                        <p>Use active recall and spaced repetition to learn faster.</p>
                    </div>
                </div>
            </section>
            
            <div class="dashboard-widgets-grid">
                <!-- Left Column -->
                <div class="widget-col">
                    ${this.renderDailyFocus()}
                    ${this.renderWeeklyProgress()}
                    ${this.renderMotivation()}
                </div>

                <!-- Middle Column -->
                <div class="widget-col">
                    ${this.renderQuickFiles()}
                    
                    <!-- Quick Note Widget -->
                    <div class="glass-panel widget-card">
                        <div class="widget-header">
                            <h4 style="display: flex; align-items: center; gap: 0.5rem;">
                                <i class="ph ph-sticky-note" style="color: #fdcb6e;"></i>
                                Quick Note
                            </h4>
                        </div>
                        <textarea id="quick-note-area" placeholder="Jot down a thought..." 
                            style="width: 100%; height: 100px; border: none; background: transparent; resize: none; font-family: var(--font-main); color: var(--text-main); font-size: 0.95rem; outline: none;"
                            oninput="localStorage.setItem('quickNote', this.value)">${localStorage.getItem('quickNote') || ''}</textarea>
                    </div>

                    <div class="glass-panel widget-card">
                         <div class="widget-header">
                            <h4 style="display: flex; align-items: center; gap: 0.5rem;">
                                <i class="ph ph-trophy" style="color: #f1c40f;"></i>
                                Achievements
                            </h4>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${this.store.getAchievements().map(ach => `
                                <div class="icon-cell ${ach.unlocked ? '' : 'locked'}" style="width: 40px; height: 40px; font-size: 1.2rem; background: ${ach.unlocked ? 'var(--primary-glow)' : 'var(--bg-main)'}; color: ${ach.unlocked ? 'var(--primary)' : 'var(--text-muted)'}; opacity: ${ach.unlocked ? 1 : 0.5};" data-tooltip="${ach.title}: ${ach.description}">
                                    <i class="ph ph-${ach.icon}"></i>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="widget-col">
                    ${this.renderProgressTracker()}
                    ${this.renderPomodoroTimer()}
                </div>
            </div>

            <h3 style="margin: 2rem 0 1rem;">My Subjects</h3>
            <section class="subjects-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem;">
                ${this.store.getSubjects().map((subject, index) => this.createSubjectCard(subject, index)).join('')}
            </section>
        `;

        this.renderLayout('dashboard', 'Dashboard', content);
        this.initPomodoroLogic();
        this.initClock();
    }

    renderReminders() {
        return `
            <div class="glass-panel widget-card" style="background: linear-gradient(135deg, rgba(255, 118, 117, 0.1) 0%, rgba(214, 48, 49, 0.1) 100%); border-left: 4px solid #ff7675; margin-bottom: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="display: flex; gap: 1rem;">
                        <div style="background: rgba(255, 118, 117, 0.2); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ff7675;">
                             <i class="ph ph-bell-ringing" style="font-size: 1.2rem;"></i>
                        </div>
                        <div>
                             <h4 style="margin-bottom: 0.2rem; color: #d63031;">Upcoming Exam</h4>
                             <p style="font-size: 0.9rem; color: var(--text-muted);">Mathematics Mid-term in 3 days.</p>
                        </div>
                    </div>
                    <button class="btn-icon" style="color: var(--text-muted);" onclick="this.closest('.widget-card').remove()">
                        <i class="ph ph-x"></i>
                    </button>
                </div>
            </div>
        `;
    }

    renderProgressTracker() {
        const progress = this.store.getStudentProgress();
        return `
            <div class="glass-panel widget-card">
                 <div class="widget-header">
                    <h4 style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ph ph-trend-up" style="color: var(--secondary); font-size: 1.2rem;"></i>
                        Daily Progress
                    </h4>
                    <span class="badge" style="background: var(--secondary-glow); color: var(--secondary);">${progress}%</span>
                </div>
                <div class="glowing-progress-track" style="height: 12px;">
                    <div class="glowing-progress-bar" style="width: ${progress}%; background: var(--secondary); box-shadow: 0 0 10px var(--secondary);"></div>
                </div>
                 <p style="margin-top: 1rem; font-size: 0.85rem; color: var(--text-muted); text-align: center;">
                    ${progress === 100 ? '🎉 Amazing! All goals completed!' : 'Keep going, you are doing great!'}
                </p>
            </div>
        `;
    }

    renderDailyFocus() {
        const goals = this.store.getDailyGoals();
        return `
            <div class="glass-panel widget-card" style="border-left: 4px solid var(--primary);">
                <div class="widget-header">
                    <h4 style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ph ph-target" style="color: var(--primary); font-size: 1.2rem;"></i>
                        Daily Focus
                    </h4>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <span class="badge" style="background: var(--primary-glow); color: var(--primary);">Today</span>
                        <button class="btn-xs" onclick="app.ui.addGoal()" style="background: var(--primary); color: white; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                            <i class="ph ph-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="focus-list">
                    ${goals.length > 0 ? goals.map(goal => `
                        <div class="focus-item ${goal.done ? 'completed' : ''}" style="display: flex; align-items: center; gap: 0.5rem; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; flex-grow: 1;">
                                <input type="checkbox" id="focus-${goal.id}" ${goal.done ? 'checked' : ''} onchange="app.ui.toggleGoal(${goal.id})">
                                <label for="focus-${goal.id}" style="${goal.done ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${goal.text}</label>
                            </div>
                            <button class="btn-xs delete-btn" onclick="app.ui.deleteGoal(${goal.id})" style="color: var(--text-muted); opacity: 0.5; padding: 2px;">
                                <i class="ph ph-trash"></i>
                            </button>
                        </div>
                    `).join('') : `
                        <div style="text-align: center; color: var(--text-muted); padding: 1rem; font-style: italic;">
                            No focus tasks yet. <br>Click + to add one!
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    deleteGoal(id) {
        if (confirm("Delete this task?")) {
            this.store.deleteDailyGoal(id);
            this.renderDashboard();
        }
    }

    toggleGoal(id) {
        this.store.toggleDailyGoal(id);
        const goal = this.store.getDailyGoals().find(g => g.id === id);
        if (goal && goal.done) {
            this.triggerConfetti();
            this.store.incrementStats('assignmentsDone', 1);
            this.showToast("Great job! Stats updated.", "success");
        }
        this.renderDashboard();
    }

    renderPomodoroTimer() {
        return `
            <div class="glass-panel widget-card" style="align-items: center; text-align: center;">
                <h4 style="margin-bottom: 1rem;">Pomodoro Timer</h4>
                
                <div class="timer-circle-container">
                    <svg class="timer-svg" viewBox="0 0 100 100">
                        <!-- Background Circle -->
                        <circle class="timer-circle-bg" cx="50" cy="50" r="45"></circle>
                        <!-- Progress Circle with pathLength="1" for easy CSS/JS calc -->
                        <circle class="timer-circle-progress" cx="50" cy="50" r="45" pathLength="1"></circle>
                    </svg>
                    
                    <div class="timer-time-display">
                        <div class="time" id="timer-display">25:00</div>
                        <div class="label" id="timer-status">Focus</div>
                    </div>
                </div>

                <div class="timer-controls" style="margin-bottom: 1rem;">
                    <button class="btn btn-primary" id="timer-toggle"><i class="ph ph-play" id="timer-icon"></i></button>
                    <button class="btn" id="timer-reset"><i class="ph ph-arrow-counter-clockwise"></i></button>
                     <button class="btn" id="timer-settings-btn"><i class="ph ph-gear"></i></button>
                </div>
                 
                 <div class="timer-modes" style="display: flex; gap: 0.5rem; justify-content: center;">
                     <button class="btn-xs active" id="mode-focus">Focus</button>
                     <button class="btn-xs" id="mode-short">Short Break</button>
                     <button class="btn-xs" id="mode-long">Long Break</button>
                </div>
            </div>
        `;
    }

    renderQuickFiles() {
        const files = this.store.getRecentFiles().slice(0, 3);

        return `
            <div class="glass-panel widget-card">
                 <div class="widget-header">
                    <h4 style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ph ph-clock" style="color: var(--accent); font-size: 1.2rem;"></i>
                        Recent Files
                    </h4>
                    <button class="btn-icon">
                        <i class="ph ph-dots-three"></i>
                    </button>
                </div>
                <!-- ... rest of content ... -->
                ${files.length > 0 ? `
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        ${files.map(file => `
                             <div class="file-item" style="display: flex; align-items: center; gap: 1rem; padding: 0.5rem; border-radius: 8px; transition: background 0.2s; cursor: pointer;" onclick="app.ui.previewFile(${file.id})">
                                <div class="file-icon" style="color: var(--primary); font-size: 1.5rem;">
                                    <i class="ph ph-file-${file.type}"></i>
                                </div>
                                <div class="file-info" style="flex-grow: 1;">
                                    <h5 style="margin-bottom: 0.2rem;">${file.name}</h5>
                                    <span style="font-size: 0.8rem; color: var(--text-muted);">${file.subject || 'General'} • ${file.date}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div style="text-align: center; color: var(--text-muted); padding: 1rem;">
                        <i class="ph ph-folder-open" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                        <p>No recent files</p>
                    </div>
                `}
            </div>
        `;
    }

    renderWeeklyProgress() {
        return `
             <div class="glass-panel widget-card">
                 <div class="widget-header">
                    <h4 style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ph ph-chart-bar" style="color: var(--secondary); font-size: 1.2rem;"></i>
                        Weekly Progress
                    </h4>
                    <select class="form-select" style="width: auto; padding: 0.2rem 0.5rem; font-size: 0.8rem;">
                        <option>This Week</option>
                        <option>Last Week</option>
                    </select>
                </div>
                <!-- Simple CSV Bar Chart Simulation -->
                <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 120px; padding-top: 1rem;">
                    ${[40, 70, 50, 90, 60, 30, 80].map((h, i) => `
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; width: 100%;">
                             <div style="width: 8px; height: ${h}%; background: ${i === 3 ? 'var(--primary)' : 'var(--border)'}; border-radius: 4px; transition: height 1s ease;"></div>
                             <span style="font-size: 0.7rem; color: var(--text-muted);">${['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderMotivation() {
        return `
             <div class="glass-panel widget-card" style="background: linear-gradient(135deg, var(--bg-panel) 0%, rgba(253, 121, 168, 0.1) 100%);">
                 <div class="widget-header">
                     <h4 style="display: flex; align-items: center; gap: 0.5rem; color: var(--accent);">
                        <i class="ph ph-lightbulb"></i>
                        Tip of the Day
                    </h4>
                </div>
                <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center; text-align: center;">
                    <p class="quote-text" style="font-size: 1rem;">"${this.store.getDailyTip()}"</p>
                </div>
            </div>
        `;
    }

    renderPrayers() {
        const prayers = this.store.getPrayers();
        const content = `
             <div style="max-width: 600px; margin: 0 auto;" class="animate-slide-up">
                 <div class="glass-panel widget-card prayer-widget" style="padding: 2rem;">
                     <div class="widget-header" style="margin-bottom: 0.5rem; justify-content: center;">
                        <h4 style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.5rem;">
                            <i class="ph ph-mosque" style="color: var(--secondary); font-size: 1.8rem;"></i>
                            جدول الصلوات اليومية 🕌
                        </h4>
                    </div>
                    
                    <div style="margin-bottom: 2rem; color: var(--text-muted); font-size: 1rem; text-align: center; border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
                        <span style="font-style: italic;">"الصلاة أساس الانضباط والتركيز."</span>
                    </div>

                    <div class="prayer-list" style="display: flex; flex-direction: column; gap: 1rem;">
                        ${prayers.map(p => `
                            <div class="prayer-item ${p.id === 'fajr' ? 'fajr-highlight' : ''} ${p.completed ? 'completed' : ''}" 
                                 onclick="app.ui.togglePrayer('${p.id}')"
                                 style="padding: 1rem;">
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <div class="prayer-checkbox ${p.completed ? 'checked' : ''}" style="width: 24px; height: 24px;">
                                        ${p.completed ? '<i class="ph ph-check" style="color: white; font-size: 1rem;"></i>' : ''}
                                    </div>
                                    <span style="font-weight: 600; font-size: 1.1rem;">${p.name}</span>
                                </div>
                                <span style="font-size: 1rem; color: var(--text-muted); font-family: monospace;">${p.time}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.renderLayout('prayers', 'Daily Prayers', content);
    }

    renderSport() {
        const sports = this.store.getDailySports();
        const content = `
            <div class="animate-slide-up" style="max-width: 900px; margin: 0 auto;">
                
                <!-- Reminder Widget (Visual Only) -->
                ${this.renderReminders()}

                <!-- Progress Tracker -->
                ${this.renderProgressTracker()}

                <!-- Intro / Benefits Section -->
                <div class="glass-panel widget-card" style="margin-bottom: 2rem; background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));">
                     <div class="widget-header" style="justify-content: center; margin-bottom: 1.5rem;">
                        <h4 style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.8rem; color: var(--text-main);">
                            <i class="ph ph-sneaker-move" style="color: var(--accent);"></i>
                            الرياضة اليومية 🏃‍♂️
                        </h4>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; text-align: center;">
                        <div class="benefit-card">
                            <i class="ph ph-brain" style="font-size: 2rem; color: #74b9ff; margin-bottom: 0.5rem;"></i>
                            <h5 style="margin-bottom: 0.2rem;">تنشيط العقل</h5>
                            <p style="font-size: 0.9rem; color: var(--text-muted);">تحسين الدورة الدموية وزيادة الاستيعاب.</p>
                        </div>
                        <div class="benefit-card">
                            <i class="ph ph-target" style="font-size: 2rem; color: #ff7675; margin-bottom: 0.5rem;"></i>
                            <h5 style="margin-bottom: 0.2rem;">تحسين التركيز</h5>
                            <p style="font-size: 0.9rem; color: var(--text-muted);">زيادة القدرة على الانتباه أثناء المذاكرة.</p>
                        </div>
                         <div class="benefit-card">
                            <i class="ph ph-smiley" style="font-size: 2rem; color: #fdcb6e; margin-bottom: 0.5rem;"></i>
                            <h5 style="margin-bottom: 0.2rem;">تقليل التوتر</h5>
                            <p style="font-size: 0.9rem; color: var(--text-muted);">إفراز هرمونات السعادة والاسترخاء.</p>
                        </div>
                         <div class="benefit-card">
                            <i class="ph ph-lightning" style="font-size: 2rem; color: #55efc4; margin-bottom: 0.5rem;"></i>
                            <h5 style="margin-bottom: 0.2rem;">رفع الطاقة</h5>
                            <p style="font-size: 0.9rem; color: var(--text-muted);">تجديد النشاط والحيوية للدراسة.</p>
                        </div>
                    </div>
                </div>

                <!-- Checklist Section -->
                <h3 style="margin-bottom: 1rem; color: var(--text-main);">قائمة الأنشطة اليومية</h3>
                <div class="sports-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
                    ${sports.map(s => `
                        <div class="glass-panel sport-card ${s.completed ? 'completed' : ''}" 
                             onclick="app.ui.toggleSport('${s.id}')"
                             style="cursor: pointer; transition: all 0.3s ease; border: 2px solid ${s.completed ? 'var(--primary)' : 'transparent'}; position: relative; overflow: hidden;">
                             
                             ${s.completed ? '<div style="position: absolute; top: 10px; right: 10px; color: var(--primary);"><i class="ph ph-check-circle" style="font-size: 1.5rem;"></i></div>' : ''}

                            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1rem;">
                                <div class="sport-icon" style="width: 60px; height: 60px; background: var(--bg-body); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--accent);">
                                    <i class="ph ph-${s.icon}"></i>
                                </div>
                                <h4 style="font-size: 1.2rem; margin: 0;">${s.name}</h4>
                                <span class="badge" style="background: var(--border); color: var(--text-muted);">${s.duration}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
    `;
        this.renderLayout('sport', 'Daily Sport', content);
    }

    toggleSport(id) {
        this.store.toggleDailySport(id);
        this.renderSport();
    }

    // Logic Methods

    togglePrayer(id) {
        this.store.togglePrayer(id);
        this.renderPrayers();
    }

    toggleGoal(id) {
        this.store.toggleDailyGoal(id);
        this.renderDashboard(); // Re-render to update UI
    }

    addGoal() {
        const text = prompt("Enter new daily goal:");
        if (text) {
            this.store.addDailyGoal(text);
            this.renderDashboard();
        }
    }

    initPomodoroLogic() {
        let timeLeft = 25 * 60;
        let originalTime = 25 * 60;
        let timerId = null;
        let isRunning = false;

        const display = document.getElementById('timer-display');
        const progressCircle = document.querySelector('.timer-circle-progress');
        const toggleBtn = document.getElementById('timer-toggle');
        const icon = document.getElementById('timer-icon');
        const resetBtn = document.getElementById('timer-reset');
        const settingsBtn = document.getElementById('timer-settings-btn');

        const modes = {
            'mode-focus': 25,
            'mode-short': 5,
            'mode-long': 15
        };

        const updateDisplay = () => {
            const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');
            display.textContent = `${m}:${s} `;

            // Update Circle
            const progress = timeLeft / originalTime;
            progressCircle.style.strokeDashoffset = 1 - progress; // SVG pathLength=1
        };

        const toggleTimer = () => {
            if (isRunning) {
                clearInterval(timerId);
                isRunning = false;
                icon.classList.replace('ph-pause', 'ph-play');
                display.classList.remove('pulse-tick'); // Stop pulse
            } else {
                isRunning = true;
                icon.classList.replace('ph-play', 'ph-pause');

                timerId = setInterval(() => {
                    if (timeLeft > 0) {
                        timeLeft--;
                        updateDisplay();

                        // Visual Pulse
                        display.classList.add('pulse-tick');
                        setTimeout(() => display.classList.remove('pulse-tick'), 300);

                    } else {
                        clearInterval(timerId);
                        isRunning = false;
                        icon.classList.replace('ph-pause', 'ph-play');
                        alert("Time's up! Take a break.");
                        new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => { }); // Simple ding
                    }
                }, 1000);
            }
        };

        toggleBtn.addEventListener('click', toggleTimer);

        resetBtn.addEventListener('click', () => {
            clearInterval(timerId);
            isRunning = false;
            icon.classList.replace('ph-pause', 'ph-play');
            timeLeft = originalTime;
            updateDisplay();
            display.classList.remove('pulse-tick');
        });

        // Mode Switching
        Object.keys(modes).forEach(id => {
            document.getElementById(id).addEventListener('click', (e) => {
                // Remove active class from all
                Object.keys(modes).forEach(k => document.getElementById(k).classList.remove('active'));
                e.target.classList.add('active');

                originalTime = modes[id] * 60;
                timeLeft = originalTime;

                // Stop if running
                if (isRunning) toggleTimer();
                updateDisplay();
            });
        });

        // Settings Logic
        settingsBtn.addEventListener('click', () => {
            const minutes = prompt("Set custom duration (minutes):", Math.floor(timeLeft / 60));
            if (minutes && !isNaN(minutes) && minutes > 0) {
                originalTime = minutes * 60;
                timeLeft = originalTime;
                if (isRunning) toggleTimer(); // Stop
                updateDisplay();

                // Clear active modes as this is custom
                Object.keys(modes).forEach(k => document.getElementById(k).classList.remove('active'));
            }
        });

        updateDisplay();
    }

    renderSchedule() {
        const events = this.store.getEvents();
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8:00 to 22:00

        const content = `
    <div class="calendar-wrapper animate-slide-up" >
                <!--Time Column-->
                <div class="time-column">
                    <div style="height: 50px;"></div> <!-- Spacer for header -->
                    ${hours.map(hour => `
                        <div class="time-label">
                            <span>${hour}:00</span>
                        </div>
                    `).join('')}
                </div>

                <!--Week Grid-->
    <div class="week-grid">
        <!-- Headers -->
        ${days.map(day => `
                        <div class="day-header">${day}</div>
                    `).join('')}

        <!-- Grid Cells -->
        <div class="calendar-row">
            ${this.generateCalendarCells(days, hours, events)}
        </div>
    </div>
            </div>
    `;

        this.renderLayout('schedule', 'Weekly Schedule', content);
    }

    generateCalendarCells(days, hours, events) {
        let html = '';

        // We iterate hour by hour, then day by day to fill the grid row by row? 
        // No, CSS grid autoflow is row. So we need to output cells:
        // Row 1 (8:00): Mon, Tue, Wed, Thu, Fri, Sat, Sun
        // Row 2 (9:00): ...

        hours.forEach(hour => {
            days.forEach(day => {
                const timeStr = `${hour.toString().padStart(2, '0')}:00`;
                const event = events.find(e => e.day === day && e.time === timeStr);

                if (event) {
                    html += `
    <div class="calendar-cell" onclick = "app.ui.editEvent(${event.id})" >
        <div class="event-block" style="background: ${event.color};">
            <span>${event.title}</span>
            <span class="event-time">${event.type}</span>
        </div>
                        </div>
    `;
                } else {
                    html += `
    <div class="calendar-cell" onclick = "app.ui.openEventModal('${day}', '${timeStr}')" ></div>
        `;
                }
            });
        });

        return html;
    }

    openEventModal(day, time, event = null) {
        // Remove existing modal if any
        const existing = document.querySelector('.modal-overlay');
        if (existing) existing.remove();

        const isEdit = !!event;
        const titleValue = isEdit ? event.title : '';
        const typeValue = isEdit ? event.type : 'class';
        const colorValue = isEdit ? event.color : '#ff7675';

        const modalHtml = `
        <div class="modal-overlay active" onclick = "if(event.target === this) this.remove()" >
            <div class="modal">
                <h3>${isEdit ? 'Edit Event' : 'Add Event'}</h3>
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="event-title" class="form-input" placeholder="e.g. Math Class" value="${titleValue}" autofocus>
                </div>
                <div class="form-group">
                    <label>Type</label>
                    <select id="event-type" class="form-select">
                        <option value="class" ${typeValue === 'class' ? 'selected' : ''}>Class</option>
                        <option value="study" ${typeValue === 'study' ? 'selected' : ''}>Study Session</option>
                        <option value="exam" ${typeValue === 'exam' ? 'selected' : ''}>Exam</option>
                        <option value="other" ${typeValue === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Color</label>
                    <div class="color-options">
                        ${this.renderColorOption('#ff7675', colorValue === '#ff7675')}
                        ${this.renderColorOption('#74b9ff', colorValue === '#74b9ff')}
                        ${this.renderColorOption('#55efc4', colorValue === '#55efc4')}
                        ${this.renderColorOption('#fd79a8', colorValue === '#fd79a8')}
                        ${this.renderColorOption('#a29bfe', colorValue === '#a29bfe')}
                        ${this.renderColorOption('#fab1a0', colorValue === '#fab1a0')}
                    </div>
                </div>
                <div class="btn-group" style="justify-content: space-between;">
                    ${isEdit ? `<button class="btn" style="color: #ff7675; background: rgba(255, 118, 117, 0.1);" onclick="app.ui.deleteEvent(${event.id})">Delete</button>` : '<div></div>'}
                    <div style="display: flex; gap: 1rem;">
                        <button class="btn" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
                        <button class="btn btn-primary" onclick="app.ui.saveEvent('${day}', '${time}', ${isEdit ? event.id : null})">Save</button>
                    </div>
                </div>
            </div>
            </div>
    `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.querySelectorAll('.color-option').forEach(opt => {
            opt.addEventListener('click', function () {
                document.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }

    renderColorOption(color, selected = false) {
        return `<div class="color-option ${selected ? 'selected' : ''}" style = "background: ${color};" data - color="${color}" ></div> `;
    }

    saveEvent(day, time, id) {
        const title = document.getElementById('event-title').value;
        const type = document.getElementById('event-type').value;
        const color = document.querySelector('.color-option.selected').dataset.color;

        if (!title) return;

        const eventData = { day, time, title, type, color };

        if (id) {
            this.store.updateEvent({ ...eventData, id });
        } else {
            this.store.addEvent(eventData);
        }

        document.querySelector('.modal-overlay').remove();
        this.renderSchedule();
    }

    deleteEvent(id) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.store.deleteEvent(id);
            document.querySelector('.modal-overlay').remove();
            this.renderSchedule();
        }
    }

    editEvent(id) {
        const event = this.store.getEvents().find(e => e.id === id);
        if (event) {
            this.openEventModal(event.day, event.time, event);
        }
    }

    renderNotes() {
        const notes = this.store.getNotes();
        const content = `
    <div class="notes-grid" >
        ${notes.map((note, index) => `
                    <div class="glass-panel note-card animate-slide-up" onclick="app.ui.openNoteModal(${note.id})" style="background: ${note.color}20; border-left: 44px solid ${note.color}; animation-delay: ${index * 100}ms;">
                        <h4 style="color: var(--text-main);">${note.title}</h4>
                        <p>${note.content}</p>
                        <div style="text-align: right; margin-top: 1rem; opacity: 0.5;">
                            <i class="ph ph-push-pin" style="color: ${note.color}; font-size: 1.2rem;"></i>
                        </div>
                    </div>
                `).join('')
            }

<div class="glass-panel note-card" onclick="app.ui.openNoteModal()" style="align-items: center; justify-content: center; border: 2px dashed var(--border); background: transparent; opacity: 0.7;">
    <i class="ph ph-plus" style="font-size: 2rem; color: var(--primary);"></i>
    <p style="flex-grow: 0; margin-top: 0.5rem;">Add Note</p>
</div>
            </div>
    `;
        this.renderLayout('notes', 'My Notes', content);
    }

    openNoteModal(noteId = null) {
        const existing = document.querySelector('.modal-overlay');
        if (existing) existing.remove();

        const note = noteId ? this.store.getNotes().find(n => n.id === noteId) : null;
        const isEdit = !!note;

        const titleValue = isEdit ? note.title : '';
        const contentValue = isEdit ? note.content : '';
        const colorValue = isEdit ? note.color : '#ffeaa7';

        const modalHtml = `
    <div class="modal-overlay active" onclick = "if(event.target === this) this.remove()" >
        <div class="modal">
            <h3>${isEdit ? 'Edit Note' : 'Add New Note'}</h3>
            <div class="form-group">
                <label>Title</label>
                <input type="text" id="note-title" class="form-input" placeholder="Note Title" value="${titleValue}" autofocus>
            </div>
            <div class="form-group">
                <label>Content</label>
                <textarea id="note-content" class="form-input" rows="5" placeholder="Write your note here...">${contentValue}</textarea>
            </div>
            <div class="form-group">
                <label>Color</label>
                <div class="color-options">
                    ${this.renderColorOption('#ffeaa7', colorValue === '#ffeaa7')}
                    ${this.renderColorOption('#fab1a0', colorValue === '#fab1a0')}
                    ${this.renderColorOption('#74b9ff', colorValue === '#74b9ff')}
                    ${this.renderColorOption('#55efc4', colorValue === '#55efc4')}
                    ${this.renderColorOption('#a29bfe', colorValue === '#a29bfe')}
                </div>
            </div>
            <div class="btn-group" style="justify-content: space-between;">
                ${isEdit ? `<button class="btn" style="color: #ff7675; background: rgba(255, 118, 117, 0.1);" onclick="app.ui.deleteNote(${note.id})">Delete</button>` : '<div></div>'}
                <div style="display: flex; gap: 1rem;">
                    <button class="btn" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="app.ui.saveNote(${isEdit ? note.id : null})">Save</button>
                </div>
            </div>
        </div>
            </div>
    `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.querySelectorAll('.color-option').forEach(opt => {
            opt.addEventListener('click', function () {
                document.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }

    saveNote(id) {
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;
        const color = document.querySelector('.color-option.selected').dataset.color;

        if (!title) return;

        const noteData = { title, content, color };

        if (id) {
            this.store.updateNote({ ...noteData, id });
        } else {
            this.store.addNote(noteData);
        }

        document.querySelector('.modal-overlay').remove();
        this.renderNotes();
    }

    deleteNote(id) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.store.deleteNote(id);
            document.querySelector('.modal-overlay').remove();
            this.renderNotes();
        }
    }

    renderDocuments() {
        // Default to list view if not specified
        if (!this.documentsView) this.documentsView = 'list';

        const files = this.store.getRecentFiles();
        const subjects = this.store.getSubjects();

        // Helper to get subject color
        const getFileColor = (subjectId) => {
            const sub = subjects.find(s => s.id === subjectId);
            return sub ? sub.color : '#6c5ce7';
        };

        let filesHtml = '';
        if (this.documentsView === 'grid') {
            filesHtml = `
    <div class="files-grid" >
        ${files.map(file => `
                        <div class="glass-panel file-card-grid" style="border-top: 4px solid ${getFileColor(file.subject)}" onclick="app.ui.previewFile(${file.id})">
                            <div class="file-icon-large">
                                <i class="ph ph-file-${file.type}"></i>
                            </div>
                            <div class="file-info-grid">
                                <h4>${file.name}</h4>
                                <span class="file-meta">${file.date} • ${file.size || '2MB'}</span>
                            </div>
                            <div class="file-date-grid" style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">${file.date}</div>
                            <div class="file-actions-grid" style="display: flex; gap: 0.5rem; justify-content: center;">
                                <button class="btn-xs" style="padding: 0.3rem 0.6rem;" onclick="event.stopPropagation(); app.ui.renameFile(${file.id})"><i class="ph ph-pencil-simple"></i></button>
                                <button class="btn-xs" style="padding: 0.3rem 0.6rem; background: rgba(255, 118, 117, 0.1); color: #ff7675;" onclick="event.stopPropagation(); app.ui.deleteFile(${file.id})"><i class="ph ph-trash"></i></button>
                            </div>
                        </div>
                    `).join('')
                }
                    <!--Add File Card-->
    <div class="glass-panel file-card-grid dashed" onclick="app.ui.openUploadModal()">
        <i class="ph ph-upload-simple" style="font-size: 2rem; color: var(--primary);"></i>
        <span style="margin-top: 0.5rem; font-weight: 600;">Upload File</span>
    </div>
                </div>
    `;
        } else {
            filesHtml = `
    <div class="glass-panel" style = "overflow-x: auto;" >
        <table class="files-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Size</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${files.map(file => `
                                <tr>
                                    <td onclick="app.ui.previewFile(${file.id})" style="cursor: pointer;">
                                        <div style="display: flex; align-items: center; gap: 0.8rem;">
                                            <i class="ph ph-file-${file.type}" style="color: ${getFileColor(file.subject)}; font-size: 1.2rem;"></i>
                                            ${file.name}
                                        </div>
                                    </td>
                                    <td><span class="badge" style="background: ${getFileColor(file.subject)}20; color: ${getFileColor(file.subject)}">${file.subject || 'General'}</span></td>
                                    <td>${file.date}</td>
                                    <td>${file.size || '2MB'}</td>
                                    <td>
                                        <button class="btn-icon" onclick="app.ui.previewFile(${file.id})"><i class="ph ph-eye"></i></button>
                                        <button class="btn-icon" onclick="app.ui.renameFile(${file.id})"><i class="ph ph-pencil-simple"></i></button>
                                        <button class="btn-icon" style="color: #ff7675;" onclick="app.ui.deleteFile(${file.id})"><i class="ph ph-trash"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
            </tbody>
        </table>
                </div>
    <button class="btn btn-primary" style="margin-top: 1rem;" onclick="app.ui.openUploadModal()">
        <i class="ph ph-upload-simple"></i> Upload New File
    </button>
`;
        }

        const content = `
    <div class="docs-header" style = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;" >
                <div class="view-toggles glass-panel" style="padding: 0.5rem; display: flex; gap: 0.5rem;">
                    <button class="btn-icon ${this.documentsView === 'list' ? 'active' : ''}" onclick="app.ui.setDocumentsView('list')"><i class="ph ph-list"></i></button>
                    <button class="btn-icon ${this.documentsView === 'grid' ? 'active' : ''}" onclick="app.ui.setDocumentsView('grid')"><i class="ph ph-grid-four"></i></button>
                </div>
                <div class="search-bar glass-panel" style="padding: 0.5rem 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="ph ph-magnifying-glass"></i>
                    <input type="text" placeholder="Search files..." style="border: none; background: transparent; outline: none; color: var(--text-main);">
                </div>
            </div>
    ${filesHtml}
`;

        this.renderLayout('documents', 'My Documents', content);
    }

    setDocumentsView(view) {
        this.documentsView = view;
        this.renderDocuments();
    }

    openUploadModal() {
        const modalHtml = `
    <div class="modal-overlay active" onclick = "if(event.target === this) this.remove()" >
        <div class="modal">
            <h3>Upload File</h3>
            <div class="upload-area" id="drop-zone">
                <i class="ph ph-cloud-arrow-up" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
                <p>Drag & Drop files here or</p>
                <button class="btn btn-primary" onclick="document.getElementById('file-input').click()">Browse Files</button>
                <input type="file" id="file-input" hidden onchange="app.ui.handleFileUpload(this.files[0])">
            </div>
            <div id="upload-progress" style="display: none; margin-top: 1.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span id="upload-filename">frontend_assignment.pdf</span>
                    <span id="upload-percent">0%</span>
                </div>
                <div class="progress-bar" style="height: 6px; background: var(--border); border-radius: 3px; overflow: hidden;">
                    <div id="upload-bar" style="width: 0%; height: 100%; background: var(--primary); transition: width 0.2s;"></div>
                </div>
            </div>
        </div>
            </div>
    `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    handleFileUpload(file) {
        if (!file) return;

        const progressDiv = document.getElementById('upload-progress');
        const filenameSpan = document.getElementById('upload-filename');
        const percentSpan = document.getElementById('upload-percent');
        const bar = document.getElementById('upload-bar');

        progressDiv.style.display = 'block';
        filenameSpan.textContent = file.name;

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress > 100) progress = 100;

            percentSpan.textContent = progress + '%';
            bar.style.width = progress + '%';

            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    // Success logic
                    const type = file.name.split('.').pop().toLowerCase();
                    const iconType = ['pdf', 'doc', 'docx', 'xls'].includes(type) ? 'pdf' : 'file';

                    const context = this.uploadContext || {};

                    this.store.addFile({
                        name: file.name,
                        type: iconType === 'pdf' ? 'pdf' : 'doc',
                        date: 'Just now',
                        subject: context.subjectId || 'math',
                        category: context.category || 'lessons',
                        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
                    });

                    document.querySelector('.modal-overlay').remove();

                    // Refresh view based on where we are
                    if (context.subjectId) {
                        this.renderSubjectDetails(context.subjectId);
                    } else {
                        this.renderDocuments();
                    }

                    alert("File uploaded successfully!");
                    this.uploadContext = null; // Clear context
                }, 500);
            }
        }, 200);
    }

    renderSettings() {
        const settings = this.store.getSettings();
        const user = this.store.getUser();

        const content = `
    < h2 > Settings</h2 >

        <div class="glass-panel" style="padding: 2rem; max-width: 600px;">
        </select>
                    </div>
                     <div class="settings-item">
                        <span>Language</span>
                         <select class="form-select" style="width: auto;" onchange="app.ui.updateSetting('language', this.value)">
                            <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                            <option value="fr" ${settings.language === 'fr' ? 'selected' : ''}>Français</option>
                            <option value="ar" ${settings.language === 'ar' ? 'selected' : ''}>العربية</option>
                        </select>
                    </div>
                    <div class="settings-item">
                        <span>Animations</span>
                        <div class="toggle-switch ${settings.animations ? 'active' : ''}" onclick="app.ui.updateSetting('animations', !${settings.animations})">
                            <div class="toggle-thumb"></div>
                        </div>
                    </div>
                     <!--Study Tips Permissions Section-->
                    <div class="settings-divider" style="height: 1px; background: var(--border); margin: 2rem 0;"></div>
                    <h3 style="margin-bottom: 1rem;">Study Tips Permissions</h3>
                    <div class="settings-item">
                         <span>Show Tips on Dashboard</span>
                         <div class="toggle-switch active">
                            <div class="toggle-thumb"></div>
                        </div>
                    </div>
                     <div class="settings-item">
                         <span>Allow Progress Analysis</span>
                         <div class="toggle-switch active">
                            <div class="toggle-thumb"></div>
                        </div>
                    </div>
                </div>
            </div>
    `;
        this.renderLayout('settings', 'Settings', content);
    }

    updateSetting(key, value) {
        this.store.updateSettings({ [key]: value });
        this.applySettings();
        this.renderSettings(); // Re-render to show updated state (e.g. toggle switch)
    }

    updateGender(gender) {
        this.store.updateUser({ gender: gender });
        this.applySettings(); // Will update the css variable
        // We don't need to full re-render profile as radio button state is handled by browser mostly, 
        // but if we want to be safe we could, but applySettings is visual enough.
    }

    handleAvatarUpload(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.store.updateUser({ avatar: e.target.result });
                this.renderProfile(); // Re-render to show new avatar in header and profile
                this.showToast("Profile picture updated!", "success");
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    renderProfile() {
        const user = this.store.getUser();
        const content = `
    <div class="glass-panel animate-slide-up" style = "padding: 3rem; max-width: 800px; margin: 0 auto;" >
                <div class="profile-header">
                    <div class="profile-avatar" style="position: relative; cursor: pointer; overflow: hidden;" onclick="document.getElementById('avatar-upload').click()">
                        <img src="${user.avatar}" alt="${user.name}" style="width: 100%; height: 100%; object-fit: cover;">
                        <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0">
                            <i class="ph ph-camera" style="color: white; font-size: 2rem;"></i>
                        </div>
                    </div>
                    <input type="file" id="avatar-upload" hidden accept="image/*" onchange="app.ui.handleAvatarUpload(this)">
                    <div>
                        <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">${user.name}</h1>
                        <p style="color: var(--text-muted); font-size: 1.2rem;">${user.grade}</p>
                        <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                            <span style="background: var(--primary-glow); color: var(--primary); padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.9rem;">🚀 Pro Student</span>
                            <span style="background: rgba(46, 213, 115, 0.1); color: #2ed573; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.9rem;">🟢 Online</span>
                        </div>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="glass-panel stat-card">
                        <i class="ph ph-fire" style="font-size: 2rem; color: #ff7675;"></i>
                        <div class="stat-value">${user.stats.streak}</div>
                        <div class="stat-label">Day Streak</div>
                    </div>
                    <div class="glass-panel stat-card">
                        <i class="ph ph-clock" style="font-size: 2rem; color: #74b9ff;"></i>
                        <div class="stat-value">${user.stats.hoursStudied}h</div>
                        <div class="stat-label">Hours Focused</div>
                    </div>
                    <div class="glass-panel stat-card">
                        <i class="ph ph-check-circle" style="font-size: 2rem; color: #55efc4;"></i>
                        <div class="stat-value">${user.stats.assignmentsDone}</div>
                        <div class="stat-label">Tasks Done</div>
                    </div>
                </div>

                <h3>Personalization</h3>
                <div class="glass-panel" style="padding: 1.5rem; margin-top: 1rem; margin-bottom: 2rem;">
                    <div class="settings-item">
                        <span>Gender Theme</span>
                        <div style="display: flex; gap: 1rem;">
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="radio" name="gender" value="male" ${user.gender === 'male' ? 'checked' : ''} onchange="app.ui.updateGender('male')">
                                <span>Male</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="radio" name="gender" value="female" ${user.gender === 'female' ? 'checked' : ''} onchange="app.ui.updateGender('female')">
                                <span>Female</span>
                            </label>
                        </div>
                    </div>
                </div>

                <h3>Account Settings</h3>
                <div class="glass-panel" style="padding: 2rem; display: grid; gap: 1.5rem;">
                     <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" class="form-input" value="${user.name}" onchange="app.store.updateUser({name: this.value}); app.ui.renderProfile();">
                    </div>
                    
                    <div class="form-group">
                        <label style="color: var(--accent);">Current Grade Level (Dedicated)</label>
                        <select class="form-select" onchange="app.store.updateUser({grade: this.value}); app.ui.renderProfile();">
                            <option ${user.grade === '1st Baccalaureate' ? 'selected' : ''}>1st Baccalaureate</option>
                            <option ${user.grade === '2nd Baccalaureate' ? 'selected' : ''}>2nd Baccalaureate</option>
                            <option ${user.grade === 'College Year 1' ? 'selected' : ''}>College Year 1</option>
                        </select>
                         <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">
                            This setting adjusts your curriculum and difficulty. It evolves as you progress.
                        </p>
                    </div>

                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" class="form-input" value="student@studyspace.com" disabled style="opacity: 0.7; cursor: not-allowed;">
                    </div>

                     <div class="form-group">
                        <label>Bio</label>
                        <textarea class="form-input" rows="3" placeholder="Tell us about your goals...">Aiming for top honors!</textarea>
                    </div>

                    <div style="text-align: right;">
                        <button class="btn btn-primary">Save Changes</button>
                    </div>
                </div>
            </div>
    `;

        this.renderLayout('profile', 'My Profile', content);
    }

    initKineticEffects() {
        // Simple Magnetic Effect implementation
        const kineticElements = document.querySelectorAll('.icon-cell, .btn-primary, .kinetic-element');

        kineticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Strength of effect
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }

    renderSubject(subject) {
        const content = `
    < header class="app-header" style = "margin-bottom: 2rem;" >
                <div class="header-left">
                    <button class="btn" id="back-btn" style="background: transparent; padding-left: 0; color: var(--text-muted);">
                        <i class="ph ph-arrow-left"></i> Back
                    </button>
                    <h2 style="color: ${subject.color}; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ph ph-${subject.icon}"></i> ${subject.name}
                    </h2>
                </div>
                <button class="btn btn-primary">
                    <i class="ph ph-plus"></i> Add File
                </button>
            </header >

    <main class="subject-detail animate-slide-up">
        <div class="tabs" style="display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">
            <button class="btn active" style="background: var(--primary); color: white;">Lessons</button>
            <button class="btn" style="background: transparent; color: var(--text-muted);">Exercises</button>
            <button class="btn" style="background: transparent; color: var(--text-muted);">Exams</button>
        </div>

        <div class="glass-panel" style="padding: 2rem; text-align: center; color: var(--text-muted);">
            <i class="ph ph-folder-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
            <p>No content uploaded for ${subject.name} yet.</p>
            <button class="btn btn-primary" style="margin: 1rem auto;">Upload first lesson</button>
        </div>
    </main>
`;

        this.renderLayout('dashboard', `Subject: ${subject.name} `, content);

        // Re-bind back button since renderLayout wipes DOM
        document.getElementById('back-btn').addEventListener('click', () => this.renderDashboard());
    }

    createSubjectCard(subject, index) {
        return `
    <div class="glass-panel subject-card animate-slide-up"
onclick = "app.ui.renderSubjectDetails('${subject.id}')"
style = "--subject-color: ${subject.color}; animation-delay: ${index * 100}ms;" >
                
                <div class="subject-card-icon">
                    <i class="ph ph-${subject.icon}"></i>
                </div>
                
                <div class="subject-card-content">
                    <h4>${subject.name}</h4>
                    <p class="subject-progress-text">${subject.progress}% Mastered</p>
                    
                    <div class="glowing-progress-track">
                        <div class="glowing-progress-bar" style="width: ${subject.progress}%;"></div>
                    </div>
                </div>
            </div>
    `;
    }

    renderSubjectDetails(subjectId) {
        const subject = this.store.getSubject(subjectId);
        if (!subject) return;

        // Default tab
        if (!this.activeSubjectTab) this.activeSubjectTab = 'lessons';

        const files = this.store.getSubjectFiles(subjectId, this.activeSubjectTab);

        const content = `
    <div class="subject-header animate-fade-in" style = "margin-bottom: 2rem;" >
                <button class="btn-icon" onclick="app.ui.renderDashboard()" style="margin-bottom: 1rem;">
                    <i class="ph ph-arrow-left" style="font-size: 1.2rem;"></i> Back
                </button>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div class="subject-icon" style="background: ${subject.color}20; color: ${subject.color}; width: 60px; height: 60px; font-size: 2rem;">
                        <i class="ph ph-${subject.icon}"></i>
                    </div>
                    <div>
                        <h2 style="margin: 0;">${subject.name}</h2>
                        <p style="color: var(--text-muted);">Manage your materials</p>
                    </div>
                </div>
            </div>

            <div class="subject-tabs glass-panel" style="padding: 0.5rem; margin-bottom: 2rem; display: flex; gap: 1rem;">
                <button class="tab-btn ${this.activeSubjectTab === 'lessons' ? 'active' : ''}" onclick="app.ui.setSubjectTab('${subjectId}', 'lessons')">Lessons</button>
                <button class="tab-btn ${this.activeSubjectTab === 'exercises' ? 'active' : ''}" onclick="app.ui.setSubjectTab('${subjectId}', 'exercises')">Exercises</button>
                <button class="tab-btn ${this.activeSubjectTab === 'exams' ? 'active' : ''}" onclick="app.ui.setSubjectTab('${subjectId}', 'exams')">Exams</button>
            </div>

            <div class="subject-content animate-slide-up">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3>${this.activeSubjectTab.charAt(0).toUpperCase() + this.activeSubjectTab.slice(1)}</h3>
                    <button class="btn btn-primary glow-effect" onclick="app.ui.openUploadModal('${subjectId}', '${this.activeSubjectTab}')">
                        <i class="ph ph-upload-simple"></i> Upload first lesson
                    </button>
                </div>
                
                ${this.renderSubjectFilesGrid(files, subject.color)}
            </div>
`;

        this.renderLayout('dashboard', subject.name, content);
    }

    setSubjectTab(subjectId, tab) {
        this.activeSubjectTab = tab;
        this.renderSubjectDetails(subjectId);
    }

    renderSubjectFilesGrid(files, color) {
        if (files.length === 0) {
            return `
    <div class="glass-panel dashed" style = "padding: 4rem; text-align: center;" >
                    <div class="folder-pulse">
                        <i class="ph ph-folder-notch-open" style="font-size: 4rem; color: var(--text-muted); opacity: 0.5;"></i>
                    </div>
                    <h3 style="margin-top: 1rem; color: var(--text-muted);">No content uploaded</h3>
                    <p style="color: var(--text-muted);">Upload your first file to get started.</p>
                </div>
    `;
        }

        return `
    <div class="files-grid" >
        ${files.map(file => {
            // Create Download Button Logic
            let downloadBtn = '';
            let previewBtn = '';

            if (file.dataUrl) {
                // Real File
                // Real File
                // Use ID to reference file in store to avoid huge inline strings
                const fileId = file.id;

                downloadBtn = `
                            <button class="btn-sm" onclick="app.ui.triggerDownload('${fileId}')" title="Download" style="color: var(--primary);">
                                <i class="ph ph-download-simple"></i>
                            </button>
                        `;
                previewBtn = `
                            <button class="btn-sm" onclick="app.ui.previewFile('${fileId}')" title="Preview">
                                <i class="ph ph-eye"></i>
                            </button>
                        `;
            } else {
                // Mock File
                downloadBtn = `
                            <button class="btn-sm" onclick="alert('Simulation: Downloading ${file.name}...')" title="Download Mock" style="color: var(--text-muted);">
                                <i class="ph ph-download-simple"></i>
                            </button>
                        `;
                previewBtn = `
                            <button class="btn-sm" onclick="alert('Simulation: Previewing ${file.name}...')" title="Preview Mock">
                                <i class="ph ph-eye"></i>
                            </button>
                        `;
            }

            return `
                    <div class="glass-panel file-card-grid" style="border-top: 4px solid ${color};">
                        <div class="file-icon-large" style="color: ${color};">
                            <i class="ph ph-file-${file.type}"></i>
                        </div>
                        <div class="file-info-grid">
                            <h4 style="font-size: 1rem;">${file.name}</h4>
                            <span class="file-meta">${file.size || '1.2 MB'} • ${file.type.toUpperCase()}</span>
                        </div>
                        <div class="file-actions" style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                            ${previewBtn}
                            ${downloadBtn}
                        </div>
                    </div>
                `}).join('')
            }
            </div>
    `;
    }

    // File Actions
    // File Actions
    previewFile(id) {
        const file = this.store.getFile(id);
        if (!file) {
            this.showToast("File not found!", "error");
            return;
        }

        // Handle Image Previews
        if (file.type === 'image' || file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) || (file.dataUrl && file.dataUrl.startsWith('data:image'))) {
            const modalHtml = `
                <div class="modal-overlay active" onclick="if(event.target === this) this.remove()">
                    <div class="modal" style="width: 80vh; height: 80vh; max-width: 95%; background: transparent; box-shadow: none; display: flex; align-items: center; justify-content: center;">
                        <img src="${file.dataUrl}" style="max-width: 100%; max-height: 100%; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <button class="btn-icon" onclick="this.closest('.modal-overlay').remove()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.5); color: white;">
                            <i class="ph ph-x"></i>
                        </button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            return;
        }

        // Handle Other Documents (PDF, Text, etc.) - Try to open in Iframe Modal
        const modalHtml = `
            <div class="modal-overlay active" onclick="if(event.target === this) this.remove()">
                <div class="modal" style="width: 90vw; height: 90vh; max-width: 1200px; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="ph ph-file-text" style="color: var(--primary);"></i>
                            ${file.name}
                        </h3>
                        <div style="display: flex; gap: 0.5rem;">
                             <button class="btn-sm" onclick="app.ui.triggerDownload('${file.id}')">
                                <i class="ph ph-download-simple"></i> Download
                            </button>
                            <button class="btn-icon" onclick="this.closest('.modal-overlay').remove()">
                                <i class="ph ph-x"></i>
                            </button>
                        </div>
                    </div>
                    <div style="flex-grow: 1; background: var(--bg-main); border-radius: 8px; overflow: hidden; position: relative;">
                        <iframe src="${file.dataUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    renameFile(id) {
        const file = this.store.getFile(id);
        if (!file) return;

        const newName = prompt("Enter new file name:", file.name);
        if (newName && newName.trim() !== "") {
            this.store.renameFile(id, newName.trim());
            this.renderDocuments(); // Re-render current view
            this.showToast("File renamed successfully", "success");
        }
    }

    deleteFile(id) {
        if (confirm("Are you sure you want to delete this file?")) {
            this.store.deleteFile(id);
            this.renderDocuments(); // Re-render
            this.showToast("File deleted", "success");
        }
    }

    triggerDownload(id) {
        const file = this.store.getFile(id);
        if (!file) {
            this.showToast("File not found!", "error");
            return;
        }

        const link = document.createElement('a');
        link.href = file.dataUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showToast("Download started!", "success");
    }

    renderTips() {
        const tips = [
            { icon: 'timer', color: '#ff7675', title: 'The Pomodoro Technique', text: 'Work for 25 minutes, then take a 5 minute break. After 4 cycles, take a longer break.' },
            { icon: 'brain', color: '#74b9ff', title: 'Active Recall', text: 'Don\'t just re-read. Test yourself. Close the book and try to recite what you learned.' },
            { icon: 'calendar-check', color: '#55efc4', title: 'Spaced Repetition', text: 'Review material at increasing intervals (1 day, 3 days, 1 week) to combat forgetting.' }
        ];

        let activeTip = 0;

        const content = `
     <div class="animate-slide-up" >
                <div class="glass-panel" style="padding: 3rem; margin-bottom: 2rem; text-align: center; background: linear-gradient(135deg, rgba(108, 92, 231, 0.1) 0%, rgba(162, 155, 254, 0.1) 100%); position: relative; overflow: hidden;">
                    <i class="ph ph-lightbulb" style="font-size: 4rem; color: var(--accent); margin-bottom: 1rem; animation: float 3s ease-in-out infinite;"></i>
                    <h2 style="margin-bottom: 0.5rem; font-family: var(--font-heading); font-size: 2rem;">Master Your Learning</h2>
                    <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto; font-size: 1.1rem;">Discover scientifically proven techniques to study smarter, not harder.</p>
                </div>

                <div class="tip-carousel-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                    ${tips.map((tip, index) => `
                        <div class="glass-panel tip-card" style="border-top: 4px solid ${tip.color}; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-10px)'; this.style.boxShadow='0 15px 30px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--card-shadow)';">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                                <div style="width: 50px; height: 50px; border-radius: 50%; background: ${tip.color}20; display: flex; align-items: center; justify-content: center;">
                                    <i class="ph ph-${tip.icon}" style="color: ${tip.color}; font-size: 1.5rem;"></i>
                                </div>
                                <span class="badge" style="background: ${tip.color}20; color: ${tip.color};">Tip #${index + 1}</span>
                            </div>
                            <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">${tip.title}</h3>
                            <p style="color: var(--text-muted); line-height: 1.6;">${tip.text}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="glass-panel" style="margin-top: 2rem; padding: 2rem;">
                    <h3><i class="ph ph-sliders"></i> Study Tips Settings</h3>
                    <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Manage how the study assistant interacts with your learning data.</p>
                    
                    <div class="settings-group">
                         <div class="settings-item">
                            <span>Personalized Recommendations</span>
                            <div class="toggle-switch active" onclick="this.classList.toggle('active')">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>
                        <div class="settings-item">
                            <span>Daily Tip Notification</span>
                            <div class="toggle-switch" onclick="this.classList.toggle('active')">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `;
        this.renderLayout('tips', 'Study Tips', content);
    }

    // Enhanced Upload & Toast Logic
    showToast(message, type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const icons = {
            'success': 'check-circle',
            'error': 'warning-circle',
            'info': 'info'
        };

        const colors = {
            'success': '#2ed573',
            'error': '#ff7675',
            'info': 'var(--primary)'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type} `;
        toast.innerHTML = `
    < i class="ph ph-${icons[type]}" style = "color: ${colors[type]}; font-size: 1.5rem;" ></i >
        <span style="font-weight: 500;">${message}</span>
`;

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    openUploadModal(subjectId = null, category = null) {
        this.uploadContext = { subjectId, category };

        const modalHtml = `
    <div class="modal-overlay active" onclick = "if(event.target === this) this.remove()" >
        <div class="modal">
            <h3>Upload File ${category ? `to ${category}` : ''}</h3>
            <p style="color: var(--text-muted); margin-bottom: 1rem;">Drag and drop your files here or click to browse.</p>

            <div class="upload-drop-zone" id="drop-zone">
                <i class="ph ph-cloud-arrow-up" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem; opacity: 0.7;"></i>
                <p style="font-weight: 600;">Click to upload or drag & drop</p>
                <p style="font-size: 0.8rem; color: var(--text-muted);">PDF, DOCX, XLS or Images (max 2MB)</p>
                <input type="file" id="file-upload-input" hidden>
            </div>

            <div id="selected-file-display" style="display: none;"></div>

            <div class="progress-container" style="margin-bottom: 1rem; display: none;" id="upload-progress-container">
                <div class="progress-bar" style="width: 100%; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden;">
                    <div class="progress-bar-fill" style="width: 0%; height: 100%; background: var(--primary); transition: width 0.2s;"></div>
                </div>
                <span class="progress-percent" style="font-size: 0.8rem; float: right; margin-top: 0.2rem;">0%</span>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;">
                <button class="btn" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
                <button class="btn btn-primary" id="upload-btn" disabled style="opacity: 0.6; cursor: not-allowed;">Upload</button>
            </div>
        </div>
            </div>
    `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const dropZone = document.getElementById('drop-zone');
        const uploadInput = document.getElementById('file-upload-input');
        const uploadBtn = document.getElementById('upload-btn');
        const fileDisplay = document.getElementById('selected-file-display');

        let selectedFile = null;

        // Drag & Drop Events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        });

        // Click to browse
        dropZone.addEventListener('click', () => uploadInput.click());
        uploadInput.addEventListener('change', function () {
            handleFiles(this.files);
        });

        function handleFiles(files) {
            if (files.length > 0) {
                selectedFile = files[0];
                updateFileDisplay();
                uploadBtn.disabled = false;
                uploadBtn.style.opacity = '1';
                uploadBtn.style.cursor = 'pointer';
            }
        }

        function updateFileDisplay() {
            if (!selectedFile) return;
            const size = (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB';
            fileDisplay.style.display = 'block';
            fileDisplay.innerHTML = `
    <div class="upload-selected-file" >
                    <i class="ph ph-file-text" style="font-size: 1.5rem; color: var(--primary);"></i>
                    <div style="flex-grow: 1;">
                        <div style="font-weight: 600; font-size: 0.9rem;">${selectedFile.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${size}</div>
                    </div>
                    <i class="ph ph-check-circle" style="color: #2ed573;"></i>
                </div>
    `;
            // Hide drop zone instruction to save space or keep it, user choice. hiding for cleaner look
            dropZone.style.display = 'none';
        }

        uploadBtn.addEventListener('click', () => {
            if (selectedFile) {
                if (selectedFile.size > 2 * 1024 * 1024) {
                    this.showToast("File too large! Max 2MB.", 'error');
                    return;
                }
                const progressContainer = document.getElementById('upload-progress-container');
                const progressBar = document.querySelector('.progress-bar-fill');
                const percentSpan = document.querySelector('.progress-percent');

                progressContainer.style.display = 'block';
                uploadBtn.disabled = true;

                this.simulateUpload(selectedFile, progressBar, percentSpan);
            }
        });
    }

    simulateUpload(file, bar, percent) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const dataUrl = e.target.result;

            // Step-based simulation for more realistic feel
            let progress = 0;
            const interval = setInterval(() => {
                // Randomize speed
                progress += Math.random() * 15;
                if (progress > 100) progress = 100;

                percent.textContent = Math.floor(progress) + '%';
                bar.style.width = progress + '%';

                if (progress === 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        // Success logic
                        const type = file.name.split('.').pop().toLowerCase();
                        const iconType = ['pdf', 'doc', 'docx', 'xls'].includes(type) ? 'pdf' : 'file';

                        const context = this.uploadContext || {};

                        this.store.addFile({
                            name: file.name,
                            type: iconType === 'pdf' ? 'pdf' : 'doc',
                            date: 'Just now',
                            subject: context.subjectId || 'math',
                            category: context.category || 'lessons',
                            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                            dataUrl: dataUrl
                        });

                        document.querySelector('.modal-overlay').remove();

                        if (context.subjectId) {
                            this.renderSubjectDetails(context.subjectId);
                        } else {
                            this.renderDocuments();
                        }

                        this.showToast("File uploaded successfully!", 'success');
                        this.uploadContext = null;
                    }, 600);
                }
            }, 100);
        };

        reader.readAsDataURL(file);
    }

    bindEvents() {
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
            });
        }

        // Initialize switches (for settings page)
        const switches = document.querySelectorAll('.toggle-switch');
        switches.forEach(sw => {
            sw.addEventListener('click', () => {
                sw.classList.toggle('active');
                if (sw.id === 'setting-theme') {
                    const current = document.documentElement.getAttribute('data-theme');
                    document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
                }
            });
        });

        // Delegate click for subject cards
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.subject-card');
            if (card) {
                const id = card.getAttribute('data-id');
                const subject = this.store.getSubjects().find(s => s.id === id);
                if (subject) this.renderSubject(subject);
            }
        });

        // Add hover effect for icons via JS delegate (optional, but css is better)


    }

    renderWelcome() {
        // Welcome / Landing Screen
        this.appContainer.innerHTML = `
    <div style = "min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; background: var(--bg-main);" >
                
                <div class="animate-slide-up" style="margin-bottom: 2rem;">
                    <div style="font-family: var(--font-heading); font-weight: 800; font-size: 4rem; color: var(--text-main); margin-bottom: 0.5rem;">
                        StudySpace<span style="color: var(--primary);">.</span>
                    </div>
                    <p style="font-size: 1.2rem; color: var(--text-muted); max-width: 500px; margin: 0 auto; line-height: 1.6;">
                        Your all-in-one platform to organize, study, and achieve your academic goals.
                        <br>Designed for efficiency, focused on your success.
                    </p>
                </div>

                <div class="animate-slide-up" style="animation-delay: 0.2s;">
                    <button class="btn btn-primary" onclick="app.ui.renderDashboard()" style="padding: 1rem 2.5rem; font-size: 1.1rem;">
                        Get Started <i class="ph ph-arrow-right"></i>
                    </button>
                    <p style="margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted);">
                        Made Khalil ❤️ Welcome students
                    </p>
                </div>

                <!--Abstract decorations-->
                <div style="position: absolute; top: 10%; left: 10%; width: 300px; height: 300px; background: var(--primary); opacity: 0.05; filter: blur(80px); border-radius: 50%; pointer-events: none;"></div>
                <div style="position: absolute; bottom: 10%; right: 10%; width: 250px; height: 250px; background: var(--secondary); opacity: 0.05; filter: blur(80px); border-radius: 50%; pointer-events: none;"></div>
            </div>
    `;
    }
    triggerConfetti() {
        const colors = ['#6c5ce7', '#00cec9', '#fdcb6e', '#ff7675', '#a29bfe'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.transition = 'all 3s ease-out';

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.style.top = window.innerHeight + 'px';
                confetti.style.transform = `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 50 - 25}px)`;
                confetti.style.opacity = '0';
            }, 100);

            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }
}
