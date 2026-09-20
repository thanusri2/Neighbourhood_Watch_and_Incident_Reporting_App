from django.urls import path
from .views import login_view, users_list,update_user_status,admin_dashboard

urlpatterns = [
    path("login/", login_view, name="login"),
    path("list/", users_list, name="users_list"),
    path("update-status/",update_user_status,name="update_user_status",),
    path("dashboard/", admin_dashboard, name="admin_dashboard"),
]
