from django.urls import path
from .views import upload_journal_images,delete_journal_image,update_journal_image_caption

urlpatterns = [
    path("upload-images/", upload_journal_images, name="upload-journal-images"),
    path("delete-image/<int:image_id>/", delete_journal_image, name="delete-journal-image"),
     path("update-caption/<int:image_id>/", update_journal_image_caption), 
]
