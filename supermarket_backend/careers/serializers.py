from rest_framework import serializers
from .models import JobPosition, JobApplication
from accounts.models import User


class JobPositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosition
        fields = ['id', 'title', 'department', 'type', 'description', 'location', 'salary_range', 'is_active', 'slug', 'created_at']
        read_only_fields = ['slug', 'created_at', 'updated_at']


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ['id', 'job', 'applicant_name', 'applicant_email', 'cover_letter', 'resume', 'status', 'applied_at']
        read_only_fields = ['id', 'status', 'applied_at']

    def validate_job(self, value):
        if not value.is_active:
            raise serializers.ValidationError("This job position is no longer active.")
        return value

    def validate_resume(self, value):
        if value.size > 5 * 1024 * 1024:  # 5MB
            raise serializers.ValidationError("Resume file size cannot exceed 5MB.")
        if not value.name.lower().endswith(('.pdf', '.doc', '.docx')):
            raise serializers.ValidationError("Resume must be PDF or Word document.")
        return value


class JobApplicationListSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    job_department = serializers.CharField(source='job.department', read_only=True)
    applicant_name = serializers.CharField(source='applicant_name', read_only=True)

    class Meta:
        model = JobApplication
        fields = ['id', 'job_title', 'job_department', 'applicant_name', 'applicant_email', 'status', 'applied_at']

