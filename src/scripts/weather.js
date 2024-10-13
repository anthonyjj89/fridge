// Weather Widget Integration

function getMockWeatherData() {
    const temperatures = [20, 22, 25, 28, 30, 32, 35];
    const randomTemp = temperatures[Math.floor(Math.random() * temperatures.length)];
    const humidity = Math.floor(Math.random() * 41) + 30; // 30% to 70%
    const windSpeed = Math.floor(Math.random() * 21) + 5; // 5 to 25 km/h
    const precipitation = Math.floor(Math.random() * 51); // 0% to 50%

    return {
        main: {
            temp: randomTemp,
            humidity: humidity
        },
        wind: {
            speed: windSpeed
        },
        precipitation: precipitation
    };
}

export function initializeWeather() {
    console.log('Initializing weather widget');
    try {
        const data = getMockWeatherData();
        updateWeatherDisplay(data);
    } catch (error) {
        console.error('Error updating weather data:', error);
        displayWeatherError();
    }
}

function updateWeatherDisplay(data) {
    if (data && data.main) {
        const temperatureElement = document.getElementById('temperature');
        const humidityElement = document.getElementById('humidity');
        const windElement = document.getElementById('wind');
        const precipitationElement = document.getElementById('precipitation');

        if (temperatureElement) {
            const temperature = Math.round(data.main.temp);
            temperatureElement.textContent = `${temperature}°C`;
            console.log('Temperature updated:', `${temperature}°C`);
        }

        if (humidityElement) {
            humidityElement.textContent = `${data.main.humidity}%`;
            console.log('Humidity updated:', `${data.main.humidity}%`);
        }

        if (windElement) {
            windElement.textContent = `${data.wind.speed} km/h`;
            console.log('Wind speed updated:', `${data.wind.speed} km/h`);
        }

        if (precipitationElement) {
            precipitationElement.textContent = `${data.precipitation}%`;
            console.log('Precipitation updated:', `${data.precipitation}%`);
        }
    } else {
        console.warn('Weather data is incomplete');
        displayWeatherError();
    }
}

function displayWeatherError() {
    const elements = ['temperature', 'humidity', 'wind', 'precipitation'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = 'N/A';
        }
    });
    console.error('Failed to load weather data');
}

console.log('Weather.js loaded');
