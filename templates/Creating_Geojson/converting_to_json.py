import pandas as pd

# Load the CSV file into a DataFrame
df = pd.read_csv('merged_geojsondata.csv')

# Convert the DataFrame to JSON format
json_data = df.to_json(orient='records')

# Save the JSON data to a file
with open('output.json', 'w') as json_file:
    json_file.write(json_data)
