"""
Visualize grad-cam of the test images
"""
from keras.applications import mobilenet
from keras.applications import inception_v3
from keras.applications import mobilenet_v2
from keras.layers import Input
from keras.preprocessing import image
from vis.visualization import visualize_cam
import cv2
import numpy as np
import os

"""
Load image and transform
Args:
    image_path -- path to image file
    model_parent_module -- the parent module of keras model that contains the
        model, preprocessing etc.
"""
def load_image(image_path, model_parent_module):
    img = image.load_img(image_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = model_parent_module.preprocess_input(x)

    return x

"""
Save a Grad-cam image of the given image and model for the target layer
Args:
    model -- keras model
    model_parent_module -- the upper module that has the model
    model_name -- a name for the model
    target_layer -- target layer to visualize
    image_path -- image path of the target image
"""
def grad_cam(model, model_parent_module, model_name, target_layer, image_path):
    model.summary()
    img = load_image('test_images/pug.jpg', model_parent_module)
    predictions = model.predict(img)
    result = model_parent_module.decode_predictions(predictions)[0][0]
    print('Prediction: {} with score {}'.format(result[1], result[2]))
    predicted_class = np.argmax(predictions)
    layer_idx = [idx for idx, layer in enumerate(model.layers)
                 if layer.name == target_layer][0]
    heatmap = visualize_cam(model, layer_idx, [predicted_class], img)

    cv2.imwrite('visualize/{}_gradcam_{}'.format(model_name, os.path.basename(image_path)), heatmap)

if __name__ == '__main__':
    mobilenet_model = mobilenet.MobileNet(weights='imagenet', input_tensor=Input(shape=(224, 224, 3)))
    inception_model = inception_v3.InceptionV3(weights='imagenet', input_tensor=Input(shape=(224, 224, 3)))
    mobilenet_v2_model = mobilenet_v2.MobileNetV2(weights='imagenet', input_tensor=Input(shape=(224, 224, 3)))

    grad_cam(mobilenet_model, mobilenet, 'mobilenet', 'conv_preds', 'test_images/pug.jpg')
    # grad_cam(inception_model, inception_v3, 'inception_v3', 'conv2d_86', 'test_images/pug.jpg')
    grad_cam(mobilenet_v2_model, mobilenet_v2, 'mobilenet_v2', 'out_relu', 'test_images/pug.jpg')
