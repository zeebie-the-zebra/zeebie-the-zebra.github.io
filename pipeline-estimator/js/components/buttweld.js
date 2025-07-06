// js/components/buttweld.js

const defaultData = [
    { nb: 6,   sch20: 0.60, sch40: 0.60, sch60: 0.65, sch80: 0.70, sch100: 0.75, sch120: 0.80, sch140: 0.85, sch160: 0.90 },
{ nb: 8,   sch20: 0.60, sch40: 0.60, sch60: 0.65, sch80: 0.70, sch100: 0.75, sch120: 0.80, sch140: 0.85, sch160: 0.90 },
{ nb: 10,  sch20: 0.60, sch40: 0.60, sch60: 0.65, sch80: 0.70, sch100: 0.75, sch120: 0.80, sch140: 0.85, sch160: 0.90 },
{ nb: 15,  sch20: 0.60, sch40: 0.60, sch60: 0.65, sch80: 0.70, sch100: 0.75, sch120: 0.80, sch140: 0.85, sch160: 0.90 },
{ nb: 20,  sch20: 0.60, sch40: 0.60, sch60: 0.65, sch80: 0.70, sch100: 0.75, sch120: 0.80, sch140: 0.85, sch160: 0.90 },
{ nb: 25,  sch20: 0.60, sch40: 0.60, sch60: 0.65, sch80: 0.70, sch100: 0.75, sch120: 0.80, sch140: 0.85, sch160: 0.90 },
{ nb: 32,  sch20: 0.70, sch40: 0.70, sch60: 0.70, sch80: 0.70, sch100: 0.80, sch120: 0.90, sch140: 0.95, sch160: 1.00 },
{ nb: 40,  sch20: 0.70, sch40: 0.70, sch60: 0.75, sch80: 0.80, sch100: 0.90, sch120: 1.00, sch140: 1.05, sch160: 1.10 },
{ nb: 50,  sch20: 0.80, sch40: 0.80, sch60: 0.85, sch80: 0.90, sch100: 1.03, sch120: 1.15, sch140: 1.28, sch160: 1.40 },
{ nb: 65,  sch20: 1.00, sch40: 1.00, sch60: 1.05, sch80: 1.10, sch100: 1.23, sch120: 1.35, sch140: 1.48, sch160: 1.60 },
{ nb: 80,  sch20: 1.10, sch40: 1.10, sch60: 1.15, sch80: 1.20, sch100: 1.35, sch120: 1.50, sch140: 1.65, sch160: 1.80 },
{ nb: 90,  sch20: 1.20, sch40: 1.20, sch60: 1.30, sch80: 1.40, sch100: 1.50, sch120: 1.60, sch140: 1.70, sch160: 1.80 },
{ nb: 100, sch20: 1.30, sch40: 1.30, sch60: 1.45, sch80: 1.60, sch100: 2.00, sch120: 2.40, sch140: 2.50, sch160: 2.60 },
{ nb: 125, sch20: 1.50, sch40: 1.50, sch60: 1.70, sch80: 1.90, sch100: 2.20, sch120: 2.50, sch140: 2.90, sch160: 3.30 },
{ nb: 150, sch20: 1.80, sch40: 1.80, sch60: 1.95, sch80: 2.10, sch100: 2.65, sch120: 3.20, sch140: 3.75, sch160: 4.30 },
{ nb: 200, sch20: 2.20, sch40: 2.20, sch60: 2.50, sch80: 2.80, sch100: 3.80, sch120: 5.10, sch140: 6.40, sch160: 7.30 },
{ nb: 250, sch20: 2.70, sch40: 2.70, sch60: 3.40, sch80: 4.30, sch100: 5.80, sch120: 8.00, sch140: 9.60, sch160: 11.10 },
{ nb: 300, sch20: 3.10, sch40: 3.40, sch60: 4.40, sch80: 5.60, sch100: 8.40, sch120: 10.40, sch140: 13.00, sch160: 15.20 },
{ nb: 350, sch20: 3.60, sch40: 4.20, sch60: 5.80, sch80: 8.10, sch100: 11.20, sch120: 13.70, sch140: 16.30, sch160: 19.20 },
{ nb: 400, sch20: 4.20, sch40: 5.60, sch60: 7.10, sch80: 10.50, sch100: 14.30, sch120: 17.60, sch140: 21.10, sch160: 23.50 }
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
    <p class="text-muted">This table contains the man-hour estimates for butt welding. Double-click any number cell to edit it.</p>
    <div class="table-responsive">
    <table class="table table-bordered table-hover text-center" id="buttweld-table">
    <thead class="table-light">
    <tr>
    <th rowspan="2" class="align-middle">Nominal Bore (mm) / SCH</th>
    <th colspan="${headers.length}">Butt Welding Man Hours</th>
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
    const table = document.getElementById('buttweld-table');
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
