""" Download pretrained models from keras
"""
import os
from keras.applications.inception_v3 import InceptionV3
from keras.applications.mobilenet import MobileNet
from keras.applications.mobilenet_v2 import MobileNetV2
from keras.layers import Input

def download_inception_model():
    """ Download inception v3 model from keras
    """
    print('Downloading inception_v3 keras model')
    model = InceptionV3(weights='imagenet', input_tensor=Input(shape=(224, 224, 3)))
    model.save('keras_models/inception_v3.h5')
    print('Finished Downloading inception_v3 keras model')

def download_mobilenet_model():
    """ Download mobilenet model from keras
    """
    print('Downloading MobileNet keras model')
    model = MobileNet(weights='imagenet', input_tensor=Input(shape=(224, 224, 3)))
    model.save('keras_models/mobilenet.h5')
    print('Finished Downloading MobileNet keras model')

def download_mobilenet_v2_model():
    """ Download mobilenet_v2 model from keras
    """
    print('Downloading MobileNetV2 keras model')
    model = MobileNetV2(weights='imagenet', input_tensor=Input(shape=(224, 224, 3)))
    model.save('keras_models/mobilenet_v2.h5')
    print('Finished Downloading MobileNetV2 keras model')

if __name__ == '__main__':
    if not os.path.isfile('keras_models/inception_v3.h5'):
        download_inception_model()
    if not os.path.isfile('keras_models/mobilenet.h5'):
        download_mobilenet_model()
    if not os.path.isfile('keras_models/mobilenet_v2.h5'):
        download_mobilenet_v2_model()
