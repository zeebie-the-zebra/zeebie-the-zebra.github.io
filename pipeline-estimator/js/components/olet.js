// js/components/olet.js

const defaultData = [
    { nb: 6,   sch20: 1.3, sch40: 1.3, sch60: 1.3, sch80: 1.7, sch100: 1.7, sch120: 1.7, sch140: 1.7, sch160: 2.2 },
{ nb: 8,   sch20: 1.3, sch40: 1.3, sch60: 1.3, sch80: 1.7, sch100: 1.7, sch120: 1.7, sch140: 1.7, sch160: 2.2 },
{ nb: 10,  sch20: 1.3, sch40: 1.3, sch60: 1.3, sch80: 1.7, sch100: 1.7, sch120: 1.7, sch140: 1.7, sch160: 2.2 },
{ nb: 15,  sch20: 1.3, sch40: 1.3, sch60: 1.3, sch80: 1.7, sch100: 1.7, sch120: 1.7, sch140: 1.7, sch160: 2.2 },
{ nb: 20,  sch20: 1.3, sch40: 1.3, sch60: 1.3, sch80: 1.7, sch100: 1.7, sch120: 1.7, sch140: 1.7, sch160: 2.2 },
{ nb: 25,  sch20: 1.6, sch40: 1.6, sch60: 1.6, sch80: 1.9, sch100: 1.9, sch120: 1.9, sch140: 1.9, sch160: 2.6 },
{ nb: 32,  sch20: 1.8, sch40: 1.8, sch60: 1.8, sch80: 2.2, sch100: 2.2, sch120: 2.2, sch140: 2.2, sch160: 2.9 },
{ nb: 40,  sch20: 2.0, sch40: 2.0, sch60: 2.0, sch80: 2.5, sch100: 2.5, sch120: 2.5, sch140: 2.5, sch160: 3.3 },
{ nb: 50,  sch20: 2.5, sch40: 2.5, sch60: 2.5, sch80: 3.2, sch100: 3.2, sch120: 3.2, sch140: 3.2, sch160: 4.3 },
{ nb: 65,  sch20: 3.4, sch40: 3.4, sch60: 3.4, sch80: 4.2, sch100: 4.2, sch120: 4.2, sch140: 4.2, sch160: 5.6 },
{ nb: 80,  sch20: 4.0, sch40: 4.0, sch60: 4.0, sch80: 5.1, sch100: 5.1, sch120: 5.1, sch140: 5.1, sch160: 6.7 },
{ nb: 90,  sch20: 4.6, sch40: 4.6, sch60: 4.6, sch80: 5.9, sch100: 5.9, sch120: 5.9, sch140: 5.9, sch160: 9.2 },
{ nb: 100, sch20: 6.1, sch40: 6.1, sch60: 6.1, sch80: 7.4, sch100: 7.4, sch120: 7.4, sch140: 7.4, sch160: 9.8 },
{ nb: 125, sch20: 6.9, sch40: 6.9, sch60: 6.9, sch80: 8.1, sch100: 8.1, sch120: 8.1, sch140: 8.1, sch160: 11.9 },
{ nb: 150, sch20: 7.6, sch40: 7.6, sch60: 7.6, sch80: 8.6, sch100: 8.6, sch120: 8.6, sch140: 8.6, sch160: 13.9 },
{ nb: 200, sch20: 8.4, sch40: 8.4, sch60: 8.4, sch80: 9.2, sch100: 9.2, sch120: 9.2, sch140: 9.2, sch160: 16.4 },
{ nb: 250, sch20: 11.8, sch40: 11.8, sch60: 11.8, sch80: 16.9, sch100: 16.9, sch120: 16.9, sch140: 16.9, sch160: 26.3 },
{ nb: 300, sch20: 16.5, sch40: 16.5, sch60: 16.5, sch80: 19.6, sch100: 19.6, sch120: 19.6, sch140: 19.6, sch160: 38.9 },
{ nb: 350, sch20: 20.7, sch40: 20.7, sch60: 20.7, sch80: 23.0, sch100: 23.0, sch120: 23.0, sch140: 23.0, sch160: 46.9 },
{ nb: 400, sch20: 24.7, sch40: 24.7, sch60: 24.7, sch80: 26.4, sch100: 26.4, sch120: 26.4, sch140: 26.4, sch160: 61.2 }
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
    <p class="text-muted">This table contains the man-hour estimates for olets. Double-click any number cell to edit it.</p>
    <div class="table-responsive">
    <table class="table table-bordered table-hover text-center" id="olet-table">
    <thead class="table-light">
    <tr>
    <th rowspan="2" class="align-middle">Olets<br>NB / SCH</th>
    <th colspan="3">Class 2000#</th>
    <th colspan="4">Class 3000#</th>
    <th colspan="1">Class 6000#</th>
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
    const table = document.getElementById('olet-table');
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
