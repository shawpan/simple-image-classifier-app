# Start tensorflow serving
docker run -p 8501:8501 \
     --mount type=bind,source="$(pwd)"/serving_model/,target=/models \
     --mount type=bind,source="$(pwd)"/models.config,target=/models/models.config \
     -t tensorflow/serving --model_config_file=/models/models.config &

# Start flask api_server
FLASK_APP=api_server/image_classifier_api.py flask run --host=0.0.0.0 &

# Start front app
python -m http.server 7777 &
