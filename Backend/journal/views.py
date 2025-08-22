from rest_framework.response import Response
from .models import JournalEntry,User
from .utils import analyze_journal
from datetime import date
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.timezone import now
from journalmedia.models import JournalImage
from journalmedia.serializers import JournalImageSerializer
from django.utils.timezone import localdate
from users.utils import update_streak

from django.utils.dateparse import parse_date

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
    userid = request.data.get("userid")
    journal_text = request.data.get("text")
    analysis = request.data.get("analysis")

    if not userid or not journal_text or not analysis:
        return Response({"error": "Missing required data."}, status=400)

    try:
        user = User.objects.get(userid=userid)
    except User.DoesNotExist:
        return Response({"error": "Invalid user ID."}, status=401)

    today = localdate()
    journal = JournalEntry.objects.filter(user=user, date=today).first()

    emotions = analysis["top_emotions"]
    highlight = analysis["highlight"]

    if journal:
        # Update existing
        journal.journal_text = journal_text
        journal.emotion_1 = emotions[0][0]
        journal.score_1 = emotions[0][1]
        journal.emotion_2 = emotions[1][0] if len(emotions) > 1 else None
        journal.score_2 = emotions[1][1] if len(emotions) > 1 else None
        journal.emotion_3 = emotions[2][0] if len(emotions) > 2 else None
        journal.score_3 = emotions[2][1] if len(emotions) > 2 else None
        journal.top_emotion_sentences = highlight
        journal.save()
        message = "Journal updated successfully."

    else:
        # Create new
        journal = JournalEntry.objects.create(
            user=user,
            date=today,
            journal_text=journal_text,
            emotion_1=emotions[0][0], score_1=emotions[0][1],
            emotion_2=emotions[1][0] if len(emotions) > 1 else None,
            score_2=emotions[1][1] if len(emotions) > 1 else None,
            emotion_3=emotions[2][0] if len(emotions) > 2 else None,
            score_3=emotions[2][1] if len(emotions) > 2 else None,
            top_emotion_sentences=highlight
        )
        message = "Journal saved successfully."

    # 1. Activate the streak logic after any save or update.
    update_streak(user)

    # 2. Return the current streak in the response.
    return Response({
        "message": message,
        "journal_id": journal.id,
        "current_streak": user.streak  # Add this line
    })

@api_view(["GET"])
def get_today_journal(request, userid):
    try:
        user = User.objects.get(userid=userid)
    except User.DoesNotExist:
        return Response({"error": "Invalid user ID."}, status=401)

    today = now().date()
    print(today)
    journal = JournalEntry.objects.filter(user=user, date=today).first()

    if not journal:
        return Response({"message": "No journal for today."}, status=404)

    images = JournalImage.objects.filter(journal=journal)
    image_data = JournalImageSerializer(images, many=True).data

    return Response({
        "journal_id": journal.id,
        "text": journal.journal_text,
        "top_emotions": [
            [journal.emotion_1, journal.score_1],
            [journal.emotion_2, journal.score_2],
            [journal.emotion_3, journal.score_3],
        ],
        "highlight": journal.top_emotion_sentences,
        "images": image_data  # 👈 send images
    })


@api_view(["GET"])
def get_journal_history(request, userid, date_str):
    try:
        user = User.objects.get(userid=userid)
    except User.DoesNotExist:
        return Response({"error": "Invalid user ID or username."}, status=401)

    selected_date = parse_date(date_str)
    if not selected_date:
        return Response({"error": "Invalid date format in URL, expected YYYY-MM-DD"}, status=400)

    # Use prefetch_related for a more efficient database query
    journal = JournalEntry.objects.prefetch_related('images').filter(user=user, date=selected_date).first()
    
    if not journal:
        return Response({"message": "No journal found for this date."}, status=404)

    # V V V THIS IS THE NEW PART V V V
    # Get the images that were efficiently fetched with prefetch_related
    images = journal.images.all()
    image_data = JournalImageSerializer(images, many=True).data

    # Now, we build the final response including the image data
    return Response({
        "id": journal.id,
        "created_at": journal.created_at,
        "text": journal.journal_text,
        "emotion_emoji": journal.emotion_1,
        "theme": journal.emotion_1,
        "images": image_data  # <-- And add the images here
    })
