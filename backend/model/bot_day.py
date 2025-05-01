import requests
import os
import time
from dotenv import load_dotenv
from .api_response_handler import get_weather_by_city
load_dotenv()


class Bot_daily():
    def __init__(self, url):
        # self.url = os.getenv("BOT_URL")
        self.url = url

    def __get_detail(self, value):
        data = value.split("。")
        obj = {
            "天氣現象": data[0],
            "降雨機率": data[1][-2:],
            "舒適度": data[3],
            "濕度": data[5][-3:]
        }
        return obj

    def __build_embed(self, city, obj):
        return {
            "title": f"當前天氣預報--{city}",
            "url": "https://www.youtube.com/watch?v=72ap5hdI4fs&ab_channel=%E9%A6%99%E6%B8%AF%E4%BA%A4%E5%8F%8B%E8%A8%8E%E8%AB%96%E5%8D%80hkeasychat.com",
            "description": f"天氣現象: {obj.get("天氣現象")}\n降雨機率: {obj.get('降雨機率')}\n舒適度: {obj.get('舒適度')}\n濕度: {obj.get('濕度')}\n最高溫度: {obj.get('最高溫度')}°C\n最低溫度: {obj.get('最低溫度')}°C",
            "thumbnail": {"url": "https://www.cwa.gov.tw/Data/radar/CV1_3600_202504301410.png"},
            # "image": {"url": "https://www.cwa.gov.tw/Data/radar/CV1_3600_202504301410.png"},
            "color": 16753920,
            "footer": {
                "text": f"資料來源：中央情報局 👨‍💻"
            }
        }

    def __build_data(self, city, obj):
        embed = self.__build_embed(city, obj)
        data = {
            "username": "瑞克雷達",
            "avatar_url": "https://image-cdn.hypb.st/https%3A%2F%2Fhk.hypebeast.com%2Ffiles%2F2021%2F08%2Fnever-gonna-give-you-up-passes-one-billion-views-01.jpg?w=960&cbr=1&q=90&fit=max",
            "embeds": [embed]
        }
        return data

    def get_current_weather_data(self, city):
        try:
            weather_data = get_weather_by_city(
                city, ["最高溫度", "最低溫度", "天氣預報綜合描述"])
            weathers = weather_data.get("weather")
            obj = {}
            for weather in weathers:
                element_type = weather.get("elementType")
                element_value = weather.get("elementValue")
                values = element_value[0].get("values")
                key, value = list(values.items())[0]
                if element_type == "天氣預報綜合描述":
                    weather_detail = self.__get_detail(value)
                    obj = {**weather_detail, **obj}
                else:
                    obj[element_type] = value
            weather_data = self.__build_data(city, obj)
            response = requests.post(self.url, json=weather_data)
            if response.status_code == 204:
                print(f"✅ 訊息發送成功")
        except Exception as e:
            print(e)


# if __name__ == "__main__":
#     Bot = Bot_daily(os.getenv("BOT_URL"))
#     Bot.get_current_weather_data()
#     while True:
#         time.sleep(50)
    # response = requests.post(Bot.url, json=weather_data)


# def img_data(url):
#     data = {
#         "username": "瑞克雷達",
#         "avatar_url": "https://image-cdn.hypb.st/https%3A%2F%2Fhk.hypebeast.com%2Ffiles%2F2021%2F08%2Fnever-gonna-give-you-up-passes-one-billion-views-01.jpg?w=960&cbr=1&q=90&fit=max",
#         "embeds": [
#             {
#                 "title": "雷達迴波圖",
#                 "image": {
#                     "url": url
#                 },
#                 "footer": {
#                     "text": f"資料來源：中央情報局 👨‍💻"
#                 }
#             }
#         ]
#     }
#     return data
