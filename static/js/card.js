const city = "臺北市";

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

      // 風速 & 風向
      const beaufortScale =
        data.weather[9].elementValue[0].values.BeaufortScale;
      const windSpeed = data.weather[9].elementValue[0].values.WindSpeed;
      const windDirec = data.weather[10].elementValue[0].values.WindDirection;
      document.getElementById("beaufortScale").textContent = beaufortScale;
      document.getElementById("windSpeed").textContent = windSpeed;
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
      const comfort
      = data.weather[7].elementValue[0].values.MaxComfortIndexDescription
      ;
      document.getElementById("comfort").textContent = `${comfort}`;

      // 指數值範圍（可能為推估）	中文描述
      // < 10	非常寒冷
      // 10 ~ 15	寒冷
      // 16 ~ 20	涼爽
      // 21 ~ 25	舒適
      // 26 ~ 30	微熱
      // 31 ~ 35	炎熱
      // > 35	非常炎熱

      // 風向	 縮寫 方位角（度）
      // 北風	  N	  0° 或 360°
      // 北北東	NNE	22.5°
      // 東北風	NE	45°
      // 東北東	ENE	67.5°
      // 東風	  E	  90°
      // 東南東	ESE	112.5°
      // 東南風	SE	135°
      // 南南東	SSE	157.5°
      // 南風	  S	  180°
      // 南南西	SSW	202.5°
      // 西南風	SW	225°
      // 西南西	WSW	247.5°
      // 西風	  W	  270°
      // 西北西	WNW	292.5°
      // 西北風	NW	315°
      // 北北西	NNW	337.5°
    });
  })
  .catch((err) => {
    console.error("發生錯誤：", err);
  });
