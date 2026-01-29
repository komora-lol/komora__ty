/**
 * Store - Manages data and state
 */
class Store {
    constructor() {
        // Load from local storage or use defaults
        const saved = localStorage.getItem('studySpaceData');
        if (saved) {
            const data = JSON.parse(saved);
            Object.assign(this, data);
        } else {
            this.initDefaults();
        }
    }

    initDefaults() {
        this.user = {
            name: "Student",
            grade: "1st Baccalaureate",
            gender: "male",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix",
            stats: {
                streak: 12,
                hoursStudied: 45,
                assignmentsDone: 28
            }
        };

        this.settings = {
            theme: 'light',
            language: 'en',
            dashboardLayout: 'normal',
            pomodoroTime: 25,
            animations: true,
            fontSize: 'medium'
        };

        this.subjects = [
            { id: "math", name: "Mathematics", icon: "function", color: "#e17055", progress: 78 },
            { id: "pc", name: "Physics & Chemistry", icon: "atom", color: "#0984e3", progress: 65 },
            { id: "svt", name: "Life & Earth Sciences", icon: "dna", color: "#00b894", progress: 42 },
            { id: "eng", name: "English", icon: "chat-circle-text", color: "#fdcb6e", progress: 85 },
            { id: "phi", name: "Philosophy", icon: "brain", color: "#6c5ce7", progress: 30 },
            { id: "ei", name: "Islamic Education", icon: "book-open-text", color: "#2d3436", progress: 90 },
            { id: "ar", name: "Arabic", icon: "pen-nib", color: "#d63031", progress: 50 },
            { id: "hg", name: "History & Geography", icon: "globe-hemisphere-west", color: "#e84393", progress: 60 }
        ];

        // Interactive Calendar Events
        this.events = [
            { id: 1, day: 'Monday', time: '09:00', title: 'Mathematics', type: 'class', color: '#ff7675' },
            { id: 2, day: 'Monday', time: '11:00', title: 'Physics', type: 'class', color: '#74b9ff' },
            { id: 3, day: 'Tuesday', time: '10:00', title: 'English', type: 'class', color: '#fd79a8' },
            { id: 4, day: 'Wednesday', time: '14:00', title: 'Study Math', type: 'study', color: '#55efc4' },
            { id: 5, day: 'Friday', time: '09:00', title: 'Islamic Edu', type: 'class', color: '#00b894' }
        ];

        this.dailyGoals = [
            { id: 1, text: 'Review Math Chapter 4', done: false },
            { id: 2, text: 'Complete French Essay', done: true },
            { id: 3, text: 'Read 20 pages of History', done: false }
        ];

        this.recentFiles = [
            { id: 101, name: 'Math_Functions_Summary.pdf', type: 'pdf', date: '2h ago', subject: 'math', category: 'lessons', isMock: true },
            { id: 102, name: 'Physics_Mechanics_Ex1.docx', type: 'doc', date: '5h ago', subject: 'phys', category: 'exercises', isMock: true },
            { id: 103, name: 'English_Vocabulary_List.pdf', type: 'pdf', date: '1d ago', subject: 'eng', category: 'lessons', isMock: true },
            { id: 104, name: 'Math_Calculus_Exam_2024.pdf', type: 'pdf', date: '3d ago', subject: 'math', category: 'exams', isMock: true }
        ];

        this.weeklyProgress = [
            { day: 'Mon', hours: 4 },
            { day: 'Tue', hours: 2.5 },
            { day: 'Wed', hours: 5 },
            { day: 'Thu', hours: 3 },
            { day: 'Fri', hours: 0 },
            { day: 'Sat', hours: 0 },
            { day: 'Sun', hours: 0 }
        ];

        this.motivationQuotes = [
            "Believe you can and you're halfway there.",
            "Success is the sum of small efforts, repeated day in and day out.",
            "The future depends on what you do today.",
            "Don't watch the clock; do what it does. Keep going.",
            "Your limitation—it's only your imagination."
        ];

        this.notes = [
            { id: 1, title: 'Math Formulas', content: 'Remember quadratic formula...', color: '#ffeaa7' },
            { id: 2, title: 'French Verbs', content: 'Subjonctif endings: -e, -es, -e...', color: '#fab1a0' },
            { id: 3, title: 'Physics Project', content: 'Buy materials for the circuit.', color: '#74b9ff' }
        ];
    }

    save() {
        localStorage.setItem('studySpaceData', JSON.stringify(this));
    }

    // --- Accessors & Mutators ---

    getSubjects() {
        return this.subjects || [];
    }

    getSubject(id) {
        return this.subjects.find(s => s.id === id);
    }

    getUser() {
        return this.user;
    }

    getEvents() {
        return this.events || [];
    }

    addEvent(event) {
        this.events.push({
            ...event,
            id: Date.now()
        });
        this.save();
    }

    updateEvent(updatedEvent) {
        const index = this.events.findIndex(e => e.id === updatedEvent.id);
        if (index !== -1) {
            this.events[index] = updatedEvent;
            this.save();
        }
    }

    deleteEvent(id) {
        this.events = this.events.filter(e => e.id !== id);
        this.save();
    }

    getDailyGoals() {
        return this.dailyGoals || [];
    }

    addDailyGoal(text) {
        this.dailyGoals.push({ id: Date.now(), text, done: false });
        this.save();
    }

    toggleDailyGoal(id) {
        const goal = this.dailyGoals.find(g => g.id === id);
        if (goal) {
            goal.done = !goal.done;
            this.save();
        }
    }

    getRecentFiles() {
        return this.recentFiles || [];
    }

    getSubjectFiles(subjectId, category = null) {
        let files = this.recentFiles.filter(f => f.subject === subjectId);
        if (category) {
            files = files.filter(f => f.category === category);
        }
        return files;
    }

    getFile(id) {
        return this.recentFiles.find(f => f.id === id || f.id === parseInt(id));
    }

    addFile(file) {
        this.recentFiles.unshift({
            ...file,
            id: Date.now()
        });
        this.save();
    }

    deleteFile(id) {
        this.recentFiles = this.recentFiles.filter(f => f.id !== id);
        this.save();
    }

    renameFile(id, newName) {
        const file = this.recentFiles.find(f => f.id === id);
        if (file) {
            file.name = newName;
            this.save();
        }
    }

    getWeeklyProgress() {
        return this.weeklyProgress || [];
    }

    getRandomQuote() {
        return this.motivationQuotes[Math.floor(Math.random() * this.motivationQuotes.length)];
    }

    getNotes() {
        return this.notes || [];
    }

    addNote(note) {
        this.notes.push({
            ...note,
            id: Date.now()
        });
        this.save();
    }

    updateNote(updatedNote) {
        const index = this.notes.findIndex(n => n.id === updatedNote.id);
        if (index !== -1) {
            this.notes[index] = updatedNote;
            this.save();
        }
    }

    deleteNote(id) {
        this.notes = this.notes.filter(n => n.id !== id);
        this.save();
    }

    getSettings() {
        return this.settings || {};
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.save();
    }

    updateUser(updates) {
        this.user = { ...this.user, ...updates };
        this.save();
    }
}
