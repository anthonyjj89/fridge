// Weather Widget Integration

function getMockWeatherData() {
    const temperatures = [20, 22, 25, 28, 30, 32, 35];
    const randomTemp = temperatures[Math.floor(Math.random() * temperatures.length)];
    return {
        main: {
            temp: randomTemp
        }
    };
}

export function initializeWeather() {
    console.log('Initializing weather widget');
    try {
        const data = getMockWeatherData();
        const temperatureElement = document.getElementById('temperature');
        if (temperatureElement) {
            if (data && data.main) {
                const temperature = Math.round(data.main.temp);
                temperatureElement.textContent = `${temperature}°C`;
                console.log('Weather data updated:', `${temperature}°C`);
            } else {
                temperatureElement.textContent = 'Weather data unavailable';
                console.warn('Weather data is incomplete');
            }
        } else {
            console.error('Temperature element not found in the DOM');
        }
    } catch (error) {
        console.error('Error updating weather data:', error);
        const temperatureElement = document.getElementById('temperature');
        if (temperatureElement) {
            temperatureElement.textContent = 'Failed to load weather data';
        }
    }
}

// Remove the DOMContentLoaded event listener, as we'll handle initialization in main.js
// document.addEventListener('DOMContentLoaded', initializeWeather);

console.log('Weather.js loaded');
