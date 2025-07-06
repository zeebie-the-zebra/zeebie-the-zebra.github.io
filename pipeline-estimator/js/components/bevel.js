// Data structure designed to match the 2D grid from the Excel sheet.
// `null` is used for empty cells.
const defaultBevelData = [
    { nb: 6,   sch20: 0.070, sch40: 0.070, sch60: 0.070, sch80: 0.070, sch100: 0.195, sch120: 0.260, sch140: 0.270, sch160: 0.280 },
{ nb: 8,   sch20: 0.070, sch40: 0.070, sch60: 0.070, sch80: 0.070, sch100: 0.195, sch120: 0.260, sch140: 0.270, sch160: 0.280 },
{ nb: 10,  sch20: 0.070, sch40: 0.070, sch60: 0.070, sch80: 0.070, sch100: 0.195, sch120: 0.260, sch140: 0.270, sch160: 0.280 },
{ nb: 15,  sch20: 0.070, sch40: 0.070, sch60: 0.070, sch80: 0.070, sch100: 0.195, sch120: 0.260, sch140: 0.270, sch160: 0.295 },
{ nb: 20,  sch20: 0.070, sch40: 0.070, sch60: 0.070, sch80: 0.070, sch100: 0.195, sch120: 0.260, sch140: 0.290, sch160: 0.320 },
{ nb: 25,  sch20: 0.070, sch40: 0.070, sch60: 0.070, sch80: 0.070, sch100: 0.195, sch120: 0.260, sch140: 0.290, sch160: 0.320 },
{ nb: 32,  sch20: 0.070, sch40: 0.070, sch60: 0.070, sch80: 0.085, sch100: 0.195, sch120: 0.260, sch140: 0.270, sch160: 0.280 },
{ nb: 40,  sch20: 0.070, sch40: 0.070, sch60: 0.070, sch80: 0.092, sch100: 0.195, sch120: 0.260, sch140: 0.270, sch160: 0.280 },
{ nb: 50,  sch20: 0.075, sch40: 0.070, sch60: 0.080, sch80: 0.100, sch100: 0.195, sch120: 0.260, sch140: 0.270, sch160: 0.280 },
{ nb: 65,  sch20: 0.090, sch40: 0.080, sch60: 0.100, sch80: 0.120, sch100: 0.130, sch120: 0.135, sch140: 0.138, sch160: 0.140 },
{ nb: 80,  sch20: 0.113, sch40: 0.100, sch60: 0.110, sch80: 0.120, sch100: 0.140, sch120: 0.150, sch140: 0.155, sch160: 0.160 },
{ nb: 90,  sch20: 0.125, sch40: 0.100, sch60: 0.120, sch80: 0.140, sch100: 0.165, sch120: 0.178, sch140: 0.184, sch160: 0.190 },
{ nb: 100, sch20: 0.163, sch40: 0.140, sch60: 0.165, sch80: 0.190, sch100: 0.225, sch120: 0.260, sch140: 0.270, sch160: 0.280 },
{ nb: 125, sch20: 0.211, sch40: 0.170, sch60: 0.205, sch80: 0.240, sch100: 0.270, sch120: 0.300, sch140: 0.320, sch160: 0.340 },
{ nb: 150, sch20: 0.265, sch40: 0.230, sch60: 0.265, sch80: 0.300, sch100: 0.345, sch120: 0.390, sch140: 0.410, sch160: 0.430 },
{ nb: 200, sch20: 0.320, sch40: 0.320, sch60: 0.400, sch80: 0.440, sch100: 0.520, sch120: 0.590, sch140: 0.650, sch160: 0.650 },
{ nb: 250, sch20: 0.440, sch40: 0.440, sch60: 0.630, sch80: 0.680, sch100: 0.750, sch120: 0.830, sch140: 0.830, sch160: 0.830 },
{ nb: 300, sch20: 0.480, sch40: 0.590, sch60: 0.890, sch80: 0.940, sch100: 1.030, sch120: 1.030, sch140: 1.030, sch160: 1.030 },
{ nb: 350, sch20: 0.670, sch40: 0.790, sch60: 0.980, sch80: 1.140, sch100: 1.140, sch120: 1.140, sch140: 1.140, sch160: 1.140 },
{ nb: 400, sch20: 0.750, sch40: 1.100, sch60: 1.220, sch80: 1.350, sch100: 1.350, sch120: 1.350, sch140: 1.350, sch160: 1.350 }
];

