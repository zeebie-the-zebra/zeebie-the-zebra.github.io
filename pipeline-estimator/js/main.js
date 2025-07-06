// js/main.js

// --- Imports ---
import * as storage from './services/storage.js';
import Fabrication from './components/fabrication.js';
import StartPage from './components/startPage.js';
import Productivity from './components/productivity.js';
import HydrostaticTest from './components/hydrostaticTest.js';
import Summary from './components/summary.js';
import Bevel from './components/bevel.js';
import Setup from './components/setup.js';
import Buttweld from './components/buttweld.js';
import Olet from './components/olet.js';
import Socket from './components/socket.js';
import Flange from './components/flange.js';
import NDT from './components/ndt.js';
import Handling from './components/handling.js';
import HydroTestRates from './components/hydroTestRates.js';

// --- Global State ---
const state = {
    currentProject: null,
    projectData: {},
    isDirty: false,
};

// --- DOM Element Cache ---
const dom = {
    projectSelector: document.getElementById('project-selector'),
    newProjectBtn: document.getElementById('new-project-btn'),
    saveBtn: document.getElementById('save-project-btn'),
    renameBtn: document.getElementById('rename-project-btn'),
    deleteBtn: document.getElementById('delete-project-btn'),
    exportProjectBtn: document.getElementById('export-project-btn'),
    importProjectInput: document.getElementById('import-project-input'),
    exportRatesBtn: document.getElementById('export-rates-btn'),
    importRatesInput: document.getElementById('import-rates-input'),
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    footerProjectName: document.getElementById('footer-project-name'),
    footerLastSaved: document.getElementById('footer-last-saved'),
    projectNameDisplay: document.getElementById('project-name-display'),
};


function saveCurrentProject() {
    if (!state.currentProject) {
        alert("No project selected to save.");
        return false;
    }
    // Gather data from ALL components
    state.projectData.fabrication = Fabrication.getData();
    state.projectData.productivity = Productivity.getData();
    state.projectData.hydroData = HydrostaticTest.getData();
    state.projectData.summaryData = Summary.getData();
    state.projectData.bevel = Bevel.getData();
    state.projectData.setup = Setup.getData();
    state.projectData.buttweld = Buttweld.getData();
    state.projectData.olet = Olet.getData();
    state.projectData.socket = Socket.getData();
    state.projectData.flange = Flange.getData();
    state.projectData.ndt = NDT.getData();
    state.projectData.handling = Handling.getData();
    state.projectData.hydroTestRates = HydroTestRates.getData();

    storage.saveProject(state.currentProject, state.projectData);

    const loaded = storage.loadProject(state.currentProject);
    dom.footerLastSaved.textContent = new Date(loaded.lastUpdated).toLocaleString();

    state.isDirty = false;
    dom.saveBtn.textContent = 'Save';
    dom.saveBtn.classList.remove('btn-warning');
    dom.saveBtn.classList.add('btn-primary');
    console.log(`Project "${state.currentProject}" saved successfully!`);

    return true;
}

function handleNewProject(defaultName = '', showPrompt = true) {
    let newName = defaultName;
    if (showPrompt) { newName = prompt("Enter new project name:", `New Project ${new Date().toLocaleTimeString()}`); }
    if (!newName || storage.projectExists(newName)) {
        if(newName) alert(`A project named "${newName}" already exists.`);
        return;
    }
    storage.addProjectToList(newName);
    loadProjectList();
    loadProject(newName);
}

function initializeComponents() {
    Productivity.init(document.getElementById('productivity-pane'), state.projectData.productivity);
    Bevel.init(document.getElementById('bevel-pane'), state.projectData.bevel);
    Setup.init(document.getElementById('setup-pane'), state.projectData.setup);
    Buttweld.init(document.getElementById('buttweld-pane'), state.projectData.buttweld);
    Olet.init(document.getElementById('olet-pane'), state.projectData.olet);
    Socket.init(document.getElementById('socket-pane'), state.projectData.socket);
    Flange.init(document.getElementById('flange-pane'), state.projectData.flange);
    NDT.init(document.getElementById('ndt-pane'), state.projectData.ndt);
    Handling.init(document.getElementById('handling-pane'), state.projectData.handling);
    HydroTestRates.init(document.getElementById('hydro-test-rates-pane'), state.projectData.hydroTestRates);

    state.projectData.productivity = Productivity.getData();
    state.projectData.bevel = Bevel.getData();
    state.projectData.setup = Setup.getData();
    state.projectData.buttweld = Buttweld.getData();
    state.projectData.olet = Olet.getData();
    state.projectData.socket = Socket.getData();
    state.projectData.flange = Flange.getData();
    state.projectData.ndt = NDT.getData();
    state.projectData.handling = Handling.getData();
    state.projectData.hydroTestRates = HydroTestRates.getData();

    StartPage.init(document.getElementById('start-pane'));
    Fabrication.init(document.getElementById('fabrication-pane'), state.projectData.fabrication, state.projectData);
    HydrostaticTest.init(document.getElementById('hydrostatic-test-pane'), state.projectData);
    Summary.init(document.getElementById('summary-pane'), state.projectData);
}

