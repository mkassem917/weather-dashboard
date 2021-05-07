//Weather API Key
const apiKey = "9f6da660dfa1ca8dcca549b83bfb6636";


$(document).ready(function () {
  $("#search-input").on("click", function (event) {
    let citySearch = $("#search-city").val();
    cityWeather (citySearch);
    console.log(citySearch);

        //Clear search input box
    $("#search-input").val("");

    
  });

function 



});
