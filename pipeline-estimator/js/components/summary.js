// js/components/summary.js

let allLookupData = {};
let summarySettings = {};

const METER_TO_FEET = 3.28084;

// --- Helper Functions ---
function findRate(lookupTable, pipeSize, sch) { if (!lookupTable || !pipeSize || !sch) return 0; const row = lookupTable.find(r => r.nb == pipeSize); if (!row) return 0; const rate = row[`sch${sch}`]; return rate !== null ? rate : 0; }
function findFlangeRate(lookupTable, pipeSize, lb) { if (!lookupTable || !pipeSize || !lb) return 0; const row = lookupTable.find(r => r.nb == pipeSize); if (!row) return 0; const rate = row[`lb${lb}`]; return rate !== null ? rate : 0; }
function findNdtRate(ndtTables, ndtType, pipeSize, sch) { if (!ndtTables || !ndtType || !pipeSize || !sch) return 0; let totalRate = 0; if (ndtType.includes('Gamma')) totalRate += findRate(ndtTables.gamma, pipeSize, sch); if (ndtType.includes('X-Ray')) totalRate += findRate(ndtTables.xray, pipeSize, sch); if (ndtType.includes('MPI')) totalRate += findRate(ndtTables.mpi, pipeSize, sch); if (ndtType.includes('DPI')) totalRate += findRate(ndtTables.dpi, pipeSize, sch); return totalRate; }
function calculateCompositeRates(prodData) {
    if (!prodData || !prodData.items || !prodData.standardRates) { return { labour: 75, supervision: 95 }; }
    const itemValues = Object.values(prodData.items);
    const totalPercentage = itemValues.reduce((sum, value) => sum + value, 0);
    const totalJobProductivity = itemValues.length > 0 ? totalPercentage / itemValues.length : 0;
    const productivityFactor = totalJobProductivity < 70 && totalJobProductivity > 0 ? (70 / totalJobProductivity) : 1;
    return {
        labour: prodData.standardRates.labour * productivityFactor,
        supervision: prodData.standardRates.supervision * productivityFactor,
    };
}

