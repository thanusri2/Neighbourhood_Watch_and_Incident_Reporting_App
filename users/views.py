from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User
import json


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