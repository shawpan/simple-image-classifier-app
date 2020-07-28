""" Methods to pre process image before sending to predict api
"""
import base64
import numpy as np
import os
import sys
import json
from io import BytesIO
from keras.preprocessing import image
from keras.applications import inception_v3
from keras.applications import mobilenet
from keras.applications import mobilenet_v2

def get_config():
    """
    Get configurations, raises error if config.json is not present
    Returns:
        CONFIG dictionary
    """
    with open(os.path.join(sys.path[0], 'config.json'), 'r') as f:
        return json.load(f)

def validate_input_image(request):
    """ Validate input image
    Args:
        request: http request object
    Returns:
        a triple of (success, message, img)
    """
    img = None
    if 'input_image' in request.files:
        img = request.files.get('input_image')
        try:
            img = base64.b64encode(img.read())
        except Exception as e:
            img = None
    elif 'input_image' in request.form:
        img = request.form.get('input_image', None)

    # if img is None then input_image is missing
    if img is None:
        return False, 'Missing input_image', False

    try:
        img = get_transformed_image(img)
    except Exception as e:
        return False, 'Can not transform input_image', img

    return True, 'Valid input_image', img

def get_transformed_image(img):
    """ Transform image e.g, convert format, normalize etc.
    Args:
        img: Raw image data
    Returns:
        Tensorflow model compliant input image
    """
    img = BytesIO(base64.b64decode(img))
    img = image.load_img(img, target_size=(224, 224))
    img = image.img_to_array(img) / 255.

    return img.tolist()

def transform_predictions_to_api_response(predictions, model_name):
    """ Transform predictions into readable response
    Args:
        predictions: prediction object from tensorflow
        model_name: name of the model used for this predictions
    Returns:
        transformed result object as array
    """
    decoded_predictions = {}
    if model_name == 'inception_v3':
        decoded_predictions = inception_v3.decode_predictions(np.array(predictions['predictions']))[0]
    elif model_name == 'mobilenet':
        decoded_predictions = mobilenet.decode_predictions(np.array(predictions['predictions']))[0]
    elif model_name == 'mobilenet_v2':
        decoded_predictions = mobilenet_v2.decode_predictions(np.array(predictions['predictions']))[0]

    result = []
    for prediction in decoded_predictions:
        result.append({
            'label': prediction[1],
            'score': prediction[2]
        })

    return result
