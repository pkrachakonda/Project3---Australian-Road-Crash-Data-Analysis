# 🚗Australian Road Crash Data Analysis - 2013-2023

#### ⭐ This repository contains the data analysis project on Australian road crashes from 2013 to 2023 conducted by  **Group 7: Praveen Rachakonda, Lee Armstrong, Jesslyn Lengkong, and Athira Reji** for the UWA Data Analytics Bootcamp 2023. 

## Table of Contents
1. [Project Overview](#project-overview)
2. [Aim](#aim)
3. [Data Source](#data-source)
4. [Analysis Focus](#analysis-focus)
5. [Research Questions](#research-questions)
6. [Project Stages](#project-stages)
   - [A. Concept Stage](#a-concept-stage)
   - [B. Extract, Transform and Load](#b-extract-transform-and-load)
      - [B.1 Flow Diagram](#b1-flow-diagram)
      - [B.2 ETL Stages in Detail](#b2-etl-stages-in-detail)
   - [C. Dashboard Development](#c-dashboard-development)
7. [Conclusions](#conclusions)
8. [References](#references)


## 📑Project Overview

64% of surveyed Australians over 18 with driver’s licenses have experienced at least one car crash. With a total of 39,755 people hospitalized due to car crashes in 2018-19, we look into some of the available data to review the demographics of road fatalities. To further look at the statistics of road crashes and road fatalities in Australia, the Australian Road Deaths Database was analyzed and visualizations were prepared for a more complete understanding of the demographics involved in road crashes and fatalities. To understand the data better, an AARD Dictionary was included to list all values that are included in the database. **Note: The dataset only provides data until September 2023.**

## 🎯Aim

The primary aim of this project is to create an interactive dashboard providing users with the ability to perform various types of analysis, enhancing the understanding of road crashes in Australia. The analysis encompasses both long-term trends and demographic patterns to aid in developing targeted road safety strategies.

## 🖥️Data Source

The analysis is based on the [Australian Road Deaths Database](https://data.gov.au/dataset/ds-dga-5b530fb8-526e-4fbf-b0f6-aa24e84e4277/details?q=road%20fatalities%20in%20Australia), focusing on road fatalities and crash data. The dataset is available until September 2023.
The database used to derive the latitudes and longitudes is [The Latitudes and Longitudes](https://github.com/Elkfox/Australian-Postcode-Data/blob/master/au_postcodes.csv)

## 📊Analysis Focus

- **Trend Analysis:** Examining long-term trends in road fatalities to identify patterns and changes over time. This can help assess the effectiveness of road safety initiatives and interventions.
- **Geographic Analysis:** Analyzing crash data by location to identify high-risk regions. This information can be used to prioritize safety improvements and allocate resources effectively.
- **Demographic Analysis:** Investigating crash data by factors such as age, gender, etc. This analysis can help identify vulnerable road user groups and tailor road safety campaigns accordingly.
- **Comparative Analysis:** Comparing road crash data across different states. This can help identify variations in road safety practices and outcomes, leading to the sharing of best practices.

## ❓❓Research Questions

1. How have overall state fatalities changed from 2013 to 2023?
2. Are there noticeable trends or patterns in yearly fatalities data?
3. Are there significant variations in fatalities across different states?
4. What are the road user patterns, and how do they contribute to overall fatalities?
5. How are fatalities distributed among different age groups?
6. Is there a correlation between age group and the number of fatalities?
7. What is the correlation between fatalities and speed limits? Are higher speed limits associated with more severe accidents?
8. How do fatalities vary across different speed limit categories?

## 🪜Project Stages

### A. 💡Concept Stage

![](https://github.com/pkrachakonda/Project3_Gr7/blob/main/Athira/README_images/CC.png)


### B. ⬇️🧹✂️⬆️ Extract, Transform and Load

1. **Downloading Data:** Data retrieved from "DATA.GOV.AU" through API.
2. **Cleaning Data:** Filling empty columns, handling -9 values, renaming columns, and merging data frames.
3. **Database Setup:** Creating a SQLite3 database.
4. **Setting Project Database & JSON for Visualization:** Creating a web API using Flask, connecting to SQLite database, retrieving specific data, and serving it in JSON format.
5. **Final Database:** Incorporating cleaned and transformed data into the SQL Alchemy database.
6. **Flask API:** Creating routes using Flask.
7. **Creating Geojson:** Merging latitude and longitude coordinates columns to the final database.

#### Description
As part of the Extract Transform and Load (ETL) process, data was downloaded from data.gov.au (data related to road crashes) and GitHub (data related to coordinates for locations), using the requests function. As part of extracting data, all empty rows were filled with “undetermined” except for the Time and Speed columns for which “-9” was used, using Pandas. The modified Pandas DataFrame were merged by removing duplicated columns. The modified data was transformed into a sqlite3 database and loaded using SQLAlchemy. A web application (127.0.0.1:8080) was created using Flask and WSGI server and data for visualisation was extracted from the web application using the requests function and jsonified.

#### Flow Diagram 

![ARDD_FLowChart_V02](https://github.com/pkrachakonda/Project3_Gr7/assets/20739237/5c7a698a-1b44-44c5-87b1-81d2eb2c03cd)


#### ETL stages: Linked files

- **Downloading Data:** , **Cleaning Data:**, **Database Setup:** [DataDownload_Cleaninng_DB-Setup.py](https://github.com/pkrachakonda/Project3_Gr7/blob/main/DataDownload_Cleaninng_DB-Setup.py)

- **Setting Project Database & JSON for Visualization:** [Data_forVisualisation.py](https://github.com/pkrachakonda/Project3_Gr7/blob/main/Data_forVisualisation.py)

- **Final Database:** [ProjectDB_Flask.py](https://github.com/pkrachakonda/Project3_Gr7/blob/main/ProjectDB_Flask.py)

- **Flask API:** [app.py](https://github.com/pkrachakonda/Project3_Gr7/blob/main/app.py)

- **Creating Geojson:** [Creating Geojson](https://github.com/pkrachakonda/Project3_Gr7/tree/main/Athira)


### C. 📊📈📉Dashboard Development

- **HTML, JavaScript, CSS:** Developing an interactive dashboard with responsive design using W3-School templates and Leaflet for map presentation.

#### Linked Files

- **Static Folder:** [static](https://github.com/pkrachakonda/Project3_Gr7/tree/main/static)

- **Flask API:** [app.py](https://github.com/pkrachakonda/Project3_Gr7/blob/main/app.py)

- **Leaflet:** [Leaflet](https://github.com/pkrachakonda/Project3_Gr7/tree/main/Athira)

#### Snapshot of the Dashboard

![](https://github.com/pkrachakonda/Project3_Gr7/blob/main/Athira/README_images/DB.png)

## 📄Answering the Research Questions

1. **How have overall state fatalities changed from 2013 to 2023?**
2. **Are there any noticeable trends or patterns in the yearly fatalities data?**

`The analysis reveals a downward trend in fatalities over the years, with a significant reduction in numbers, indicating a positive impact on road safety measures.`

3. **Are there significant variations in fatalities across different states?**
4. **What are the road user patterns, and how do they contribute to overall fatalities?**

`NSW has the highest number of fatalities over the last decade, followed by VIC and QLD. This observation emphasizes the importance of understanding road user patterns for effective safety measures.`

5. **How are fatalities distributed among different age groups?**
6. **Is there a correlation between age group and the number of fatalities?**

`The 40-46 years age group has the most number of fatalities followed by 25-39 years, followed by 16-24 years. This analysis reveals a notable correlation between age groups and the occurrence of fatalities, emphasizing the need for age-specific safety measures.`

7. **What is the correlation between fatalities and speed limits?**
8. **How do fatalities vary across different speed limit categories?**

`The number of fatalities changes with different speed limits. The 60km/hr-80km/hr range has the most number of fatalities. These findings suggest a potential correlation between speed limits and the severity of accidents, highlighting the importance of speed management for road safety.`


## 📑Conclusions

In summary, 

- the data points towards a positive trend in reducing overall state fatalities. Sustaining these improvements requires continuous monitoring.
- Recognizing state-specific variations and understanding road user patterns are critical elements for formulating targeted strategies aimed at improving road safety.
- Understanding the age distribution of fatalities is essential for tailoring interventions and policies to address the specific needs of different age groups, thereby contributing to overall road safety.
- Apprehending the relationship between fatalities and speed limits is crucial for implementing effective speed control measures and enhancing overall road safety.

## 📝References

- [Green Color Codes](html-color.codes)
- [How to Highlight Table Row on Hover Mouse Using CSS](tutorialdeep.com)
- [CSS Table Style](w3schools.com)
- [Canvas is Already in Use. Chart with ID '3' Must be Destroyed Before the Canvas with ID 'eachStateChart' Can be Reused](bing.com)
- [How To Create an On Scroll Fixed Header](w3schools.com)
