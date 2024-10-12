// Word of the Day Module

// Placeholder for word of the day data
let wordOfDayData = {
    en: { word: '', definition: '' },
    uk: { word: '', definition: '' }
};

// Function to fetch word of the day (placeholder)
async function fetchWordOfDay() {
    // In a real implementation, this would fetch data from an API
    console.log('Fetching word of the day...');
    // Simulating API call with placeholder data
    wordOfDayData = {
        en: { word: 'Placeholder', definition: 'A placeholder English word' },
        uk: { word: 'Заповнювач', definition: 'Тимчасове українське слово' }
    };
}

// Function to update the UI with word of the day
function updateWordOfDayUI() {
    const enElement = document.getElementById('word-of-day-en');
    const ukElement = document.getElementById('word-of-day-uk');

    if (enElement) {
        enElement.innerHTML = `
            <h3>Word of the Day (EN)</h3>
            <p><strong>${wordOfDayData.en.word}</strong></p>
            <p>${wordOfDayData.en.definition}</p>
        `;
    }

    if (ukElement) {
        ukElement.innerHTML = `
            <h3>Слово дня (UK)</h3>
            <p><strong>${wordOfDayData.uk.word}</strong></p>
            <p>${wordOfDayData.uk.definition}</p>
        `;
    }
}

// Initialize word of the day functionality
export async function initializeWordOfDay() {
    console.log('Initializing Word of the Day...');
    await fetchWordOfDay();
    updateWordOfDayUI();
    // Set up daily refresh (e.g., at midnight)
    setInterval(async () => {
        await fetchWordOfDay();
        updateWordOfDayUI();
    }, 24 * 60 * 60 * 1000); // 24 hours
}

console.log('Word of the Day module loaded');
