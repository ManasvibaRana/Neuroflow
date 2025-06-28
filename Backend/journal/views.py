from rest_framework.response import Response
from .models import JournalEntry,User
from .utils import analyze_journal
from datetime import date
from rest_framework.decorators import api_view
from rest_framework.response import Response



@api_view(["POST"])
def analyze_journal_only(request):
    journal_text = request.data.get("text", "")
    if not journal_text:
        return Response({"error": "No journal text provided."}, status=400)

    analysis = analyze_journal(journal_text)
    emotions = analysis["sorted_emotions"]

    return Response({
        "top_emotions": emotions,
        "highlight": analysis["top_emotion_sentences"]
    })

@api_view(["POST"])
def save_journal(request):
    userid = request.data.get("userid")  # 👈 from frontend
    journal_text = request.data.get("text")
    analysis = request.data.get("analysis")

    if not userid or not journal_text or not analysis:
        return Response({"error": "Missing required data."}, status=400)

    try:
        user = User.objects.get(userid=userid)  # ✅ Use your custom field
    except User.DoesNotExist:
        return Response({"error": "Invalid user ID."}, status=401)

    emotions = analysis["top_emotions"]
    highlight = analysis["highlight"]

    JournalEntry.objects.create(
        user=user,
        date=date.today(),
        journal_text=journal_text,
        emotion_1=emotions[0][0], score_1=emotions[0][1],
        emotion_2=emotions[1][0] if len(emotions) > 1 else None,
        score_2=emotions[1][1] if len(emotions) > 1 else None,
        emotion_3=emotions[2][0] if len(emotions) > 2 else None,
        score_3=emotions[2][1] if len(emotions) > 2 else None,
        top_emotion_sentences=highlight
    )

    return Response({ "message": "Journal saved successfully." })