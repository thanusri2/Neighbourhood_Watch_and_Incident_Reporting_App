from django.urls import path
from .views import login_view, users_list


urlpatterns = [
    path("login/", login_view, name="login"),
    path("list/", users_list, name="users_list"),
]