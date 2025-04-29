function prikaziTablicu(weathers) {
    const tbody = document.querySelector('#weather-table tbody')
    ;
    tbody.innerHTML = ``; // ocisti ako postoji
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
    tbody.innerHTML = ``; // ocisti ako postoji
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

        row.addEventListener('click', () => {
            dodajUPlanAktivnosti(weather);
        });

        tbody.appendChild(row);
    }
};

function filtriraj() {
    const weather_type = document.getElementById('filter-weather-type').value.trim().toLowerCase();
    const temperatureMin = parseInt(document.getElementById('filter-temperature-min').value);
    const temperatureMax = parseInt(document.getElementById('filter-temperature-max').value);
    const season = document.getElementById('filter-season').value.trim().toLowerCase();


    const filteredWeathers = weathers.filter(weather => {
        const weather_typeMatch = !weather_type || weather.weather_type.toLowerCase().includes(weather_type);
        const temperatureMatch =
            (isNaN(temperatureMin) || weather.temperature >= temperatureMin) &&
            (isNaN(temperatureMax) || weather.temperature <= temperatureMax);
        const seasonMatch = !season || weather.season.toLowerCase().includes(season);

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

    weathers = rezultat.data.map(weather => ({
        id: weather.ID ?? "-",
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

let aktivnosti = [];

document.addEventListener("DOMContentLoaded", () => {
    const spremljeno = localStorage.getItem("planAktivnosti");
    if (spremljeno) {
        aktivnosti = JSON.parse(spremljeno);
        osvjeziAktivnosti();
    }
});

function dodajUPlanAktivnosti(weather){
    if (!aktivnosti.includes(weather)){
        aktivnosti.push(weather);
        localStorage.setItem("planAktivnosti", JSON.stringify(aktivnosti));
        osvjeziAktivnosti();
    } else {
        alert("Dan je u planu aktivnosti!");
    }
}

function ukloniIzPlanAktivnosti(index){
    aktivnosti.splice(index,1);
    localStorage.setItem("planAktivnosti", JSON.stringify(aktivnosti));
    osvjeziAktivnosti();
}

function osvjeziAktivnosti(){
    const tbody =document.querySelector('#tablica-aktivnosti tbody');
    tbody.innerHTML=``;

    aktivnosti.forEach((weather, index) => {
        const li = document.createElement('li');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${weather.id}</td>
        <td>${weather.temperature}°C</td>
        <td>${weather.location}</td>
        <td>${weather.weather_type}</td>
        `;

        const akcijaTd = document.createElement('td');
        const ukloniBtn = document.createElement('button');
        ukloniBtn.textContent = 'Ukloni';
        ukloniBtn.addEventListener('click', () => ukloniIzPlanAktivnosti(index));
        akcijaTd.appendChild(ukloniBtn);
        row.appendChild(akcijaTd);

        tbody.appendChild(row);
    })
}

// document.getElementById('pregled-plana').addEventListener('click',() =>{
//     if (aktivnosti.length===0){
//         alert("Nema aktivnosti!");
//     } else {
//         osvjeziAktivnosti();
//     }
// });

// JS za modal
const modal = document.getElementById("modal-aktivnosti");
const span = document.querySelector(".zatvori");

document.getElementById("pregled-plana").addEventListener('click', ()=>{
    if (aktivnosti.length===0){
        alert("Nema aktivnosti!");
    } else {
        modal.style.display = "block";
        osvjeziAktivnosti();
    }
});

document.querySelector(".zatvori").addEventListener('click', () => {
    modal.style.display = "none";
    alert(`Uspjesno ste odabrali ${aktivnosti.length} dan/a za aktivnosti!`);
});

window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// JS za filtriranje podataka
const tempSliderMin = document.getElementById('filter-temperature-min');
const tempValueMin = document.getElementById('temperature-value-min');
tempSliderMin.addEventListener('input', function() {
    tempValueMin.textContent = tempSliderMin.value + "°C";
});

const tempSliderMax = document.getElementById('filter-temperature-max');
const tempValueMax = document.getElementById('temperature-value-max');
tempSliderMax.addEventListener('input', function() {
    tempValueMax.textContent = tempSliderMax.value + "°C";
});

document.getElementById('primijeni-filtere').addEventListener('click', filtriraj);