from django.db import models
from users.models import User
from incidents.models import Incident


class Report(models.Model):

    report_id = models.AutoField(primary_key=True)

    incident = models.ForeignKey(
        Incident,
        on_delete=models.CASCADE,
        related_name="reports",
    )

    submitted_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="submitted_reports",
    )

    report_details = models.TextField()

    submitted_date = models.DateTimeField(
        auto_now_add=True
    )

    status = models.CharField(
        max_length=30,
        default="SUBMITTED"
    )

    def __str__(self):
        return f"Report - {self.incident.title}"