function loadProject(projectName, isInitialLoad = false) {
    if (isInitialLoad && !storage.projectExists(projectName)) {
        handleNewProject(projectName, false);
        return;
    }
    const loaded = storage.loadProject(projectName);
    state.currentProject = projectName;
    dom.projectSelector.value = projectName;

    state.projectData = loaded ? loaded.data : {};

    if (!loaded) {
        state.projectData = {
            fabrication: [],
            productivity: null,
            hydroData: {},
            summaryData: null,
            bevel: null,
            setup: null,
            buttweld: null,
            olet: null,
            socket: null,
            flange: null,
            ndt: null,
            handling: null,
            hydroTestRates: null
        };
        dom.footerLastSaved.textContent = 'Not saved yet';
    } else {
        dom.footerLastSaved.textContent = new Date(loaded.lastUpdated).toLocaleString();
    }

    dom.footerProjectName.textContent = projectName;
    dom.projectNameDisplay.textContent = projectName;

    initializeComponents();

    state.isDirty = false;
    dom.saveBtn.textContent = 'Save';
    dom.saveBtn.classList.remove('btn-warning');
    dom.saveBtn.classList.add('btn-primary');
    console.log(`Loaded project: ${projectName}`);
}

function loadProjectList() {
    const projects = storage.getProjectList();
    dom.projectSelector.innerHTML = projects.map(p => `<option value="${p}">${p}</option>`).join('');
    return projects;
}

function handleRenameProject() {
    if (!state.currentProject) return;
    const newName = prompt("Enter the new name for this project:", state.currentProject);
    if (!newName || newName === state.currentProject || storage.projectExists(newName)) {
        if (storage.projectExists(newName)) alert(`A project named "${newName}" already exists.`);
        return;
    }
    const oldName = state.currentProject;
    storage.renameProject(oldName, newName);
    loadProjectList();
    state.currentProject = newName;
    dom.projectSelector.value = newName;
    dom.footerProjectName.textContent = newName;
    dom.projectNameDisplay.textContent = newName;
    alert(`Project renamed from "${oldName}" to "${newName}"`);
}

function handleDeleteProject() {
    if (!state.currentProject) return;
    const projects = storage.getProjectList();
    if (projects.length <= 1) {
        alert("Cannot delete the last project.");
        return;
    }
    if (confirm(`Are you sure you want to permanently delete project "${state.currentProject}"?`)) {
        const deletedProject = state.currentProject;
        storage.deleteProject(deletedProject);
        const newProjectList = loadProjectList();
        loadProject(newProjectList[0]);
        alert(`Project "${deletedProject}" was deleted.`);
    }
}

