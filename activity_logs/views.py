from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ActivityLog
from users.models import User

import json
@csrf_exempt
def create_activity_log(request):
    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST method is allowed"},
            status=405
        )
    try:
        data = json.loads(request.body)

        user_id = data.get("user_id")
        activity = data.get("activity")

        if not user_id or not activity:
            return JsonResponse({
                "error": "user_id and activity are required"
            }, status=400)

        try:
            user = User.objects.get(
                id=user_id
            )
        except User.DoesNotExist:
            return JsonResponse({
                "error": "User not found"
            }, status=404)

        log = ActivityLog.objects.create(
            user=user,
            activity=activity,
        )

        return JsonResponse({
            "message": "Activity log created successfully",
            "log_id": log.log_id,
            "user": user.username,
            "activity": log.activity,
            "timestamp": log.timestamp,
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({
            "error": "Invalid JSON"
        }, status=400)
@csrf_exempt
def activity_logs_list(request):

    if request.method != "GET":
        return JsonResponse(
            {"error": "Only GET method is allowed"},
            status=405
        )

    logs = ActivityLog.objects.select_related(
        "user"
    ).order_by("-timestamp")

    data = []

    for log in logs:
        data.append({
            "log_id": log.log_id,
            "user": log.user.username,
            "activity": log.activity,
            "timestamp": log.timestamp,
        })
    return JsonResponse(data, safe=False)

