class CardModel {
  async GetData(city = "臺北市") {
    try {
      const response = await fetch(`api/weather/city?city=${city}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  }
}

class CardView {
  element = {
    // 當前天氣元素
    currentPeriod: document.getElementById("current-period"),
    currentTemp: document.getElementById("current-temp"),
    currentDescription: document.getElementById("current-description"),
    currentWeatherIcon: document.getElementById("current-weather-icon"),
    currentDate: document.getElementById("current-date"),
    currentLocation: document.getElementById("current-location"),

    // 卡片容器
    cards: document.querySelectorAll(".card"),

    // SVG 地圖元素
    paths: document.querySelectorAll("svg path"),

    // 預報元素 - 使用陣列來存儲五天預報的元素
    forecastDays: Array.from({ length: 5 }, (_, i) => ({
      container: document.getElementById(`forecast-day-${i}`),
      icon: document.getElementById(`forecast-icon-${i}`),
      temp: document.getElementById(`forecast-temp-${i}`),
      date: document.getElementById(`forecast-date-${i}`),
      weekday: document.getElementById(`forecast-weekday-${i}`),
    })),
  };

  // 動畫中標誌
  isAnimating = false;

  init(onHoverCallback) {
    // 創建城市高亮效果元素
    this.createCityHighlight();

    this.element.paths.forEach((path) => {
      path.addEventListener("mouseenter", (e) => {
        const titleTag = path.querySelector("title");
        if (titleTag && !this.isAnimating) {
          const city = titleTag.textContent.trim();

          // 移除所有path的active類
          this.element.paths.forEach((p) => p.classList.remove("active"));

          // 添加當前path的active類
          path.classList.add("active");

          // 顯示城市高亮效果
          this.showCityHighlight(e.clientX, e.clientY);

          onHoverCallback(city);
        }
      });

      path.addEventListener("click", () => {
        const titleTag = path.querySelector("title");
        if (titleTag && !this.isAnimating) {
          const city = titleTag.textContent.trim();
          localStorage.setItem("city", city);
          window.location.href = "/weater";
        }
      });
    });

    // 為預報項添加懸停效果
    this.element.forecastDays.forEach((day) => {
      if (day.container) {
        day.container.classList.add("forecast-item");
      }
    });
  }

  // 創建城市高亮效果
  createCityHighlight() {
    this.cityHighlight = document.createElement("div");
    this.cityHighlight.className = "city-highlight";
    this.cityHighlight.style.width = "100px";
    this.cityHighlight.style.height = "100px";
    document.body.appendChild(this.cityHighlight);
  }

  // 顯示城市高亮效果
  showCityHighlight(x, y) {
    this.cityHighlight.style.left = x + "px";
    this.cityHighlight.style.top = y + "px";
    this.cityHighlight.classList.add("active");

    setTimeout(() => {
      this.cityHighlight.classList.remove("active");
    }, 1000);
  }

  weatherIconMap = {
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

  // 添加加載指示器
  addLoadingIndicator() {
    // 為卡片添加加載指示器
    this.element.cards.forEach((card) => {
      if (!card.querySelector(".loading-indicator")) {
        const loader = document.createElement("div");
        loader.className = "loading-indicator";
        card.appendChild(loader);
      }
    });
  }

  // 動畫淡出
  startUpdateAnimation() {
    return new Promise((resolve) => {
      this.isAnimating = true;

      // 添加更新狀態類
      this.element.cards.forEach((card) => {
        card.classList.add("updating");
        card.classList.remove("updated");
      });

      // 為預報項添加更新狀態類
      this.element.forecastDays.forEach((day) => {
        if (day.container) {
          day.container.classList.add("updating");
          day.container.classList.remove("updated");
        }
      });

      // 等待淡出完成
      setTimeout(() => {
        resolve();
      }, 400);
    });
  }

  // 動畫淡入
  endUpdateAnimation() {
    return new Promise((resolve) => {
      // 添加更新完成類
      this.element.cards.forEach((card) => {
        card.classList.remove("updating");
        card.classList.add("updated");
      });

      // 為預報項添加更新完成類
      this.element.forecastDays.forEach((day) => {
        if (day.container) {
          day.container.classList.remove("updating");
          day.container.classList.add("updated");
        }
      });

      // 添加數據更新閃光效果
      const dataElements = [
        this.element.currentTemp,
        this.element.currentDescription,
        ...this.element.forecastDays.map((day) => day.temp),
      ].filter((el) => el);

      dataElements.forEach((el) => {
        el.classList.add("data-update");
        el.classList.add("animate");

        setTimeout(() => {
          el.classList.remove("animate");
        }, 1000);
      });

      // 等待淡入完成
      setTimeout(() => {
        this.isAnimating = false;
        resolve();
      }, 500);
    });
  }

  async render(data) {
    // 添加加載指示器
    this.addLoadingIndicator();

    // 先執行淡出動畫
    await this.startUpdateAnimation();

    // 獲取所有天氣資料
    const allData = data.weather[0].elementValue;

    // 渲染當前天氣 - 使用第二筆資料作為當前天氣
    const current = allData[2]; // 從第二筆資料開始

    if (current) {
      this.element.currentPeriod.textContent = current.period || "Now";

      // 提取溫度範圍
      const temperatureRange = this.extractTemperature(
        current.values.WeatherDescription
      );
      this.element.currentTemp.innerHTML = temperatureRange;

      // 提取天氣描述
      const weatherDesc = current.values.WeatherDescription.split("。")[0];
      this.element.currentDescription.textContent = weatherDesc;

      // 設置天氣圖標
      this.element.currentWeatherIcon.src = this.getWeatherIcon(
        current.values.WeatherDescription
      );

      // 格式化和設置日期
      this.element.currentDate.textContent = this.formatDate(current.date);

      // 設置位置
      this.element.currentLocation.textContent = `台灣 ${data.city || ""}`;
    }

    // 選擇偶數索引的資料（從第二筆開始）進行渲染
    const forecastData = [];
    for (let i = 1; i < allData.length; i += 2) {
      forecastData.push(allData[i]);
      if (forecastData.length >= 5) break; // 最多顯示5天
    }

    // 渲染五天預報
    for (let i = 0; i < forecastData.length; i++) {
      const forecast = forecastData[i];
      const forecastElements = this.element.forecastDays[i];

      if (forecast && forecastElements) {
        // 設置圖標
        if (forecastElements.icon) {
          forecastElements.icon.src = this.getWeatherIcon(
            forecast.values.WeatherDescription
          );
        }

        // 設置溫度
        if (forecastElements.temp) {
          forecastElements.temp.innerHTML = this.extractTemperature(
            forecast.values.WeatherDescription
          );
        }

        // 格式化並設置日期
        if (forecastElements.date) {
          const date = new Date(forecast.date);
          forecastElements.date.textContent = `${date.getDate()} ${date.toLocaleString(
            "en-US",
            { month: "short" }
          )}`;
        }

        // 設置星期幾
        if (forecastElements.weekday) {
          const date = new Date(forecast.date);
          forecastElements.weekday.textContent = date.toLocaleString("zh-TW", {
            weekday: "long",
          });
        }
      }
    }

    // 執行淡入動畫
    await this.endUpdateAnimation();
  }

  // 根據天氣描述選擇合適的圖標
  getWeatherIcon(weatherDescription) {
    // 從描述中提取天氣現象（去掉溫度、濕度等其他資訊）
    const weatherPart = weatherDescription.split("。")[0];

    // 檢查是否在映射表中有完全匹配
    for (const [key, value] of Object.entries(this.weatherIconMap)) {
      if (weatherPart === key) {
        return value;
      }
    }

    // 如果沒有完全匹配，嘗試部分匹配
    for (const [key, value] of Object.entries(this.weatherIconMap)) {
      if (weatherPart.includes(key)) {
        return value;
      }
    }

    // 進一步解析天氣現象的詞組來找到最佳匹配
    let foundDescription = "";
    let foundIcon = "";

    // 尋找最長匹配的天氣描述
    for (const [desc, icon] of Object.entries(this.weatherIconMap)) {
      // 尋找天氣描述是否包含在文本中
      if (weatherPart.includes(desc) && desc.length > foundDescription.length) {
        foundDescription = desc;
        foundIcon = icon;
      }
    }

    if (foundIcon) {
      return foundIcon;
    }

    // 如果還是沒找到，返回默認圖標
    return "/static/img/天氣對照表/白天/04.svg"; // 使用多雲作為默認
  }

  // 提取溫度範圍
  extractTemperature(description) {
    const tempRange = description.match(
      /溫度攝氏(\d+)[\u4e00-\u9fa5]*?(\d+)度/
    );
    if (tempRange) {
      return `${tempRange[1]} &deg;C ~ ${tempRange[2]} &deg;C`;
    }
    return "未知溫度";
  }

  // 格式化日期
  formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const weekday = date.toLocaleString("zh-TW", { weekday: "long" });
    return `${weekday} ${day} ${month} ${date.getFullYear()}`;
  }
}

class CardControl {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.lastCity = null; // 追蹤上一次顯示的城市
  }

  async init() {
    // 初始化時先載入默認城市（臺北市）的數據
    try {
      const defaultData = await this.model.GetData();
      this.lastCity = "臺北市";
      this.view.render(defaultData);
    } catch (error) {
      console.error("Error loading default city data:", error);
    }

    // 設置鼠標懸停事件
    this.view.init(async (city) => {
      // 如果城市相同，不重複加載
      if (city === this.lastCity || this.view.isAnimating) return;

      try {
        this.lastCity = city;
        const data = await this.model.GetData(city);
        this.view.render(data);
      } catch (error) {
        console.error(`Error loading data for ${city}:`, error);
      }
    });
  }
}

// 初始化應用
const initWeatherApp = () => {
  // 創建應用實例
  const cardModel = new CardModel();
  const cardView = new CardView();
  const cardControl = new CardControl(cardModel, cardView);

  // 初始化控制器
  cardControl.init();
};

// 當文檔已經加載完成時初始化應用
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWeatherApp);
} else {
  initWeatherApp();
}
