from django.db import models
from django.utils.text import slugify
from accounts.models import User


class JobPosition(models.Model):
    title = models.CharField(max_length=200)
    department = models.CharField(max_length=100, choices=[
        ('Logistics', 'Logistics'),
        ('Retail', 'Retail'),
        ('Management', 'Management'),
    ])
    type = models.CharField(max_length=50, choices=[
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Contract', 'Contract'),
    ])
    description = models.TextField()
    location = models.CharField(max_length=100, default='Kigali, Rwanda')
    salary_range = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    slug = models.SlugField(blank=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.department}"


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('interview', 'Interview Scheduled'),
        ('rejected', 'Rejected'),
        ('hired', 'Hired'),
    ]

    job = models.ForeignKey(JobPosition, on_delete=models.CASCADE, related_name='applications')
    applicant_name = models.CharField(max_length=200)
    applicant_email = models.EmailField()
    cover_letter = models.TextField(blank=True)
    resume = models.FileField(upload_to='applications/resumes/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.applicant_name} - {self.job.title}"

