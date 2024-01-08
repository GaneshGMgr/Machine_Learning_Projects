import joblib
import json
import numpy as np
import base64
import cv2
import os
from wavelet import w2d

__class_name_to_number = {}
__class_number_to_name = {}

__model = None

def classify_image(image_base64_data, file_path=None):
    try:
        # # Debugging: Print information about the loaded image
        # if file_path:
        #     # Convert to absolute path based on script's location
        #     file_path = os.path.join(os.path.dirname(__file__), file_path)
        #     print(f"Attempting to load image from file: {file_path}")
        # elif image_base64_data:
        #     print("Attempting to load image from base64 data")
        #     # Debugging: Print the received image data
        #     print(f"Received image data  from client  side is : {image_base64_data[:50]}...")

        # Image Preprocessing:
        imgs = get_cropped_image_if_2_eyes(file_path, image_base64_data)

        # print(f"Number of images obtained from preprocessing: {len(imgs)}")

        result = []
        for img in imgs:
            try:
                # print(f"Processing image with shape: {img.shape}")

                scalled_raw_img = cv2.resize(img, (32, 32))
                img_har = w2d(img, 'db1', 5)
                scalled_img_har = cv2.resize(img_har, (32, 32))
                combined_img = np.vstack((scalled_raw_img.reshape(32 * 32 * 3, 1), scalled_img_har.reshape(32 * 32, 1)))

                len_image_array = 32 * 32 * 3 + 32 * 32

                final = combined_img.reshape(1, len_image_array).astype(float)
                prediction = __model.predict(final)[0]
                probability = np.around(__model.predict_proba(final) * 100, 2).tolist()[0]

                result.append({
                    'class': class_number_to_name(prediction),
                    'class_probability': probability,
                    'class_dictionary': __class_name_to_number
                })
            except Exception as e_inner:
                print(f"An error occurred while processing an image: {e_inner}")

        # # Print the result in the terminal
        # for res in result:
        #     try:
        #         print(res)
        #     except Exception as e_outer:
        #         print(f"An error occurred while printing the result: {e_outer}")

        return result

    except Exception as e:
        print(f"An error occurred in the classify_image function: {e}")
        return []


def class_number_to_name(class_num):
    return __class_number_to_name[class_num]

def load_saved_artifacts():
    print("loading saved artifacts...start")
    global __class_name_to_number
    global __class_number_to_name

    with open("artifacts/class_dictionary.json", "r") as f:
        __class_name_to_number = json.load(f)
        __class_number_to_name = {v:k for k,v in __class_name_to_number.items()}

    global __model
    if __model is None:
        with open('artifacts/saved_model.pkl', 'rb') as f:
            __model = joblib.load(f)
    print("loading saved artifacts...done")


def get_cv2_image_from_base64_string(b64str):
    # print(f"Received image data  for encoding : {b64str[:50]}...")

    '''
    credit: https://stackoverflow.com/questions/33754935/read-a-base-64-encoded-image-from-memory-using-opencv-python-library
    :param uri:
    :return:
    '''
    encoded_data = b64str.split(',')[1]
    nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # print(f"Type of img: {type(img)}")
    # print(f"Shape of img: {img.shape}")
    # print(f"Data img: {img}")

    return img

def get_cropped_image_if_2_eyes(image_path, image_base64_data):
    face_cascade = cv2.CascadeClassifier('opencv/haarcascades/haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier('opencv/haarcascades/haarcascade_eye.xml')

    faces = []
    if image_path:
        img = cv2.imread(image_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
    else:
        img = get_cv2_image_from_base64_string(image_base64_data)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
        # print(f"Type of img: {type(img)}")
        # print(f"Shape of img: {img.shape}")
        # print(f"Data img: {img}")

    cropped_faces = []
    for (x, y, w, h) in faces:
        roi_gray = gray[y:y + h, x:x + w]
        roi_color = img[y:y + h, x:x + w]
        eyes = eye_cascade.detectMultiScale(roi_gray)

        if len(eyes) >= 2:
            cropped_faces.append(roi_color)

    return cropped_faces


def get_b64_test_image_for_virat():
    with open("b64.txt") as f:
        return f.read()

if __name__ == '__main__':
    load_saved_artifacts()
    # checking the model
    
    # print(classify_image(get_b64_test_image_for_virat(), None))

    # print(classify_image(None, "test_images/federer2.jpg"))
    # print(classify_image(None, "test_images/virat1.jpg"))
    # print(classify_image(None, "test_images/virat2.jpg"))
    # print(classify_image(None, "test_images/virat3.jpg")) # Inconsistent result could be due to https://github.com/scikit-learn/scikit-learn/issues/13211
    # print(classify_image(None, "test_images/serena1.jpg"))
    # print(classify_image(None, "test_images/serena2.jpg"))
    # print(classify_image(None, "test_images/sharapova1.jpg"))
