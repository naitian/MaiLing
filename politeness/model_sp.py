
import sys
import os
import pickle

"""
This file provides an interface to
a pre-trained politeness SVM.
"""

#####
# Ensure the proper python dependencies exist

try:
    import numpy as np
except:
    sys.stderr.write("Package not found: Politeness model requires python package numpy\n")
    sys.exit(2)

try:
    import scipy
    from scipy.sparse import csr_matrix
except:
    sys.stderr.write("Package not found: Politeness model requires python package scipy\n")
    sys.exit(2)

try:
    import sklearn
except:
    sys.stderr.write("Package not found: Politeness model requires python package scikit-learn\n")
    sys.exit(2)

try:
    import nltk
except:
    sys.stderr.write("Package not found: Politeness model requires python package nltk\n")
    sys.exit(2)

####

from .features.vectorizer import PolitenessFeatureVectorizer


####
# Serialized model filename

MODEL_FILENAME = os.path.join(os.path.split(__file__)[0], 'politeness-svm.p')

####
# Load model, initialize vectorizer

clf = pickle.load(open(MODEL_FILENAME, 'rb'), encoding='latin1', fix_imports=True)
vectorizer = PolitenessFeatureVectorizer()

def score(request):
    """
    :param request - The request document to score
    :type requests - list of dict with 'text' field
        sample --
        {
            'text': [
                "Have you found the answer for your question? If yes would you please share it?"
            ],
        }

    returns class probabilities as a dict
        {
            'polite': float,
            'impolite': float
        }
    """
    # vectorizer returns {feature-name: value} dict
    features = vectorizer.features(request)
    fv = [features[f] for f in sorted(features.keys())]
    # Single-row sparse matrix
    X = csr_matrix(np.asarray([fv]))
    probs = clf.predict_proba(X)
    # Massage return format
    probs = {"polite": probs[0][1], "impolite": probs[0][0]}
    return probs


if __name__ == "__main__":

    """
    Sample classification of requests
    """

    from test_documents_sp import TEST_DOCUMENTS
    acc = 0
    TEST_DOCUMENTS = PolitenessFeatureVectorizer.preprocess(TEST_DOCUMENTS)
    for doc in TEST_DOCUMENTS:

        probs = score(doc)

        print("====================")
        print("Text: ", doc['text'])
        print("\tP(polite) = %.3f" % probs['polite'])
        print("\tP(impolite) = %.3f" % probs['impolite'])
        print("\n")



