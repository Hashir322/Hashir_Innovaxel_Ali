from django.db import models
import random
import string

class ShortURL(models.Model):
    original_url = models.URLField(max_length=1000)
    short_code = models.CharField(max_length=10, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    access_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.short_code} -> {self.original_url}"

    def save(self, *args, **kwargs):
        if not self.short_code:
            self.short_code = self.generate_short_code()
        super().save(*args, **kwargs)

    @staticmethod
    def generate_short_code():
        length = 6
        while True:
            code = ''.join(random.choices(string.ascii_letters + string.digits, k=length))
            if not ShortURL.objects.filter(short_code=code).exists():
                return code