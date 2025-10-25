from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import BankCredential, BankAccount, Transaction
from .serializers import BankCredentialSerializer, BankAccountSerializer, TransactionSerializer
from .bank_adapter import client as bank_client

class BankCredentialViewSet(viewsets.ModelViewSet):
    queryset = BankCredential.objects.all()
    serializer_class = BankCredentialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return BankCredential.objects.filter(user=self.request.user)

    @action(detail=True, methods=["post"])
    def start_connect(self, request, pk=None):
        cred = self.get_object()
        # stub: start OAuth flow — implement in bank adapter
        url = bank_client.start_oauth_flow(cred.user, cred.provider)
        return Response({"url": url})

class BankAccountViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BankAccount.objects.filter(credential__user=self.request.user)

    @action(detail=True, methods=["post"])
    def sync(self, request, pk=None):
        account = self.get_object()
        # trigger background sync task (placeholder)
        bank_client.enqueue_sync_account(account.id)
        return Response({"status": "queued"})

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(account__credential__user=self.request.user)