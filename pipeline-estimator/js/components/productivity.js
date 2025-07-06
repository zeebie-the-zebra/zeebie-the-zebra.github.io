// js/components/productivity.js

let productivityData = {};

const defaultData = {
    items: { generalEconomy: 75, projectSupervision: 70, labourRelations: 65, jobConditions: 60, equipment: 70, weather: 100 },
    standardRates: { labour: 75.00, supervision: 95.00 },
    taxRate: 10,
    units: 'm'
};

function calculateTotals(data) {
    const itemValues = Object.values(data.items);
    const totalPercentage = itemValues.reduce((sum, value) => sum + value, 0);
    const totalJobProductivity = itemValues.length > 0 ? totalPercentage / itemValues.length : 0;
    const productivityFactor = totalJobProductivity < 70 && totalJobProductivity > 0 ? (70 / totalJobProductivity) : 1;
    const compositeLabour = data.standardRates.labour * productivityFactor;
    const compositeSupervision = data.standardRates.supervision * productivityFactor;
    return {
        totalJobProductivity,
        lostLabourProductivity: Math.max(0, 100 - totalJobProductivity),
        adjustmentStatus: productivityFactor > 1 ? `Rates adjusted by a factor of ${productivityFactor.toFixed(2)}` : 'Positive productivity % rates wont be adjusted',
        compositeLabour,
        compositeSupervision
    };
}

