from django.contrib import admin
from .models import JournalImage
from django.utils.html import format_html

@admin.register(JournalImage)
class JournalImageAdmin(admin.ModelAdmin):
    list_display = ("journal", "thumbnail", "image")
    list_filter = ("journal",)
    search_fields = ("journal__journal_text",)

    def thumbnail(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="60" height="60" style="object-fit: cover;" />', obj.image.url)
        return "-"
    thumbnail.short_description = "Preview"
