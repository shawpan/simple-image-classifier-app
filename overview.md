# Installation
[setup.md] https://github.com/shawpan/image-classifier-app/blob/master/setup.md describes setup instructions.

# Basic ideas
**1. pros/cons**
Application consists of three main components.
1. Tensorflow Model server in docker to run the prediction models. This separates the inference from the api server (flask).
2. An api server to prepare data/payload to feed to the prediction model and serve more customized response to the consumer i.e., front app
3. a simple ui to upload image and show the prediction result.

Additionally, there are a two python scripts to download keras models and export them as tensorflow servables.  

**3. Future steps **

1. Separate the three components to micro-services and app.
2. Adding more tests (unit and integration).
3. Prepare scripts for latency and throughput benchmarking.
4. Organize Grad-cam visualization in a way to better interpret the different layers(not just the last one) respect to the original image and class label. e.g, in a jupyter notebook

**Others**

`python visualize/grad_cam.py` generates the Grad-cam heatmaps for all three models and saves as files in the `visualize` directory.

`python example.py --model_name={model_name}` can be used to test the api using command line.
