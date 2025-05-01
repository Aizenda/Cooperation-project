// 在 static/js/radar.js 中添加以下代碼

document.addEventListener('DOMContentLoaded', function() {
  // 獲取雷達圖元素
  const radarImg = document.querySelector('.radar__img');
  
  // 儲存雷達圖 URL 列表
  let radarUrls = [];
  // 儲存完整的雷達圖 URL 列表（用於時段篩選）
  let allRadarUrls = [];
  
  // 預加載的圖像緩存
  const preloadedImages = {};
  
  // 當前雷達圖索引
  let currentIndex = 0;
  
  // 輪播間隔 (毫秒) - 默認值
  let carouselInterval = 1000; // 每秒切換一次
  
  // 輪播計時器
  let carouselTimer = null;
  
  // 速度選項（毫秒）
  const speedOptions = {
    '0.25x 極慢': 4000,
    '0.5x 慢速': 2000,
    '1x 正常': 1000,
    '2x 快速': 500,
    '4x 極快': 250
  };
  
  // 時段選項（小時）
  const timeRangeOptions = {
    '全部': 48,
    '最近6小時': 6,
    '最近12小時': 12,
    '最近24小時': 24,
    '最近48小時': 48
  };
  
  // 創建雷達圖容器和右側選單
  function createRadarInterface() {
    // 創建主佈局容器
    const mainContainer = document.createElement('div');
    mainContainer.className = 'radar-interface-container';
    
    // 創建左側內容區域
    const contentArea = document.createElement('div');
    contentArea.className = 'radar-content-area';
    
    // 創建雷達圖容器
    const radarContainer = document.createElement('div');
    radarContainer.className = 'radar-container';
    
    // 創建標題
    const radarTitle = document.createElement('div');
    radarTitle.className = 'radar-title';
    radarTitle.textContent = '中央氣象署雷達回波圖';
    
    // 創建時間顯示
    const radarTime = document.createElement('div');
    radarTime.className = 'radar-time';
    radarTime.id = 'radar-time';
    
    // 創建加載提示
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = '正在載入雷達圖數據...';
    loadingIndicator.id = 'loading-indicator';
    
    // 創建幀數顯示
    const frameInfo = document.createElement('div');
    frameInfo.className = 'frame-info';
    frameInfo.id = 'frame-info';
    frameInfo.textContent = `圖片 1/${radarUrls.length || 0}`;
    
    // 添加到雷達圖容器
    radarContainer.appendChild(radarTitle);
    radarContainer.appendChild(radarTime);
    radarContainer.appendChild(loadingIndicator);
    
    // 包裹雷達圖
    const mainElement = document.querySelector('main');
    const radarImgWrapper = document.createElement('div');
    radarImgWrapper.className = 'radar-img-wrapper';
    radarImgWrapper.appendChild(radarImg);
    radarContainer.appendChild(radarImgWrapper);
    radarContainer.appendChild(frameInfo);
    
    // 添加進度條容器
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    // 添加進度條
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.id = 'progress-bar';
    progressContainer.appendChild(progressBar);
    
    // 添加進度條到容器
    radarContainer.appendChild(progressContainer);
    
    // 添加控制按鈕區域
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'radar-controls';
    
    // 播放/暫停按鈕
    const playPauseBtn = document.createElement('button');
    playPauseBtn.textContent = '暫停';
    playPauseBtn.id = 'play-pause-btn';
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // 前一張按鈕
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '上一張';
    prevBtn.addEventListener('click', showPrevImage);
    
    // 下一張按鈕
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '下一張';
    nextBtn.addEventListener('click', showNextImage);
    
    // 添加按鈕到控制區域
    controlsContainer.appendChild(prevBtn);
    controlsContainer.appendChild(playPauseBtn);
    controlsContainer.appendChild(nextBtn);
    
    // 添加控制區域到容器
    radarContainer.appendChild(controlsContainer);
    
    // 添加雷達圖容器到左側內容區域
    contentArea.appendChild(radarContainer);
    
    // 創建右側選單
    const sidebarContainer = document.createElement('div');
    sidebarContainer.className = 'radar-sidebar';
    
    // 創建右側選單標題
    const sidebarTitle = document.createElement('div');
    sidebarTitle.className = 'sidebar-title';
    sidebarTitle.textContent = '控制選項';
    sidebarContainer.appendChild(sidebarTitle);
    
    // 添加時段選擇區塊
    const timeRangeBlock = document.createElement('div');
    timeRangeBlock.className = 'sidebar-block';
    
    // 添加時段標籤
    const timeRangeLabel = document.createElement('div');
    timeRangeLabel.className = 'sidebar-label';
    timeRangeLabel.textContent = '時段選擇:';
    timeRangeBlock.appendChild(timeRangeLabel);
    
    // 添加時段選擇器
    const timeRangeSelector = document.createElement('select');
    timeRangeSelector.id = 'time-range-selector';
    timeRangeSelector.className = 'sidebar-selector';
    
    // 添加時段選項
    for (const [label, hours] of Object.entries(timeRangeOptions)) {
      const option = document.createElement('option');
      option.value = hours;
      option.textContent = label;
      timeRangeSelector.appendChild(option);
    }
    

    // 時段選擇器變更事件 - 修改為直接使用後端 API
		timeRangeSelector.addEventListener('change', function() {
			const selectedHours = parseInt(this.value);
			
			// 暫停輪播
			if (carouselTimer) {
				clearInterval(carouselTimer);
				carouselTimer = null;
				const playPauseBtn = document.getElementById('play-pause-btn');
				if (playPauseBtn) {
					playPauseBtn.textContent = '播放';
				}
			}
  
			// 直接從後端獲取指定時間範圍的數據
			fetchRadarData(selectedHours);
		});
    
    timeRangeBlock.appendChild(timeRangeSelector);
    sidebarContainer.appendChild(timeRangeBlock);
    
    // 添加速度控制區塊
    const speedControlBlock = document.createElement('div');
    speedControlBlock.className = 'sidebar-block';
    
    // 添加速度標籤
    const speedLabel = document.createElement('div');
    speedLabel.className = 'sidebar-label';
    speedLabel.textContent = '輪播速度:';
    speedControlBlock.appendChild(speedLabel);
    
    // 添加速度選擇器
    const speedSelector = document.createElement('select');
    speedSelector.id = 'speed-selector';
    speedSelector.className = 'sidebar-selector';
    
    // 添加速度選項
    for (const [label, value] of Object.entries(speedOptions)) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      
      // 設置默認選項
      if (value === carouselInterval) {
        option.selected = true;
      }
      
      speedSelector.appendChild(option);
    }
    
    // 添加速度選擇器變更事件
    speedSelector.addEventListener('change', function() {
      carouselInterval = parseInt(this.value);
      
      // 如果正在播放，重啟輪播以應用新速度
      if (carouselTimer) {
        startCarousel();
      }
    });
    
    speedControlBlock.appendChild(speedSelector);
    sidebarContainer.appendChild(speedControlBlock);
    
    // 添加其他控制選項區塊（可擴充）
    
    // 將左側內容和右側選單添加到主容器
    mainContainer.appendChild(contentArea);
    mainContainer.appendChild(sidebarContainer);
    
    // 將主容器添加到頁面
    mainElement.appendChild(mainContainer);
  }
  
  // 根據時段篩選雷達圖
  function filterRadarsByTimeRange(hours) {
    if (!allRadarUrls || allRadarUrls.length === 0) {
      console.error('沒有可用的雷達圖數據');
      return;
    }
    
    // 獲取當前時間
    const now = new Date();
    // 計算時間範圍的起始時間
    const startTime = new Date(now.getTime() - hours * 60 * 60 * 1000);
    
    // 暫停輪播
    if (carouselTimer) {
      clearInterval(carouselTimer);
      carouselTimer = null;
      const playPauseBtn = document.getElementById('play-pause-btn');
      if (playPauseBtn) {
        playPauseBtn.textContent = '播放';
      }
    }
    
    // 篩選時間範圍內的雷達圖
    radarUrls = allRadarUrls.filter(radar => radar.time >= startTime);
    
    console.log(`已篩選最近 ${hours} 小時的雷達圖，共 ${radarUrls.length} 張`);
    
    // 重置當前索引
    currentIndex = 0;
    
    // 更新顯示
    if (radarUrls.length > 0) {
      updateRadarDisplay();
      updateProgressAndFrame();
    } else {
      console.error(`沒有找到最近 ${hours} 小時的雷達圖`);
      const loadingIndicator = document.getElementById('loading-indicator');
      if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
        loadingIndicator.textContent = `沒有找到最近 ${hours} 小時的雷達圖`;
      }
    }
  }
  
  // 更新進度條和幀數顯示
  function updateProgressAndFrame() {
    // 更新幀數顯示
    const frameInfo = document.getElementById('frame-info');
    if (frameInfo && radarUrls.length > 0) {
      frameInfo.textContent = `圖片 ${currentIndex + 1}/${radarUrls.length}`;
    }
    
    // 更新進度條
    const progressBar = document.getElementById('progress-bar');
    if (progressBar && radarUrls.length > 0) {
      const progressPercent = ((currentIndex + 1) / radarUrls.length) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }
  }
  
  // 切換播放/暫停
  function togglePlayPause() {
    const playPauseBtn = document.getElementById('play-pause-btn');
    
    if (carouselTimer) {
      // 暫停
      clearInterval(carouselTimer);
      carouselTimer = null;
      playPauseBtn.textContent = '播放';
    } else {
      // 播放
      startCarousel();
      playPauseBtn.textContent = '暫停';
    }
  }
  
  // 顯示上一張圖片
  function showPrevImage() {
    currentIndex = (currentIndex - 1 + radarUrls.length) % radarUrls.length;
    updateRadarDisplay();
    updateProgressAndFrame();
  }
  
  // 顯示下一張圖片
  function showNextImage() {
    currentIndex = (currentIndex + 1) % radarUrls.length;
    updateRadarDisplay();
    updateProgressAndFrame();
  }
  
  // 預加載圖像
  function preloadImage(url) {
    return new Promise((resolve, reject) => {
      // 如果已經預加載過，直接返回
      if (preloadedImages[url]) {
        resolve(preloadedImages[url]);
        return;
      }
      
      // 創建新的圖像元素進行預加載
      const img = new Image();
      
      // 設置 3 秒超時
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout loading image: ${url}`));
      }, 3000);
      
      // 清除超時
      img.onload = function() {
        clearTimeout(timeout);
        preloadedImages[url] = img;
        resolve(img);
      };
      
      img.onerror = function() {
        clearTimeout(timeout);
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      // 開始加載圖像
      img.src = url;
    });
  }
  
  // 預加載多張圖像
  async function preloadImages(urlObjects) {
    // 先預加載前幾張
    const firstBatch = urlObjects.slice(0, 3);
    const promises = firstBatch.map(obj => preloadImage(obj.url));
    
    try {
      await Promise.all(promises);
      
      // 在背景繼續預加載其餘圖像
      setTimeout(() => {
        const remainingBatch = urlObjects.slice(3);
        remainingBatch.forEach(obj => {
          preloadImage(obj.url).catch(() => {
            // 忽略後續加載錯誤
          });
        });
      }, 500);
    } catch (error) {
      console.error('Error preloading images:', error);
    }
  }
  
// 從後端 API 獲取雷達圖數據，加入時間參數
async function fetchRadarData(hoursRange = 6) {
  // 重試設定
  const maxRetries = 3;
  let retryCount = 0;
  let retryDelay = 1000; // 初始延遲 1 秒
  
  async function tryFetchData() {
    try {
      // 顯示加載指示器
      const loadingIndicator = document.getElementById('loading-indicator');
      if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
        loadingIndicator.textContent = retryCount > 0 
          ? `正在載入最近 ${hoursRange} 小時的雷達圖數據... (重試第 ${retryCount} 次)` 
          : `正在載入最近 ${hoursRange} 小時的雷達圖數據...`;
      }
      
      // 從你的 API 端點獲取雷達圖數據，添加時間範圍參數
      const response = await fetch(`/api/radar?hours=${hoursRange}`);
      
      if (!response.ok) {
        // 檢查是否為 503 錯誤 (服務暫時不可用)
        if (response.status === 503 && retryCount < maxRetries) {
          retryCount++;
          console.log(`伺服器忙碌中，${retryDelay/1000}秒後進行第 ${retryCount} 次重試...`);
          
          if (loadingIndicator) {
            loadingIndicator.textContent = `伺服器忙碌中，即將重試 (${retryCount}/${maxRetries})...`;
          }
          
          // 指數退避策略
          return new Promise(resolve => {
            setTimeout(() => {
              // 下次重試的延遲時間加倍
              retryDelay *= 2;
              resolve(tryFetchData());
            }, retryDelay);
          });
        }
        
        // 其他 HTTP 錯誤
        throw new Error(`API 請求失敗: ${response.status} - ${await response.text()}`);
      }
      
      const data = await response.json();
      
      if (data.ok && Array.isArray(data.radars) && data.radars.length > 0) {
        // 清空當前雷達圖列表
        allRadarUrls = [];
        
        // 處理 API 返回的數據
        // 注意：API 已經按照時間從小到大排序了數據
        for (const radar of data.radars) {
          allRadarUrls.push({
            url: radar.radar_img_url,
            time: new Date(radar.radar_time)
          });
        }
        
        // 保存完整的雷達圖列表，不再需要前端篩選
        radarUrls = [...allRadarUrls];
        
        // 預加載所有雷達圖
        await preloadImages(radarUrls);
        
        if (radarUrls.length > 0) {
          // 從第一張開始
          currentIndex = 0;
          updateRadarDisplay();
          updateProgressAndFrame();
          startCarousel();
          
          // 顯示找到的雷達圖數量
          console.log(`從 API 獲取到 ${radarUrls.length} 張雷達圖，時間範圍: ${hoursRange} 小時`);
          
          // 隱藏加載指示器
          if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
          }
          
          return true;
        } else {
          throw new Error('API 返回的雷達圖數據為空');
        }
      } else {
        throw new Error('API 返回的數據格式不正確或為空');
      }
    } catch (error) {
      // 檢查是否還有重試機會
      if (retryCount < maxRetries && error.message.includes('API 請求失敗')) {
        retryCount++;
        console.log(`發生錯誤，${retryDelay/1000}秒後進行第 ${retryCount} 次重試...`);
        console.error('錯誤詳情:', error);
        
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
          loadingIndicator.textContent = `載入失敗，即將重試 (${retryCount}/${maxRetries})...`;
        }
        
        // 指數退避策略
        return new Promise(resolve => {
          setTimeout(() => {
            // 下次重試的延遲時間加倍
            retryDelay *= 2;
            resolve(tryFetchData());
          }, retryDelay);
        });
      }
      
      // 已無重試機會或非網路錯誤
      console.error('獲取雷達圖數據失敗:', error);
      
      const loadingIndicator = document.getElementById('loading-indicator');
      if (loadingIndicator) {
        loadingIndicator.textContent = `獲取雷達圖數據失敗: ${error.message}`;
      }
      
      return false;
    }
  }
  
  return tryFetchData();
}
  
  // 更新雷達圖顯示 - 無淡入淡出效果，直接更換src
  function updateRadarDisplay() {
    if (radarUrls.length === 0 || currentIndex < 0 || currentIndex >= radarUrls.length) {
      return;
    }
    
    const currentRadar = radarUrls[currentIndex];
    
    // 直接更新圖片URL，不使用淡入淡出效果
    radarImg.src = currentRadar.url;
    
    // 更新時間顯示
    const radarTimeElement = document.getElementById('radar-time');
    if (radarTimeElement) {
      // 格式化時間顯示
      const formattedTime = currentRadar.time.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      radarTimeElement.textContent = formattedTime;
    }
    
    // 提前預加載下一張圖片
    const nextIndex = (currentIndex + 1) % radarUrls.length;
    if (radarUrls[nextIndex]) {
      preloadImage(radarUrls[nextIndex].url).catch(() => {
        // 忽略預加載錯誤
      });
    }
  }
  
  // 開始輪播
  function startCarousel() {
    // 清除現有的輪播計時器
    if (carouselTimer) {
      clearInterval(carouselTimer);
    }
    
    // 設置新的輪播計時器，使用當前設置的速度
    carouselTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % radarUrls.length;
      updateRadarDisplay();
      updateProgressAndFrame();
    }, carouselInterval);
  }
  
  // 設置圖片載入錯誤處理
  radarImg.onerror = function() {
    console.error(`無法載入雷達圖: ${this.src}`);
    // 載入失敗時顯示一個提示
    this.alt = '雷達圖載入失敗';
    
    // 跳到下一張
    setTimeout(() => {
      showNextImage();
    }, 1000);
  };
  
  // 初始化
	async function initRadarCarousel() {
		// 創建雷達圖界面
		createRadarInterface();
		
		// 獲取雷達圖數據，默認 6 小時
		const success = await fetchRadarData(6);
		
		// 如果成功獲取數據，設置定期更新
		if (success) {
			// 每 10 分鐘刷新一次雷達圖數據，使用當前選擇的時間範圍
			setInterval(() => {
				const timeRangeSelector = document.getElementById('time-range-selector');
				const currentRange = parseInt(timeRangeSelector.value);
				fetchRadarData(currentRange);
			}, 10 * 60 * 1000);
		}
	}
		
  // 啟動初始化
  initRadarCarousel();
  
  // 頁面離開時清除計時器
  window.addEventListener('beforeunload', function() {
    if (carouselTimer) {
      clearInterval(carouselTimer);
    }
  });
});