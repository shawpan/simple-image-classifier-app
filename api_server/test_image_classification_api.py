import pytest
import json
import base64
from image_classifier_api import app
from flask import json

def test_image_classifier_route():
    response = app.test_client().post(
        '/image_classifier/predict',
        data = json.dumps({ 'model_name': 'inception_v3', 'input_image': None })
    )
    assert response.status_code == 200