function render(container) {
    const compositeRates = calculateCompositeRates(allLookupData.productivity);
    const lineItems = allLookupData.fabrication || [];
    const taxRate = allLookupData.productivity?.taxRate || 10;

    const headers = `
    <thead class="table-light align-middle text-center">
    <tr>
    <th rowspan="2">Iso / Dwg No.</th>
    <th colspan="8">Internal Labour Costing</th>
    <th colspan="6">Third Party Suppliers & Materials</th>
    <th rowspan="2">${summarySettings.markUpPercent}% Mark Up</th>
    <th rowspan="2">Line Item Total</th>
    </tr>
    <tr>
    <th>Labour Hrs</th><th>Hydro Hrs</th><th>Packaging Hrs</th><th>Sub Total Labour Hrs</th><th>Labour Rate $</th><th>Supervision Hrs</th><th>Supervision Rate $</th><th>Total of all Labour</th>
    <th>NDT</th><th>Survey</th><th>Painting</th><th>Packaging Materials</th><th>Hydrostatic Testing Materials</th><th>Consumables</th>
    </tr>
    </thead>
    `;

    const processedItems = lineItems.map(item => {
        const lineItemSettings = summarySettings.lineItemData[item.id] || {};

        const labourHrs = (item.bevelQty * findRate(allLookupData.bevel, item.pipeSize, item.sch)) + (item.setupQty * findRate(allLookupData.setup, item.pipeSize, item.sch)) + (item.buttweldQty * findRate(allLookupData.buttweld, item.pipeSize, item.sch)) + (item.oletQty * findRate(allLookupData.olet, item.pipeSize, item.sch)) + (item.socketQty * findRate(allLookupData.socket, item.pipeSize, item.sch)) + (item.flangeQty * findFlangeRate(allLookupData.flange, item.pipeSize, item.flangeLb)) + (item.spareQty * item.spareRate);
        let hydroHrs = 0, hydroMats = 0;
        if (item.hydroRequired === 'Yes') {
            const hydroRate = findRate(allLookupData.hydroTestRates, item.pipeSize, item.sch);
            const units = allLookupData.productivity?.units || 'm';
            const hydroLengthInFeet = units === 'm' ? item.spoolAssemblyLength * METER_TO_FEET : item.spoolAssemblyLength;
            const multiplier = allLookupData.hydroData?.[item.id] || 2;
            const isIndividual = item.individualSegment === 'Yes';
            const hydroSum = (hydroLengthInFeet * hydroRate) * 4;
            const baseHydroLabor = findRate(allLookupData.handling, item.pipeSize, item.sch) + item.weldEndPlatesQty * item.weldEndPlatesRate + item.cutAndPrepQty * item.cutAndPrepRate;
            hydroHrs = isIndividual ? baseHydroLabor + (hydroSum * multiplier) : baseHydroLabor + hydroSum;
            hydroMats = (item.supplyEndPlatesQty * item.supplyEndPlatesRate) + (item.fittingsCostQty * item.fittingsCostCost);
        }

        const packagingHrs = findRate(allLookupData.handling, item.pipeSize, item.sch);
        const subTotalLabourHrs = labourHrs + hydroHrs + packagingHrs;
        const supervisionHrs = subTotalLabourHrs * (summarySettings.supervisionPercent / 100);
        const supervisionCostComponent = supervisionHrs * compositeRates.supervision;
        const labourCostComponent = subTotalLabourHrs * compositeRates.labour;
        const totalAllLab = labourCostComponent + supervisionCostComponent;

        const ndtCost = findNdtRate(allLookupData.ndt, item.ndtType, item.pipeSize, item.sch) * item.ndtQty;
        const surveyCost = lineItemSettings.survey || 0;
        const paintingCost = lineItemSettings.painting || 0;
        const packageMatsCost = lineItemSettings.packageMats || 0;

        // --- THIS IS THE FIX ---
        // Changed `rowTotal` (which was undefined) to `labourHrs` (which is correctly defined).
        const consumablesCost = (labourHrs * 5) + ((findRate(allLookupData.buttweld, item.pipeSize, item.sch)*item.buttweldQty) + (findRate(allLookupData.olet, item.pipeSize, item.sch)*item.oletQty) + (findRate(allLookupData.socket, item.pipeSize, item.sch)*item.socketQty) + (findFlangeRate(allLookupData.flange, item.pipeSize, item.flangeLb)*item.flangeQty) + (item.spareQty*item.spareRate)) * 10;

        const thirdPartyAndMaterialsTotal = ndtCost + surveyCost + paintingCost + packageMatsCost + hydroMats + consumablesCost;
        const markUpAmount = thirdPartyAndMaterialsTotal * (summarySettings.markUpPercent / 100);
        const grandTotal = totalAllLab + thirdPartyAndMaterialsTotal + markUpAmount;

        return { item, labourHrs, hydroHrs, packagingHrs, subTotalLabourHrs, supervisionHrs, totalAllLab, ndtCost, surveyCost, paintingCost, packageMatsCost, hydroMats, consumablesCost, markUpAmount, grandTotal };
    });

    const bodyRows = processedItems.map(({ item, ...calcs }) => `
    <tr class="text-center" data-id="${item.id}">
    <td class="text-start">${item.isoDwgNo}</td>
    <td>${calcs.labourHrs.toFixed(2)}</td><td>${calcs.hydroHrs.toFixed(2)}</td><td class="bg-light-yellow">${calcs.packagingHrs.toFixed(2)}</td>
    <td class="fw-bold">${calcs.subTotalLabourHrs.toFixed(2)}</td><td>$${compositeRates.labour.toFixed(2)}</td><td>${calcs.supervisionHrs.toFixed(2)}</td>
    <td>$${compositeRates.supervision.toFixed(2)}</td><td class="fw-bold">$${calcs.totalAllLab.toFixed(2)}</td><td>$${calcs.ndtCost.toFixed(2)}</td>
    <td><input type="number" class="form-control form-control-sm" data-prop="survey" value="${calcs.surveyCost.toFixed(2)}"></td>
    <td><input type="number" class="form-control form-control-sm" data-prop="painting" value="${calcs.paintingCost.toFixed(2)}"></td>
    <td class="bg-light-yellow"><input type="number" class="form-control form-control-sm" data-prop="packageMats" value="${calcs.packageMatsCost.toFixed(2)}"></td>
    <td>$${calcs.hydroMats.toFixed(2)}</td><td>$${calcs.consumablesCost.toFixed(2)}</td><td>$${calcs.markUpAmount.toFixed(2)}</td>
    <td class="fw-bold table-success">$${calcs.grandTotal.toFixed(2)}</td>
    </tr>
    `).join('');

    const grandTotals = processedItems.reduce((totals, current) => { totals.labourHrs += current.labourHrs; totals.hydroHrs += current.hydroHrs; totals.packagingHrs += current.packagingHrs; totals.subTotalLabourHrs += current.subTotalLabourHrs; totals.totalAllLab += current.totalAllLab; totals.ndtCost += current.ndtCost; totals.surveyCost += current.surveyCost; totals.paintingCost += current.paintingCost; totals.packageMatsCost += current.packageMatsCost; totals.hydroMats += current.hydroMats; totals.consumablesCost += current.consumablesCost; return totals; }, { labourHrs: 0, hydroHrs: 0, packagingHrs: 0, subTotalLabourHrs: 0, totalAllLab: 0, ndtCost: 0, surveyCost: 0, paintingCost: 0, packageMatsCost: 0, hydroMats: 0, consumablesCost: 0 });
    const preMarkupGrandTotal = grandTotals.ndtCost + grandTotals.surveyCost + grandTotals.paintingCost + grandTotals.packageMatsCost + grandTotals.hydroMats + grandTotals.consumablesCost;
    const markUpGrandTotal = preMarkupGrandTotal * (summarySettings.markUpPercent / 100);
    const lumpSumTotal = Object.values(summarySettings.lumpSum).reduce((sum, val) => sum + val, 0);
    const subTotalBeforeLumpSum = grandTotals.totalAllLab + preMarkupGrandTotal + markUpGrandTotal;
    const taxAmount = subTotalBeforeLumpSum * (taxRate / 100);
    const finalGrandTotal = subTotalBeforeLumpSum + taxAmount + lumpSumTotal;

    const tableFooter = `
    <tfoot class="table-group-divider fw-bold text-center">
    <tr>
    <td>Totals</td><td>${grandTotals.labourHrs.toFixed(2)}</td><td>${grandTotals.hydroHrs.toFixed(2)}</td><td>${grandTotals.packagingHrs.toFixed(2)}</td>
    <td>${grandTotals.subTotalLabourHrs.toFixed(2)}</td><td colspan="3"></td><td>$${grandTotals.totalAllLab.toFixed(2)}</td><td>$${grandTotals.ndtCost.toFixed(2)}</td>
    <td>$${grandTotals.surveyCost.toFixed(2)}</td><td>$${grandTotals.paintingCost.toFixed(2)}</td><td>$${grandTotals.packageMatsCost.toFixed(2)}</td>
    <td>$${grandTotals.hydroMats.toFixed(2)}</td><td>$${grandTotals.consumablesCost.toFixed(2)}</td><td>$${markUpGrandTotal.toFixed(2)}</td>
    <td class="table-success">$${(grandTotals.totalAllLab + preMarkupGrandTotal + markUpGrandTotal).toFixed(2)}</td>
    </tr>
    </tfoot>
    `;

    const lumpSumRows = Object.keys(summarySettings.lumpSum).map(field => `
    <tr><td>${field.charAt(0).toUpperCase() + field.slice(1)}</td><td><input type="number" class="form-control form-control-sm" data-lump-sum-prop="${field}" value="${(summarySettings.lumpSum[field] || 0).toFixed(2)}"></td></tr>
    `).join('');

    const printSummaryCard = `
    <div class="print-only mt-4">
    <h4 class="text-end">Quotation Summary</h4>
    <table class="table table-sm table-bordered" style="width: 350px; float: right;">
    <tbody>
    <tr><td>Sub-Total (Labour, Materials, Markup)</td><td class="text-end">$${subTotalBeforeLumpSum.toFixed(2)}</td></tr>
    <tr><td>Tax (${taxRate}%)</td><td class="text-end">$${taxAmount.toFixed(2)}</td></tr>
    ${Object.entries(summarySettings.lumpSum).map(([key, value]) => `
        <tr><td>${key.charAt(0).toUpperCase() + key.slice(1)}</td><td class="text-end">$${value.toFixed(2)}</td></tr>
        `).join('')}
        <tr class="fw-bold h5"><td>Grand Total</td><td class="text-end">$${finalGrandTotal.toFixed(2)}</td></tr>
        </tbody>
        </table>
        </div>
        `;

        container.innerHTML = `
        <div class="no-print">
        <div class="d-flex justify-content-between align-items-center mb-3">
        <h3>Quotation Summary</h3>
        <button class="btn btn-primary" id="download-pdf-btn"><i class="bi bi-printer-fill"></i> Download as PDF</button>
        </div>
        </div>
        <div class="print-area">
        <div class="row">
        <div class="col-12">
        <div class="table-responsive">
        <table class="table table-bordered table-sm" id="summary-table">
        ${headers}
        <tbody>${bodyRows}</tbody>
        ${tableFooter}
        </table>
        </div>
        </div>
        </div>
        ${printSummaryCard}
        </div>
        <div class="row no-print">
        <div class="col-lg-9"></div>
        <div class="col-lg-3">
        <div class="card mt-3">
        <div class="card-header">Adjustments & Lump Sum</div>
        <div class="card-body">
        <div class="mb-3"><label class="form-label fw-bold">Supervision %</label><input type="number" class="form-control" data-summary-prop="supervisionPercent" value="${summarySettings.supervisionPercent}"></div>
        <div class="mb-3"><label class="form-label fw-bold">Mark Up % on Third Party Suppliers & Materials</label><input type="number" class="form-control" data-summary-prop="markUpPercent" value="${summarySettings.markUpPercent}"></div>
        <hr>
        <table class="table table-sm" id="lump-sum-table"><tbody>${lumpSumRows}</tbody></table>
        <hr>
        <div class="d-flex justify-content-between"><span>Tax (${taxRate}%)</span><span class="fw-bold">$${taxAmount.toFixed(2)}</span></div>
        <hr>
        <div class="d-flex justify-content-between h4"><span>Lump Sum Total:</span><span class="fw-bold">$${finalGrandTotal.toFixed(2)}</span></div>
        </div>
        </div>
        </div>
        </div>
        `;
        addEventListeners(container);
}

