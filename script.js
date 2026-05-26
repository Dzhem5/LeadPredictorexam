// Translations
const translations = {
    en: {
        'label.language': 'Language',
        'label.currency': 'Currency',
        'value.currency': '$ US Dollar',
        'label.campaignStart': 'Campaign Start',
        'label.campaignEnd': 'Campaign End',
        'label.totalRevenue': 'Total Revenue',
        'label.avgOrder': 'Avg. Order Value',
        'stat.prospects': 'Prospects',
        'stat.leads': 'Leads',
        'stat.customers': 'Customers',
        'label.leadRate': 'Lead Response Rate',
        'label.prospectRate': 'Prospect Response Rate',
        'yaxis.title': 'Months'
    },
    bg: {
        'label.language': 'Език',
        'label.currency': 'Валута',
        'value.currency': '$ US Dollar',
        'label.campaignStart': 'Начало на кампанията',
        'label.campaignEnd': 'Край на кампанията',
        'label.totalRevenue': 'Общо приходи',
        'label.avgOrder': 'Ср. стойност на поръчка',
        'stat.prospects': 'Потенциални клиенти',
        'stat.leads': 'Лийдове',
        'stat.customers': 'Клиенти',
        'label.leadRate': 'Процент отговор на лидове',
        'label.prospectRate': 'Процент отговор на потенциални',
        'yaxis.title': 'Месеци'
    }
};

