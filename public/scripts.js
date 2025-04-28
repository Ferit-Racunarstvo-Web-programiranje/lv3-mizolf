function prikaziTablicu(weathers) {
    const tbody = document.querySelector('#weather-table tbody')
    ;
    tbody.innerHTML = ''; // ocisti ako postoji
    for (const weather of weathers) {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${weather.temperature}</td>
        <td>${weather.humidity}</td>
        <td>${weather.cloud_cover}</td>
        <td>${weather.uv_index}</td>
        <td>${weather.season}</td>
        <td>${weather.location}</td>
        <td>${weather.weather_type}</td>
        `;
        tbody.appendChild(row);
    }
};

function prikaziFiltriranePrognoze(weathers) {
    const tbody = document.querySelector('#weather-table tbody');
    tbody.innerHTML = ''; // ocisti ako postoji
    if (weathers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">Nema prognoze za odabrane filtre.</td></tr>';
    return;
    }
    for (const weather of weathers) {
    const row = document.createElement('tr');
    row.innerHTML =  `
    <td>${weather.temperature}</td>
    <td>${weather.humidity}</td>
    <td>${weather.cloud_cover}</td>
    <td>${weather.uv_index}</td>
    <td>${weather.season}</td>
    <td>${weather.location}</td>
    <td>${weather.weather_type}</td>
    `;
    tbody.appendChild(row);
    }
};

function filtriraj() {
    const weather_type = document.getElementById('filter-weather-type').value.trim().toLowerCase();
    const temperature = parseInt(document.getElementById('filter-temperature').value);
    const season = document.getElementById('filter-season').value.trim().toLowerCase();

    const filteredWeathers = weathers.filter(weather => {
        const weather_typeMatch = !weather_type || weather.weather_type.toLowerCase().includes(weather_type);
        const temperatureMatch = !temperature || weather.temperature >= temperature;
        const seasonMatch = !season || weather.season.some(c => c.toLowerCase().includes(season));

        return weather_typeMatch && temperatureMatch && seasonMatch;
    });
    prikaziFiltriranePrognoze(filteredWeathers);
}
    

let weathers = [];

fetch('weather.csv')
    .then(res => res.text())
    .then(csv => {
        const rezultat = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true
    });
    console.log(rezultat.data);
    const weathers = rezultat.data.map(weather => ({
        temperature: isNaN(Number(weather.Temperature)) ? 0 : Number(weather.Temperature),
        humidity: isNaN(Number(weather.Humidity)) ? 0 : Number(weather.Humidity),
        cloud_cover: weather["Cloud Cover"] ?? "-",
        uv_index: isNaN(Number(weather["UV Index"])) ? 0 : Number(weather["UV Index"]),
        season: weather.Season ?? "-",
        location: weather.Location ?? "-",
        weather_type: weather["Weather Type"] ?? "-"
    }));

    const prvih20 = weathers.slice(0, 50);
    prikaziTablicu(prvih20);
    prikaziFiltriranePrognoze(prvih20);
}).catch(err => {
    console.error('Greska pri dohvacanju CSV-a: ', err);
    });
    

// JS za filtriranje podataka
const tempSlider = document.getElementById('filter-temperature');
const tempValue = document.getElementById('temperature-value');
tempSlider.addEventListener('input', function() {
  tempValue.textContent = tempSlider.value + "°C";
});

document.getElementById('primijeni-filtere').addEventListener('click', filtriraj);