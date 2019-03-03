import convokit
from politeness import model_sp as model
from politeness.features.vectorizer import PolitenessFeatureVectorizer


def format_draft(draft, email_addr):
    return convokit.Utterance(id=1, user=email_addr, root=1, reply_to=None, text=draft)


def score_draft(draft, email_addr="ben@example.com"):
    utterance = format_draft(draft, email_addr)
    corpus = convokit.Corpus(utterances=[utterance])
    document = PolitenessFeatureVectorizer.preprocess([{'text': utterance.text}])[0]
    politeness = model.score(document)
    print(politeness)


score_draft("Hello, how are you doing?")
