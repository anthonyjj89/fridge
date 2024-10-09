// Weather Widget Integration
function initializeWeather() {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
    const city = 'Dubai';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const temperatureElement = document.getElementById('temperature');
            if (data && data.main) {
                const temperature = Math.round(data.main.temp);
                temperatureElement.textContent = `${temperature}°C`;
            } else {
                temperatureElement.textContent = 'Weather data unavailable';
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            const temperatureElement = document.getElementById('temperature');
            temperatureElement.textContent = 'Failed to load weather data';
        });
}