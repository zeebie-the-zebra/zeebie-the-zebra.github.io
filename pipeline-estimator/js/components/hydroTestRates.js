// js/components/hydroTestRates.js

const defaultData = [
    { nb: 6,   sch20: 0.027, sch40: 0.014, sch60: 0.030, sch80: 0.016, sch100: 0.039, sch120: 0.046, sch140: 0.052, sch160: 0.025 },
{ nb: 8,   sch20: 0.027, sch40: 0.014, sch60: 0.030, sch80: 0.016, sch100: 0.039, sch120: 0.046, sch140: 0.052, sch160: 0.025 },
{ nb: 10,  sch20: 0.027, sch40: 0.014, sch60: 0.030, sch80: 0.016, sch100: 0.039, sch120: 0.046, sch140: 0.052, sch160: 0.025 },
{ nb: 15,  sch20: 0.027, sch40: 0.014, sch60: 0.030, sch80: 0.016, sch100: 0.039, sch120: 0.046, sch140: 0.052, sch160: 0.025 },
{ nb: 20,  sch20: 0.027, sch40: 0.014, sch60: 0.030, sch80: 0.016, sch100: 0.039, sch120: 0.046, sch140: 0.052, sch160: 0.025 },
{ nb: 25,  sch20: 0.027, sch40: 0.014, sch60: 0.030, sch80: 0.016, sch100: 0.039, sch120: 0.046, sch140: 0.052, sch160: 0.025 },
{ nb: 32,  sch20: 0.027, sch40: 0.014, sch60: 0.030, sch80: 0.016, sch100: 0.039, sch120: 0.046, sch140: 0.052, sch160: 0.025 },
{ nb: 40,  sch20: 0.027, sch40: 0.014, sch60: 0.030, sch80: 0.016, sch100: 0.039, sch120: 0.046, sch140: 0.052, sch160: 0.025 },
{ nb: 50,  sch20: 0.027, sch40: 0.014, sch60: 0.030, sch80: 0.016, sch100: 0.039, sch120: 0.046, sch140: 0.052, sch160: 0.025 },
{ nb: 65,  sch20: 0.027, sch40: 0.015, sch60: 0.030, sch80: 0.017, sch100: 0.039, sch120: 0.046, sch140: 0.052, sch160: 0.028 },
{ nb: 80,  sch20: 0.027, sch40: 0.017, sch60: 0.030, sch80: 0.019, sch100: 0.039, sch120: 0.046, sch140: 0.052, sch160: 0.031 },
{ nb: 90,  sch20: 0.027, sch40: 0.017, sch60: 0.030, sch80: 0.019, sch100: 0.039, sch120: 0.046, sch140: 0.052, sch160: 0.031 },
{ nb: 100, sch20: 0.027, sch40: 0.020, sch60: 0.030, sch80: 0.024, sch100: 0.039, sch120: 0.046, sch140: 0.052, sch160: 0.036 },
{ nb: 125, sch20: 0.027, sch40: 0.022, sch60: 0.030, sch80: 0.026, sch100: 0.039, sch120: 0.046, sch140: 0.052, sch160: 0.041 },
{ nb: 150, sch20: 0.027, sch40: 0.025, sch60: 0.030, sch80: 0.029, sch100: 0.039, sch120: 0.046, sch140: 0.052, sch160: 0.047 },
{ nb: 200, sch20: 0.027, sch40: 0.027, sch60: 0.030, sch80: 0.035, sch100: 0.039, sch120: 0.046, sch140: 0.052, sch160: 0.057 },
{ nb: 250, sch20: 0.031, sch40: 0.031, sch60: 0.035, sch80: 0.041, sch100: 0.049, sch120: 0.055, sch140: 0.063, sch160: 0.070 },
{ nb: 300, sch20: 0.034, sch40: 0.038, sch60: 0.044, sch80: 0.053, sch100: 0.061, sch120: 0.068, sch140: 0.077, sch160: 0.087 },
{ nb: 350, sch20: 0.038, sch40: 0.041, sch60: 0.050, sch80: 0.062, sch100: 0.069, sch120: 0.078, sch140: 0.091, sch160: 0.111 },
{ nb: 400, sch20: 0.044, sch40: 0.044, sch60: 0.062, sch80: 0.075, sch100: 0.086, sch120: 0.097, sch140: 0.114, sch160: 0.134 }
];

let componentData = [];
const headers = [20, 40, 60, 80, 100, 120, 140, 160];

function render(container) {
    const headerRow = headers.map(h => `<th>${h}</th>`).join('');
    const dataRows = componentData.map((row, rowIndex) => {
        const dataCells = headers.map(h => {
            const colKey = `sch${h}`;
            const value = row[colKey];
            return `<td contenteditable="true" data-row-index="${rowIndex}" data-col-key="${colKey}">${value !== null ? value : ''}</td>`;
        }).join('');
        return `<tr><td class="fw-bold">${row.nb}</td>${dataCells}</tr>`;
    }).join('');

    container.innerHTML = `
    <p class="text-muted">This table contains the rates for hydro testing. Double-click any number cell to edit it.</p>
    <div class="table-responsive">
    <table class="table table-bordered table-hover text-center" id="hydro-test-rates-table">
    <thead class="table-light">
    <tr>
    <th rowspan="2" class="align-middle">NB / SCH</th>
    <th colspan="${headers.length}">Hydro Testing Per Foot With Hold Time of 1Hour - Pressure Under 4,000 PSI</th>
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

function addEventListeners() {
    const table = document.getElementById('hydro-test-rates-table');
    if (!table) return;

    table.addEventListener('blur', (event) => {
        const cell = event.target;
        if (cell.tagName === 'TD' && cell.isContentEditable) {
            const rowIndex = cell.dataset.rowIndex;
            const colKey = cell.dataset.colKey;
            const originalValue = componentData[rowIndex][colKey];
            let rawValue = cell.textContent.trim();

            if (rawValue === '') {
                componentData[rowIndex][colKey] = null;
                document.dispatchEvent(new CustomEvent('dataChanged'));
                return;
            }
            const numericValue = parseFloat(rawValue);
            if (isNaN(numericValue) || numericValue < 0) {
                alert('Invalid input. Please enter a non-negative number.');
                cell.textContent = originalValue !== null ? originalValue : '';
                return;
            }
            if (numericValue !== originalValue) {
                componentData[rowIndex][colKey] = numericValue;
                document.dispatchEvent(new CustomEvent('dataChanged'));
            }
        }
    }, true);
}

export default {
    init(container, data) {
        componentData = data && data.length > 0 ? JSON.parse(JSON.stringify(data)) : JSON.parse(JSON.stringify(defaultData));
        render(container);
    },
    getData() {
        return componentData;
    },
};
