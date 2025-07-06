// js/components/fabrication.js

let lineItems = [];
let allLookupData = {};

const ITEM_TYPES = ['Seamless Pipe', 'Flange', 'Blind Flange', 'Olet', 'Sockolet', 'Elbow', 'Con Reducer', 'Ecc Reducer', 'Nippo Flange', 'Nipple Outlet', 'Valve'];
const WELD_TYPES = ['Butt', 'Olet', 'Sockolet', 'SlipOn'];
const NDT_TYPES = ['Gamma + MPI', 'X-Ray + MPI', 'Gamma Only', 'X-Ray Only', 'MPI Only', 'DPI Only'];
const YES_NO = ['No', 'Yes'];
const FLANGE_LB_OPTIONS = [150, 300, 400, 600, 900, 1500, 2500];
// Define the schedule options statically as they are consistent
const SCHEDULE_OPTIONS = [20, 40, 60, 80, 100, 120, 140, 160];

// Helper functions are unchanged...
function findRate(lookupTable, pipeSize, sch) { if (!lookupTable || !pipeSize || !sch) return 0; const row = lookupTable.find(r => r.nb == pipeSize); if (!row) return 0; const rate = row[`sch${sch}`]; return rate !== null ? rate : 0; }
function findFlangeRate(lookupTable, pipeSize, lb) { if (!lookupTable || !pipeSize || !lb) return 0; const row = lookupTable.find(r => r.nb == pipeSize); if (!row) return 0; const rate = row[`lb${lb}`]; return rate !== null ? rate : 0; }
function findNdtRate(ndtTables, ndtType, pipeSize, sch) { if (!ndtTables || !ndtType || !pipeSize || !sch) return 0; let totalRate = 0; if (ndtType.includes('Gamma')) totalRate += findRate(ndtTables.gamma, pipeSize, sch); if (ndtType.includes('X-Ray')) totalRate += findRate(ndtTables.xray, pipeSize, sch); if (ndtType.includes('MPI')) totalRate += findRate(ndtTables.mpi, pipeSize, sch); if (ndtType.includes('DPI')) totalRate += findRate(ndtTables.dpi, pipeSize, sch); return totalRate; }

