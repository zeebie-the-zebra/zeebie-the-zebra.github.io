// js/components/hydrostaticTest.js

let hydroItems = [];
let allLookupData = {};
let hydroSettings = {};
const METER_TO_FEET = 3.28084;
const YES_NO = ['No', 'Yes'];

function findRate(lookupTable, pipeSize, sch) {
    if (!lookupTable || !pipeSize || !sch) return 0;
    const row = lookupTable.find(r => r.nb == pipeSize);
    if (!row) return 0;
    const rate = row[`sch${sch}`];
    return rate !== null ? rate : 0;
}

// --- Helper function from Productivity.js to calculate the composite rate ---
// This ensures the logic is identical in both places.
function calculateCompositeRate(prodData) {
    if (!prodData || !prodData.items || !prodData.standardRates) {
        return 75.00; // Return a default if data is missing
    }
    const itemValues = Object.values(prodData.items);
    const totalPercentage = itemValues.reduce((sum, value) => sum + value, 0);
    const totalJobProductivity = totalPercentage / itemValues.length;
    const productivityFactor = totalJobProductivity < 70 ? (70 / totalJobProductivity) : 1;
    return prodData.standardRates.labour * productivityFactor;
}


function render(container) {
    // --- FIX: Calculate the composite rate using the helper function ---
    const compositeShopRate = calculateCompositeRate(allLookupData.productivity);
    const units = allLookupData.productivity?.units || 'm';

    const headers = `
    <thead class="table-light align-middle text-center">
    <tr>
    <th rowspan="2">Individual Segment?</th>
    <th rowspan="2">Individual Segment Multiplier</th>
    <th rowspan="2">Iso / Dwg No.</th>
    <th rowspan="2">Spool Assembly Length (${units})</th>
    <th colspan="3">Handling</th>
    <th colspan="3">Supply End Plates and Fittings</th>
    <th colspan="3">Material Cost Allocation – Fittings & End Plates</th>
    <th colspan="3" data-bs-toggle="tooltip" data-bs-placement="top" title="Includes preparation of the pipe end for welding an end plate, and its subsequent removal after hydrostatic testing is completed.">Prep Pipe Ends for End Plate Weld & Post-Test Removal</th>
    <th colspan="3" data-bs-toggle="tooltip" data-bs-placement="top" title="Welding an end plate (flange) to one end of the pipe for pressure testing purposes, as requested by the client. The opposite end is intentionally left blank to allow flange installation on-site, often due to fitment constraints during final assembly.">Weld End Plates to Pipe Sections</th>
    <th colspan="3">Assemble and Disassemble Test Flange Connections</th>
    <th colspan="3">Install Hydrostatic Test Equipment</th>
    <th colspan="3">Perform Hydrostatic Pressure Test</th>
    <th colspan="3">Remove Test Equipment and Flanges</th>
    <th colspan="3">Totals</th>
    </tr>
    <tr>
    <th>Qty</th><th>Rate</th><th>Total</th>
    <th>Qty</th><th>Cost</th><th>Total</th>
    <th>Qty</th><th>Cost</th><th>Total</th>
    <th>Qty</th><th>Hours</th><th>Total</th>
    <th>Qty</th><th>Hours</th><th>Total</th>
    <th>Qty</th><th>Rate</th><th>Total</th>
    <th>Qty</th><th>Rate</th><th>Total</th>
    <th>Qty</th><th>Rate</th><th>Total</th>
    <th>Qty</th><th>Rate</th><th>Total</th>
    <th>Hr's</th><th>Labour Total</th><th>Material Total</th>
    </tr>
    </thead>
    `;

    const bodyRows = hydroItems.map(item => {
        const multiplier = hydroSettings[item.id] || 2;
        const isIndividual = item.individualSegment === 'Yes';

        const handlingRate = findRate(allLookupData.handling, item.pipeSize, item.sch);
        const hydroRate = findRate(allLookupData.hydroTestRates, item.pipeSize, item.sch);

        const handlingQty = 1.0;
        const hydroLengthInFeet = units === 'm' ? item.spoolAssemblyLength * METER_TO_FEET : item.spoolAssemblyLength;
        const hydroQty = item.spoolAssemblyLength;

        // Labor Costs
        const handlingTotal = handlingQty * handlingRate;
        const weldEndPlatesTotal = item.weldEndPlatesQty * item.weldEndPlatesRate;
        const boltUpTotal = hydroLengthInFeet * hydroRate;
        const setupHydroTotal = hydroLengthInFeet * hydroRate;
        const hydroTestTotal = hydroLengthInFeet * hydroRate;
        const unboltTotal = hydroLengthInFeet * hydroRate;
        const cutAndPrepTotal = item.cutAndPrepQty * item.cutAndPrepRate;

        // Material Costs
        const supplyEndPlatesTotal = item.supplyEndPlatesQty * item.supplyEndPlatesRate;
        const fittingsCostTotal = item.fittingsCostQty * item.fittingsCostCost;

        // Calculations
        let hrsTotal;
        const hydroSum = boltUpTotal + setupHydroTotal + hydroTestTotal + unboltTotal;
        const baseLaborHrs = handlingTotal + weldEndPlatesTotal + cutAndPrepTotal;

        if (isIndividual) {
            hrsTotal = baseLaborHrs + (hydroSum * multiplier);
        } else {
            hrsTotal = baseLaborHrs + hydroSum;
        }

        // --- FIX: Use the new compositeShopRate for the calculation ---
        const labourTotal = hrsTotal * compositeShopRate;
        const materialTotal = supplyEndPlatesTotal + fittingsCostTotal;

        return `
        <tr class="text-center" data-id="${item.id}">
        <td><select class="form-select form-select-sm" data-prop="individualSegment">${YES_NO.map(o => `<option value="${o}" ${o === item.individualSegment ? 'selected' : ''}>${o}</option>`).join('')}</select></td>
        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="individualSegmentMultiplier" value="${multiplier}" step="0.1" ${!isIndividual ? 'disabled' : ''}></td>
        <td>${item.isoDwgNo}</td>
        <td><input type="number" class="form-control form-control-sm" data-prop="spoolAssemblyLength" value="${item.spoolAssemblyLength}"></td>

        <td class="bg-light-yellow">${handlingQty.toFixed(1)}</td>
        <td class="bg-light-orange">${handlingRate.toFixed(2)}</td>
        <td>${handlingTotal.toFixed(2)}</td>

        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="supplyEndPlatesQty" value="${item.supplyEndPlatesQty}"></td>
        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="supplyEndPlatesRate" value="${item.supplyEndPlatesRate}"></td>
        <td>${supplyEndPlatesTotal.toFixed(2)}</td>

        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="fittingsCostQty" value="${item.fittingsCostQty}"></td>
        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="fittingsCostCost" value="${item.fittingsCostCost}"></td>
        <td>${fittingsCostTotal.toFixed(2)}</td>

        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="cutAndPrepQty" value="${item.cutAndPrepQty}"></td>
        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="cutAndPrepRate" value="${item.cutAndPrepRate}"></td>
        <td>${cutAndPrepTotal.toFixed(2)}</td>

        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="weldEndPlatesQty" value="${item.weldEndPlatesQty}"></td>
        <td><input type="number" class="form-control form-control-sm bg-light-yellow" data-prop="weldEndPlatesRate" value="${item.weldEndPlatesRate}"></td>
        <td>${weldEndPlatesTotal.toFixed(2)}</td>

        <td class="bg-light-yellow">${hydroQty.toFixed(2)}</td>
        <td class="bg-light-orange">${hydroRate.toFixed(4)}</td>
        <td>${boltUpTotal.toFixed(2)}</td>

        <td class="bg-light-yellow">${hydroQty.toFixed(2)}</td>
        <td class="bg-light-orange">${hydroRate.toFixed(4)}</td>
        <td>${setupHydroTotal.toFixed(2)}</td>

        <td class="bg-light-yellow">${hydroQty.toFixed(2)}</td>
        <td class="bg-light-orange">${hydroRate.toFixed(4)}</td>
        <td>${hydroTestTotal.toFixed(2)}</td>

        <td class="bg-light-yellow">${hydroQty.toFixed(2)}</td>
        <td class="bg-light-orange">${hydroRate.toFixed(4)}</td>
        <td>${unboltTotal.toFixed(2)}</td>

        <td class="fw-bold">${hrsTotal.toFixed(2)}</td>
        <td class="fw-bold">$${labourTotal.toFixed(2)}</td>
        <td class="fw-bold">$${materialTotal.toFixed(2)}</td>
        </tr>
        `;
    }).join('');

    container.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
    <h3>Hydrostatic Test Report</h3>
    <!-- FIX: Display the new composite rate -->
    <div class="h5">Composite Labour Rate: <span class="badge bg-primary">$${compositeShopRate.toFixed(2)} / hr</span></div>
    </div>
    <div class="table-responsive">
    <style>
    .bg-light-yellow { background-color: #fffacd; }
    .bg-light-orange { background-color: #ffe4e1; }
    </style>
    <table class="table table-bordered table-sm" id="hydro-test-table">
    ${headers}
    <tbody>
    ${bodyRows}
    </tbody>
    </table>
    </div>
    ${hydroItems.length === 0 ? '<div class="alert alert-info">No items are marked as "Hydro Required" on the Fabrication tab.</div>' : ''}
    `;
    const tooltipTriggerList = container.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

function addEventListeners(container) {
    container.addEventListener('change', event => {
        const target = event.target;
        const rowEl = target.closest('tr');
        if (!rowEl) return;

        const id = parseInt(rowEl.dataset.id, 10);
        const prop = target.dataset.prop;
        if (!id || !prop) return;

        let value = target.value;
        if (target.type === 'number') {
            value = parseFloat(value) || 0;
        }

        if (prop === 'individualSegmentMultiplier') {
            hydroSettings[id] = value;
        } else {
            const masterItem = allLookupData.fabrication.find(item => item.id === id);
            if (masterItem) {
                masterItem[prop] = value;
            }
        }

        hydroItems = allLookupData.fabrication.filter(item => item.hydroRequired === 'Yes');
        render(container);
        document.dispatchEvent(new CustomEvent('dataChanged'));
    });
}

export default {
    init(container, projectData) {
        allLookupData = projectData;
        hydroItems = projectData.fabrication ? projectData.fabrication.filter(item => item.hydroRequired === 'Yes') : [];

        hydroSettings = projectData.hydroData || {};
        hydroItems.forEach(item => {
            if (hydroSettings[item.id] === undefined) {
                hydroSettings[item.id] = 2;
            }
        });

        render(container);
        addEventListeners(container);
    },
    getData() {
        return hydroSettings;
    }
};
