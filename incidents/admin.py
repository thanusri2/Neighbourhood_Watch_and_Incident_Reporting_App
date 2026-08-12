from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import IncidentCategory, Incident
from users.models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (
            "Additional Information",
            {
                "fields": ("role", "phone", "address"),
            },
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "Additional Information",
            {
                "fields": ("role", "phone", "address"),
            },
        ),
    )

    list_display = ("username", "email", "role", "phone", "is_staff")
    list_filter = ("role", "is_staff", "is_active")


@admin.register(IncidentCategory)
class IncidentCategoryAdmin(admin.ModelAdmin):
    list_display = ("category_name",)


@admin.register(Incident)
class IncidentAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "resident",
        "category",
        "status",
        "reported_date",
        "location",
    )

    list_filter = ("status", "category")

    search_fields = (
        "title",
        "description",
        "location",
        "resident__username",
    )