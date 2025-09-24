from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('name', 'profile_image')}),
    )
    list_display = ['email', 'username', 'name', 'is_active', 'date_joined']
    list_filter = ['is_active', 'is_staff', 'date_joined']
    search_fields = ['email', 'username', 'name']

