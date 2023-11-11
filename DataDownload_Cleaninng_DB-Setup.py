import pandas as pd, requests, wget, sqlite3

#################################################
# Data Download  from "DATA.GOV.AU" through API
#################################################

data_df = requests.get(
    "https://data.gov.au/data/api/3/action/package_show?id=5b530fb8-526e-4fbf-b0f6-aa24e84e4277").json()

results = data_df['result']['resources']

csv = []

for i in range(0, len(results)):
    csv.append(results[i]['url'])

open('Master_Folder/ardd_fatalities.csv', 'wb').write(requests.get(csv[1]).content)
open('Master_Folder/ardd_fatal_crashes.csv', 'wb').write(requests.get(csv[2]).content)
open('Master_Folder/calendar.csv', 'wb').write(requests.get(csv[4]).content)
wget.download(csv[3], out='Master_Folder/')
wget.download('https://github.com/Elkfox/Australian-Postcode-Data/blob/master/au_postcodes.csv', out = 'Master_Folder/')
#################################################
# Data Cleaning
#################################################

Fatal_Crash = pd.read_csv('Master_Folder/ardd_fatal_crashes.csv')
Fatalities = pd.read_csv('Master_Folder/ardd_fatalities.csv')

Fatal_Crash_df = Fatal_Crash.fillna({'Time': '00:00', 'Crash Type': 'Undetermined', 'Bus Involvement': 'Undetermined',
                                     'Heavy Rigid Truck Involvement': 'Undetermined',
                                     'Articulated Truck Involvement': 'Undetermined',
                                     'Speed Limit': '-9', 'National Remoteness Areas': 'Undetermined',
                                     'SA4 Name 2021': 'Undetermined',
                                     'National LGA NAme 2021': 'Undetermined', 'National Road Type': 'Undetermined'
                                     })
Fatal_Crash_df['Bus Involvement'] = Fatal_Crash_df['Bus Involvement'].replace(['-9'], 'Undetermined')
Fatal_Crash_df['Heavy Rigid Truck Involvement'] = Fatal_Crash_df['Heavy Rigid Truck Involvement'].replace(['-9'],
                                                                                                          'Undetermined')
Fatal_Crash_df['Articulated Truck Involvement'] = Fatal_Crash_df['Articulated Truck Involvement'].replace(['-9'],
                                                                                                          'Undetermined')
Fatal_Crash_df['Speed Limit'] = Fatal_Crash_df['Speed Limit'].replace(['Unspecified', '<40', 'Undetermined'], '-9')
Fatal_Crash_df['National Remoteness Areas'] = Fatal_Crash_df['National Remoteness Areas'].replace(['Unknown'],
                                                                                                  'Undetermined')
Fatal_Crash_df['SA4 Name 2021'] = Fatal_Crash_df['SA4 Name 2021'].replace(['Unknown'], 'Undetermined')
Fatal_Crash_df['National LGA NAme 2021'] = Fatal_Crash_df['National LGA NAme 2021'].replace(['Unknown'], 'Undetermined')
Fatal_Crash_df['National Road Type'] = Fatal_Crash_df['National Road Type'].replace(['Unknown'], 'Undetermined')

Fatal_Crash_df.rename(columns={'National LGA NAme 2021': 'National LGA Name 2021'}, inplace=True)

Fatal_Crash_df.to_csv("output/Cleaned_Fatal_Crash_Data.csv", index=False)
Fatal_Crash_df.to_json("output/Cleaned_Fatal_Crash_Data.json", orient="index")

Fatalities_df = Fatalities.fillna({'Time': '00:00', 'Crash Type': 'Undetermined', 'Bus Involvement': 'Undetermined',
                                   'Heavy Rigid Truck Involvement': 'Undetermined', 'Gender': 'Undetermined',
                                   'Articulated Truck Involvement': 'Undetermined', 'Age': '-9',
                                   'Speed Limit': '-9', 'Road User': "Undetermined",
                                   'National Remoteness Areas': 'Undetermined', 'SA4 Name 2021': 'Undetermined',
                                   'National LGA Name 2021': 'Undetermined', 'National Road Type': 'Undetermined'
                                   })

