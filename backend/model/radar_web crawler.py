import time
import requests
import db_connector
from datetime import datetime, timedelta

def fetch_radar_data():
    radar_url = 'https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0058-003?Authorization=rdec-key-123-45678-011121314&format=JSON'

    try:
        radar = requests.get(radar_url, timeout=10)
        radar_json = radar.json()
        latest_dt = datetime.fromisoformat(radar_json['cwaopendata']['dataset']['DateTime'])
        print(f"最新雷達圖時間: {latest_dt.isoformat()}")

        con = db_connector.mysql_pool.get_connection()
        cursor = con.cursor()

        delete_old_data(cursor, con)

        cursor.execute("SELECT COUNT(*) FROM radar_data")
        row_count = cursor.fetchone()[0]

        if row_count == 0:
            print("資料表為空，補抓過去兩天資料")
            fetch_two_days_radar_data(cursor, con, latest_dt)
        else:
            print("資料表已有資料，只抓最新一筆")
            fetch_latest_radar_data(cursor, con, latest_dt)

    except Exception as e:
        print(f"獲取雷達圖數據時發生錯誤: {e}")
    finally:
        try:
            if cursor:
                cursor.close()
            if con and con.is_connected():
                con.close()
        except Exception as e:
            print(f"關閉資源時錯誤: {e}")

def fetch_two_days_radar_data(cursor, con, latest_dt):
    two_days_ago = latest_dt - timedelta(days=2)
    for i in range(288):  # 288 張圖
        dt = latest_dt - timedelta(minutes=i * 10)
        if dt < two_days_ago:
            break
        insert_radar_image(cursor, con, dt)

def fetch_latest_radar_data(cursor, con, dt):
    insert_radar_image(cursor, con, dt)

def insert_radar_image(cursor, con, dt):
    formatted_time = dt.strftime("%Y%m%d%H%M")
    url = f"https://www.cwa.gov.tw/Data/radar/CV1_3600_{formatted_time}.png"
    try:
        response = requests.head(url, timeout=5)
        if response.status_code == 200:
            insert_query = """
                INSERT INTO radar_data (radar_img_url, radar_time)
                VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE radar_img_url = VALUES(radar_img_url)
            """
            cursor.execute(insert_query, (url, dt.isoformat()))
            con.commit()
            print(f"✅ 插入成功: {formatted_time}")
        else:
            print(f"❌ 無效圖片: {url}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️ 連線錯誤: {e}")

def delete_old_data(cursor, con):
    try:
        threshold = datetime.now() - timedelta(days=2)
        delete_query = "DELETE FROM radar_data WHERE radar_time < %s"
        cursor.execute(delete_query, (threshold.strftime('%Y-%m-%d %H:%M:%S'),))
        con.commit()
        print(f"🧹 已刪除 {cursor.rowcount} 筆舊資料")
    except Exception as e:
        print(f"刪除舊資料錯誤: {e}")
        if con.is_connected():
            con.rollback()

if __name__ == "__main__":
    while True:
        print(f"\n🚀 開始: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        fetch_radar_data()
        print("⏳ 等待 10 分鐘...\n")
        time.sleep(600)
