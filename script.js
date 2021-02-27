//SEARCH BY USING A CITY NAME WITH THE COUNTRY CODE
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
const apiKey = "43552513a136cfe277918a8793567acf";

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  //check if there's already a city
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      //athens,gr
      if (inputVal.includes(",")) {
        //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //athens
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well`;
      form.reset();
      input.focus();
      return;
    }
  }

  //ajax here
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather, coord, wind, clouds } = data;
      const lat = coord.lat;
      const lon = coord.lon;
      const purl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      fetch(purl)
      .then(response => response.json())
      .then(data2 => {
       const {list} = data2;
       window.pol = list[0]["main"]["aqi"];
       return pol;
      })
      // console.log(pol);
      var aqi;
      switch(pol){
        case 1:
          aqi = "Good";
          break;
        case 2:
           aqi = "Fair";
          break;
        case 3:
          aqi = "Moderate";
          break;
        case 4:
          aqi = "Poor";
          break;
        case 5:
          aqi = "Very Poor";
          break;
      }
      // console.log(aqi);
      const icon = `http://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="row">
        <div class="col-8">
        <span class="city-temp">${Math.round(main.temp)}<sup> &deg;C</sup></span>
        </div>
        <div class="col-4">
          <p class="condition">${weather[0]["description"]}</p>
          <p class="high">${main.temp_max} &deg;C</p>
          <p class="low">${main.temp_min} &deg;C</p>
        </div>
        </div>
        <div class="text-center mx-auto">
            <img class="city-icon" src="${icon}" alt="${
              weather[0]["description"]
            }">
        </div>
        <div class="py-4 row">
          <div class="col text-center">
            <p>${main.feels_like} &deg;C</p>
            <span>Feels Like</span>
          </div>
          <div class="col text-center">
            <p>${main.humidity}%</p>
            <span>Humidity</span>
          </div>
          <div class="col text-center">
            <p>${clouds.all}%</p>
            <span>Clouds</span>            
          </div>
        </div>
        <div class="row">
          <div class="col text-center">
            <p class>${wind.speed} m/s</p>
            <span>Wind Speed</span>
          </div>
          <div class="col text-center">
            <p>${main.pressure} hpa</p>
            <span>Pressure</span>
          </div>
          <div class="col text-center">
            <p>${aqi}</p>
            <span>Air Quality (Pollution)</span>
          </div>
        </div>
      `;
      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = "Please search again for valid city";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});