Fatalities_df['Bus Involvement'] = Fatalities_df['Bus Involvement'].replace(['-9'], 'Undetermined')
Fatalities_df['Heavy Rigid Truck Involvement'] = Fatalities_df['Heavy Rigid Truck Involvement'].replace(['-9'],
                                                                                                        'Undetermined')
Fatalities_df['Articulated Truck Involvement'] = Fatalities_df['Articulated Truck Involvement'].replace(['-9'],
                                                                                                        'Undetermined')
Fatalities_df['Speed Limit'] = Fatalities_df['Speed Limit'].replace(['Unspecified', '<40', 'Undetermined'], '-9')
Fatalities_df['Road User'] = Fatalities_df['Road User'].replace(['Unknown', 'Other/-9'], ['Undetermined', 'Other'])
Fatalities_df['Gender'] = Fatalities_df['Gender'].replace(['-9', 'U', 'M ', "Unspecified"],
                                                          ['Undetermined', 'Undetermined', 'Male', 'Undetermined'])
Fatalities_df['National Remoteness Areas'] = Fatalities_df['National Remoteness Areas'].replace(['Unknown'],
                                                                                                'Undetermined')
Fatalities_df['SA4 Name 2021'] = Fatalities_df['SA4 Name 2021'].replace(['Unknown'], 'Undetermined')
Fatalities_df['National LGA Name 2021'] = Fatalities_df['National LGA Name 2021'].replace(['Unknown'], 'Undetermined')
Fatalities_df['National Road Type'] = Fatalities_df['National Road Type'].replace(['Unknown'], 'Undetermined')

Fatalities_df.to_csv("output/Cleaned_Fatalities_Data.csv", index=False)
Fatalities_df.to_json("output/Cleaned_Fatalities_Data.json", orient="index")

Modified_Fatalities_df = Fatalities_df[['Crash ID', 'Road User', 'Gender', 'Age', 'Age Group']]

#################################################
# Database Setup using SQLITE3
#################################################

conn = sqlite3.connect('output/Master_Database.sqlite')

c = conn.cursor()

Master_Database_df = pd.merge(Fatal_Crash_df, Modified_Fatalities_df, on='Crash ID')

Master_Database_df = Master_Database_df[
    ['Crash ID', 'State', 'Dayweek', 'Day of week', 'Month', 'Year', 'Time', 'Time of Day', 'Speed Limit', 'Crash Type',
     'Number of Fatalities', 'Road User', 'Gender', 'Age', 'Age Group', 'Christmas Period', 'Easter Period',
     'National Road Type', 'National Remoteness Areas', 'SA4 Name 2021', 'National LGA Name 2021',
     'Bus Involvement', 'Heavy Rigid Truck Involvement', 'Articulated Truck Involvement']]

Master_Database_df['Speed Limit'] = Master_Database_df['Speed Limit'].astype('int64')
Master_Database_df['Time'] = pd.to_datetime(Master_Database_df['Time'], format='%H:%M')

Modified_Master_DB = Master_Database_df.set_axis(['Crash_ID', 'State', 'Dayweek', 'Day_of_week', 'Month', 'Year', 'Time', 'Time_of_Day', 'Speed_Limit', 'Crash_Type',
     'Number_of_Fatalities', 'Road_User', 'Gender', 'Age', 'Age_Group', 'Christmas_Period', 'Easter_Period',
     'National_Road_Type', 'National_Remoteness_Areas', 'SA4_Name_2021', 'National_LGA_Name_2021',
     'Bus_Involvement', 'Heavy_Rigid_Truck_Involvement', 'Articulated_Truck_Involvement'], axis = 'columns')

Modified_Master_DB.to_json("output/Master_Database_df.json", orient="index")

Modified_Master_DB.to_sql('Fatalities_Crash', conn, if_exists='replace', index=False)

for row in c.execute('SELECT * FROM Fatalities_Crash'):
    print(row)

conn.close()