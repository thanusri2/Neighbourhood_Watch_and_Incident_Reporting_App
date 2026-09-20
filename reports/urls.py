from django.urls import path
from .views import create_report,reports_list

urlpatterns = [
    path("create/", create_report, name="create_report"),
    path("list/", reports_list, name="reports_list"),
]