from rest_framework import serializers
from .models import BankCredential, BankAccount, Transaction, User
from django.contrib.auth.hashers import make_password

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

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)