let bevelData = [];
const scheduleHeaders = [20, 40, 60, 80, 100, 120, 140, 160];

// Renders the component's UI into the given container element
function render(container) {
    // Generate the HTML for the table headers
    const headerRow = scheduleHeaders.map(sch => `<th>${sch}</th>`).join('');

    // Generate the HTML for each data row
    const dataRows = bevelData.map((row, rowIndex) => {
        const dataCells = scheduleHeaders.map(sch => {
            const colKey = `sch${sch}`;
            const value = row[colKey];
            // Render the value, or an empty string for null. Make it editable.
            return `<td contenteditable="true" data-row-index="${rowIndex}" data-col-key="${colKey}">${value !== null ? value : ''}</td>`;
        }).join('');

        return `<tr><td class="fw-bold">${row.nb}</td>${dataCells}</tr>`;
    }).join('');

    // Assemble the final HTML for the component
    container.innerHTML = `
    <p class="text-muted">This table contains the man-hour estimates for beveling. Double-click any number cell to edit it. Changes are saved with the project.</p>
    <div class="table-responsive">
    <table class="table table-bordered table-hover text-center" id="bevel-table">
    <thead class="table-light">
    <tr>
    <th rowspan="2" class="align-middle">NB / SCH</th>
    <th colspan="${scheduleHeaders.length}">Beveling Man Hours</th>
    </tr>
    <tr>
    ${headerRow}
    </tr>
    </thead>
    <tbody>
    ${dataRows}
    </tbody>
    </table>
    </div>
    `;
    addEventListeners();
}

// Attaches event listeners for inline editing
function addEventListeners() {
    const table = document.getElementById('bevel-table');
    if (!table) return;

    table.addEventListener('blur', (event) => {
        const cell = event.target;
        if (cell.tagName === 'TD' && cell.isContentEditable) {
            const rowIndex = cell.dataset.rowIndex;
            const colKey = cell.dataset.colKey;
            const originalValue = bevelData[rowIndex][colKey];
            let rawValue = cell.textContent.trim();

            // Handle empty input
            if (rawValue === '') {
                bevelData[rowIndex][colKey] = null;
                document.dispatchEvent(new CustomEvent('dataChanged'));
                return;
            }

            // Data Validation
            const numericValue = parseFloat(rawValue);
            if (isNaN(numericValue) || numericValue < 0) {
                alert('Invalid input. Please enter a non-negative number.');
                // Revert to the old value
                cell.textContent = originalValue !== null ? originalValue : '';
                return;
            }

            // Update the data model if the value is valid and has changed
            if (numericValue !== originalValue) {
                bevelData[rowIndex][colKey] = numericValue;
                console.log(`Updated bevelData[${rowIndex}].${colKey} to ${numericValue}`);
                // Notify the main app that data has changed and needs to be saved
                document.dispatchEvent(new CustomEvent('dataChanged'));
            }
        }
    }, true); // Use event capturing
}

// --- Module's Public API ---
export default {
    // Initializes the component
    init(container, data) {
        // If there's saved data, use it. Otherwise, use a deep copy of the default data.
        if (data && data.length > 0) {
            bevelData = JSON.parse(JSON.stringify(data));
        } else {
            bevelData = JSON.parse(JSON.stringify(defaultBevelData));
        }
        render(container);
    },

    // Returns the component's current data for saving
    getData() {
        return bevelData;
    },
};
