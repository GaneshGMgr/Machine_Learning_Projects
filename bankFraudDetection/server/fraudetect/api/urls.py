from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import predict, predict_bulk, get_transaction, create_transaction, transaction_detail, export_transactions, profile_view
from .views import RegisterView, LoginView, change_password, get_user_role

urlpatterns = [
    path('transactions/', get_transaction, name='get_transaction'),
    path('transactions/predict/', predict, name='predict'),
    path('transactions/predict_bulk/', views.predict_bulk, name='predict_bulk'),
    path('transactions/create/', create_transaction, name='create_transaction'),
    path('transactions/<int:pk>/', transaction_detail, name='transaction_detail'),
    path('transactions/export/', export_transactions, name='export_transactions'),

    path('api/transactions/', views.transaction_list, name='transaction-list'),

    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    path('profile/', profile_view, name='profile'),
    path('change-password/', change_password, name="change-password"),



    path('get_transaction_data/', views.get_transaction_data, name='get_transaction_data'),
    path('get_fraud_by_type/', views.get_fraud_by_type, name='get_fraud_by_type'),

    path('get_user_role/', get_user_role, name='get_user_role'),

]
