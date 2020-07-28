import argparse
import base64

import requests

parser = argparse.ArgumentParser(description='Example api usage')
parser.add_argument('--model_name', default='inception_v3', type=str, help='model file name')
args = parser.parse_args()

API_ENDPOINT = "http://0.0.0.0:5000/image_classifier/predict?model_name={}".format(args.model_name)

# defining the api-endpoint
image_path = 'test_images/pug.jpg'
b64_image = ""
with open(image_path, "rb") as imageFile:
    b64_image = base64.b64encode(imageFile.read())

data = {'input_image': b64_image}

r = requests.post(url=API_ENDPOINT, data=data)

print("{}".format(r.text))
