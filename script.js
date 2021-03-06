$(document).ready(function () {

//Weather API Key
const apiKey = "9f6da660dfa1ca8dcca549b83bfb6636";


  $("#search-input").on("click", function (event) {
    let citySearch = $("#search-city").val();

    console.log(citySearch);

    cityWeather(citySearch);

    //Clear search input box
    $("#search-city").val("");
  });

  $(".history").on("click", "li", function () {
    cityWeather($(this).text());
  });

  function newRow(text) {
    var li = $("<li>")
      .addClass("list-group-item list-group-item-action")
      .text(text);
    $(".history").append(li);
  }

  function cityWeather(citySearch) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/weather?q=" + citySearch +
        "&appid=9f6da660dfa1ca8dcca549b83bfb6636&units=imperial",
      dataType: "json",
      success: function (data) {
        // create history link for this search
        if (history.indexOf(citySearch) === -1) {
          history.push(citySearch);
          window.localStorage.setItem("history", JSON.stringify(history));

          newRow(citySearch);
        }

        // clear any old content
        $("#today").empty();

        // create html content for current weather
        var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var card = $("<div>").addClass("card");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
        var cardBody = $("<div>").addClass("card-body");
        var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

        // merge and add to page
        title.append(img);
        cardBody.append(title, temp, humid, wind);
        card.append(cardBody);
        $("#today").append(card);

        // call follow-up api endpoints
        getForecast(citySearch);
        getUVIndex(data.coord.lat, data.coord.lon);

      },
    });
  }



  function getForecast(citySearch) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=9f6da660dfa1ca8dcca549b83bfb6636&units=imperial",
      dataType: "json",
      success: function (data) {

        // overwrite any existing content with title and empty row
        $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

        // loop over all forecasts (by 3-hour increments)
        for (var i = 0; i < data.list.length; i++) {

          // only look at forecasts around 3:00pm
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {

            // create html elements for a bootstrap card
            var col = $("<div>").addClass("col-md-2");
            var card = $("<div>").addClass("card bg-primary text-black");
            var body = $("<div>").addClass("card-body p-2");
            var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
            var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
            var p1 = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp_max + " °F");
            var p2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");

            // append together on page
            col.append(card.append(body.append(title, img, p1, p2)));
            $("#forecast .row").append(col);
          }
        }
      }
    });
  }

  function getUVIndex(lat, lon) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/uvi?appid=9f6da660dfa1ca8dcca549b83bfb6636&lat=" + lat + "&lon=" + lon,
      dataType: "json",
      success: function (data) {
        var uv = $("<p>").text("UV Index: ");
        var btn = $("<span>").addClass("btn btn-sm").text(data.value);

        // change color depending on uv value
        if (data.value < 3) {
          btn.addClass("btn-success");
        } else if (data.value < 7) {
          btn.addClass("btn-warning");
        } else {
          btn.addClass("btn-danger");
        }

        $("#today .card-body").append(uv.append(btn));
      }
    });
  }

  // get current history, if any
  var history = JSON.parse(window.localStorage.getItem("history")) || [];

  if (history.length > 0) {
    cityWeather(history[history.length - 1]);
  }

  for (var i = 0; i < history.length; i++) {
    newRow(history[i]);
  }

});