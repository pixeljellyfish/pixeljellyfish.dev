  // Client-side script for weather hover effect
  const weatherElement = document.getElementById('weather');
  const tempC = Number.parseFloat(weatherElement?.textContent) || 0;
  const tempF = Math.round(tempC * 9 / 5 + 32);
  
  if (weatherElement) {
    // Set the initial temperature correctly
    weatherElement.innerHTML = `${Math.round(tempC)}°C`;

    // Add hover effect to toggle between Celsius and Fahrenheit
    weatherElement.addEventListener('mouseover', () => {
      weatherElement.innerHTML = `${tempF}°F`;
    });
    weatherElement.addEventListener('mouseout', () => {
      weatherElement.innerHTML = `${Math.round(tempC)}°C`;
    });
  }