# journalmedia/views.py
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import JournalImage
from .serializers import JournalImageSerializer
from journal.models import JournalEntry

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_journal_images(request):
    journal_id = request.data.get("journal")
    files = request.FILES.getlist("images")
    captions = request.data.getlist("captions")  # ✅ Receive captions as list

    print(f"Received journal_id: {journal_id}")
    print(f"Received files: {[f.name for f in files]}")
    print(f"Received captions: {captions}")

    if not journal_id or not files:
        return Response({"error": "Missing journal ID or images"}, status=400)

    try:
        journal = JournalEntry.objects.get(id=journal_id)
    except JournalEntry.DoesNotExist:
        return Response({"error": "Journal not found"}, status=404)

    saved_images = []
    for i, img in enumerate(files):
        caption = captions[i] if i < len(captions) else ""  # ✅ Match caption
        ji = JournalImage.objects.create(journal=journal, image=img, caption=caption)
        saved_images.append(JournalImageSerializer(ji).data)

    return Response({"message": "Images uploaded successfully", "images": saved_images})

@api_view(["DELETE"])
def delete_journal_image(request, image_id):
    try:
        image = JournalImage.objects.get(id=image_id)
        image.delete()
        return Response({"message": "Image deleted successfully"})
    except JournalImage.DoesNotExist:
        return Response({"error": "Image not found"}, status=404)
    
@api_view(["PATCH"])
def update_journal_image_caption(request, image_id):
    print(request.data)
    new_caption = request.data.get("caption", "")
    try:
        image = JournalImage.objects.get(id=image_id)
        image.caption = new_caption
        image.save()
        return Response({"message": "Caption updated successfully"})
    except JournalImage.DoesNotExist:
        return Response({"error": "Image not found"}, status=404)

