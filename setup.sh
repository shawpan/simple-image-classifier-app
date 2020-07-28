pip3 install -r requirements.txt

docker pull tensorflow/serving

mkdir keras_models
mkdir serving_model
python utility/download_keras_models.py
python utility/export_keras_to_tf_serving_model.py --keras_model_file=inception_v3.h5
python utility/export_keras_to_tf_serving_model.py --keras_model_file=mobilenet.h5
python utility/export_keras_to_tf_serving_model.py --keras_model_file=mobilenet_v2.h5