function render(container) {
    const totals = calculateTotals(productivityData);

    container.innerHTML = `
    <h2 class="mb-4">Production and Composite Rate Calculation</h2>

    <div class="row g-4">
    <!-- Left Column: Input Tables -->
    <div class="col-lg-8">
    <div class="card">
    <div class="card-body">
    <div class="d-flex justify-content-between">
    <h5 class="card-title">Productivity Factors</h5>
    <div class="alert alert-warning p-2 small">
    <strong>Please be careful adjusting this section:</strong> This should only need adjusting if work is undertaken outside of the work shop.
    </div>
    </div>

    <div class="row mt-3">
    <div class="col-md-8">
    <table class="table table-sm table-bordered" id="productivity-items-table">
    <thead class="table-light">
    <tr>
    <th>Productivity Items</th>
    <th class="text-center">Productivity %</th>
    </tr>
    </thead>
    <tbody>
    <tr><td>General Economy</td><td><input type="number" class="form-control form-control-sm text-center" data-item="generalEconomy" value="${productivityData.items.generalEconomy}"></td></tr>
    <tr><td>Project Supervision</td><td><input type="number" class="form-control form-control-sm text-center" data-item="projectSupervision" value="${productivityData.items.projectSupervision}"></td></tr>
    <tr><td>Labour Relations</td><td><input type="number" class="form-control form-control-sm text-center" data-item="labourRelations" value="${productivityData.items.labourRelations}"></td></tr>
    <tr><td>Job Conditions</td><td><input type="number" class="form-control form-control-sm text-center" data-item="jobConditions" value="${productivityData.items.jobConditions}"></td></tr>
    <tr><td>Equipment</td><td><input type="number" class="form-control form-control-sm text-center" data-item="equipment" value="${productivityData.items.equipment}"></td></tr>
    <tr><td>Weather</td><td><input type="number" class="form-control form-control-sm text-center" data-item="weather" value="${productivityData.items.weather}"></td></tr>
    </tbody>
    </table>
    </div>
    <div class="col-md-4">
    <table class="table table-sm table-bordered">
    <thead class="table-light">
    <tr><th>Type</th><th class="text-center">% Range</th></tr>
    </thead>
    <tbody>
    <tr><td>Very Low</td><td class="text-center">10 - 40</td></tr>
    <tr><td>Low</td><td class="text-center">41 - 60</td></tr>
    <tr><td>Average</td><td class="text-center">61 - 80</td></tr>
    <tr><td>Very Good</td><td class="text-center">81 - 90</td></tr>
    <tr><td>Excellent</td><td class="text-center">91 - 100</td></tr>
    </tbody>
    </table>
    </div>
    </div>

    <!-- Results Section -->
    <table class="table table-sm table-bordered" style="max-width: 400px;">
    <tbody>
    <tr>
    <td class="fw-bold" data-bs-toggle="tooltip" title="Total Job Productivity; Anything over 70% is considered near perfect and as such labour rates do not get adjusted. If value drops below 70% labour rates will be increased for the company to cover the % of costs lost for the reduction in productivity.">Total Job Productivity</td>
    <td class="text-center">${totals.totalJobProductivity.toFixed(2)}%</td>
    </tr>
    <tr>
    <td>Lost Labour Productivity</td>
    <td class="text-center">${totals.lostLabourProductivity.toFixed(2)}%</td>
    </tr>
    <tr>
    <td colspan="2" class="text-center ${totals.adjustmentStatus.includes('wont') ? 'text-success' : 'text-danger'} fw-bold">${totals.adjustmentStatus}</td>
    </tr>
    </tbody>
    </table>
    </div>
    </div>
    </div>

    <!-- Right Column: Rates -->
    <div class="col-lg-4">
    <div class="card mb-4">
    <div class="card-header">Standard Rates & Global Settings</div>
    <div class="card-body">
    <label class="form-label">Standard Labour Rate</label>
    <input type="number" class="form-control" data-rate="labour" value="${productivityData.standardRates.labour.toFixed(2)}">
    <label class="form-label mt-2">Standard Supervision Rate</label>
    <input type="number" class="form-control" data-rate="supervision" value="${productivityData.standardRates.supervision.toFixed(2)}">
    <hr>
    <label for="tax-rate" class="form-label fw-bold">Tax Rate</label>
    <div class="input-group">
    <input type="number" class="form-control" id="tax-rate" value="${productivityData.taxRate}" step="0.1">
    <span class="input-group-text">%</span>
    </div>
    <hr>
    <label for="unit-selector" class="form-label">Spool Length Units</label>
    <select class="form-select" id="unit-selector">
    <option value="m" ${productivityData.units === 'm' ? 'selected' : ''}>Meters (m)</option>
    <option value="ft" ${productivityData.units === 'ft' ? 'selected' : ''}>Feet (ft)</option>
    </select>
    </div>
    </div>
    <div class="card">
    <div class="card-header">Final Composite Rates</div>
    <div class="card-body">
    <label class="form-label">Composite Labour</label>
    <input type="text" class="form-control" readonly disabled value="$${totals.compositeLabour.toFixed(2)}">
    <label class="form-label mt-2">Composite Supervision</label>
    <input type="text" class="form-control" readonly disabled value="$${totals.compositeSupervision.toFixed(2)}">
    </div>
    </div>
    </div>
    </div>

    <!-- FIX: Re-added the descriptions table -->
    <h3 class="mt-5">Productivity Item Descriptions</h3>
    <table class="table table-bordered mt-3">
    <thead class="table-light">
    <tr><th style="width: 20%;">Items</th><th>Description</th></tr>
    </thead>
    <tbody>
    <tr>
    <td>General Economy</td>
    <td>This percentage is based off, A - Business trends and outlooks, B - Construction volume, C - The employment situation.<br>IE - To show how to arrive at final productivity efficiency percentage, lets us say we find this element to be of a high average in the area of the project. Since it is a high average, but no means excellent, we estimate our productivity percentage at 75%.</td>
    </tr>
    <tr>
    <td>Project Supervision</td>
    <td>This percentage is based off, A - Experience, B - Supply, C - Pay.<br>IE - Similar to General Economy; After careful analysis of the three items listed under this element, we find that our supervision will be normal for this type of work and we arrive at an estimated productivity rate of 70%</td>
    </tr>
    <tr>
    <td>Labour Relations</td>
    <td>This percentage is based off, A - Experience, B - Supply, C - Pay<br>IE - Lets us say that for a project in a given area we have found our labour relations to be fair but feel that they could be a little better. Since this is the case, we arrive at an efficient rating of 65% for this element.</td>
    </tr>
    <tr>
    <td>Job Conditions</td>
    <td>This percentage is based off, A - Scope of work, B - Site Conditions, C - Material procurement, D - Manual and Mechanized Operations.<br>IE - Site is new plant and there is ample time to complete project, but the site location is low and muddy, the estimated productivity rating would be 60%</td>
    </tr>
    <tr>
    <td>Equipment</td>
    <td>This percentage is based off, the following factors A - Usability, B - Condition, C - Maintenance and Repair<br>IE - Equipment in good shape, ample supplies to draw from and average mechanics, the estimated productivity rating would be 70%</td>
    </tr>
    <tr>
    <td>Weather</td>
    <td>Based on weather conditions over the course of the work while at job site. If work performed is inside the workshop weather is set to 100<br>IE - If weather estimated (based on past history) is good 40% of time and bad the other 60%, value would be set to 40%</td>
    </tr>
    </tbody>
    </table>
    `;
    addEventListeners(container);
    const tooltipTriggerList = container.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

function addEventListeners(container) {
    container.addEventListener('change', (event) => {
        const target = event.target;
        const itemKey = target.dataset.item;
        const rateKey = target.dataset.rate;

        if (itemKey) {
            productivityData.items[itemKey] = parseFloat(target.value) || 0;
        } else if (rateKey) {
            productivityData.standardRates[rateKey] = parseFloat(target.value) || 0;
        } else if (target.id === 'tax-rate') {
            productivityData.taxRate = parseFloat(target.value) || 0;
        } else if (target.id === 'unit-selector') {
            productivityData.units = target.value;
            document.dispatchEvent(new CustomEvent('unitsChanged'));
        } else {
            return;
        }

        render(container);
        document.dispatchEvent(new CustomEvent('dataChanged'));
    });
}

export default {
    init(container, data) {
        const savedItems = data?.items || {};
        const savedRates = data?.standardRates || {};
        productivityData = {
            items: { ...defaultData.items, ...savedItems },
            standardRates: { ...defaultData.standardRates, ...savedRates },
            taxRate: data?.taxRate ?? defaultData.taxRate,
            units: data?.units || defaultData.units,
        };
        render(container);
    },
    getData() {
        return productivityData;
    }
};
