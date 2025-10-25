from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import BankCredentialViewSet, BankAccountViewSet, TransactionViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register("bank-credentials", BankCredentialViewSet, basename="bankcredential")
router.register("bank-accounts", BankAccountViewSet, basename="bankaccount")
router.register("transactions", TransactionViewSet, basename="transaction")

urlpatterns = [
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include(router.urls)),
]