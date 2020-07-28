# Setup

requires `python3.7` and `docker`

```
git clone https://github.com/shawpan/image-classifier-app.git
cd image-classifier-app
bash create_env.sh
source image_classifier_environment/bin/activate
bash setup.sh
```

it will install the required packages and prepare for starting

# Start the app

```
bash start_app.sh
```

it will run tensorflow_model_server in docker, api server and front app

**`model_name` can be one of `inception_v3`, `mobilenet` and `mobilenet_v2`**

Tensorflow model server:
[POST]
`http://localhost:8501/v1/models/{model_name}:predict`

Api server
[POST]
`http://0.0.0.0:5000/image_classifier/predict?model_name={model_name}`

with image file as `input_image` form data/binary

Front app:

`http://localhost:7777/front/`

# It will look like the following
https://github.com/shawpan/image-classifier-app/blob/master/sample.png

[sample]: https://github.com/shawpan/image-classifier-app/blob/master/sample.png "Sample Image"
