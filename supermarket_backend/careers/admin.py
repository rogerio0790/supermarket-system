from django.contrib import admin
from .models import JobPosition, JobApplication


@admin.register(JobPosition)
class JobPositionAdmin(admin.ModelAdmin):
    list_display = ['title', 'department', 'type', 'location', 'is_active', 'created_at']
    list_filter = ['department', 'type', 'is_active', 'created_at']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_active']


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['applicant_name', 'job', 'applicant_email', 'status', 'applied_at', 'reviewed_by']
    list_filter = ['status', 'applied_at', 'job__department']
    search_fields = ['applicant_name', 'applicant_email', 'job__title']
    raw_id_fields = ['job', 'reviewed_by']
    readonly_fields = ['applied_at']
    list_editable = ['status']
    actions = ['mark_as_reviewed', 'mark_as_interview', 'mark_as_rejected']

    def mark_as_reviewed(self, request, queryset):
        updated = queryset.update(status='reviewed')
        self.message_user(request, f'{updated} applications marked as reviewed.')
    mark_as_reviewed.short_description = 'Mark selected as reviewed'

    def mark_as_interview(self, request, queryset):
        updated = queryset.update(status='interview')
        self.message_user(request, f'{updated} applications scheduled for interview.')
    mark_as_interview.short_description = 'Schedule interviews'

    def mark_as_rejected(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f'{updated} applications marked as rejected.')
    mark_as_rejected.short_description = 'Reject selected applications'

