// Slider updates
const leadRate = document.getElementById("leadRate");
const valLeadRate = document.getElementById("valLeadRate");

const prospectRate = document.getElementById("prospectRate");
const valProspectRate = document.getElementById("valProspectRate");

function updateSliderBackground(slider) {
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, #d1d8e6 0%, #d1d8e6 ${value}%, #464f61 ${value}%, #464f61 100%)`;
}

// Attach event listeners
leadRate.addEventListener("input", function() {
    valLeadRate.textContent = parseFloat(this.value).toFixed(2) + "%";
    updateSliderBackground(this);
});

prospectRate.addEventListener("input", function() {
    valProspectRate.textContent = parseFloat(this.value).toFixed(2) + "%";
    updateSliderBackground(this);
});

// Initialize with default values
updateSliderBackground(leadRate);
updateSliderBackground(prospectRate);

// Add quick visual hover effects to chart bars just to make it a bit dynamic
document.querySelectorAll('.bar-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
        row.style.opacity = '0.9';
    });
    row.addEventListener('mouseleave', () => {
        row.style.opacity = '1';
    });
});
