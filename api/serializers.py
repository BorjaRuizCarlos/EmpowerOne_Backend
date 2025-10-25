from rest_framework import serializers
from .models import BankCredential, BankAccount, Transaction

class BankCredentialSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankCredential
        fields = "__all__"
        read_only_fields = ("user", "created_at")

class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = "__all__"

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"