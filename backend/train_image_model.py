import tensorflow as tf
from image_model import build_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

# Assume you have directory structure:
# data/
#   train/
#     clear/
#     turbid/
#     algae_bloom/
#   val/
#     clear/
#     turbid/
#     algae_bloom/

IMG_SIZE = (224, 224)
BATCH = 32
NUM_CLASSES = 3

train_gen = ImageDataGenerator(rescale=1./255, horizontal_flip=True, rotation_range=15)
val_gen = ImageDataGenerator(rescale=1./255)

train_ds = train_gen.flow_from_directory(
    "data/train", target_size=IMG_SIZE, batch_size=BATCH, class_mode="categorical"
)
val_ds = val_gen.flow_from_directory(
    "data/val", target_size=IMG_SIZE, batch_size=BATCH, class_mode="categorical"
)

model = build_model(num_classes=NUM_CLASSES)
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
model.fit(train_ds, validation_data=val_ds, epochs=10)

# Optionally unfreeze some layers and fine-tune
base = model.layers[1]
base.trainable = True
model.compile(optimizer=tf.keras.optimizers.Adam(1e-5), loss="categorical_crossentropy", metrics=["accuracy"])
model.fit(train_ds, validation_data=val_ds, epochs=5)

model.save("image_classifier")
