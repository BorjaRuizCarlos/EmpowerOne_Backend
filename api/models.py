from django.db import models
from django.conf import settings

class BankCredential(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    provider = models.CharField(max_length=128)
    external_id = models.CharField(max_length=256, blank=True, null=True)
    access_token = models.TextField(blank=True, null=True)
    refresh_token = models.TextField(blank=True, null=True)
    scopes = models.TextField(blank=True, null=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.provider} ({self.user})"

class BankAccount(models.Model):
    credential = models.ForeignKey(BankCredential, on_delete=models.CASCADE, related_name="accounts")
    external_id = models.CharField(max_length=256, db_index=True)
    name = models.CharField(max_length=256)
    currency = models.CharField(max_length=8, default="USD")
    last_synced_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.external_id})"

class Transaction(models.Model):
    account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name="transactions")
    external_id = models.CharField(max_length=256, db_index=True)
    date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=8, default="USD")
    description = models.TextField(blank=True, null=True)
    raw = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'