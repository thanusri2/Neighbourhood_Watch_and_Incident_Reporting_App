from django.urls import path
from .views import create_activity_log,activity_logs_list
urlpatterns = [
    path("create/",create_activity_log,name="create_activity_log",),
    path("list/",activity_logs_list,name="activity_logs_list",),
]
