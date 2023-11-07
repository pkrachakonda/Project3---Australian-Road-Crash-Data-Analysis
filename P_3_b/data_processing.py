# data_processing.py

import sqlite3
import json

# Load the data from Visualisation_data.json
try:
    with open('Visualisation_data.json', 'r') as json_file:
        data = json.load(json_file)
except FileNotFoundError as e:
    print(f"Error: {e}")
    exit(1)
except json.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")
    exit(1)

# Connect to the SQLite database
conn = sqlite3.connect('static/data/Master_Database.db')
cursor = conn.cursor()

# Create a table for your data if it doesn't exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS crash_data (
        id INTEGER PRIMARY KEY,
        Crash_ID INTEGER,
        State TEXT,
        Month INTEGER,
        Year INTEGER,
        Dayweek TEXT,
        Time TEXT,
        Crash_Type TEXT,
        Number_of_Fatalities INTEGER,
        Bus_Involvement TEXT,
        Heavy_Rigid_Truck_Involvement TEXT,
        Articulated_Truck_Involvement TEXT,
        Speed_Limit INTEGER,
        National_Remoteness_Areas TEXT,
        SA4_Name_2021 TEXT,
        National_LGA_Name_2021 TEXT,
        National_Road_Type TEXT,
        Christmas_Period TEXT,
        Easter_Period TEXT,
        Day_of_week TEXT,
        Time_of_Day TEXT,
        Road_User TEXT,
        Gender TEXT,
        Age INTEGER,
        Age_Group TEXT
    );
''')

# Prepare data for insertion
records = []
for i in range(10801):  # Assuming 10801 records based on Visualisation_data JSON structure
    record = (
        data['{}Crash ID'][i], data['{}State'][i], data['{}Month'][i], data['{}Year'][i],
        data['{}Dayweek'][i], data['{}Time'][i], data['{}Crash Type'][i],
        data['{}Number of Fatalities'][i], data['{}Bus Involvement'][i],
        data['{}Heavy Rigid Truck Involvement'][i], data['{}Articulated Truck Involvement'][i],
        data['{}Speed Limit'][i], data['{}National Remoteness Areas'][i],
        data['{}SA4 Name 2021'][i], data['{}National LGA NAme 2021'][i],
        data['{}National Road Type'][i], data['{}Christmas Period'][i],
        data['{}Easter Period'][i], data['{}Day of week'][i],
        data['{}Time of Day'][i], data['{}Road User'][i], data['{}Gender'][i],
        data['{}Age'][i], data['{}Age Group'][i]
    )
    records.append(record)

# Insert data into the database using executemany
cursor.executemany('''
    INSERT INTO crash_data (
        Crash_ID, State, Month, Year, Dayweek, Time, Crash_Type,
        Number_of_Fatalities, Bus_Involvement, Heavy_Rigid_Truck_Involvement,
        Articulated_Truck_Involvement, Speed_Limit, National_Remoteness_Areas,
        SA4_Name_2021, National_LGA_Name_2021, National_Road_Type, Christmas_Period,
        Easter_Period, Day_of_week, Time_of_Day, Road_User, Gender, Age, Age_Group
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', records)

# Commit changes and close the connection
conn.commit()
conn.close()


