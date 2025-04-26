from flask import Flask, request, render_template, jsonify
import pandas as pd
import joblib
import numpy as np

app = Flask(__name__)

model = joblib.load('Online Payment Fraud Detection/random_forest_model.pkl')

scaler = joblib.load('Online Payment Fraud Detection/model/scaler.pkl')

# Load the column names
with open('Online Payment Fraud Detection/columns.pkl', 'rb') as f:
    expected_columns = joblib.load(f)

# Define a mapping for 'type' column encoding
type_mapping = {'PAYMENT': 0, 'CASH_IN': 1, 'DEBIT': 2, 'CASH_OUT': 3, 'TRANSFER': 4}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']
    if not file:
        return "No file uploaded", 400

    if file.filename.endswith('.csv'):
        data = pd.read_csv(file)
    elif file.filename.endswith('.xlsx'):
        data = pd.read_excel(file)
    else:
        return "Unsupported file format", 400
   
    # print("Input data columns:", data.columns)
    
    if 'type' in data.columns:
        data['type'] = data['type'].map(type_mapping) #  preprocessing 'type'
    
    # Define columns to keep
    features = ['step', 'type', 'amount', 'nameOrig', 'oldbalanceOrg', 'newbalanceOrig', 'nameDest', 'oldbalanceDest', 'newbalanceDest']
    
    # Ensure all required columns are present
    missing_cols = [col for col in features if col not in data.columns]
    if missing_cols:
        return f"Missing columns in the input data: {', '.join(missing_cols)}", 400
    
    # Add frequency encoding
    data['nameOrig'] = data['nameOrig'].map(data['nameOrig'].value_counts())
    data['nameDest'] = data['nameDest'].map(data['nameDest'].value_counts())
    
    input_data = data[features]
   
    input_data = input_data.dropna()
   
    # print("Reordered data columns:", input_data.columns)
    
    if input_data.empty: # Check if there are rows remaining after dropping missing values
        return "No valid data available for prediction after removing missing values", 400
    
    standardized_data = pd.DataFrame(scaler.transform(input_data), columns=features)  # Standardize the data

    predictions = model.predict(standardized_data)
    
    data['Prediction'] = predictions # Add predictions to the original data
    
    results = data.to_json(orient="records") # Convert predictions to a JSON format
    return results

if __name__ == '__main__':
    app.run(debug=True)
