const APP_PREFIX = 'pipelineEstimator_';
const APP_VERSION = '1.0.0';

// --- Project List Management ---

export function getProjectList() {
    const projects = localStorage.getItem(`${APP_PREFIX}projectList`);
    return projects ? JSON.parse(projects) : [];
}

function saveProjectList(list) {
    localStorage.setItem(`${APP_PREFIX}projectList`, JSON.stringify(list));
}

export function addProjectToList(projectName) {
    const list = getProjectList();
    if (!list.includes(projectName)) {
        list.push(projectName);
        saveProjectList(list);
    }
}

export function projectExists(projectName) {
    return getProjectList().includes(projectName);
}

// --- Individual Project Data Management ---

export function saveProject(projectName, projectData) {
    addProjectToList(projectName); // Ensure it's in the list

    const dataToStore = {
        version: APP_VERSION,
        lastUpdated: new Date().toISOString(),
        data: projectData,
    };

    localStorage.setItem(`${APP_PREFIX}project_${projectName}`, JSON.stringify(dataToStore));
    console.log(`Project "${projectName}" saved.`);
}

export function loadProject(projectName) {
    const projectJSON = localStorage.getItem(`${APP_PREFIX}project_${projectName}`);
    if (!projectJSON) {
        console.warn(`Attempted to load project "${projectName}" but it does not exist in localStorage.`);
        return null;
    }

    const project = JSON.parse(projectJSON);

    if (project.version !== APP_VERSION) {
        alert(`Warning: Project "${projectName}" was saved with version ${project.version}. Current app version is ${APP_VERSION}. Some features may not work correctly.`);
    }

    return project;
}

export function deleteProject(projectName) {
    const projectList = getProjectList();
    const updatedList = projectList.filter(p => p !== projectName);
    saveProjectList(updatedList);
    localStorage.removeItem(`${APP_PREFIX}project_${projectName}`);
    console.log(`Project "${projectName}" deleted.`);
}

export function renameProject(oldName, newName) {
    const projectData = loadProject(oldName);
    if (!projectData) return;

    saveProject(newName, projectData.data);
    deleteProject(oldName); // This also removes the old name from the list
    console.log(`Project renamed from "${oldName}" to "${newName}".`);
}
