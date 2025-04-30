import time
import requests
import db_connector
from datetime import datetime

def fetch_radar_data():
	radar_url = 'https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0058-003?Authorization=rdec-key-123-45678-011121314&format=JSON'
	radar = requests.get(radar_url)
	radar_json = radar.json()
	radar_time = radar_json['cwaopendata']['dataset']['DateTime'] 
	print(radar_time)
	dt = datetime.fromisoformat(radar_time)
	formatted_time = dt.strftime("%Y%m%d%H%M")
	print(formatted_time)
	radar_img = f"https://www.cwa.gov.tw/Data/radar/CV1_3600_{formatted_time}.png"
	print(radar_img)

	con = db_connector.mysql_pool.get_connection()  
	cursor = con.cursor()

	insert_query = """
	INSERT INTO radar_data (radar_img_url, radar_time)
	VALUES (%s, %s)
    """
    
	try:
		cursor.execute(insert_query, (radar_img, radar_time))
		con.commit()

	except Exception as e:
		print(f"Error inserting data: {e}")
		con.rollback()

	finally:
		cursor.close()
		con.close()


if __name__ == "__main__":
    while True:
        fetch_radar_data()
        time.sleep(600)