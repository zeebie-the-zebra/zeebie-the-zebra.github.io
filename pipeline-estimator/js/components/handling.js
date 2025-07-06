// js/components/handling.js

const defaultData = [
    { nb: 6,   sch20: 0.26, sch40: 0.26, sch60: 0.27, sch80: 0.29, sch100: 0.29, sch120: 0.30, sch140: 0.30, sch160: 0.30 },
{ nb: 8,   sch20: 0.26, sch40: 0.26, sch60: 0.27, sch80: 0.29, sch100: 0.29, sch120: 0.30, sch140: 0.30, sch160: 0.30 },
{ nb: 10,  sch20: 0.27, sch40: 0.27, sch60: 0.27, sch80: 0.29, sch100: 0.29, sch120: 0.32, sch140: 0.32, sch160: 0.32 },
{ nb: 15,  sch20: 0.27, sch40: 0.27, sch60: 0.27, sch80: 0.30, sch100: 0.30, sch120: 0.34, sch140: 0.34, sch160: 0.34 },
{ nb: 20,  sch20: 0.28, sch40: 0.28, sch60: 0.28, sch80: 0.32, sch100: 0.32, sch120: 0.35, sch140: 0.35, sch160: 0.35 },
{ nb: 25,  sch20: 0.29, sch40: 0.29, sch60: 0.29, sch80: 0.34, sch100: 0.34, sch120: 0.39, sch140: 0.39, sch160: 0.39 },
{ nb: 32,  sch20: 0.30, sch40: 0.30, sch60: 0.30, sch80: 0.35, sch100: 0.35, sch120: 0.41, sch140: 0.41, sch160: 0.41 },
{ nb: 40,  sch20: 0.32, sch40: 0.32, sch60: 0.32, sch80: 0.37, sch100: 0.37, sch120: 0.45, sch140: 0.45, sch160: 0.45 },
{ nb: 50,  sch20: 0.34, sch40: 0.34, sch60: 0.34, sch80: 0.40, sch100: 0.40, sch120: 0.49, sch140: 0.49, sch160: 0.49 },
{ nb: 65,  sch20: 0.36, sch40: 0.36, sch60: 0.36, sch80: 0.44, sch100: 0.44, sch120: 0.54, sch140: 0.54, sch160: 0.54 },
{ nb: 80,  sch20: 0.39, sch40: 0.39, sch60: 0.39, sch80: 0.48, sch100: 0.48, sch120: 0.59, sch140: 0.59, sch160: 0.59 },
{ nb: 90,  sch20: 0.40, sch40: 0.40, sch60: 0.40, sch80: 0.50, sch100: 0.50, sch120: 0.62, sch140: 0.62, sch160: 0.62 },
{ nb: 100, sch20: 0.41, sch40: 0.41, sch60: 0.41, sch80: 0.52, sch100: 0.52, sch120: 0.66, sch140: 0.66, sch160: 0.66 },
{ nb: 125, sch20: 0.44, sch40: 0.44, sch60: 0.44, sch80: 0.57, sch100: 0.57, sch120: 0.72, sch140: 0.72, sch160: 0.72 },
{ nb: 150, sch20: 0.47, sch40: 0.47, sch60: 0.47, sch80: 0.64, sch100: 0.64, sch120: 0.84, sch140: 0.84, sch160: 0.84 },
{ nb: 200, sch20: 0.57, sch40: 0.57, sch60: 0.57, sch80: 0.81, sch100: 0.81, sch120: 0.99, sch140: 0.99, sch160: 0.99 },
{ nb: 250, sch20: 0.72, sch40: 0.72, sch60: 0.72, sch80: 1.00, sch100: 1.00, sch120: 1.38, sch140: 1.38, sch160: 1.38 },
{ nb: 300, sch20: 0.88, sch40: 0.88, sch60: 0.88, sch80: 1.23, sch100: 1.23, sch120: 1.69, sch140: 1.69, sch160: 1.69 },
{ nb: 350, sch20: 1.01, sch40: 1.01, sch60: 1.01, sch80: 1.46, sch100: 1.46, sch120: 2.01, sch140: 2.01, sch160: 2.01 },
{ nb: 400, sch20: 1.27, sch40: 1.27, sch60: 1.27, sch80: 1.71, sch100: 1.71, sch120: 2.34, sch140: 2.34, sch160: 2.34 }
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
    <p class="text-muted">This table contains the man-hour estimates for handling. Double-click any number cell to edit it.</p>
    <div class="table-responsive">
    <table class="table table-bordered table-hover text-center" id="handling-table">
    <thead class="table-light">
    <tr>
    <th rowspan="2" class="align-middle">NB / SCH</th>
    <th colspan="${headers.length}">Shipping and Handling (Loading/Unloading for Transport)</th>
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
    const table = document.getElementById('handling-table');
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
