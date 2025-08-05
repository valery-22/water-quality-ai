import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
from PIL import Image
import io

# Load or build the transfer learning model (example MobileNetV2)
def build_model(num_classes=3):
    base = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3), include_top=False, weights="imagenet"
    )
    base.trainable = False  # fine-tune later if needed
    inputs = layers.Input(shape=(224, 224, 3))
    x = tf.keras.applications.mobilenet_v2.preprocess_input(inputs)
    x = base(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)
    model = models.Model(inputs, outputs)
    return model

# Load saved model (assumes saved as 'image_classifier')
def load_image_model():
    return tf.keras.models.load_model("image_classifier")

# Preprocess uploaded image bytes
def preprocess_image(image_bytes: bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))
    arr = np.array(img)
    return arr  # shape (224,224,3)

# Inference wrapper
def predict_image_quality(model, image_array: np.ndarray, class_names):
    inp = np.expand_dims(image_array, axis=0)  # batch
    probs = model.predict(inp)[0]
    idx = np.argmax(probs)
    confidence = float(probs[idx])
    label = class_names[idx]
    return label, confidence, probs.tolist()
