// js/components/socket.js

const defaultData = [
    { nb: 6,   sch20: 0.5, sch40: 0.5, sch60: 0.5, sch80: 0.5, sch100: 0.5, sch120: 0.5, sch140: 0.5, sch160: 0.5 },
{ nb: 8,   sch20: 0.5, sch40: 0.5, sch60: 0.5, sch80: 0.5, sch100: 0.5, sch120: 0.5, sch140: 0.5, sch160: 0.5 },
{ nb: 10,  sch20: 0.5, sch40: 0.5, sch60: 0.5, sch80: 0.5, sch100: 0.5, sch120: 0.5, sch140: 0.5, sch160: 0.5 },
{ nb: 15,  sch20: 0.5, sch40: 0.5, sch60: 0.5, sch80: 0.5, sch100: 0.5, sch120: 0.5, sch140: 0.5, sch160: 0.5 },
{ nb: 20,  sch20: 0.5, sch40: 0.5, sch60: 0.5, sch80: 0.5, sch100: 0.6, sch120: 0.6, sch140: 0.6, sch160: 0.6 },
{ nb: 25,  sch20: 0.6, sch40: 0.6, sch60: 0.6, sch80: 0.6, sch100: 0.7, sch120: 0.7, sch140: 0.7, sch160: 0.7 },
{ nb: 32,  sch20: 0.8, sch40: 0.8, sch60: 0.8, sch80: 0.8, sch100: 0.9, sch120: 0.9, sch140: 0.9, sch160: 0.9 },
{ nb: 40,  sch20: 0.8, sch40: 0.8, sch60: 0.8, sch80: 0.8, sch100: 1.0, sch120: 1.0, sch140: 1.0, sch160: 1.0 },
{ nb: 50,  sch20: 0.9, sch40: 0.9, sch60: 0.9, sch80: 0.9, sch100: 1.3, sch120: 1.3, sch140: 1.3, sch160: 1.3 },
{ nb: 65,  sch20: 1.1, sch40: 1.1, sch60: 1.1, sch80: 1.1, sch100: 1.4, sch120: 1.4, sch140: 1.4, sch160: 1.4 },
{ nb: 80,  sch20: 1.2, sch40: 1.2, sch60: 1.2, sch80: 1.2, sch100: 1.7, sch120: 1.7, sch140: 1.7, sch160: 1.7 },
{ nb: 90,  sch20: 1.3, sch40: 1.3, sch60: 1.3, sch80: 1.3, sch100: 1.9, sch120: 1.9, sch140: 1.9, sch160: 1.9 },
{ nb: 100, sch20: 1.3, sch40: 1.3, sch60: 1.3, sch80: 1.3, sch100: 2.1, sch120: 2.1, sch140: 2.1, sch160: 2.1 },
{ nb: 125, sch20: 1.5, sch40: 1.5, sch60: 1.5, sch80: 1.5, sch100: 2.6, sch120: 2.6, sch140: 2.6, sch160: 2.6 },
{ nb: 150, sch20: 1.7, sch40: 1.7, sch60: 1.7, sch80: 1.7, sch100: 3.1, sch120: 3.1, sch140: 3.1, sch160: 3.1 },
{ nb: 200, sch20: 2.0, sch40: 2.0, sch60: 2.0, sch80: 2.0, sch100: 4.1, sch120: 4.1, sch140: 4.1, sch160: 4.1 },
{ nb: 250, sch20: 2.3, sch40: 2.3, sch60: 2.3, sch80: 2.3, sch100: 5.1, sch120: 5.1, sch140: 5.1, sch160: 5.1 },
{ nb: 300, sch20: 2.7, sch40: 2.7, sch60: 2.7, sch80: 2.7, sch100: 6.1, sch120: 6.1, sch140: 6.1, sch160: 6.1 },
{ nb: 350, sch20: 3.0, sch40: 3.0, sch60: 3.0, sch80: 3.0, sch100: 7.1, sch120: 7.1, sch140: 7.1, sch160: 7.1 },
{ nb: 400, sch20: 3.3, sch40: 3.3, sch60: 3.3, sch80: 3.3, sch100: 8.1, sch120: 8.1, sch140: 8.1, sch160: 8.1 }
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
    <p class="text-muted">This table contains the man-hour estimates for socket welds. Double-click any number cell to edit it.</p>
    <div class="table-responsive">
    <table class="table table-bordered table-hover text-center" id="socket-table">
    <thead class="table-light">
    <tr>
    <th rowspan="2" class="align-middle">SW<br>NB / SCH</th>
    <th colspan="4">SCH < 80</th>
    <th colspan="4">SCH 80 ></th>
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
    <p class="text-center fst-italic mt-2">Note: 90 Degree socket weld values not included</p>
    `;
    addEventListeners();
}

function addEventListeners() {
    const table = document.getElementById('socket-table');
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
