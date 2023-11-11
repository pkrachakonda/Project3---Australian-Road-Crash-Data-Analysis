###############################################################################################
# Run these files while Flasks is running in order to download the data for Visualisation
################################################################################################
import requests, pandas as pd

open("output/Data_for_Visualisation.json", 'wb').write(requests.get('http://127.0.0.1:8080/api/v1.0/Data_for_Dashboard').content)
Data = pd.read_json(r'output/Data_for_Visualisation.json', orient ="index")
Data.to_json('output/Visualisation_data_v02.json')