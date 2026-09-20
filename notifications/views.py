from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Notification
from users.models import User

import json


@csrf_exempt
def create_notification(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST method is allowed"},
            status=405
        )

    try:
        data = json.loads(request.body)

        user_id = data.get("user_id")
        message = data.get("message")

        if not user_id or not message:
            return JsonResponse({
                "error": "user_id and message are required"
            }, status=400)

        try:
            user = User.objects.get(
                id=user_id
            )
        except User.DoesNotExist:
            return JsonResponse({
                "error": "User not found"
            }, status=404)

        notification = Notification.objects.create(
            user=user,
            message=message,
            is_read=False,
        )

        return JsonResponse({
            "message": "Notification created successfully",
            "notification_id": notification.notification_id,
            "user": user.username,
            "notification_message": notification.message,
            "is_read": notification.is_read,
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({
            "error": "Invalid JSON"
        }, status=400)
@csrf_exempt
def notifications_list(request, user_id):

    if request.method != "GET":
        return JsonResponse(
            {"error": "Only GET method is allowed"},
            status=405
        )

    try:
        user = User.objects.get(
            id=user_id
        )
    except User.DoesNotExist:
        return JsonResponse({
            "error": "User not found"
        }, status=404)

    notifications = Notification.objects.filter(
        user=user
    ).order_by("-created_at")

    data = []

    for notification in notifications:
        data.append({
            "notification_id": notification.notification_id,
            "user": user.username,
            "message": notification.message,
            "is_read": notification.is_read,
            "created_at": notification.created_at,
        })

    return JsonResponse(data, safe=False)    
@csrf_exempt
def mark_notification_read(request, notification_id):

    if request.method != "PUT":
        return JsonResponse(
            {"error": "Only PUT method is allowed"},
            status=405
        )

    try:
        notification = Notification.objects.get(
            notification_id=notification_id
        )
    except Notification.DoesNotExist:
        return JsonResponse({
            "error": "Notification not found"
        }, status=404)

    notification.is_read = True
    notification.save(update_fields=["is_read"])

    return JsonResponse({
        "message": "Notification marked as read",
        "notification_id": notification.notification_id,
        "user": notification.user.username,
        "is_read": notification.is_read,
    })