function addEventListeners(container) {
    container.addEventListener('change', event => {
        const target = event.target;
        const lineItemRow = target.closest('tr[data-id]');

        if (target.dataset.summaryProp) {
            summarySettings[target.dataset.summaryProp] = parseFloat(target.value) || 0;
        } else if (target.dataset.lumpSumProp) {
            summarySettings.lumpSum[target.dataset.lumpSumProp] = parseFloat(target.value) || 0;
        } else if (lineItemRow) {
            const id = parseInt(lineItemRow.dataset.id, 10);
            const prop = target.dataset.prop;
            if (!id || !prop) return;

            if (!summarySettings.lineItemData[id]) {
                summarySettings.lineItemData[id] = {};
            }
            summarySettings.lineItemData[id][prop] = parseFloat(target.value) || 0;
        } else {
            return;
        }

        render(container);
        document.dispatchEvent(new CustomEvent('dataChanged'));
    });

    const pdfButton = container.querySelector('#download-pdf-btn');
    if (pdfButton) {
        pdfButton.addEventListener('click', () => {
            window.print();
        });
    }
}

export default {
    init(container, projectData) {
        allLookupData = projectData;
        const defaultLumpSum = { qaDocs: 0, admin: 0, handling: 0, delivery: 0, other: 0, margin: 0 };
        const savedSummaryData = projectData.summaryData || {};

        summarySettings = {
            supervisionPercent: 6,
            markUpPercent: 10,
            ...savedSummaryData,
            lineItemData: savedSummaryData.lineItemData || {},
            lumpSum: { ...defaultLumpSum, ...(savedSummaryData.lumpSum || {}) }
        };

        (allLookupData.fabrication || []).forEach(item => {
            if (!summarySettings.lineItemData[item.id]) {
                summarySettings.lineItemData[item.id] = { survey: 0, painting: 0, packageMats: 0 };
            }
        });

        render(container);
    },
    getData() {
        return summarySettings;
    }
};
