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
    slider.style.background = `linear-gradient(to right, #d1d8e6 0%, #d1d8e6 ${value}%, #464f61 ${value}%, #464f61 100%)`;
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
