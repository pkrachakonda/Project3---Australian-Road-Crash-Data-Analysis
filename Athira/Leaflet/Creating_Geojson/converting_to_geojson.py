import json

# Load JSON data from a file
with open('output.json', 'r') as json_file:
    data = json.load(json_file)

# Convert the JSON data to GeoJSON format
geojson_data = {
    "type": "FeatureCollection",
    "features": []
}

for item in data:
    feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [item['lng'], item['lat']]
        },
        "properties": item
    }
    geojson_data["features"].append(feature)

# Save the GeoJSON data to a file
with open('output_geojson.geojson', 'w') as geojson_file:
    json.dump(geojson_data, geojson_file)

print("Conversion to GeoJSON completed.")
