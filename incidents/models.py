from django.db import models


class IncidentCategory(models.Model):
    category_name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.category_name


class Incident(models.Model):

    STATUS_CHOICES = [
        ("REPORTED", "Reported"),
        ("ASSIGNED", "Assigned"),
        ("INVESTIGATING", "Investigating"),
        ("RESOLVED", "Resolved"),
        ("CLOSED", "Closed"),
    ]

    resident = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="reported_incidents",
        limit_choices_to={"role": "RESIDENT"},
    )

    # ADD THIS
    watchman = models.ForeignKey(
        "users.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_incidents",
        limit_choices_to={"role": "WATCHMAN"},
    )

    category = models.ForeignKey(
        IncidentCategory,
        on_delete=models.PROTECT,
        related_name="incidents",
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="REPORTED",
    )

    reported_date = models.DateTimeField(auto_now_add=True)

    location = models.CharField(max_length=255)

    def __str__(self):
        return self.title