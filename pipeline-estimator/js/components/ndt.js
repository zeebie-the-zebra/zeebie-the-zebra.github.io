// js/components/ndt.js

// A more complex data structure to hold all four NDT tables.
const defaultData = {
    xray: [
        { nb: 6, sch20: 123, sch40: 123, sch60: 123, sch80: 123, sch100: 160, sch120: 160, sch140: 0, sch160: 0 },
        { nb: 8, sch20: 123, sch40: 123, sch60: 123, sch80: 123, sch100: 160, sch120: 160, sch140: 0, sch160: 0 },
        { nb: 10, sch20: 123, sch40: 123, sch60: 123, sch80: 123, sch100: 160, sch120: 160, sch140: 0, sch160: 0 },
        { nb: 15, sch20: 123, sch40: 123, sch60: 123, sch80: 123, sch100: 160, sch120: 160, sch140: 0, sch160: 0 },
        { nb: 20, sch20: 123, sch40: 123, sch60: 123, sch80: 123, sch100: 160, sch120: 160, sch140: 0, sch160: 0 },
        { nb: 25, sch20: 123, sch40: 123, sch60: 123, sch80: 123, sch100: 160, sch120: 160, sch140: 0, sch160: 0 },
        { nb: 32, sch20: 123, sch40: 123, sch60: 123, sch80: 123, sch100: 160, sch120: 160, sch140: 0, sch160: 0 },
        { nb: 40, sch20: 123, sch40: 123, sch60: 123, sch80: 123, sch100: 160, sch120: 160, sch140: 0, sch160: 0 },
        { nb: 50, sch20: 123, sch40: 123, sch60: 123, sch80: 123, sch100: 160, sch120: 160, sch140: 0, sch160: 0 },
        { nb: 65, sch20: 123, sch40: 123, sch60: 123, sch80: 123, sch100: 160, sch120: 160, sch140: 0, sch160: 0 },
        { nb: 80, sch20: 123, sch40: 123, sch60: 123, sch80: 123, sch100: 160, sch120: 160, sch140: 0, sch160: 0 },
        { nb: 90, sch20: 129, sch40: 129, sch60: 129, sch80: 129, sch100: 168, sch120: 168, sch140: 0, sch160: 0 },
        { nb: 100, sch20: 129, sch40: 129, sch60: 129, sch80: 129, sch100: 168, sch120: 168, sch140: 0, sch160: 0 },
        { nb: 125, sch20: 138, sch40: 138, sch60: 138, sch80: 138, sch100: 179, sch120: 179, sch140: 0, sch160: 0 },
        { nb: 150, sch20: 138, sch40: 138, sch60: 138, sch80: 138, sch100: 179, sch120: 179, sch140: 0, sch160: 0 },
        { nb: 200, sch20: 142, sch40: 142, sch60: 142, sch80: 142, sch100: 0, sch120: 0, sch140: 0, sch160: 0 },
        { nb: 250, sch20: 147, sch40: 147, sch60: 147, sch80: 147, sch100: 0, sch120: 0, sch140: 0, sch160: 0 },
        { nb: 300, sch20: 0, sch40: 0, sch60: 0, sch80: 0, sch100: 0, sch120: 0, sch140: 0, sch160: 0 },
        { nb: 350, sch20: 0, sch40: 0, sch60: 0, sch80: 0, sch100: 0, sch120: 0, sch140: 0, sch160: 0 },
        { nb: 400, sch20: 0, sch40: 0, sch60: 0, sch80: 0, sch100: 0, sch120: 0, sch140: 0, sch160: 0 },
    ],
    gamma: [
        { nb: 6, sch20: 54, sch40: 54, sch60: 54, sch80: 54, sch100: 65, sch120: 65, sch140: 81, sch160: 81 },
        { nb: 8, sch20: 54, sch40: 54, sch60: 54, sch80: 54, sch100: 65, sch120: 65, sch140: 81, sch160: 81 },
        { nb: 10, sch20: 54, sch40: 54, sch60: 54, sch80: 54, sch100: 65, sch120: 65, sch140: 81, sch160: 81 },
        { nb: 15, sch20: 54, sch40: 54, sch60: 54, sch80: 54, sch100: 65, sch120: 65, sch140: 81, sch160: 81 },
        { nb: 20, sch20: 54, sch40: 54, sch60: 54, sch80: 54, sch100: 65, sch120: 65, sch140: 81, sch160: 81 },
        { nb: 25, sch20: 54, sch40: 54, sch60: 54, sch80: 54, sch100: 65, sch120: 65, sch140: 81, sch160: 81 },
        { nb: 32, sch20: 54, sch40: 54, sch60: 54, sch80: 54, sch100: 65, sch120: 65, sch140: 81, sch160: 81 },
        { nb: 40, sch20: 54, sch40: 54, sch60: 54, sch80: 54, sch100: 65, sch120: 65, sch140: 81, sch160: 81 },
        { nb: 50, sch20: 54, sch40: 54, sch60: 54, sch80: 54, sch100: 65, sch120: 65, sch140: 81, sch160: 81 },
        { nb: 65, sch20: 54, sch40: 54, sch60: 54, sch80: 54, sch100: 65, sch120: 65, sch140: 81, sch160: 81 },
        { nb: 80, sch20: 54, sch40: 54, sch60: 54, sch80: 54, sch100: 65, sch120: 65, sch140: 81, sch160: 81 },
        { nb: 90, sch20: 60, sch40: 60, sch60: 60, sch80: 60, sch100: 72, sch120: 72, sch140: 90, sch160: 90 },
        { nb: 100, sch20: 60, sch40: 60, sch60: 60, sch80: 60, sch100: 72, sch120: 72, sch140: 90, sch160: 90 },
        { nb: 125, sch20: 69, sch40: 69, sch60: 69, sch80: 69, sch100: 83, sch120: 83, sch140: 104, sch160: 104 },
        { nb: 150, sch20: 69, sch40: 69, sch60: 69, sch80: 69, sch100: 83, sch120: 83, sch140: 104, sch160: 104 },
        { nb: 200, sch20: 73, sch40: 73, sch60: 73, sch80: 73, sch100: 88, sch120: 88, sch140: 110, sch160: 110 },
        { nb: 250, sch20: 78, sch40: 147, sch60: 147, sch80: 147, sch100: 108, sch120: 108, sch140: 173, sch160: 173 },
        { nb: 300, sch20: 98, sch40: 98, sch60: 98, sch80: 98, sch100: 152, sch120: 152, sch140: 390, sch160: 390 },
        { nb: 350, sch20: 106, sch40: 106, sch60: 106, sch80: 106, sch100: 325, sch120: 325, sch140: 0, sch160: 0 },
        { nb: 400, sch20: 130, sch40: 130, sch60: 130, sch80: 130, sch100: 0, sch120: 0, sch140: 0, sch160: 0 },
    ],
    mpi: [
        { nb: 6, sch20: 10, sch40: 10, sch60: 10, sch80: 10, sch100: 10, sch120: 10, sch140: 10, sch160: 10 },
        { nb: 8, sch20: 10, sch40: 10, sch60: 10, sch80: 10, sch100: 10, sch120: 10, sch140: 10, sch160: 10 },
        { nb: 10, sch20: 10, sch40: 10, sch60: 10, sch80: 10, sch100: 10, sch120: 10, sch140: 10, sch160: 10 },
        { nb: 15, sch20: 10, sch40: 10, sch60: 10, sch80: 10, sch100: 10, sch120: 10, sch140: 10, sch160: 10 },
        { nb: 20, sch20: 10, sch40: 10, sch60: 10, sch80: 10, sch100: 10, sch120: 10, sch140: 10, sch160: 10 },
        { nb: 25, sch20: 10, sch40: 10, sch60: 10, sch80: 10, sch100: 10, sch120: 10, sch140: 10, sch160: 10 },
        { nb: 32, sch20: 10, sch40: 10, sch60: 10, sch80: 10, sch100: 10, sch120: 10, sch140: 10, sch160: 10 },
        { nb: 40, sch20: 10, sch40: 10, sch60: 10, sch80: 10, sch100: 10, sch120: 10, sch140: 10, sch160: 10 },
        { nb: 50, sch20: 10, sch40: 10, sch60: 10, sch80: 10, sch100: 10, sch120: 10, sch140: 10, sch160: 10 },
        { nb: 65, sch20: 11, sch40: 11, sch60: 11, sch80: 11, sch100: 11, sch120: 11, sch140: 11, sch160: 11 },
        { nb: 80, sch20: 11, sch40: 11, sch60: 11, sch80: 11, sch100: 11, sch120: 11, sch140: 11, sch160: 11 },
        { nb: 90, sch20: 11, sch40: 11, sch60: 11, sch80: 11, sch100: 11, sch120: 11, sch140: 11, sch160: 11 },
        { nb: 100, sch20: 11, sch40: 11, sch60: 11, sch80: 11, sch100: 11, sch120: 11, sch140: 11, sch160: 11 },
        { nb: 125, sch20: 13, sch40: 13, sch60: 13, sch80: 13, sch100: 13, sch120: 13, sch140: 13, sch160: 13 },
        { nb: 150, sch20: 13, sch40: 13, sch60: 13, sch80: 13, sch100: 13, sch120: 13, sch140: 13, sch160: 13 },
        { nb: 200, sch20: 14, sch40: 14, sch60: 14, sch80: 14, sch100: 14, sch120: 14, sch140: 14, sch160: 14 },
        { nb: 250, sch20: 14, sch40: 14, sch60: 14, sch80: 14, sch100: 14, sch120: 14, sch140: 14, sch160: 14 },
        { nb: 300, sch20: 15, sch40: 15, sch60: 15, sch80: 15, sch100: 15, sch120: 15, sch140: 15, sch160: 15 },
        { nb: 350, sch20: 15, sch40: 15, sch60: 15, sch80: 15, sch100: 15, sch120: 15, sch140: 15, sch160: 15 },
        { nb: 400, sch20: 19, sch40: 19, sch60: 19, sch80: 19, sch100: 19, sch120: 19, sch140: 19, sch160: 19 },
    ],
    dpi: [
        { nb: 6, sch20: 12, sch40: 12, sch60: 12, sch80: 12, sch100: 12, sch120: 12, sch140: 12, sch160: 12 },
        { nb: 8, sch20: 12, sch40: 12, sch60: 12, sch80: 12, sch100: 12, sch120: 12, sch140: 12, sch160: 12 },
        { nb: 10, sch20: 12, sch40: 12, sch60: 12, sch80: 12, sch100: 12, sch120: 12, sch140: 12, sch160: 12 },
        { nb: 15, sch20: 12, sch40: 12, sch60: 12, sch80: 12, sch100: 12, sch120: 12, sch140: 12, sch160: 12 },
        { nb: 20, sch20: 12, sch40: 12, sch60: 12, sch80: 12, sch100: 12, sch120: 12, sch140: 12, sch160: 12 },
        { nb: 25, sch20: 12, sch40: 12, sch60: 12, sch80: 12, sch100: 12, sch120: 12, sch140: 12, sch160: 12 },
        { nb: 32, sch20: 12, sch40: 12, sch60: 12, sch80: 12, sch100: 12, sch120: 12, sch140: 12, sch160: 12 },
        { nb: 40, sch20: 12, sch40: 12, sch60: 12, sch80: 12, sch100: 12, sch120: 12, sch140: 12, sch160: 12 },
        { nb: 50, sch20: 12, sch40: 12, sch60: 12, sch80: 12, sch100: 12, sch120: 12, sch140: 12, sch160: 12 },
        { nb: 65, sch20: 13, sch40: 13, sch60: 13, sch80: 13, sch100: 13, sch120: 13, sch140: 13, sch160: 13 },
        { nb: 80, sch20: 13, sch40: 13, sch60: 13, sch80: 13, sch100: 13, sch120: 13, sch140: 13, sch160: 13 },
        { nb: 90, sch20: 14, sch40: 14, sch60: 14, sch80: 14, sch100: 14, sch120: 14, sch140: 14, sch160: 14 },
        { nb: 100, sch20: 14, sch40: 14, sch60: 14, sch80: 14, sch100: 14, sch120: 14, sch140: 14, sch160: 14 },
        { nb: 125, sch20: 14, sch40: 14, sch60: 14, sch80: 14, sch100: 14, sch120: 14, sch140: 14, sch160: 14 },
        { nb: 150, sch20: 14, sch40: 14, sch60: 14, sch80: 14, sch100: 14, sch120: 14, sch140: 14, sch160: 14 },
        { nb: 200, sch20: 14, sch40: 14, sch60: 14, sch80: 14, sch100: 14, sch120: 14, sch140: 14, sch160: 14 },
        { nb: 250, sch20: 14, sch40: 14, sch60: 14, sch80: 14, sch100: 14, sch120: 14, sch140: 14, sch160: 14 },
        { nb: 300, sch20: 19, sch40: 19, sch60: 19, sch80: 19, sch100: 19, sch120: 19, sch140: 19, sch160: 19 },
        { nb: 350, sch20: 19, sch40: 19, sch60: 19, sch80: 19, sch100: 19, sch120: 19, sch140: 19, sch160: 19 },
        { nb: 400, sch20: 24, sch40: 24, sch60: 24, sch80: 24, sch100: 24, sch120: 24, sch140: 24, sch160: 24 },
    ]
};

