import time
from transformers import pipeline

class ModerationModel:
    def __init__(self):
        print("Initializing Toxic-BERT Moderation Model...", flush=True)
        self.classifier = pipeline("text-classification", model="unitary/toxic-bert", top_k=None)

    def evaluate(self, text: str):
        start_time = time.time()
        
        results = self.classifier(text)[0]
        
        scores = {item['label']: item['score'] for item in results}
        
        toxicity = scores.get('toxic', 0.0)
        severe_insult = scores.get('severe_toxic', 0.0)
        harassment = scores.get('identity_hate', 0.0)
        threat = scores.get('threat', 0.0)
        
        max_score = max(toxicity, severe_insult, harassment, threat)
        
        if max_score < 0.1:
            action = "ALLOW"
        elif max_score <= 0.99:
            action = "FLAG"
        else:
            action = "BLOCK"
            
        elapsed_ms = (time.time() - start_time) * 1000
        print(f"[Model] Inference completed in {elapsed_ms:.2f}ms", flush=True)

        return {
            "toxicityScore": round(toxicity, 3),
            "severeInsultScore": round(severe_insult, 3),
            "harassmentScore": round(harassment, 3),
            "threatScore": round(threat, 3),
            "explainingTokens": "toxic-bert-inference",
            "action": action
        }
