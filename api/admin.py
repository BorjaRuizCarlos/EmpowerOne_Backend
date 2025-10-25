from django.contrib import admin
from .models import BankCredential, BankAccount, Transaction

@admin.register(BankCredential)
class BankCredentialAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "provider", "external_id", "created_at")
    search_fields = ("provider", "external_id", "user__username")

@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    list_display = ("id", "credential", "name", "external_id", "currency", "last_synced_at")
    search_fields = ("name", "external_id")

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "account", "external_id", "date", "amount")
    search_fields = ("external_id", "description")