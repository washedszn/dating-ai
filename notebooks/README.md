# Model Research Directory

This directory is dedicated to the exploration and development of model architectures. The insights gained from this research will inform the implementation of models within the extension.

## Key Principles

- **Client-Side Training**: All model training processes are executed on the client-side. Data utilized during training is exclusively collected by the user and retained on their device to ensure privacy and security.

## Research Areas

- **Bag-of-Trees for Textual Input Classification**: Leveraging ensemble tree methods to classify text inputs efficiently.
- **Decision Classifiers for Multiple Choice Inputs**: Utilizing decision trees or similar classifiers to handle inputs with multiple choice options.
- **Facial Matching**:
  - **Initial Concept**: Implementing face recognition to match and classify faces from profile pictures.
  - **Advanced Idea**: Developing a neural network capable of classifying faces extracted from profiles. Note: Given the computational demands, this may pose challenges for client-side training.

## Running Notebooks

If you'd like to run these notebooks yourself you'll need to download profile data you have collected yourself from the extension.

- **Data Collection**: Ensure you've downloaded the requisite profile data from your browser. This data serves as the foundation for all training and model development activities.