function handleExportProject() {
    if (!state.currentProject) {
        alert("Please select a project to export.");
        return;
    }
    saveCurrentProject();
    const projectToExport = storage.loadProject(state.currentProject);
    if (!projectToExport) {
        alert("Error: Could not load project data for export.");
        return;
    }
    const dataStr = JSON.stringify(projectToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.currentProject.replace(/[/\\?%*:|"<>]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log(`Exported project: ${state.currentProject}`);
}

function handleImportProject(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedProject = JSON.parse(e.target.result);
            if (!importedProject.version || !importedProject.data || !importedProject.data.hasOwnProperty('fabrication')) {
                throw new Error("Invalid or corrupted project file format.");
            }
            if (importedProject.version !== storage.APP_VERSION) {
                if (!confirm(`Warning: Project file is v${importedProject.version}, app is v${storage.APP_VERSION}. Continue?`)) {
                    return;
                }
            }
            let newName = prompt(`Enter a name for the imported project:`, file.name.replace('.json', ''));
            if (!newName) return;
            if (storage.projectExists(newName)) {
                if (!confirm(`A project named "${newName}" already exists. Overwrite it?`)) {
                    return;
                }
            }
            storage.saveProject(newName, importedProject.data);
            loadProjectList();
            loadProject(newName);
            alert(`Project "${newName}" imported successfully!`);
        } catch (error) {
            alert(`Error importing file: ${error.message}`);
        } finally {
            dom.importProjectInput.value = '';
        }
    };
    reader.readAsText(file);
}

function handleExportRates() {
    const ratesData = {
        bevel: Bevel.getData(),
        setup: Setup.getData(),
        buttweld: Buttweld.getData(),
        olet: Olet.getData(),
        socket: Socket.getData(),
        flange: Flange.getData(),
        ndt: NDT.getData(),
        handling: Handling.getData(),
        hydroTestRates: HydroTestRates.getData(),
    };
    const dataToExport = {
        version: storage.APP_VERSION,
        type: 'PipelineEstimatorRates',
        data: ratesData
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Pipeline-Estimator-Shop-Rates.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log(`Exported Shop Rates.`);
}

function handleImportRates(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.type !== 'PipelineEstimatorRates' || !imported.data) {
                throw new Error("This does not appear to be a valid Shop Rates file.");
            }
            if (confirm("This will overwrite the lookup tables in your CURRENT project with the imported rates. Continue?")) {
                Object.assign(state.projectData, imported.data);
                initializeComponents();
                document.dispatchEvent(new CustomEvent('dataChanged'));
                alert("Shop rates imported successfully. Click 'Save' to make them permanent for this project.");
            }
        } catch (error) {
            alert(`Error importing rates file: ${error.message}`);
        } finally {
            dom.importRatesInput.value = '';
        }
    };
    reader.readAsText(file);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('pipeline_estimator_theme', theme);
    dom.themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('pipeline_estimator_theme') || 'light';
    setTheme(savedTheme);
}

function setupEventListeners() {
    dom.themeToggleBtn.addEventListener('click', toggleTheme);
    dom.projectSelector.addEventListener('change', () => {
        if (state.isDirty && confirm("You have unsaved changes. Save before switching?")) {
            saveCurrentProject();
        }
        loadProject(dom.projectSelector.value);
    });

    dom.newProjectBtn.addEventListener('click', handleNewProject);
    dom.saveBtn.addEventListener('click', () => saveCurrentProject());
    dom.renameBtn.addEventListener('click', handleRenameProject);
    dom.deleteBtn.addEventListener('click', handleDeleteProject);

    dom.exportProjectBtn.addEventListener('click', handleExportProject);
    dom.importProjectInput.addEventListener('change', handleImportProject);
    dom.exportRatesBtn.addEventListener('click', handleExportRates);
    dom.importRatesInput.addEventListener('change', handleImportRates);

    document.addEventListener('dataChanged', () => {
        state.isDirty = true;
        dom.saveBtn.textContent = 'Save*';
        dom.saveBtn.classList.add('btn-warning');
        dom.saveBtn.classList.remove('btn-primary');
    });

    document.querySelectorAll('button[data-bs-toggle="tab"]').forEach(tabEl => {
        tabEl.addEventListener('show.bs.tab', event => {
            const targetPaneId = event.target.dataset.bsTarget;

            if (targetPaneId === '#hydrostatic-test-pane' || targetPaneId === '#summary-pane') {
                state.projectData.fabrication = Fabrication.getData();
                state.projectData.productivity = Productivity.getData();
                state.projectData.hydroData = HydrostaticTest.getData();
                state.projectData.summaryData = Summary.getData();
            }

            if (targetPaneId === '#hydrostatic-test-pane') {
                HydrostaticTest.init(document.getElementById('hydrostatic-test-pane'), state.projectData);
            }
            if (targetPaneId === '#summary-pane') {
                Summary.init(document.getElementById('summary-pane'), state.projectData);
            }
        });
    });

    document.addEventListener('unitsChanged', () => {
        HydrostaticTest.init(document.getElementById('hydrostatic-test-pane'), state.projectData);
        Summary.init(document.getElementById('summary-pane'), state.projectData);
    });
}

function init() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    console.log('App Initializing...');

    setupEventListeners();
    loadTheme();
    loadProjectList();

    const projects = storage.getProjectList();
    const initialProject = projects.length > 0 ? projects[0] : 'Default Project';

    loadProject(initialProject, true);
}

// --- Run the App ---
init();
