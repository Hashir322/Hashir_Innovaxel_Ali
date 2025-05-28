from rest_framework import serializers
from .models import ShortURL

class ShortURLSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortURL
        fields = ['id', 'original_url', 'short_code', 'created_at', 'updated_at', 'access_count']
        read_only_fields = ['short_code', 'created_at', 'updated_at', 'access_count']

    def validate_original_url(self, value):
        """
        Validate that the URL is properly formatted
        """
        if not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("URL must start with http:// or https://")
        return value