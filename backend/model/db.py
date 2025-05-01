import db_connector


def create_database():
    con = None
    cursor = None

    try:
        con = db_connector.mysql_pool.get_connection()
        cursor = con.cursor()

        create_table_query = """
            CREATE TABLE IF NOT EXISTS radar_data (
                id INT AUTO_INCREMENT PRIMARY KEY,
                radar_img_url VARCHAR(255) NOT NULL,
                radar_time DATETIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """
        cursor.execute(create_table_query)
        create_table_query = """
            CREATE TABLE IF NOT EXISTS webhook (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                webhook_url TEXT NOT NULL,
                city VARCHAR(255) NOT NULL,
                notify_time TEXT NOT NULL,
                last_update DATE NOT NULL
            );
        """
        cursor.execute(create_table_query)
        con.commit()

    except Exception as e:
        print(f"Create table failed: {e}")

    finally:
        if cursor:
            cursor.close()
        if con:
            con.close()


if __name__ == "__main__":
    create_database()