function render(container) {
    // Dynamically get the available pipe sizes from a lookup table (e.g., bevel)
    const PIPE_SIZE_OPTIONS = (allLookupData.bevel || []).map(row => row.nb);

    const tableHeaders = `
    <thead class="table-light align-middle text-center">
    <tr>
    <th rowspan="2">Item</th>
    <th rowspan="2">Iso / Dwg No.</th>
    <th rowspan="2">Item Type</th>
    <th rowspan="2">Hydro Required</th>
    <th rowspan="2">Weld Type</th>
    <th rowspan="2">Pipe Size</th>
    <th rowspan="2">SCH</th>
    <th colspan="3">Bevel</th>
    <th colspan="3">Set Up & Tac</th>
    <th colspan="3">Butt Weld</th>
    <th colspan="3">O/Let Weld</th>
    <th colspan="3">Socket Weld</th>
    <th colspan="4">Flange - SlipOn</th>
    <th colspan="3">Spare/Misc</th>
    <th rowspan="2">Totals</th>
    <th colspan="2">Consumables</th>
    <th colspan="3">NDT RATES</th>
    <th rowspan="2">NDT Total</th>
    <th rowspan="2">Actions</th>
    </tr>
    <tr>
    <th>Qty</th><th>Rate</th><th>Total</th>
    <th>Qty</th><th>Rate</th><th>Total</th>
    <th>Qty</th><th>Rate</th><th>Total</th>
    <th>Qty</th><th>Rate</th><th>Total</th>
    <th>Qty</th><th>Rate</th><th>Total</th>
    <th>Qty</th><th>LB</th><th>Rate</th><th>Total</th>
    <th>Qty</th><th>Rate</th><th>Total</th>
    <th>General</th><th>Welding</th>
    <th>NDT Rate</th><th>NDT Qty</th><th>NDT TYPE</th>
    </tr>
    </thead>
    `;

    const tableBody = lineItems.map((item, index) => {
        const bevelRate = findRate(allLookupData.bevel, item.pipeSize, item.sch);
        const setupRate = findRate(allLookupData.setup, item.pipeSize, item.sch);
        const buttweldRate = findRate(allLookupData.buttweld, item.pipeSize, item.sch);
        const oletRate = findRate(allLookupData.olet, item.pipeSize, item.sch);
        const socketRate = findRate(allLookupData.socket, item.pipeSize, item.sch);
        const flangeRate = findFlangeRate(allLookupData.flange, item.pipeSize, item.flangeLb);
        const bevelTotal = item.bevelQty * bevelRate;
        const setupTotal = item.setupQty * setupRate;
        const buttweldTotal = item.buttweldQty * buttweldRate;
        const oletTotal = item.oletQty * oletRate;
        const socketTotal = item.socketQty * socketRate;
        const flangeTotal = item.flangeQty * flangeRate;
        const spareTotal = item.spareQty * item.spareRate;
        const rowTotal = bevelTotal + setupTotal + buttweldTotal + oletTotal + socketTotal + flangeTotal + spareTotal;
        const generalConsumables = rowTotal * 5;
        const weldingConsumables = (buttweldTotal + oletTotal + socketTotal + flangeTotal + spareTotal) * 10;
        const ndtRate = findNdtRate(allLookupData.ndt, item.ndtType, item.pipeSize, item.sch);
        const ndtTotal = ndtRate * item.ndtQty;

        return `
        <tr data-index="${index}">
        <td class="text-center">${index + 1}</td>
        <td><input type="text" class="form-control form-control-sm" data-prop="isoDwgNo" value="${item.isoDwgNo}"></td>
        <td><select class="form-select form-select-sm" data-prop="itemType">${ITEM_TYPES.map(o => `<option value="${o}" ${o === item.itemType ? 'selected' : ''}>${o}</option>`).join('')}</select></td>
        <td><select class="form-select form-select-sm" data-prop="hydroRequired">${YES_NO.map(o => `<option value="${o}" ${o === item.hydroRequired ? 'selected' : ''}>${o}</option>`).join('')}</select></td>
        <td><select class="form-select form-select-sm" data-prop="weldType">${WELD_TYPES.map(o => `<option value="${o}" ${o === item.weldType ? 'selected' : ''}>${o}</option>`).join('')}</select></td>

        <!-- FIX: Changed Pipe Size to a dropdown -->
        <td><select class="form-select form-select-sm" data-prop="pipeSize">${PIPE_SIZE_OPTIONS.map(size => `<option value="${size}" ${size == item.pipeSize ? 'selected' : ''}>${size}</option>`).join('')}</select></td>

        <!-- FIX: Changed SCH to a dropdown -->
        <td><select class="form-select form-select-sm" data-prop="sch">${SCHEDULE_OPTIONS.map(sch => `<option value="${sch}" ${sch == item.sch ? 'selected' : ''}>${sch}</option>`).join('')}</select></td>

        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="bevelQty" value="${item.bevelQty}"></td>
        <td class="rate-cell text-center"><span>${bevelRate.toFixed(2)}</span></td>
        <td class="total-cell text-center"><strong>${bevelTotal.toFixed(2)}</strong></td>
        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="setupQty" value="${item.setupQty}"></td>
        <td class="rate-cell text-center"><span>${setupRate.toFixed(2)}</span></td>
        <td class="total-cell text-center"><strong>${setupTotal.toFixed(2)}</strong></td>
        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="buttweldQty" value="${item.buttweldQty}"></td>
        <td class="rate-cell text-center"><span>${buttweldRate.toFixed(2)}</span></td>
        <td class="total-cell text-center"><strong>${buttweldTotal.toFixed(2)}</strong></td>
        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="oletQty" value="${item.oletQty}"></td>
        <td class="rate-cell text-center"><span>${oletRate.toFixed(2)}</span></td>
        <td class="total-cell text-center"><strong>${oletTotal.toFixed(2)}</strong></td>
        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="socketQty" value="${item.socketQty}"></td>
        <td class="rate-cell text-center"><span>${socketRate.toFixed(2)}</span></td>
        <td class="total-cell text-center"><strong>${socketTotal.toFixed(2)}</strong></td>
        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="flangeQty" value="${item.flangeQty}"></td>
        <td><select class="form-select form-select-sm bg-light-yellow" data-prop="flangeLb">${FLANGE_LB_OPTIONS.map(o => `<option value="${o}" ${o == item.flangeLb ? 'selected' : ''}>${o}</option>`).join('')}</select></td>
        <td class="rate-cell text-center"><span>${flangeRate.toFixed(2)}</span></td>
        <td class="total-cell text-center"><strong>${flangeTotal.toFixed(2)}</strong></td>
        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="spareQty" value="${item.spareQty}"></td>
        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="spareRate" value="${item.spareRate}"></td>
        <td class="total-cell text-center"><strong>${spareTotal.toFixed(2)}</strong></td>

        <td class="total-cell text-center">${rowTotal.toFixed(2)}</td>
        <td class="total-cell text-center">$${generalConsumables.toFixed(2)}</td>
        <td class="total-cell text-center">$${weldingConsumables.toFixed(2)}</td>
        <td class="total-cell text-center">$${ndtRate.toFixed(2)}</td>
        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="ndtQty" value="${item.ndtQty}"></td>
        <td><select class="form-select form-select-sm" data-prop="ndtType">${NDT_TYPES.map(o => `<option value="${o}" ${o === item.ndtType ? 'selected' : ''}>${o}</option>`).join('')}</select></td>
        <td class="total-cell text-center">$${ndtTotal.toFixed(2)}</td>
        <td class="text-center"><button class="btn btn-sm btn-danger btn-delete-row" title="Delete this row">X</button></td>
        </tr>
        `;
    }).join('');

    const grandTotals = {
        bevelTotal: lineItems.reduce((sum, i) => sum + (i.bevelQty * findRate(allLookupData.bevel, i.pipeSize, i.sch)), 0),
        setupTotal: lineItems.reduce((sum, i) => sum + (i.setupQty * findRate(allLookupData.setup, i.pipeSize, i.sch)), 0),
        buttweldTotal: lineItems.reduce((sum, i) => sum + (i.buttweldQty * findRate(allLookupData.buttweld, i.pipeSize, i.sch)), 0),
        oletTotal: lineItems.reduce((sum, i) => sum + (i.oletQty * findRate(allLookupData.olet, i.pipeSize, i.sch)), 0),
        socketTotal: lineItems.reduce((sum, i) => sum + (i.socketQty * findRate(allLookupData.socket, i.pipeSize, i.sch)), 0),
        flangeTotal: lineItems.reduce((sum, i) => sum + (i.flangeQty * findFlangeRate(allLookupData.flange, i.pipeSize, i.flangeLb)), 0),
        spareTotal: lineItems.reduce((sum, i) => sum + (i.spareQty * i.spareRate), 0),
        ndtTotal: lineItems.reduce((sum, i) => sum + (findNdtRate(allLookupData.ndt, i.ndtType, i.pipeSize, i.sch) * i.ndtQty), 0),
    };
    grandTotals.mainTotal = grandTotals.bevelTotal + grandTotals.setupTotal + grandTotals.buttweldTotal + grandTotals.oletTotal + grandTotals.socketTotal + grandTotals.flangeTotal + grandTotals.spareTotal;
    grandTotals.generalConsumables = grandTotals.mainTotal * 5;
    grandTotals.weldingConsumables = (grandTotals.buttweldTotal + grandTotals.oletTotal + grandTotals.socketTotal + grandTotals.flangeTotal + grandTotals.spareTotal) * 10;

    const tableFooter = `
    <tfoot class="table-group-divider fw-bold text-center">
    <tr>
    <td colspan="7">Totals</td>
    <td>${lineItems.reduce((s, i) => s + i.bevelQty, 0)}</td><td></td><td>${grandTotals.bevelTotal.toFixed(2)}</td>
    <td>${lineItems.reduce((s, i) => s + i.setupQty, 0)}</td><td></td><td>${grandTotals.setupTotal.toFixed(2)}</td>
    <td>${lineItems.reduce((s, i) => s + i.buttweldQty, 0)}</td><td></td><td>${grandTotals.buttweldTotal.toFixed(2)}</td>
    <td>${lineItems.reduce((s, i) => s + i.oletQty, 0)}</td><td></td><td>${grandTotals.oletTotal.toFixed(2)}</td>
    <td>${lineItems.reduce((s, i) => s + i.socketQty, 0)}</td><td></td><td>${grandTotals.socketTotal.toFixed(2)}</td>
    <td colspan="3"></td><td>${grandTotals.flangeTotal.toFixed(2)}</td>
    <td colspan="2"></td><td>${grandTotals.spareTotal.toFixed(2)}</td>
    <td>${grandTotals.mainTotal.toFixed(2)}</td>
    <td>$${grandTotals.generalConsumables.toFixed(2)}</td>
    <td>$${grandTotals.weldingConsumables.toFixed(2)}</td>
    <td colspan="3"></td>
    <td>$${grandTotals.ndtTotal.toFixed(2)}</td>
    <td></td>
    </tr>
    </tfoot>
    `;

    container.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
    <h3>Fabrication Line Items</h3>
    <button class="btn btn-success" id="btn-add-row">Add New Item</button>
    </div>
    <div class="table-responsive">
    <style>
    .bg-light-yellow { background-color: #fffacd !important; }
    .rate-cell, .total-cell { background-color: #f8f9fa; vertical-align: middle; }
    [data-bs-theme="dark"] .rate-cell, [data-bs-theme="dark"] .total-cell { background-color: var(--bs-tertiary-bg); }
    #fabrication-table .form-control-sm, #fabrication-table .form-select-sm { min-width: 70px; }
    #fabrication-table select[data-prop="itemType"], #fabrication-table input[data-prop="isoDwgNo"] { min-width: 150px; }
    </style>
    <table class="table table-bordered table-sm" id="fabrication-table">
    ${tableHeaders}
    <tbody>${tableBody}</tbody>
    ${tableFooter}
    </table>
    </div>
    `;
}

function addEventListeners(container) {
    container.addEventListener('change', (event) => {
        const target = event.target;
        const rowEl = target.closest('tr');
        if (!rowEl) return;

        const index = parseInt(rowEl.dataset.index, 10);
        const prop = target.dataset.prop;
        if (isNaN(index) || !prop) return;

        let value = target.value;
        // The check now includes our dropdowns
        if (target.type === 'number' || ['flangeLb', 'pipeSize', 'sch'].includes(prop)) {
            value = parseFloat(value) || 0;
        }

        lineItems[index][prop] = value;

        render(container);
        document.dispatchEvent(new CustomEvent('dataChanged'));
    });

    container.addEventListener('click', (event) => {
        if (event.target.id === 'btn-add-row') {
            lineItems.push({
                id: Date.now(),
                           isoDwgNo: `Spool-${lineItems.length + 1}`,
                           itemType: ITEM_TYPES[0],
                           hydroRequired: 'No',
                           weldType: WELD_TYPES[0],
                           // Default to the first available size and schedule
                           pipeSize: (allLookupData.bevel || [])[0]?.nb || 80,
                           sch: SCHEDULE_OPTIONS[0] || 80,
                           bevelQty: 1, setupQty: 1, buttweldQty: 1, oletQty: 0, socketQty: 0,
                           flangeQty: 0, flangeLb: FLANGE_LB_OPTIONS[0], spareQty: 0, spareRate: 0,
                           ndtQty: 1, ndtType: NDT_TYPES[0],
                           spoolAssemblyLength: 1,
                           supplyEndPlatesQty: 0, supplyEndPlatesRate: 0,
                           fittingsCostQty: 0, fittingsCostCost: 0,
                           weldEndPlatesQty: 0, weldEndPlatesRate: 0,
                           cutAndPrepQty: 0, cutAndPrepRate: 0,
            });
            render(container);
            document.dispatchEvent(new CustomEvent('dataChanged'));
        }
        if (event.target.classList.contains('btn-delete-row')) {
            if (confirm('Are you sure you want to delete this item?')) {
                const rowEl = event.target.closest('tr');
                const index = parseInt(rowEl.dataset.index, 10);
                lineItems.splice(index, 1);
                render(container);
                document.dispatchEvent(new CustomEvent('dataChanged'));
            }
        }
    });
}

export default {
    init(container, data, lookupData) {
        lineItems = data && data.length > 0 ? JSON.parse(JSON.stringify(data)) : [];
        allLookupData = lookupData;
        render(container);
        addEventListeners(container);
    },
    getData() {
        return lineItems;
    },
};
