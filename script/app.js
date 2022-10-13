// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
let updateSun = (percentage) => {
	const sun = document.querySelector('.js-sun');

	sun.style.left = `calc(${percentage}%)`;
	const bottomPercent =
		percentage < 50 ? percentage * 2 : (100 - percentage) * 2;
	sun.style.bottom = `calc(${bottomPercent}% )`;
};

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	// Bepaal het aantal minuten dat de zon al op is.
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	// Vergeet niet om het resterende aantal minuten in te vullen.
	// Nu maken we een functie die de zon elke minuut zal updaten
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.

	const sun = document.querySelector('.js-sun');
	const minutesSunUp = Date.now() - sunrise * 1000;
	console.log(totalMinutes);
	const suntimePast = minutesSunUp / 60 / totalMinutes;
	console.log(suntimePast);
	updateSun((suntimePast / totalMinutes) * 100);

	document.querySelector('body').classList.add('is-loaded');

	//updatesun every minute
	setInterval(() => {
		const minutesSunUp = Date.now() - sunrise * 1000;

		const suntimePast = minutesSunUp / 60 / totalMinutes;
		updateSun((suntimePast / totalMinutes) * 100);
		document.querySelector('.js-sun').dataset.time =
			_parseMillisecondsIntoReadableTime(Date.now() / 1000);
	}, 6000);
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = (queryResponse) => {
	console.log(queryResponse);
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.

	document.querySelector('.js-location').innerHTML =
		queryResponse.city.name + ', ' + queryResponse.city.country;

	document.querySelector('.js-sunrise').innerHTML =
		_parseMillisecondsIntoReadableTime(queryResponse.city.sunrise);
	document.querySelector('.js-sunset').innerHTML =
		_parseMillisecondsIntoReadableTime(queryResponse.city.sunset);

	const datumSunRise = new Date(queryResponse.city.sunrise * 1000);
	const datumSunSet = new Date(queryResponse.city.sunset * 1000);

	const totminutes = datumSunSet - datumSunRise;

	placeSunAndStartMoving(
		Math.floor(totminutes / 60000),
		queryResponse.city.sunrise
	);

	//show remaining time
	const Timeleft = _parseMillisecondsIntoReadableTime(
		queryResponse.city.sunset - Date.now() / 1000
	);

	document.querySelector('.js-time-left').innerHTML = Timeleft + ' hours';
	console.log(_parseMillisecondsIntoReadableTime(Date.now() / 1000));

	//every minute update time left
	setInterval(() => {
		if (
			queryResponse.city.sunset < Date.now() / 1000 ||
			queryResponse.city.sunrise > Date.now() / 1000
		) {
			document.querySelector('html').classList.add('is-night');
			document.querySelector('html').classList.remove('is-day');
		} else {
			document.querySelector('html').classList.add('is-day');
			document.querySelector('html').classList.remove('is-night');
		}
	}, 6000);
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
	// Eerst bouwen we onze url op

	const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=b6671f84efe078115951eda3dc2f4b7a`;
	// Met de fetch API proberen we de data op te halen.
	// Als dat gelukt is, gaan we naar onze showResult functie.

	fetch(url)
		.then((response) => response.json())
		.then(showResult);
};

document.addEventListener('DOMContentLoaded', function () {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});
