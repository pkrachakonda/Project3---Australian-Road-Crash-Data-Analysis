
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from flask import Flask, jsonify
from sqlalchemy import Column, Integer, String, create_engine, text, DateTime
import pandas as pd
from gevent.pywsgi import WSGIServer
from gevent import monkey

engine = create_engine("sqlite:///output/Master_Database.sqlite", echo=False)
Base = automap_base()

class Fatalities_Crash(Base):
    __tablename__ = "Fatalities_Crash"
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    Crash_ID = Column(Integer)
    State = Column(String)
    Dayweek = Column(String)
    Day_of_week = Column(String)
    Month = Column(Integer)
    Year = Column(Integer)
    Time = Column(DateTime)
    Time_of_Day = Column(String)
    Speed_Limit = Column(Integer)
    Crash_Type = Column(String)
    Number_of_Fatalities = Column(Integer)
    Road_User = Column(String)
    Gender = Column(String)
    Age = Column(Integer)
    Age_Group = Column(String)
    Christmas_Period = Column(String)
    Easter_Period = Column(String)
    National_Road_Type = Column(String)
    National_Remoteness_Areas = Column(String)
    SA4_Name_2021 = Column(String)
    National_LGA_Name_2021 = Column(String)
    Bus_Involvement = Column(String)
    Heavy_Rigid_Truck_Involvement = Column(String)
    Articulated_Truck_Involvement = Column(String)

Base.prepare(autoload_with=engine)

monkey.patch_all()
app = Flask(__name__)

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"<br/>"
        f"/api/v1.0/Data_for_Dashboard<br/>"
    )


@app.route("/api/v1.0/Data_for_Dashboard")
def data_for_dashboard():
    session = Session(engine)

    dashboard_data = session.execute(text('SELECT * FROM Fatalities_Crash WHERE Year >= 2013')).fetchall()

    session.close()
    Data = (pd.DataFrame(dashboard_data,
                                  columns=['Crash_ID', 'State', 'Dayweek', 'Day_of_week', 'Month', 'Year', 'Time',
                                           'Time_of_Day', 'Speed_Limit', 'Crash_Type',
                                           'Number_of_Fatalities', 'Road_User', 'Gender', 'Age', 'Age_Group',
                                           'Christmas_Period', 'Easter_Period',
                                           'National_Road_Type', 'National_Remoteness_Areas', 'SA4_Name_2021',
                                           'National_LGA_Name_2021',
                                           'Bus_Involvement', 'Heavy_Rigid_Truck_Involvement',
                                           'Articulated_Truck_Involvement']).to_dict())

    return jsonify(Data)


def main():
    http = WSGIServer(('', 8080), app.wsgi_app)

    http.serve_forever()

if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=8080, threaded=True)
