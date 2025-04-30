fetch("/api/weather")
  .then((res) => res.json())
  .then((data) => {
    console.log("氣象資料：", data);
    const WeatherElement =
      data.records.Locations[0].Location[0].WeatherElement[0];
    const Temperature = WeatherElement.Time[0].ElementValue[0].Temperature;
    console.log(Temperature);
    document.getElementById("weather").textContent = Temperature;
  })
  .catch((err) => {
    console.error("發生錯誤：", err);
  });
