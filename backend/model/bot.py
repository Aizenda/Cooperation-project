import requests
import os
from dotenv import load_dotenv
from datetime import datetime
from .api_response_handler import get_weather_by_location
load_dotenv()
BOT_URL = os.getenv("BOT_URL")


class Discord_bot():
    """
    用於生成並儲存 Discord webhook 所需的氣象預報嵌入資料（embed 格式）。

    主要功能：
    - 產生欄位內容（fields）
    - 設定顏色
    - 組裝 webhook payload 資料
    - 將產出的 webhook 資料存入 post_list 等待發送
    """

    def __init__(self):
        self.post_list = []
        self.current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.url = BOT_URL

    def get_value(self, dict_value):
        data = "\n".join(f"{key}: {value}" for key,
                         value in dict_value.items())
        return data

    def fields_generator(self, element_type, element_value):
        fields = []
        for values in element_value:
            if values.get('period') == "晚上":
                continue
            column1 = {
                "name": "日期", "value": f"{values.get('date')}", "inline": True
            }
            column2 = {
                "name": element_type, "value": self.get_value(values.get('values')), "inline": True
            }
            # 插入空白欄位
            column3 = {
                "name": "\u200b",
                "value": "\u200b",
                "inline": True
            }
            fields.append(column1)
            fields.append(column2)
            fields.append(column3)
        # print(fields)
        return fields

    def color_switch(self, element_type):
        color_map = {
            "天氣預報綜合描述": 65280,
            "平均相對溼度": 16711680,
            "天氣現象": 255,
            "最高體感溫度": 16776960,
            "最低體感溫度": 16761035,
            "紫外線指數": 16711935,
            "平均溫度": 16753920
        }
        return color_map.get(element_type, 0)

    def build_embed(self, city, district, element_type, fields):
        return {
            "author": {
                "name": f"一周天氣預報--{element_type}",
                "url": "https://opendata.cwa.gov.tw/dist/opendata-swagger.html",
            },
            "title": f"{city} - {district}",
            "description": "未來一周天氣，參考就好，不要迷信❌",
            "color": self.color_switch(element_type),
            "fields": fields,
            "footer": {
                "text": f"資料來源：中央情報局 👨‍💻"
            }
        }

    def data_generator(self, city, district, fields, element_type):
        embed = self.build_embed(city, district, element_type, fields)
        data = {
            "username": "瑞克雷達",
            "content": "晚上也要搖",
            "avatar_url": "https://image-cdn.hypb.st/https%3A%2F%2Fhk.hypebeast.com%2Ffiles%2F2021%2F08%2Fnever-gonna-give-you-up-passes-one-billion-views-01.jpg?w=960&cbr=1&q=90&fit=max",
            "embeds": [embed]
        }
        self.post_list.append(data)

    def send_message(self, target_city, target_district, target_element):
        weather_data = get_weather_by_location(
            target_city, target_district, target_element)
        city = weather_data.get("city")
        district = weather_data.get("district")
        weathers = weather_data.get("weather")

        for weather in weathers:
            element_type = weather.get("elementType")
            element_value = weather.get("elementValue")
            fields = self.fields_generator(element_type, element_value)
            fields.append(
                {
                    "name": "發布時間",
                    "value": f"{self.current_time}",
                    "inline": False
                }
            )
            self.data_generator(city, district, fields, element_type)
        return self.post_list


if __name__ == "__main__":
    target_element = ["平均溫度"]
    Bot = Discord_bot()
    Bot.send_message("臺北市", "信義區", target_element)
    if Bot.post_list:
        for data in Bot.post_list:
            # response = requests.post(Bot.url, json=data)
            print(data)

# def img_data():
#     data = {
#         "content": "Hi",
#         "embeds": [
#             {
#                 "image": {
#                     "url": "https://static.popdaily.com.tw/u/202409/c30937fd-0e91-4be1-9328-d52cdb472ca3.png"
#                 }
#             }
#         ]
#     }
#     return data


# response = requests.post(url, json=img_data())

# | 顏色名稱 | 十進位表示法 | HEX 值 | RGB 值 |
# | 紅色 | 16711680 |  # FF0000 | (255, 0, 0) |
# | 綠色 | 65280 |  # 00FF00 | (0, 255, 0) |
# | 藍色 | 255 |  # 0000FF | (0, 0, 255) |
# | 黃色 | 16776960 |  # FFFF00 | (255, 255, 0) |
# | 紫色 | 16711935 |  # FF00FF | (255, 0, 255) |
# | 青色 | 65535 |  # 00FFFF | (0, 255, 255) |
# | 橙色 | 16753920 |  # FF8000 | (255, 128, 0) |
# | 粉色 | 16761035 |  # FF66B2 | (255, 102, 178) |
# | 淺藍 | 8421376 |  # 8080FF | (128, 128, 255) |
# | 深綠 | 32768 |  # 008000 | (0, 128, 0) |
# | 棕色 | 10824234 |  # A52A2A | (165, 42, 42) |
# | 灰色 | 8421504 |  # 808080 | (128, 128, 128) |
# | 金色 | 16766720 |  # FFD700 | (255, 215, 0) |
# | 深藍 | 33023 |  # 0080FF | (0, 128, 255) |
# | 黑色 | 0 |  # 000000 | (0, 0, 0) |
