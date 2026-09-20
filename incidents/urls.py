from django.urls import path
from .views import (
    incidents_list,
    assign_watchman,
    create_incident,
    watchman_incidents,
    update_incident_progress,
    add_evidence,
    evidence_list,
)

urlpatterns = [
    path("list/", incidents_list, name="incidents_list"),
    path("assign/", assign_watchman, name="assign_watchman"),
    path("create/", create_incident, name="create_incident"),
    path("watchman/<int:watchman_id>/",watchman_incidents,name="watchman_incidents",),
    path("update-progress/",update_incident_progress,name="update_incident_progress",),
    path("add-evidence/",add_evidence,name="add_evidence",),
    path("evidence/<int:incident_id>/",evidence_list,name="evidence_list",),
]