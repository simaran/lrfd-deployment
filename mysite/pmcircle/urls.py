from django.urls import path
from . import views

app_name = 'pmcircle'

urlpatterns = [
    path('', views.PmCircle.as_view(), name="pmcircle"),
]
