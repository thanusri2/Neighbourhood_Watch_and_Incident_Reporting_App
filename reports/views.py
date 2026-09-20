from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Report
from incidents.models import Incident
from users.models import User

import json

@csrf_exempt
def create_report(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST method is allowed"},
            status=405
        )
    try:
        data = json.loads(request.body)

        incident_id = data.get("incident_id")
        submitted_by_id = data.get("submitted_by_id")
        report_details = data.get("report_details")

        if not incident_id or not submitted_by_id or not report_details:
            return JsonResponse({
                "error": (
                    "incident_id, submitted_by_id and "
                    "report_details are required"
                )
            }, status=400)

        try:
            incident = Incident.objects.get(
                incident_id=incident_id
            )
        except Incident.DoesNotExist:
            return JsonResponse({
                "error": "Incident not found"
            }, status=404)

        try:
            user = User.objects.get(
                id=submitted_by_id
            )
        except User.DoesNotExist:
            return JsonResponse({
                "error": "User not found"
            }, status=404)

        report = Report.objects.create(
            incident=incident,
            submitted_by=user,
            report_details=report_details,
            status="SUBMITTED",
        )
        return JsonResponse({
            "message": "Report submitted successfully",
            "report_id": report.report_id,
            "incident_id": incident.incident_id,
            "submitted_by": user.username,
            "report_details": report.report_details,
            "status": report.status,
        }, status=201)
    except json.JSONDecodeError:
        return JsonResponse({
            "error": "Invalid JSON"
        }, status=400)
@csrf_exempt
def reports_list(request):

    if request.method != "GET":
        return JsonResponse(
            {"error": "Only GET method is allowed"},
            status=405
        )

    reports = Report.objects.select_related(
        "incident",
        "submitted_by",
    ).order_by("-submitted_date")

    data = []

    for report in reports:
        data.append({
            "report_id": report.report_id,
            "incident_id": report.incident.incident_id,
            "incident_title": report.incident.title,
            "submitted_by": report.submitted_by.username,
            "report_details": report.report_details,
            "status": report.status,
            "submitted_date": report.submitted_date,
        })

    return JsonResponse(data, safe=False)
