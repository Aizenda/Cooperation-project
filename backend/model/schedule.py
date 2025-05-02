
from backend.model.bot_day import Bot_daily
from backend.model.bot_CRUD import get_all_webhook_data
from datetime import date, datetime, timedelta

def job():
    try:
        # 取得時間(UTC+8)
        current_hour = datetime.now() + timedelta(hours=8)
        # 格式化為小時字串 (例如 "08")
        current_hour = current_hour.strftime("%H")
        
        all_data = get_all_webhook_data(current_hour)
        print(f"job被呼叫 - 現在時間: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} (UTC+8時間: {(datetime.now() + timedelta(hours=8)).strftime('%Y-%m-%d %H:%M:%S')})")
        print(f"檢查 {current_hour} 點的通知")
        
        for data in all_data:
            city = data.get("city")
            url = data.get("webhook_url")
            Bot = Bot_daily(url)
            Bot.get_current_weather_data(city)
            print(f"已發送 {city} 的天氣通知")
    except Exception as e:
        print(f"執行過程中發生錯誤: {e}")

if __name__ == "__main__":
    job()