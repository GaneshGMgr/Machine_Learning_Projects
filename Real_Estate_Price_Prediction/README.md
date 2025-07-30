# Real Estate Home Price Prediction

A user-friendly web application to estimate home prices based on area (sqft), BHK, bathrooms, and location, powered by a trained machine learning regression model with a Flask backend.

## Description  
This project leverages a regression model trained on Bangalore housing data to provide price predictions. Users input property details through the frontend, which sends the data to the Flask backend. The backend loads the saved model and returns an estimated price based on the inputs.

## Project Files  
- `app.html` — Frontend HTML form for user inputs  
- `app.js` — JavaScript handling input processing and API requests  
- `server.py` — Flask server providing prediction and location APIs  
- `util.py` — Utility functions to load artifacts and perform predictions  
- `artifacts/` — Contains the saved ML model (`home_prices_model.pickle`) and data columns (`columns.json`)  

## Setup & Run  
1. Install required Python packages (e.g., Flask, numpy, scikit-learn)  
2. Start the Flask server:  
   ```bash
   python server.py