let componentData = {};
const headers = [20, 40, 60, 80, 100, 120, 140, 160];

/**
 * A helper function to generate the HTML for a single NDT table.
 * @param {string} title - The title of the table (e.g., "NDT X-RAY Prices").
 * @param {string} tableKey - The key for this table in the data object (e.g., "xray").
 * @param {Array} dataArray - The array of data rows for this table.
 * @returns {string} The complete HTML string for the table.
 */
function createTableHTML(title, tableKey, dataArray) {
    const headerRow = headers.map(h => `<th>${h}</th>`).join('');
    const dataRows = dataArray.map((row, rowIndex) => {
        const dataCells = headers.map(h => {
            const colKey = `sch${h}`;
            const value = row[colKey];
            const formattedValue = value !== null ? `$${value.toFixed(2)}` : '';
            return `<td contenteditable="true" data-table-key="${tableKey}" data-row-index="${rowIndex}" data-col-key="${colKey}">${formattedValue}</td>`;
        }).join('');
        return `<tr><td class="fw-bold">${row.nb}</td>${dataCells}</tr>`;
    }).join('');

    return `
    <div class="table-responsive mb-5">
    <table class="table table-bordered table-hover text-center">
    <thead class="table-light">
    <tr>
    <th rowspan="2" class="align-middle">NB / SCH</th>
    <th colspan="${headers.length}">${title}</th>
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
}

function render(container) {
    // Generate HTML for all four tables using the helper function
    container.innerHTML = `
    <p class="text-muted">This tab contains the price estimates for various NDT methods. Double-click any price cell to edit it.</p>
    ${createTableHTML('NDT X-RAY Prices', 'xray', componentData.xray)}
    ${createTableHTML('NDT GAMMA RAY Prices', 'gamma', componentData.gamma)}
    ${createTableHTML('NDT MPI Prices', 'mpi', componentData.mpi)}
    ${createTableHTML('NDT DPI Prices', 'dpi', componentData.dpi)}
    `;
    addEventListeners(container);
}

// Use event delegation to handle clicks on all tables with one listener
function addEventListeners(container) {
    container.addEventListener('blur', (event) => {
        const cell = event.target;
        if (cell.tagName === 'TD' && cell.isContentEditable) {
            const tableKey = cell.dataset.tableKey;
            const rowIndex = cell.dataset.rowIndex;
            const colKey = cell.dataset.colKey;

            const originalValue = componentData[tableKey][rowIndex][colKey];
            // Remove dollar signs and whitespace for parsing
            let rawValue = cell.textContent.trim().replace(/\$/g, '');

            if (rawValue === '') {
                componentData[tableKey][rowIndex][colKey] = null;
                document.dispatchEvent(new CustomEvent('dataChanged'));
                return;
            }

            const numericValue = parseFloat(rawValue);
            if (isNaN(numericValue) || numericValue < 0) {
                alert('Invalid input. Please enter a non-negative number.');
                cell.textContent = originalValue !== null ? `$${originalValue.toFixed(2)}` : '';
                return;
            }

            if (numericValue !== originalValue) {
                componentData[tableKey][rowIndex][colKey] = numericValue;
                // Reformat the cell content after successful edit
                cell.textContent = `$${numericValue.toFixed(2)}`;
                document.dispatchEvent(new CustomEvent('dataChanged'));
            } else {
                // If the value hasn't changed, just ensure it's formatted correctly
                cell.textContent = `$${originalValue.toFixed(2)}`;
            }
        }
    }, true);
}

export default {
    init(container, data) {
        componentData = data ? JSON.parse(JSON.stringify(data)) : JSON.parse(JSON.stringify(defaultData));
        render(container);
    },
    getData() {
        return componentData;
    },
};
