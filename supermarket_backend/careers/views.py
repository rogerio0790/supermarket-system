from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from .models import JobPosition, JobApplication
from .serializers import JobPositionSerializer, JobApplicationSerializer, JobApplicationListSerializer


class JobPositionListView(generics.ListAPIView):
    queryset = JobPosition.objects.filter(is_active=True)
    serializer_class = JobPositionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['department']


class JobApplicationCreateView(generics.CreateAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.AllowAny]  # Allow guest applications

    def perform_create(self, serializer):
        serializer.save()


class JobApplicationListView(generics.ListAPIView):
    serializer_class = JobApplicationListSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return JobApplication.objects.select_related('job').all()


@api_view(['PATCH'])
@permission_classes([permissions.IsAdminUser])
def update_application_status(request, pk):
    application = get_object_or_404(JobApplication, pk=pk)
    status_data = request.data.get('status')
    if status_data not in dict(JobApplication.STATUS_CHOICES):
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
    
    application.status = status_data
    application.reviewed_by = request.user
    application.save()
    
    return Response(JobApplicationListSerializer(application).data)

