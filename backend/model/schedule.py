from backend.model.bot_day import Bot_daily
from backend.model.bot_CRUD import get_all_webhook_data
import schedule
import time
from datetime import date, datetime


def job():
    try:
        today = date.today()
        current_hour = datetime.now().strftime("%H:%M")
        all_data = get_all_webhook_data()
        print("job被呼叫")
        for data in all_data:
            city = data.get("city")
            url = data.get("webhook_url")
            notify_time = data.get("notify_time")
            last_update = data.get("last_update")

            if notify_time == current_hour and today >= last_update:
                Bot = Bot_daily(url)
                Bot.get_current_weather_data(city)
    except Exception as e:
        print(e)


schedule.every(1).minutes.do(job)
if __name__ == "__main__":
    while True:
        schedule.run_pending()
        time.sleep(10)
        print("10s")
