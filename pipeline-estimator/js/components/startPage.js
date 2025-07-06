// A component for a static content page.

function render(container) {
    container.innerHTML = `
    <h2>Welcome to the Pipeline Fabrication Cost Estimator!</h2>
    <p>This is a web estimator, providing a modern, reliable, and user-friendly experience. Default values have been configured based on personal experience in the australian power / oil and gas sector.</p>

    <h3>How to Use This Tool:</h3>
    <ol>
    <li><strong>Start a New Project:</strong> Use the "New" button in the header to create a new quotation. Give it a unique name.</li>
    <li><strong>Input Data:</strong> Navigate through the blue tabs ('Fabrication', 'Hydrostatic Test') to input the core details of your project.</li>
    <li><strong>Configure Rates:</strong> The orange, pink, green, yellow, and purple tabs contain lookup tables and configuration settings. These tables are <strong>editable</strong>. Double-click on a value to change it. Your changes will be saved with the project.</li>
    <li><strong>Review the Summary:</strong> The 'Summary' tab compiles all your data into a final quotation, which you can then print or export.</li>
    <li><strong>Save Your Work:</strong> Click the "Save" button at any time. Your project is saved in your browser's local storage.</li>
    <li><strong>Manage Projects:</strong> Use the dropdown menu to load, rename, or delete existing projects. Use the "Import" and "Export" buttons to back up your projects or share them with colleagues.</li>
    </ol>
    `;
}

// Public API for this component
export default {
    init(container) {
        render(container);
    },
    // Non-data components don't need getData()
};
