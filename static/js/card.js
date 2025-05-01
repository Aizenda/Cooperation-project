const city = localStorage.getItem("city");

// 新北市, 基隆市, 台中市, 台南市, 高雄市, 桃園市, 新竹市, 新竹縣, 苗栗縣, 台中縣, 彰化縣, 南投縣, 雲林縣, 嘉義市, 嘉義縣, 屏東縣, 台東縣, 花蓮縣, 宜蘭縣, 澎湖縣, 金門縣, 連江縣";
const target_element =
  "最高溫度,天氣預報綜合描述,平均相對濕度,最高體感溫度,12小時降雨機率,風向,平均露點溫度,最低體感溫度,平均溫度,最大舒適度指數,最小舒適度指數,風速,紫外線指數,天氣現象,最低溫度";

// "/api/weather/city?city=臺北市&target_element=紫外線指數"
fetch(
  `/api/weather/city?city=${encodeURIComponent(
    city
  )}&target_element=${encodeURIComponent(target_element)}`
)
  .then((res) => res.json())
  .then((data) => {
    console.log("氣象資料：", data);
    // current weather
    // 平均溫度
    const temperature = data.weather[0].elementValue[0].values.Temperature;
    console.log(temperature);
    document.getElementById("temperature").textContent = `${temperature} °C`;
    // 天氣現象
    const weatherSign = data.weather[12].elementValue[0].values.Weather;
    console.log(weatherSign);
    document.getElementById("weatherSign").textContent = weatherSign;
    // 日期時間
    const dateStr = data.weather[0].elementValue[0].date;
    const period = data.weather[0].elementValue[0].period;
    const dateObj = new Date(dateStr);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const weekNames = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    const formatted = `${dateObj.getDate()} ${
      monthNames[dateObj.getMonth()]
    } ${dateObj.getFullYear()} ${weekNames[dateObj.getDay()]} ${period}`;
    document.getElementById("date").textContent = formatted;
    // 地區
    const location = data.city;
    console.log(location);
    document.getElementById("location").textContent = `臺灣 ${location}`;

    // 一週天氣
    // 第一天
    const temperature1 = data.weather[0].elementValue[2].values.Temperature;
    console.log(temperature1);
    document.getElementById("temperature1").textContent = `${temperature1} °C`;

    const dateStr1 = data.weather[0].elementValue[2].date;
    const dateObj1 = new Date(dateStr1);
    const newDate1 = `${dateObj1.getDate()} ${
      monthNames[dateObj1.getMonth()]
    } `;
    document.getElementById("week1").textContent = `${
      weekNames[dateObj1.getDay()]
    }`;
    document.getElementById("date1").textContent = newDate1;
    // 第二天
    // 25 23 23 25 24 25
    const temperature2 = data.weather[0].elementValue[4].values.Temperature;
    console.log(temperature2);
    document.getElementById("temperature2").textContent = `${temperature2} °C`;

    const dateStr2 = data.weather[0].elementValue[4].date;
    const dateObj2 = new Date(dateStr2);
    const newDate2 = `${dateObj2.getDate()} ${
      monthNames[dateObj2.getMonth()]
    } `;
    document.getElementById("week2").textContent = `${
      weekNames[dateObj2.getDay()]
    }`;
    document.getElementById("date2").textContent = newDate2;
    // 第三天
    const temperature3 = data.weather[0].elementValue[6].values.Temperature;
    console.log(temperature3);
    document.getElementById("temperature3").textContent = `${temperature3} °C`;

    const dateStr3 = data.weather[0].elementValue[6].date;
    const dateObj3 = new Date(dateStr3);
    const newDate3 = `${dateObj3.getDate()} ${
      monthNames[dateObj3.getMonth()]
    } `;
    document.getElementById("week3").textContent = `${
      weekNames[dateObj3.getDay()]
    }`;
    document.getElementById("date3").textContent = newDate3;
    // 第四天
    const temperature4 = data.weather[0].elementValue[8].values.Temperature;
    console.log(temperature4);
    document.getElementById("temperature4").textContent = `${temperature4} °C`;

    const dateStr4 = data.weather[0].elementValue[8].date;
    const dateObj4 = new Date(dateStr4);
    const newDate4 = `${dateObj4.getDate()} ${
      monthNames[dateObj4.getMonth()]
    } `;
    document.getElementById("week4").textContent = `${
      weekNames[dateObj4.getDay()]
    }`;
    document.getElementById("date4").textContent = newDate4;
    // 第五天
    const temperature5 = data.weather[0].elementValue[10].values.Temperature;
    console.log(temperature5);
    document.getElementById("temperature5").textContent = `${temperature5} °C`;

    const dateStr5 = data.weather[0].elementValue[10].date;
    const dateObj5 = new Date(dateStr5);
    const newDate5 = `${dateObj5.getDate()} ${
      monthNames[dateObj5.getMonth()]
    } `;
    document.getElementById("week5").textContent = `${
      weekNames[dateObj5.getDay()]
    }`;
    document.getElementById("date5").textContent = newDate5;
    // 第六天
    const temperature6 = data.weather[0].elementValue[12].values.Temperature;
    console.log(temperature6);
    document.getElementById("temperature6").textContent = `${temperature6} °C`;

    const dateStr6 = data.weather[0].elementValue[12].date;
    const dateObj6 = new Date(dateStr6);
    const newDate6 = `${dateObj6.getDate()} ${
      monthNames[dateObj6.getMonth()]
    } `;
    document.getElementById("week6").textContent = `${
      weekNames[dateObj6.getDay()]
    }`;
    document.getElementById("date6").textContent = newDate6;
    // 今日天氣摘要
    const description =
      data.weather[14].elementValue[0].values.WeatherDescription;
    const parts = description
      .split("。")
      .filter((sentence) => sentence.trim() !== "");
    const container = document.getElementById("description");
    container.innerHTML = "";
    parts.forEach((sentence) => {
      const p = document.createElement("p");
      p.textContent = sentence;
      container.appendChild(p);
    });

    // 風速 & 風向
    const windSpeed = data.weather[9].elementValue[0].values.WindSpeed;
    const windDirec = data.weather[10].elementValue[0].values.WindDirection;
    document.getElementById("windSpeed").textContent = `${windSpeed} m/s`;
    document.getElementById("windDirec").textContent = windDirec;

    // 體感溫度
    const maxAppTemp =
      data.weather[5].elementValue[0].values.MaxApparentTemperature;
    const minAppTemp =
      data.weather[6].elementValue[0].values.MinApparentTemperature;
    document.getElementById(
      "feels-like"
    ).textContent = `${minAppTemp} ~ ${maxAppTemp} °C`;

    // 最高 & 最低 溫度
    const maxTemp = data.weather[1].elementValue[0].values.MaxTemperature;
    const minTemp = data.weather[2].elementValue[0].values.MinTemperature;
    console.log(maxTemp);
    console.log(minTemp);
    document.getElementById("maxTemp").textContent = `${maxTemp} °C`;
    document.getElementById("minTemp").textContent = ` ${minTemp} °C`;

    // 相對濕度 & 降雨機率
    const humidity = data.weather[4].elementValue[0].values.RelativeHumidity;
    const probability =
      data.weather[11].elementValue[0].values.ProbabilityOfPrecipitation;
    console.log(humidity);
    console.log(probability);
    document.getElementById("humidity").textContent = `${humidity} %`;
    document.getElementById("probability").textContent = ` ${probability} %`;

    // 舒適度
    const comfort =
      data.weather[7].elementValue[0].values.MaxComfortIndexDescription;
    document.getElementById("comfort").textContent = `${comfort}`;

    // 紫外線等級
    const uv = data.weather[13].elementValue[0].values.UVExposureLevel;
    console.log(uv);
    document.getElementById("uv").textContent = uv;

    // 圖示分類

    function getWeatherIcon(weatherDescription) {
      // 從描述中提取天氣現象（去掉溫度、濕度等其他資訊）
      const weatherIconMap = {
        晴天: "/static/img/天氣對照表/白天/01.svg",

        晴時多雲: "/static/img/天氣對照表/白天/02.svg",

        多雲時晴: "/static/img/天氣對照表/白天/03.svg",

        多雲: "/static/img/天氣對照表/白天/04.svg",

        多雲時陰: "/static/img/天氣對照表/白天/05.svg",

        陰時多雲: "/static/img/天氣對照表/白天/06.svg",

        陰天: "/static/img/天氣對照表/白天/07.svg",

        多雲陣雨: "/static/img/天氣對照表/白天/08.svg",
        多雲短暫雨: "/static/img/天氣對照表/白天/08.svg",
        多雲短暫陣雨: "/static/img/天氣對照表/白天/08.svg",
        午後短暫陣雨: "/static/img/天氣對照表/白天/08.svg",
        短暫陣雨: "/static/img/天氣對照表/白天/08.svg",
        多雲時晴短暫陣雨: "/static/img/天氣對照表/白天/08.svg",
        多雲時陰短暫陣雨: "/static/img/天氣對照表/白天/08.svg",
        陰短暫陣雨: "/static/img/天氣對照表/白天/08.svg",

        多雲時晴短暫雷陣雨: "/static/img/天氣對照表/白天/09.svg",
        多雲短暫雷陣雨: "/static/img/天氣對照表/白天/09.svg",
        陰短暫雷陣雨: "/static/img/天氣對照表/白天/09.svg",
        多雲時陰短暫雷陣雨: "/static/img/天氣對照表/白天/09.svg",
        陰時多雲短暫雷陣雨: "/static/img/天氣對照表/白天/09.svg",

        陰短暫雨: "/static/img/天氣對照表/白天/10.svg",
        陰午後短暫陣雨: "/static/img/天氣對照表/白天/10.svg",
        多雲時陰有雨: "/static/img/天氣對照表/白天/10.svg",

        多雲時陰有雷陣雨: "/static/img/天氣對照表/白天/11.svg",
        陰時多雲有雷陣雨: "/static/img/天氣對照表/白天/11.svg",
        陰有雷陣雨: "/static/img/天氣對照表/白天/11.svg",

        陰時多雲有雨: "/static/img/天氣對照表/白天/12.svg",
        陰有雨: "/static/img/天氣對照表/白天/12.svg",

        多雲時陰短暫雷陣雨: "/static/img/天氣對照表/白天/13.svg",
        陰短暫雷陣雨: "/static/img/天氣對照表/白天/13.svg",

        多雲時陰短暫雨: "/static/img/天氣對照表/白天/14.svg",

        多雲時陰陣雨: "/static/img/天氣對照表/白天/15.svg",
        陰陣雨: "/static/img/天氣對照表/白天/15.svg",

        多雲時陰雷陣雨: "/static/img/天氣對照表/白天/16.svg",
        陰雷陣雨: "/static/img/天氣對照表/白天/16.svg",

        多雲時陰短暫陣雨: "/static/img/天氣對照表/白天/17.svg",

        多雲時陰短暫雷陣雨: "/static/img/天氣對照表/白天/18.svg",

        多雲時陰有霧: "/static/img/天氣對照表/白天/19.svg",
        陰有霧: "/static/img/天氣對照表/白天/19.svg",
      };

      const weatherPart = weatherDescription.split("。")[0];
      return (
        weatherIconMap[weatherPart] || "/static/img/天氣對照表/白天/04.svg"
      );
    }

    // 一週圖示
    const description1 =
      data.weather[14].elementValue[2].values.WeatherDescription;
    const iconSrc1 = getWeatherIcon(description1);
    document.getElementById("weather-icon1").src = iconSrc1;

    const description2 =
      data.weather[14].elementValue[4].values.WeatherDescription;
    const iconSrc2 = getWeatherIcon(description2);
    document.getElementById("weather-icon2").src = iconSrc2;

    const description3 =
      data.weather[14].elementValue[6].values.WeatherDescription;
    const iconSrc3 = getWeatherIcon(description3);
    document.getElementById("weather-icon3").src = iconSrc3;

    const description4 =
      data.weather[14].elementValue[8].values.WeatherDescription;
    const iconSrc4 = getWeatherIcon(description4);
    document.getElementById("weather-icon4").src = iconSrc4;

    const description5 =
      data.weather[14].elementValue[10].values.WeatherDescription;
    const iconSrc5 = getWeatherIcon(description5);
    document.getElementById("weather-icon5").src = iconSrc5;

    const description6 =
      data.weather[14].elementValue[12].values.WeatherDescription;
    const iconSrc6 = getWeatherIcon(description6);
    document.getElementById("weather-icon6").src = iconSrc6;

    // 當前圖示
    const iconSrc = getWeatherIcon(description);
    document.getElementById("weather-icon").src = iconSrc;
  })
  .catch((err) => {
    console.error("發生錯誤：", err);
  });
