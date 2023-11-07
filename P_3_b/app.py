# app.py

from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configure the SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///static/data/Master_Database.db'
db = SQLAlchemy(app)

# Define the CrashData model for your database
class CrashData(db.Model):
    __tablename__ = 'crash_data'  # Use the correct table name
    # Define the table columns and data types here
    id = db.Column(db.Integer, primary_key=True)
    Crash_ID = db.Column(db.Integer)
    State = db.Column(db.String(2))
    Month = db.Column(db.Integer)
    Year = db.Column(db.Integer)
    Dayweek = db.Column(db.String(20))
    Time = db.Column(db.String(20))
    Crash_Type = db.Column(db.String(20))
    Number_of_Fatalities = db.Column(db.Integer)
    Bus_Involvement = db.Column(db.String(3))
    Heavy_Rigid_Truck_Involvement = db.Column(db.String(3))
    Articulated_Truck_Involvement = db.Column(db.String(3))
    Speed_Limit = db.Column(db.Integer)
    National_Remoteness_Areas = db.Column(db.String(20))
    SA4_Name_2021 = db.Column(db.String(20))
    National_LGA_Name_2021 = db.Column(db.String(20))
    National_Road_Type = db.Column(db.String(20))
    Christmas_Period = db.Column(db.String(3))
    Easter_Period = db.Column(db.String(3))
    Day_of_week = db.Column(db.String(20))
    Time_of_Day = db.Column(db.String(5))
    Road_User = db.Column(db.String(20))
    Gender = db.Column(db.String(6))
    Age = db.Column(db.Integer)
    Age_Group = db.Column(db.String(10))

    def to_dict(self):
        # Convert the model instance to a dictionary
        return {
            'id': self.id,
            'Crash_ID': self.Crash_ID,
            'State': self.State,
            'Month': self.Month,
            'Year': self.Year,
            'Dayweek': self.Dayweek,
            'Time': self.Time,
            'Crash_Type': self.Crash_Type,
            'Number_of_Fatalities': self.Number_of_Fatalities,
            'Bus_Involvement': self.Bus_Involvement,
            'Heavy_Rigid_Truck_Involvement': self.Heavy_Rigid_Truck_Involvement,
            'Articulated_Truck_Involvement': self.Articulated_Truck_Involvement,
            'Speed_Limit': self.Speed_Limit,
            'National_Remoteness_Areas': self.National_Remoteness_Areas,
            'SA4_Name_2021': self.SA4_Name_2021,
            'National_LGA_Name_2021': self.National_LGA_Name_2021,
            'National_Road_Type': self.National_Road_Type,
            'Christmas_Period': self.Christmas_Period,
            'Easter_Period': self.Easter_Period,
            'Day_of_week': self.Day_of_week,
            'Time_of_Day': self.Time_of_Day,
            'Road_User': self.Road_User,
            'Gender': self.Gender,
            'Age': self.Age,
            'Age_Group': self.Age_Group
        }

# Route to retrieve all crash data
@app.route('/api/crash-data', methods=['GET'])
def get_crash_data():
    crash_data = CrashData.query.all()
    formatted_data = [data.to_dict() for data in crash_data]
    return jsonify(formatted_data)

# Route to retrieve filtered data based on year and state
@app.route('/api/data', methods=['GET'])
def get_filtered_data():
    year = request.args.get('year')
    state = request.args.get('state')

    # Query the database to fetch filtered data
    filtered_data = CrashData.query.filter_by(Year=year, State=state).all()
    
    # Convert the filtered data to a list of dictionaries
    formatted_data = [data.to_dict() for data in filtered_data]
    return jsonify(formatted_data)

if __name__ == '__main__':
    app.run(debug=True)


