/**
 * StudySpace - Main Application Entry
 */



class App {
    constructor() {
        this.store = new Store();
        this.ui = new UI(this.store);
    }

    init() {
        console.log('StudySpace Initializing...');

        // Simulate loading time
        setTimeout(() => {
            document.querySelector('.loading-screen').classList.add('hidden');
            this.ui.renderDashboard();
        }, 800);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    window.app = app; // For debugging
    app.init();
});
