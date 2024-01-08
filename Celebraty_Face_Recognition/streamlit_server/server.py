from flask import Flask, request, jsonify
from flask_cors import CORS
import util

app = Flask(__name__)
CORS(app)
# @app.route('/')
# def home():
#     return 'Hello, this is the home page!'

@app.route('/classify_image', methods=['GET', 'POST'])
def classify_image():
    try:
        image_data = request.form['image_data']
        # print(f"Received image data from client: {image_data[:100]}...") 
        response_data = util.classify_image(image_data)

        response = jsonify(response_data)
        response.headers.add('Access-Control-Allow-Origin', '*')

        return response
    except Exception as e:
        print(f"An error occurred in classify_image function: {e}")
        return jsonify([])

if __name__ == "__main__":
    print("Starting Python Flask Server For Sports Celebrity Image Classification")
    util.load_saved_artifacts()
    app.run(port=5000)