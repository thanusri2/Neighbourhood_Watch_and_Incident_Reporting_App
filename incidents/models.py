from django.db import models
from users.models import User, Watchman, Incharge


class IncidentCategory(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(
        max_length=100,
        unique=True
    )

    class Meta:
        db_table = "incident_categories"

    def __str__(self):
        return self.category_name


class Incident(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("ASSIGNED", "Assigned"),
        ("UNDER_INVESTIGATION", "Under Investigation"),
        ("RESOLVED", "Resolved"),
        ("CLOSED", "Closed"),
    ]

    incident_id = models.AutoField(primary_key=True)

    resident = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reported_incidents",
        limit_choices_to={"role": "RESIDENT"},
    )

    category = models.ForeignKey(
        IncidentCategory,
        on_delete=models.PROTECT,
        related_name="incidents",
    )

    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="PENDING",
    )

    reported_date = models.DateTimeField(auto_now_add=True)

    location = models.CharField(
        max_length=150,
        blank=True
    )

    class Meta:
        db_table = "incidents"

    def __str__(self):
        return self.title


class Evidence(models.Model):
    evidence_id = models.AutoField(primary_key=True)

    incident = models.ForeignKey(
        Incident,
        on_delete=models.CASCADE,
        related_name="evidence",
    )

    image_path = models.CharField(max_length=255)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evidence - {self.incident.title}"


class IncidentAssignment(models.Model):
    assignment_id = models.AutoField(primary_key=True)

    incident = models.ForeignKey(
        Incident,
        on_delete=models.CASCADE,
        related_name="assignments",
    )

    guard = models.ForeignKey(
        Watchman,
        on_delete=models.CASCADE,
        related_name="assignments",
    )

    assigned_by = models.ForeignKey(
        Incharge,
        on_delete=models.CASCADE,
        related_name="assigned_incidents",
    )

    assigned_date = models.DateTimeField(auto_now_add=True)
    progress = models.IntegerField(default=0)

    def __str__(self):
        return (
            f"{self.incident.title} → "
            f"{self.guard.user.username}"
        )