from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import (Incident,IncidentAssignment,IncidentCategory,Evidence,)
from users.models import User, Watchman, Incharge
from notifications.models import Notification

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
    ).prefetch_related(
        "assignments__guard__user"
    ).all()

    data = []

    for incident in incidents:

        assignment = incident.assignments.order_by(
            "-assigned_date"
        ).first()

        data.append({
            "id": incident.incident_id,
            "title": incident.title,
            "description": incident.description,
            "category": incident.category.category_name,
            "resident": incident.resident.username,
            "status": incident.status,
            "location": incident.location,
            "reported_date": incident.reported_date,

            "watchman": (
                assignment.guard.user.username
                if assignment
                else None
            ),

            "progress": (
                assignment.progress
                if assignment
                else 0
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
        incharge_id = data.get("incharge_id")

        if not incident_id or not watchman_id or not incharge_id:
            return JsonResponse(
                {
                    "error": (
                        "incident_id, watchman_id and "
                        "incharge_id are required"
                    )
                },
                status=400
            )
        try:
            incident = Incident.objects.get(
                incident_id=incident_id
            )
        except Incident.DoesNotExist:
            return JsonResponse(
                {"error": "Incident not found"},
                status=404
            )
        try:
            watchman_user = User.objects.get(
                id=watchman_id,
                role="WATCHMAN"
            )
        except User.DoesNotExist:
            return JsonResponse(
                {"error": "Watchman not found"},
                status=404
            )

        try:
            watchman = Watchman.objects.get(
                user=watchman_user
            )
        except Watchman.DoesNotExist:
            return JsonResponse(
                {"error": "Watchman profile not found"},
                status=404
            )
        try:
            incharge_user = User.objects.get(
                id=incharge_id,
                role="INCHARGE"
            )

            incharge = Incharge.objects.get(
                user=incharge_user
            )

        except User.DoesNotExist:
            return JsonResponse(
                {"error": "Incharge not found"},
                status=404
            )

        except Incharge.DoesNotExist:
            return JsonResponse(
                {"error": "Incharge profile not found"},
                status=404
            )
        assignment = IncidentAssignment.objects.create(
            incident=incident,
            guard=watchman,
            assigned_by=incharge,
            progress=0,
        )

        incident.status = "ASSIGNED"
        incident.save(update_fields=["status"])

        Notification.objects.create(
            user=watchman_user,
            message=(
                f"Incident #{incident.incident_id} - "
                f"{incident.title} has been assigned to you."
            ),
        )

        Notification.objects.create(
            user=incident.resident,
            message=(
                f"Your incident #{incident.incident_id} - "
                f"{incident.title} has been assigned to "
                f"{watchman_user.username}."
            ),
        )

        return JsonResponse({
            "message": "Watchman assigned successfully",

            "assignment_id": assignment.assignment_id,

            "incident_id": incident.incident_id,

            "incident_title": incident.title,

            "watchman": watchman.user.username,

            "incharge": incharge.user.username,

            "status": incident.status,

            "progress": assignment.progress,
        })

    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON"},
            status=400
        )

@csrf_exempt
def create_incident(request):

    if request.method != "POST":
        return JsonResponse({
            "error": "Only POST method is allowed"
        }, status=405)

    try:
        data = json.loads(request.body)

        resident_id = data.get("resident_id")
        category_id = data.get("category_id")
        title = data.get("title")
        description = data.get("description")
        location = data.get("location")

        if not resident_id or not category_id or not title:
            return JsonResponse({
                "error": (
                    "resident_id, category_id and "
                    "title are required"
                )
            }, status=400)

        # Get resident
        try:
            resident = User.objects.get(
                id=resident_id,
                role="RESIDENT"
            )
        except User.DoesNotExist:
            return JsonResponse({
                "error": "Resident not found"
            }, status=404)

        # Get category
        try:
            category = IncidentCategory.objects.get(
                category_id=category_id
            )
        except IncidentCategory.DoesNotExist:
            return JsonResponse({
                "error": "Category not found"
            }, status=404)

        # Create incident
        incident = Incident.objects.create(
            resident=resident,
            category=category,
            title=title,
            description=description or "",
            location=location or "",
            status="PENDING",
        )

        return JsonResponse({
            "message": "Incident reported successfully",

            "incident_id": incident.incident_id,

            "title": incident.title,

            "status": incident.status,

            "resident": resident.username,

            "category": category.category_name,
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({
            "error": "Invalid JSON"
        }, status=400)


# =========================================================
# WATCHMAN INCIDENTS
# =========================================================

@csrf_exempt
def watchman_incidents(request, watchman_id):

    if request.method != "GET":
        return JsonResponse(
            {"error": "Only GET method is allowed"},
            status=405
        )

    try:
        watchman = Watchman.objects.get(
            user_id=watchman_id
        )
    except Watchman.DoesNotExist:
        return JsonResponse(
            {"error": "Watchman not found"},
            status=404
        )

    assignments = IncidentAssignment.objects.filter(
        guard=watchman
    ).select_related(
        "incident",
        "incident__category",
        "incident__resident",
    ).order_by("-assigned_date")

    data = []

    for assignment in assignments:

        incident = assignment.incident

        data.append({
            "assignment_id": assignment.assignment_id,
            "incident_id": incident.incident_id,
            "title": incident.title,
            "description": incident.description,
            "category": incident.category.category_name,
            "location": incident.location,
            "status": incident.status,
            "progress": assignment.progress,
            "reported_date": incident.reported_date,
        })

    return JsonResponse(data, safe=False)

@csrf_exempt
def update_incident_progress(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST method is allowed"},
            status=405
        )

    try:
        data = json.loads(request.body)

        incident_id = data.get("incident_id")
        progress = data.get("progress")
        status = data.get("status")

        if incident_id is None or progress is None or not status:
            return JsonResponse({
                "error": (
                    "incident_id, progress and "
                    "status are required"
                )
            }, status=400)

        if progress < 0 or progress > 100:
            return JsonResponse({
                "error": "Progress must be between 0 and 100"
            }, status=400)

        try:
            incident = Incident.objects.get(
                incident_id=incident_id
            )
        except Incident.DoesNotExist:
            return JsonResponse({
                "error": "Incident not found"
            }, status=404)

        valid_statuses = [
            "ASSIGNED",
            "UNDER_INVESTIGATION",
            "RESOLVED",
            "CLOSED",
        ]

        if status not in valid_statuses:
            return JsonResponse({
                "error": "Invalid status"
            }, status=400)

        assignment = IncidentAssignment.objects.filter(
            incident=incident
        ).order_by("-assigned_date").first()

        if not assignment:
            return JsonResponse({
                "error": (
                    "Incident is not assigned "
                    "to any watchman"
                )
            }, status=400)

        previous_status = incident.status

        assignment.progress = progress

        assignment.save(
            update_fields=["progress"]
        )

        # Update incident status
        incident.status = status

        incident.save(
            update_fields=["status"]
        )

        if (
            status == "RESOLVED"
            and previous_status != "RESOLVED"
        ):

            Notification.objects.create(
                user=incident.resident,
                message=(
                    f"Your incident #{incident.incident_id} - "
                    f"{incident.title} has been resolved."
                ),
            )

        return JsonResponse({
            "message": (
                "Incident progress updated successfully"
            ),

            "incident_id": incident.incident_id,

            "title": incident.title,

            "status": incident.status,

            "progress": assignment.progress,
        })

    except json.JSONDecodeError:
        return JsonResponse({
            "error": "Invalid JSON"
        }, status=400)

@csrf_exempt
def add_evidence(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST method is allowed"},
            status=405
        )

    try:
        data = json.loads(request.body)

        incident_id = data.get("incident_id")
        image_path = data.get("image_path")

        if not incident_id or not image_path:
            return JsonResponse({
                "error": (
                    "incident_id and "
                    "image_path are required"
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

        evidence = Evidence.objects.create(
            incident=incident,
            image_path=image_path,
        )

        return JsonResponse({
            "message": "Evidence added successfully",

            "evidence_id": evidence.evidence_id,

            "incident_id": incident.incident_id,

            "image_path": evidence.image_path,
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({
            "error": "Invalid JSON"
        }, status=400)

@csrf_exempt
def evidence_list(request, incident_id):

    if request.method != "GET":
        return JsonResponse(
            {"error": "Only GET method is allowed"},
            status=405
        )

    try:
        incident = Incident.objects.get(
            incident_id=incident_id
        )
    except Incident.DoesNotExist:
        return JsonResponse({
            "error": "Incident not found"
        }, status=404)

    evidences = Evidence.objects.filter(
        incident=incident
    ).order_by("-uploaded_at")

    data = []

    for evidence in evidences:

        data.append({
            "evidence_id": evidence.evidence_id,

            "incident_id": incident.incident_id,

            "image_path": evidence.image_path,

            "uploaded_at": evidence.uploaded_at,
        })

    return JsonResponse(data, safe=False)

