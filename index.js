
const searchButton = document.querySelector("#searchButton");
const searchLocationValue = document.querySelector("#searchLocation");
const locationName = document.querySelector("#locationName");
const temperature = document.querySelector("#temperature");
const information = document.querySelector("#information");
const infoIcon = document.querySelector("#infoIcon");
const celsius = document.querySelector("#celsius");
const farenheit = document.querySelector("#farenheit");
const localDateTime = document.querySelector("#localDateTime");

const feelsLike = document.querySelector("#feelsLike");
const humidity = document.querySelector("#humidity");
const precip = document.querySelector("#precip");
const windSpeed = document.querySelector("#windSpeed")
const mainCard = document.querySelector(".mainCard");
const spanErrorMessage = document.querySelector("#errorMsg");



let temperatureUnit = "c";
let searchLocation = "Mumbai";
document.body.style.zoom="110%"

farenheit.addEventListener("click", () => {
    farenheit.checked = true;
    temperatureUnit = "f";
    
    farenheitHtmlCode = "&#8457;"
    setTemperatureUnit(farenheitHtmlCode);
    getWeather();
});


celsius.addEventListener("click", () => {
    celsius.checked = true;
    temperatureUnit = "c";
    
    celsiusHtmlCode = "&#8451;"
    setTemperatureUnit(celsiusHtmlCode);
    getWeather();
});


function setTemperatureUnit(htmlCode){
    const htmlCodeElements = document.querySelectorAll(".htmlCode");
    htmlCodeElements.forEach(htmlCodeValue =>{
        console.log(htmlCodeValue);
        htmlCodeValue.remove();
    });
    const temperatureValue = document.querySelectorAll(".temperatureValue");
    temperatureValue.forEach(temperature=>{
        temperature.insertAdjacentHTML('afterend',`<span class="htmlCode">${htmlCode}</span>`);
    })
}


function setWeeklyForecast(weatherData){
    const forecastCardContainer = document.querySelector(".forcastCardContainer");

    while(forecastCardContainer.firstChild){
        forecastCardContainer.removeChild(forecastCardContainer.firstChild);
    }

    let i = 0;
    weatherData.forecast.forecastday.forEach((dayData)=>{
        console.log(dayData)
        const date = new Date(dayData.date);
        console.log(i++);
        const formatter = new Intl.DateTimeFormat(['ban', 'id'], { day: '2-digit', month: '2-digit' });
        const formattedDate = formatter.format(date);

        const avgTemp = dayData.day[`avgtemp_${temperatureUnit}`];
        const tempText = dayData.day.condition.text;
        
        
        const cardDiv = document.createElement("div");
        const spanDate = document.createElement("span");
        const spanAvgTemp = document.createElement("span");
        const spanTempUnit = document.createElement("span");
        spanAvgTemp.classList.add("temperatureValue");

        const spanTempText = document.createElement("span");
        spanDate.innerText = formattedDate;

        let htmlCode = temperatureUnit == "c"? "&#8451;" : "&#8457;" ;
        spanTempUnit.innerHTML = `<span class="htmlCode">${htmlCode}</span>`;
        spanAvgTemp.innerText = avgTemp+ " ";
        
        const tempDiv = document.createElement("div");
        tempDiv.classList.add("WeeklyForecastCardTempDiv");
        tempDiv.appendChild(spanAvgTemp);
        tempDiv.appendChild(spanTempUnit);
        
        spanTempText.innerText = tempText;        
        
        cardDiv.classList.add("forecastCard");
        
        
        cardDiv.appendChild(spanDate);
        // cardDiv.appendChild(spanAvgTemp);

        // cardDiv.appendChild(spanTempUnit)

        cardDiv.appendChild(tempDiv);
        cardDiv.appendChild(spanTempText);

        forecastCardContainer.appendChild(cardDiv);


    });
}


async function getWeather() {
    
    try{
        spanErrorMessage.innerText = "Searching......";
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=9433edf92616421e8a945329241503&q=${searchLocation}&days=7`);
        const weatherData = await response.json();
   
        spanErrorMessage.innerText = "";
    // console.log(weatherData.current.condition.text);
    console.log(weatherData);
    locationName.innerText = `${weatherData.location.name} , ${weatherData.location.country}`;
    temperature.innerText = celsius.checked == true
        ? weatherData.current.temp_c
        : weatherData.current.temp_f;

    const unitsFont = document.querySelectorAll(".unitsfont");
    unitsFont.forEach(element =>{
        // console.log(htmlCodeValue);
        element.remove();
    });


    setWeeklyForecast(weatherData);
    information.innerText = weatherData.current.condition.text;
    localDateTime.innerText = new Date(weatherData.location.localtime.toString());
    // localDateTime.innerText = new Date(weatherData.location.localtime.toString()).toLocaleString('en-US', { timeZoneName: 'short' });?

    feelsLike.innerText = weatherData.current[`feelslike_${temperatureUnit}`]+ " ";
    humidity.innerText = weatherData.current.humidity + " ";
    humidity.insertAdjacentHTML('afterend' , '<span class="unitsfont">%</span>');
    precip.innerText = weatherData.current.precip_in;
    windSpeed.innerText = weatherData.current.wind_kph+ " ";
    windSpeed.insertAdjacentHTML('afterend' , '<span class="unitsfont">km/h</span>');

    
    // setBackgroundImage(weatherData.current.condition.code);
    mainCard.style.border = "1px solid grey";

    }catch(err){
        
        spanErrorMessage.innerText = "Location Not Found. Please enter a city name";
    }
    
}

function setBackgroundImage(code){
    console.log(`Code : ${code}`);
    if(code<=1030){
        document.body.style.backgroundImage = "url(mist2.avif)";
        mainCard.style.color = "white";
        mainCard.style.opacity = 0.8;
    }
}


searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    searchLocation = searchLocationValue.value != "" ? searchLocationValue.value : "Mumbai";
    spanErrorMessage.innerText = "Fetching Weather Data....."
    getWeather();

});


getWeather();
setTemperatureUnit("&#8451;");
