from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/years', methods=['GET'])
def get_years():
    try:
        file_path = os.path.join(app.static_folder, 'data', 'Visualisation_data_v02.JSON')
        with open(file_path, 'r') as f:
            data = json.load(f)

        # Extract years and sort them
        years = sorted({str(record['Year']) for record in data.values()})
        return jsonify(list(years))
    except FileNotFoundError as e:
        app.logger.error(f'File not found: {e}')
        return jsonify({'error': 'File not found'}), 404
    except json.JSONDecodeError as e:
        app.logger.error(f'Error decoding JSON: {e}')
        return jsonify({'error': 'Error decoding JSON'}), 400
    except Exception as e:
        app.logger.error(f'Unexpected error: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/data')
def get_data():
    try:
        year_filter = request.args.get('year')
        
        file_path = os.path.join(app.static_folder, 'data', 'Visualisation_data_v02.JSON')
        with open(file_path, 'r') as f:
            data = json.load(f)

        # Apply filtering if the year filter is present and not 'all'
        if year_filter and year_filter.lower() != 'all':
            data = {k: v for k, v in data.items() if str(v.get('Year')) == str(year_filter)}

        return jsonify(list(data.values()))
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    except json.JSONDecodeError:
        return jsonify({'error': 'Error decoding JSON'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
