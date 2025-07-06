// js/components/setup.js

const defaultData = [
    { nb: 6,   sch20: 0.45, sch40: 0.45, sch60: 0.45, sch80: 0.45, sch100: 0.45, sch120: 0.45, sch140: 0.45, sch160: 0.32 },
{ nb: 8,   sch20: 0.45, sch40: 0.45, sch60: 0.45, sch80: 0.45, sch100: 0.45, sch120: 0.45, sch140: 0.45, sch160: 0.32 },
{ nb: 10,  sch20: 0.45, sch40: 0.45, sch60: 0.45, sch80: 0.45, sch100: 0.45, sch120: 0.45, sch140: 0.45, sch160: 0.32 },
{ nb: 15,  sch20: 0.45, sch40: 0.45, sch60: 0.45, sch80: 0.45, sch100: 0.45, sch120: 0.45, sch140: 0.45, sch160: 0.32 },
{ nb: 20,  sch20: 0.45, sch40: 0.45, sch60: 0.45, sch80: 0.45, sch100: 0.45, sch120: 0.45, sch140: 0.45, sch160: 0.32 },
{ nb: 25,  sch20: 0.45, sch40: 0.45, sch60: 0.45, sch80: 0.45, sch100: 0.45, sch120: 0.45, sch140: 0.45, sch160: 0.32 },
{ nb: 32,  sch20: 0.45, sch40: 0.45, sch60: 0.45, sch80: 0.45, sch100: 0.45, sch120: 0.45, sch140: 0.45, sch160: 0.45 },
{ nb: 40,  sch20: 0.45, sch40: 0.45, sch60: 0.45, sch80: 0.45, sch100: 0.45, sch120: 0.45, sch140: 0.45, sch160: 0.45 },
{ nb: 50,  sch20: 0.45, sch40: 0.45, sch60: 0.45, sch80: 0.45, sch100: 0.45, sch120: 0.45, sch140: 0.45, sch160: 0.45 },
{ nb: 65,  sch20: 0.64, sch40: 0.64, sch60: 0.64, sch80: 0.64, sch100: 0.64, sch120: 0.64, sch140: 0.64, sch160: 0.64 },
{ nb: 80,  sch20: 0.75, sch40: 0.75, sch60: 0.75, sch80: 0.75, sch100: 0.75, sch120: 0.75, sch140: 0.75, sch160: 0.75 },
{ nb: 90,  sch20: 0.75, sch40: 0.75, sch60: 0.75, sch80: 0.75, sch100: 0.75, sch120: 0.75, sch140: 0.75, sch160: 0.75 },
{ nb: 100, sch20: 0.94, sch40: 0.50, sch60: 0.94, sch80: 0.94, sch100: 0.94, sch120: 0.94, sch140: 0.94, sch160: 0.94 },
{ nb: 125, sch20: 1.14, sch40: 1.14, sch60: 1.14, sch80: 1.14, sch100: 1.14, sch120: 1.14, sch140: 1.14, sch160: 1.14 },
{ nb: 150, sch20: 1.36, sch40: 0.50, sch60: 1.36, sch80: 1.36, sch100: 1.36, sch120: 1.36, sch140: 1.36, sch160: 1.36 },
{ nb: 200, sch20: 1.67, sch40: 0.50, sch60: 1.67, sch80: 1.67, sch100: 1.67, sch120: 1.67, sch140: 1.67, sch160: 1.67 },
{ nb: 250, sch20: 1.92, sch40: 1.92, sch60: 1.92, sch80: 1.92, sch100: 1.92, sch120: 1.92, sch140: 1.92, sch160: 1.92 },
{ nb: 300, sch20: 2.06, sch40: 0.50, sch60: 2.06, sch80: 2.06, sch100: 2.06, sch120: 2.06, sch140: 2.06, sch160: 2.06 },
{ nb: 350, sch20: 2.66, sch40: 2.66, sch60: 2.66, sch80: 2.66, sch100: 2.66, sch120: 2.66, sch140: 2.66, sch160: 2.66 },
{ nb: 400, sch20: 3.19, sch40: 3.19, sch60: 3.19, sch80: 3.19, sch100: 3.19, sch120: 3.19, sch140: 3.19, sch160: 3.19 }
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
    <p class="text-muted">This table contains the man-hour estimates for setup and tacking. Double-click any number cell to edit it.</p>
    <div class="table-responsive">
    <table class="table table-bordered table-hover text-center" id="setup-table">
    <thead class="table-light">
    <tr>
    <th rowspan="2" class="align-middle">NB / SCH</th>
    <th colspan="${headers.length}">Setup & Tacking Man Hours</th>
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
    const table = document.getElementById('setup-table');
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
