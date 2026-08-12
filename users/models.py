from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ("ADMIN", "Admin"),
        ("RESIDENT", "Resident"),
        ("WATCHMAN", "Watchman"),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="RESIDENT",
    )

    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)

    def __str__(self):
        return self.username