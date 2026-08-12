
from django.urls import path

from .views import (
    incidents_list,
    assign_watchman,
)


urlpatterns = [
    path(
        "list/",
        incidents_list,
        name="incidents_list"
    ),

    path(
        "assign/",
        assign_watchman,
        name="assign_watchman"
    ),
]