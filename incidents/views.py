from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Incident
from users.models import User

import json


@csrf_exempt
def incidents_list(request):

    if request.method != "GET":
        return JsonResponse(
            {"error": "Only GET method is allowed"},
            status=405
        )

    incidents = Incident.objects.select_related(
        "resident",
        "category",
        "watchman"
    ).all()

    data = []

    for incident in incidents:

        data.append({
            "id": incident.id,
            "title": incident.title,
            "description": incident.description,
            "category": incident.category.category_name,
            "resident": incident.resident.username,
            "status": incident.status,
            "location": incident.location,
            "reported_date": incident.reported_date,

            "watchman": (
                incident.watchman.username
                if incident.watchman
                else None
            ),
        })

    return JsonResponse(data, safe=False)


@csrf_exempt
def assign_watchman(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST method is allowed"},
            status=405
        )

    try:
        data = json.loads(request.body)

        incident_id = data.get("incident_id")
        watchman_id = data.get("watchman_id")

        if not incident_id or not watchman_id:
            return JsonResponse(
                {
                    "error": "incident_id and watchman_id are required"
                },
                status=400
            )

        # Get incident
        try:
            incident = Incident.objects.get(
                id=incident_id
            )
        except Incident.DoesNotExist:
            return JsonResponse(
                {"error": "Incident not found"},
                status=404
            )

        # Get watchman
        try:
            watchman = User.objects.get(
                id=watchman_id,
                role="WATCHMAN"
            )
        except User.DoesNotExist:
            return JsonResponse(
                {"error": "Watchman not found"},
                status=404
            )

        # Assign watchman
        incident.watchman = watchman

        # Change status
        incident.status = "ASSIGNED"

        incident.save()

        return JsonResponse({
            "message": "Watchman assigned successfully",
            "incident_id": incident.id,
            "incident_title": incident.title,
            "watchman": watchman.username,
            "status": incident.status,
        })

    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON"},
            status=400
        )