"""
Convert keras model to tf serving file
"""
import tensorflow as tf
import argparse
import os

def export_model(model_name):
    """ Export keras model to tensorflow servable format
    Args:
        model_name: file name of the keras model
    """
    print('Exporting {}'.format(model_name))
    tf.keras.backend.set_learning_phase(0)

    model = tf.keras.models.load_model('keras_models/{}'.format(model_name))
    version_number = 1
    export_path = 'serving_model/{}/{}/'.format(os.path.splitext(model_name)[0], version_number)

    with tf.keras.backend.get_session() as sess:
        tf.saved_model.simple_save(
            sess,
            export_path,
            inputs={'input_image': model.input},
            outputs={t.name: t for t in model.outputs})
    print('Finished exporting {}'.format(model_name))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Export keras model to tf serving')
    parser.add_argument('--keras_model_file', default='', type=str, help='model file name')
    args = parser.parse_args()

    export_model(args.keras_model_file)
