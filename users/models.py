from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    ROLE_CHOICES = [
        ("ADMIN", "Admin"),
        ("RESIDENT", "Resident"),
        ("WATCHMAN", "Watchman"),
        ("INCHARGE", "Incharge"),
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


class Resident(models.Model):

    resident_id = models.AutoField(primary_key=True)

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="resident_profile",
    )

    apartment_number = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.username} - {self.apartment_number}"


class Watchman(models.Model):

    guard_id = models.AutoField(primary_key=True)

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="watchman_profile",
    )

    badge_number = models.CharField(max_length=50, unique=True)
    shift = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.username} - {self.badge_number}"


class Incharge(models.Model):

    incharge_id = models.AutoField(primary_key=True)

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="incharge_profile",
    )

    designation = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.username} - {self.designation}"