// Apply translations to elements matching [data-i18n]
function applyTranslations(lang) {
    if (!translations[lang]) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

// Persist selected language
function setLanguage(lang) {
    applyTranslations(lang);
    try { localStorage.setItem('lp_lang', lang); } catch(e){}
}

function updateSliderBackground(slider) {
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, #38bdf8 0%, #38bdf8 ${value}%, #cbd5e1 ${value}%, #cbd5e1 100%)`;
}

document.addEventListener('DOMContentLoaded', () => {
    // Language
    const langSelect = document.getElementById('langSelect');
    const saved = (localStorage.getItem('lp_lang')) || 'en';
    if (langSelect) {
        langSelect.value = saved;
        langSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
    applyTranslations(saved);

    // Sliders
    const leadRate = document.getElementById("leadRate");
    const valLeadRate = document.getElementById("valLeadRate");
    const prospectRate = document.getElementById("prospectRate");
    const valProspectRate = document.getElementById("valProspectRate");

    if (leadRate && valLeadRate) {
        leadRate.addEventListener("input", function() {
            valLeadRate.textContent = parseFloat(this.value).toFixed(2) + "%";
            updateSliderBackground(this);
        });
        updateSliderBackground(leadRate);
    }

    if (prospectRate && valProspectRate) {
        prospectRate.addEventListener("input", function() {
            valProspectRate.textContent = parseFloat(this.value).toFixed(2) + "%";
            updateSliderBackground(this);
        });
        updateSliderBackground(prospectRate);
    }

    // Persistable form fields: currency, campaign dates, revenue values
    const currencySelect = document.getElementById('currencySelect');
    const campaignStart = document.getElementById('campaignStart');
    const campaignEnd = document.getElementById('campaignEnd');
    const totalRevenue = document.getElementById('totalRevenue');
    const avgOrderValue = document.getElementById('avgOrderValue');
    const prefixIcon = document.getElementById('prefixIcon');
    const prefixIcon2 = document.getElementById('prefixIcon2');

    const currencySymbols = { USD: '$', EUR: '€' };

    // Load saved values
    try {
        const savedCurrency = localStorage.getItem('lp_currency');
        if (savedCurrency && currencySelect) currencySelect.value = savedCurrency;
        const savedStart = localStorage.getItem('lp_campaignStart');
        if (savedStart && campaignStart) campaignStart.value = savedStart;
        const savedEnd = localStorage.getItem('lp_campaignEnd');
        if (savedEnd && campaignEnd) campaignEnd.value = savedEnd;
        const savedRevenue = localStorage.getItem('lp_totalRevenue');
        if (savedRevenue && totalRevenue) totalRevenue.value = savedRevenue;
        const savedAvg = localStorage.getItem('lp_avgOrderValue');
        if (savedAvg && avgOrderValue) avgOrderValue.value = savedAvg;
    } catch (e) {}

    function updatePrefix(symbol) {
        if (prefixIcon) prefixIcon.textContent = symbol;
        if (prefixIcon2) prefixIcon2.textContent = symbol;
    }

    // Initial prefix update
    if (currencySelect) updatePrefix(currencySymbols[currencySelect.value] || '$');

    if (currencySelect) {
        currencySelect.addEventListener('change', (e) => {
            const v = e.target.value;
            updatePrefix(currencySymbols[v] || '$');
            try { localStorage.setItem('lp_currency', v); } catch (err) {}
        });
    }

    if (campaignStart) {
        campaignStart.addEventListener('change', (e) => {
            try { localStorage.setItem('lp_campaignStart', e.target.value); } catch (err) {}
        });
    }

    if (campaignEnd) {
        campaignEnd.addEventListener('change', (e) => {
            try { localStorage.setItem('lp_campaignEnd', e.target.value); } catch (err) {}
        });
    }

    if (totalRevenue) {
        totalRevenue.addEventListener('input', (e) => {
            try { localStorage.setItem('lp_totalRevenue', e.target.value); } catch (err) {}
            refreshChartFromValues();
        });
    }

    if (avgOrderValue) {
        avgOrderValue.addEventListener('input', (e) => {
            try { localStorage.setItem('lp_avgOrderValue', e.target.value); } catch (err) {}
            refreshChartFromValues();
        });
    }

    // Refresh chart when values change
    function refreshChartFromValues() {
        // Read values
        const totalRev = totalRevenue ? Number(totalRevenue.value) : 0;
        const avgOrder = avgOrderValue ? Number(avgOrderValue.value) : 1;
        const desiredCustomers = Math.max(0, Math.floor(totalRev / (avgOrder || 1)));
        const desiredLeads = Math.max(0, Math.round(desiredCustomers * 2.5));
        const desiredProspects = Math.max(0, Math.round(desiredLeads * 5));

        // Collect base prospects from bar rows (store base if not present)
        const rows = Array.from(document.querySelectorAll('.bar-row'));
        let baseTotal = 0;
        rows.forEach(r => {
            if (!r.dataset.baseProspects) {
                r.dataset.baseProspects = r.getAttribute('data-prospects') || '0';
            }
            baseTotal += Number(r.dataset.baseProspects || 0);
        });
        if (baseTotal === 0) baseTotal = 1;

        const scale = desiredProspects / baseTotal || 1;

        // compute new per-row values
        const newProspectsPerRow = rows.map(r => Math.max(0, Math.round(Number(r.dataset.baseProspects) * scale)));
        const newProspectsTotal = newProspectsPerRow.reduce((a,b)=>a+b,0) || 1;

        // ratios
        const leadsRatio = desiredLeads / (desiredProspects || 1);
        const customersRatio = desiredCustomers / (desiredLeads || 1);

        let maxProspect = Math.max(...newProspectsPerRow, 1);

        // Update rows and bars
        rows.forEach((r, idx) => {
            const p = newProspectsPerRow[idx];
            const l = Math.round(p * leadsRatio);
            const c = Math.round(l * customersRatio);
            r.setAttribute('data-prospects', p);
            r.setAttribute('data-leads', l);
            r.setAttribute('data-customers', c);

            const barPros = r.querySelector('.bar-prospects');
            const barLea = r.querySelector('.bar-leads');
            const barCus = r.querySelector('.bar-customers');
            if (barPros) barPros.style.width = ((p / maxProspect) * 100) + '%';
            if (barLea) barLea.style.width = (p>0 ? (l / p) * 100 : 0) + '%';
            if (barCus) barCus.style.width = (l>0 ? (c / l) * 100 : 0) + '%';
        });

        // Update stat cards
        const prospectsValueEl = document.getElementById('prospectsValue');
        const leadsValueEl = document.getElementById('leadsValue');
        const customersValueEl = document.getElementById('customersValue');
        const prospectsFill = document.getElementById('prospectsFill');
        const leadsFill = document.getElementById('leadsFill');
        const customersFill = document.getElementById('customersFill');
        const prospectsPercent = document.getElementById('prospectsPercent');
        const leadsPercent = document.getElementById('leadsPercent');
        const customersPercent = document.getElementById('customersPercent');

        if (prospectsValueEl) prospectsValueEl.textContent = newProspectsTotal;
        if (leadsValueEl) leadsValueEl.textContent = desiredLeads;
        if (customersValueEl) customersValueEl.textContent = desiredCustomers;

        // Percent fills relative to prospects
        const leadsPct = Math.round((desiredLeads / (desiredProspects || 1)) * 100);
        const customersPct = Math.round((desiredCustomers / (desiredProspects || 1)) * 100);
        if (prospectsFill) prospectsFill.style.width = '100%';
        if (leadsFill) { leadsFill.style.width = Math.min(100, leadsPct) + '%'; }
        if (customersFill) { customersFill.style.width = Math.min(100, customersPct) + '%'; }
        if (prospectsPercent) prospectsPercent.textContent = '100%';
        if (leadsPercent) leadsPercent.textContent = leadsPct + '%';
        if (customersPercent) customersPercent.textContent = customersPct + '%';
    }

    // initial refresh
    refreshChartFromValues();

    // Chart hover effects
    document.querySelectorAll('.bar-row').forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.opacity = '0.9';
        });
        row.addEventListener('mouseleave', () => {
            row.style.opacity = '1';
        });
    });
});
