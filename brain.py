import convokit
from politeness import model_sp as model
from politeness.features.vectorizer import PolitenessFeatureVectorizer


def format_draft(draft, email_addr):
    return convokit.Utterance(id=1, user=email_addr, root=1, reply_to=None, text=draft)


def rescale(politeness):
    max_politeness = .9
    pol = min(politeness['polite'], max_politeness)
    pol = (pol + (1 - max_politeness) / 2) / ((max_politeness + 1) / 2)
    impol = 1 - pol
    return {'polite': pol, 'impolite': impol}


def score_draft(draft, email_addr="ben@example.com"):
    utterance = format_draft(draft, email_addr)
    corpus = convokit.Corpus(utterances=[utterance])
    ps = convokit.PolitenessStrategies(corpus)
    indicators = ps[utterance.id]
    # document = PolitenessFeatureVectorizer.preprocess([{'text': utterance.text}])[0]
    # politeness = rescale(model.score(document))
    return {
        # 'score': politeness,
        'indicators': indicators
    }
