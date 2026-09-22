from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User
from incidents.models import Incident
from reports.models import Report
from notifications.models import Notification
import json

@csrf_exempt
def create_user(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST method is allowed"},
            status=405
        )

    try:
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")
        email = data.get("email", "")
        phone = data.get("phone", "")
        role = data.get("role")

        if not username or not password or not role:
            return JsonResponse({
                "error": "Username, password and role are required"
            }, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({
                "error": "Username already exists"
            }, status=400)

        if role not in ["RESIDENT", "WATCHMAN", "INCHARGE"]:
            return JsonResponse({
                "error": "Invalid role"
            }, status=400)

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            phone=phone,
            role=role
        )

        return JsonResponse({
            "message": "User created successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
                "is_active": user.is_active
            }
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({
            "error": "Invalid JSON"
        }, status=400)
        
@csrf_exempt
def login_view(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST method is allowed"},
            status=405
        )
    try:
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse(
                {"error": "Username and password are required"},
                status=400
            )

        user = authenticate(
            username=username,
            password=password
        )

        if user is None:
            return JsonResponse(
                {"error": "Invalid username or password"},
                status=401
            )

        return JsonResponse({
            "message": "Login successful",
            "username": user.username,
            "role": user.role,
        })

    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON"},
            status=400
        )


@csrf_exempt
def users_list(request):

    if request.method != "GET":
        return JsonResponse(
            {"error": "Only GET method is allowed"},
            status=405
        )

    users = User.objects.all()

    data = []

    for user in users:
        data.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "phone": user.phone,
            "is_active": user.is_active,
            "is_staff": user.is_staff,
        })

    return JsonResponse(data, safe=False)
@csrf_exempt
def update_user_status(request):

    if request.method != "PUT":
        return JsonResponse(
            {"error": "Only PUT method is allowed"},
            status=405
        )

    try:
        data = json.loads(request.body)

        user_id = data.get("user_id")
        is_active = data.get("is_active")

        if user_id is None or is_active is None:
            return JsonResponse({
                "error": "user_id and is_active are required"
            }, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({
                "error": "User not found"
            }, status=404)

        user.is_active = is_active
        user.save(update_fields=["is_active"])

        return JsonResponse({
            "message": "User status updated successfully",
            "user_id": user.id,
            "username": user.username,
            "is_active": user.is_active,
        })

    except json.JSONDecodeError:
        return JsonResponse({
            "error": "Invalid JSON"
        }, status=400)
@csrf_exempt
def admin_dashboard(request):

    if request.method != "GET":
        return JsonResponse(
            {"error": "Only GET method is allowed"},
            status=405
        )
    data = {
        "total_users": User.objects.count(),

        "total_incidents": Incident.objects.count(),
        "pending_incidents": Incident.objects.filter(
            status="PENDING"
        ).count(),
        "assigned_incidents": Incident.objects.filter(
            status="ASSIGNED"
        ).count(),
        "under_investigation": Incident.objects.filter(
            status="UNDER_INVESTIGATION"
        ).count(),
        "resolved_incidents": Incident.objects.filter(
            status="RESOLVED"
        ).count(),
        "closed_incidents": Incident.objects.filter(
            status="CLOSED"
        ).count(),
        "total_reports": Report.objects.count(),
        "total_notifications": Notification.objects.count(),
    }
    return JsonResponse(data)     
@csrf_exempt
def register_resident(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST method is allowed"},
            status=405
        )

    try:
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")
        email = data.get("email", "")
        phone = data.get("phone", "")

        if not username or not password or not email:
            return JsonResponse({
                "error": "Username, password and email are required"
            }, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({
                "error": "Username already exists"
            }, status=400)

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            phone=phone,
            role="RESIDENT"
        )

        return JsonResponse({
            "message": "Resident registration successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
                "is_active": user.is_active
            }
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({
            "error": "Invalid JSON"
        }, status=400)
        