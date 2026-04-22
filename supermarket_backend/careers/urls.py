from django.urls import path, include
from .views import JobPositionListView, JobApplicationCreateView, JobApplicationListView, update_application_status


urlpatterns = [
    path('positions/', JobPositionListView.as_view(), name='job-positions'),
    path('apply/', JobApplicationCreateView.as_view(), name='job-apply'),
    path('applications/', JobApplicationListView.as_view(), name='job-applications'),
    path('applications/<int:pk>/status/', update_application_status, name='update-status'),
]

