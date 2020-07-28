import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

import api_helper

app = Flask(__name__)
CORS(app)

CONFIG = api_helper.get_config()

@app.route('/image_classifier/predict', methods=['POST'])
def image_classifier():
    model_name = request.args.get('model_name', 'inception_v3')
    is_valid_input, response, img = api_helper.validate_input_image(request)

    if not is_valid_input:
        return jsonify(success=False, errors = { 'message': response })

    payload = {
        "instances": [{'input_image': img}]
    }

    try:
        r = requests.post(CONFIG['prediction_api'].format(model_name), json=payload)
        pred = json.loads(r.content.decode('utf-8'))
        result = api_helper.transform_predictions_to_api_response(pred, model_name)
    except Exception as e:
        return jsonify(success=False, errors = { 'message': 'Error in prediction module'})

    return jsonify({ 'result': result, 'model': model_name })
