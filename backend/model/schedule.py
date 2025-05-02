from backend.model.bot_day import Bot_daily
from backend.model.bot_CRUD import get_all_webhook_data
import schedule
import time
from datetime import date, datetime, timedelta


def job():
    try:
        current_hour = datetime.now() + timedelta(hours=8)
        current_hour = current_hour.strftime("%H")
        all_data = get_all_webhook_data(current_hour)
        print("job被呼叫")
        for data in all_data:
            city = data.get("city")
            url = data.get("webhook_url")
            Bot = Bot_daily(url)
            Bot.get_current_weather_data(city)
    except Exception as e:
        print(e)


job()

schedule.every(1).minutes.do(job)
if __name__ == "__main__":
    while True:
        schedule.run_pending()
        time.sleep(10)
        print("10s")
