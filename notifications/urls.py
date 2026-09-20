from django.urls import path
from .views import (create_notification,notifications_list,mark_notification_read,)
urlpatterns = [
    path("create/",create_notification,name="create_notification",),
    path("user/<int:user_id>/",notifications_list,name="notifications_list",),
    path("read/<int:notification_id>/",mark_notification_read,name="mark_notification_read",),
]
