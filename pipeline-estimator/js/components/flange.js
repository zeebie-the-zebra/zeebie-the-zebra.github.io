// js/components/flange.js

const defaultData = [
{ nb: 6,   lb150: 0.90, lb300: 1.00, lb400: 1.40, lb600: 1.40, lb900: 1.60, lb1500: 1.80, lb2500: 2.10 },
{ nb: 8,   lb150: 0.90, lb300: 1.00, lb400: 1.40, lb600: 1.40, lb900: 1.60, lb1500: 1.80, lb2500: 2.10 },
{ nb: 10,  lb150: 0.90, lb300: 1.00, lb400: 1.40, lb600: 1.40, lb900: 1.60, lb1500: 1.80, lb2500: 2.10 },
{ nb: 15,  lb150: 0.90, lb300: 1.00, lb400: 1.40, lb600: 1.40, lb900: 1.60, lb1500: 1.80, lb2500: 2.10 },
{ nb: 20,  lb150: 0.90, lb300: 1.00, lb400: 1.40, lb600: 1.40, lb900: 1.60, lb1500: 1.80, lb2500: 2.10 },
{ nb: 25,  lb150: 0.90, lb300: 1.00, lb400: 1.40, lb600: 1.40, lb900: 1.60, lb1500: 1.80, lb2500: 2.10 },
{ nb: 32,  lb150: 1.00, lb300: 1.20, lb400: 1.40, lb600: 1.40, lb900: 1.80, lb1500: 2.10, lb2500: 2.30 },
{ nb: 40,  lb150: 1.00, lb300: 1.30, lb400: 1.40, lb600: 1.40, lb900: 1.80, lb1500: 2.10, lb2500: 2.30 },
{ nb: 50,  lb150: 1.30, lb300: 1.40, lb400: 1.80, lb600: 1.80, lb900: 2.40, lb1500: 2.70, lb2500: 3.00 },
{ nb: 65,  lb150: 1.50, lb300: 1.70, lb400: 2.30, lb600: 2.30, lb900: 3.00, lb1500: 3.30, lb2500: 3.60 },
{ nb: 80,  lb150: 1.80, lb300: 2.10, lb400: 2.90, lb600: 2.90, lb900: 3.60, lb1500: 4.00, lb2500: 4.40 },
{ nb: 90,  lb150: 2.20, lb300: 2.40, lb400: 3.30, lb600: 3.30, lb900: 4.20, lb1500: 4.70, lb2500: 5.15 },
{ nb: 100, lb150: 2.50, lb300: 2.60, lb400: 3.50, lb600: 3.80, lb900: 4.80, lb1500: 5.40, lb2500: 5.90 },
{ nb: 125, lb150: 2.75, lb300: 3.30, lb400: 4.50, lb600: 4.80, lb900: 6.10, lb1500: 6.70, lb2500: 7.40 },
{ nb: 150, lb150: 3.00, lb300: 3.90, lb400: 5.20, lb600: 5.90, lb900: 7.20, lb1500: 8.10, lb2500: 8.90 },
{ nb: 200, lb150: 3.25, lb300: 5.40, lb400: 7.30, lb600: 8.00, lb900: 9.90, lb1500: 11.00, lb2500: 12.00 },
{ nb: 250, lb150: 3.50, lb300: 6.80, lb400: 9.00, lb600: 11.10, lb900: 12.50, lb1500: 14.00, lb2500: 15.50 },
{ nb: 300, lb150: 4.00, lb300: 8.30, lb400: 11.00, lb600: 13.70, lb900: 15.30, lb1500: 17.20, lb2500: 19.00 },
{ nb: 350, lb150: 4.25, lb300: 10.00, lb400: 13.00, lb600: 16.20, lb900: 17.70, lb1500: 19.80, lb2500: 22.50 },
{ nb: 400, lb150: 4.50, lb300: 11.30, lb400: 15.00, lb600: 18.40, lb900: 20.10, lb1500: 22.40, lb2500: 26.00 }
];

let componentData = [];
const headers = [150, 300, 400, 600, 900, 1500, 2500];

function render(container) {
    const headerRow = headers.map(h => `<th>${h}</th>`).join('');
    const dataRows = componentData.map((row, rowIndex) => {
        const dataCells = headers.map(h => {
            const colKey = `lb${h}`;
            const value = row[colKey];
            return `<td contenteditable="true" data-row-index="${rowIndex}" data-col-key="${colKey}">${value !== null ? value : ''}</td>`;
        }).join('');
        return `<tr><td class="fw-bold">${row.nb}</td>${dataCells}</tr>`;
    }).join('');

    container.innerHTML = `
    <p class="text-muted">This table contains the man-hour estimates for flange welding. Double-click any number cell to edit it.</p>
    <div class="table-responsive">
    <table class="table table-bordered table-hover text-center" id="flange-table">
    <thead class="table-light">
    <tr>
    <th rowspan="2" class="align-middle">NB / LB</th>
    <th colspan="${headers.length}">Flange Welding Man Hours</th>
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
    const table = document.getElementById('flange-table');
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
