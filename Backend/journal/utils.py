from transformers import pipeline

emotion_classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=None
)

def analyze_journal(journal_text, score_threshold=0.1):
    sentence_emotions = []
    aggregated_scores = {}

    sentences = journal_text.split(".")

    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue

        emotion_scores = emotion_classifier(sentence)[0]
        sentence_top = max(emotion_scores, key=lambda x: x['score'])

        sentence_emotions.append({
            "sentence": sentence,
            "top_emotion": sentence_top["label"],
            "top_score": round(sentence_top["score"], 4)
        })

        for emo in emotion_scores:
            label = emo["label"]
            score = emo["score"]
            aggregated_scores[label] = aggregated_scores.get(label, 0) + score

    total = sum(aggregated_scores.values())
    normalized_scores = {
        label: round(score / total, 4)
        for label, score in aggregated_scores.items()
    }

    sorted_emotions = sorted(normalized_scores.items(), key=lambda x: x[1], reverse=True)

    top_emotion = sorted_emotions[0][0]
    representative_sentences = [
        item["sentence"] for item in sentence_emotions
        if item["top_emotion"] == top_emotion
    ]

    return {
        "sorted_emotions": sorted_emotions[:3],
        "top_emotion_sentences": ". ".join(representative_sentences),
    }
    