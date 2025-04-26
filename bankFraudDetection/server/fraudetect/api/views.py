from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
from rest_framework import status
from .models import Transaction
from .serializers import TransactionSerializer, RegisterSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import numpy as np
import os
import joblib
import logging
from django.conf import settings

## login
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from rest_framework import status


## update
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError

from django.db.models import Count, Q

# Set up logging
logger = logging.getLogger(__name__)


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

model_path = os.path.join(BASE_DIR, 'fraudetect', 'Online_Payment_Fraud', 'random_forest_model.pkl')
scaler_path = os.path.join(BASE_DIR, 'fraudetect', 'Online_Payment_Fraud', 'scaler.pkl')

try:
    model = joblib.load(model_path)
    print("Model loaded successfully")
except FileNotFoundError:
    print("Model file not found. Please check the path:", model_path)
    model = None

try:
    scaler = joblib.load(scaler_path)
    print("Scaler loaded successfully")
except FileNotFoundError:
    print("Scaler file not found. Please check the path:", scaler_path)
    scaler = None

TYPE_MAPPING = {
    'PAYMENT': 0,
    'CASH_IN': 1,
    'DEBIT': 2,
    'CASH_OUT': 3,
    'TRANSFER': 4
}


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_role(request):
    user = request.user

    role = user.role 
    
    role_data = {
        'role_id': role.id if role else None,
        'role_name': role.name if role else None
    }
    
    return Response(role_data)

    

@api_view(['POST'])
def predict(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    logger.info("Received data from client: %s", request.data)

    if model is None or scaler is None:
        logger.error("Model or scaler not loaded.")
        return JsonResponse({'error': 'Model or scaler not loaded'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    data = request.data

    transaction_type = data.get('type', '').upper()
    logger.info("Received transaction type: %s", transaction_type)

    type_value = TYPE_MAPPING.get(transaction_type, -1)
    logger.info("Mapped type value: %d", type_value)


    if type_value == -1:
        logger.warning("Invalid transaction type received.")
        return JsonResponse({'error': 'Invalid transaction type.'}, status=status.HTTP_400_BAD_REQUEST)

  
    try:
        input_data = {
            'step': int(data['step']),
            'type': type_value,  
            'amount': float(data['amount']),
            'nameOrig': data['nameOrig'],
            'oldbalanceOrg': float(data['oldbalanceOrg']),
            'newbalanceOrig': float(data['newbalanceOrig']),
            'nameDest': data['nameDest'],
            'oldbalanceDest': float(data['oldbalanceDest']),
            'newbalanceDest': float(data['newbalanceDest'])
        }
    except ValueError as e:
        return JsonResponse({'error': f"Invalid data type provided: {e}"}, status=status.HTTP_400_BAD_REQUEST)

    df = pd.DataFrame([input_data])


    for column in ['nameOrig', 'nameDest']:
        if column in df.columns:
            df[column] = df[column].fillna('UNKNOWN').astype('category').cat.codes

    try:
        scaled_data = scaler.transform(df)
    except Exception as e:
        logger.error(f"Error in scaling data: {e}")
        return JsonResponse({'error': 'Error in scaling data'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    try:
        prediction = model.predict(scaled_data)
        is_fraud = int(prediction[0])
        print(f"Prediction: {is_fraud}")


        transaction_data = input_data
        transaction_data['isFraud'] = bool(is_fraud)
        transaction_data['user'] = request.user.id 
        print(f"Transaction data before serialization: {transaction_data}")

        serializer = TransactionSerializer(data=transaction_data)
        if serializer.is_valid():
            print(f"Saving transaction: {serializer.validated_data}")
            serializer.save() 
            return JsonResponse({'prediction': is_fraud, 'transaction_id': serializer.instance.id})
        else:
            print(f"Validation errors: {serializer.errors}")
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error(f"Error occurred during prediction: {e}")
        return JsonResponse({'error': 'Error during prediction'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def predict_bulk(request):

    if model is None or scaler is None:
        return JsonResponse({'error': 'Model or scaler not loaded'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    if 'file' not in request.FILES:
        return JsonResponse({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

    file = request.FILES['file']
    file_format = file.name.split('.')[-1].lower() 

    logger.info(f"File uploaded: {file.name}")
    logger.info(f"File format: {file_format}")

    try:
        if file_format in ['xls', 'xlsx']:
            df = pd.read_excel(file)
        elif file_format == 'csv':
            df = pd.read_csv(file)
        else:
            return JsonResponse({'error': 'Unsupported file format'}, status=status.HTTP_400_BAD_REQUEST)

        required_columns = ['step', 'type', 'amount', 'nameOrig', 'oldbalanceOrg', 'newbalanceOrig', 'nameDest', 'oldbalanceDest', 'newbalanceDest']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return JsonResponse({'error': f'Missing required columns: {", ".join(missing_columns)}'}, status=status.HTTP_400_BAD_REQUEST)


        if 'type' in df.columns:
            df['type'] = df['type'].map(TYPE_MAPPING).fillna(-1).astype(int)

        categorical_columns = ['nameOrig', 'nameDest']
        for column in categorical_columns:
            if column in df.columns:
                df[column] = df[column].astype(str).astype('category').cat.codes


        features = df.convert_dtypes()

 
        try:
            scaled_data = scaler.transform(features)
        except Exception as e:
            return JsonResponse({'error': f'Error in scaling data: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            predictions = model.predict(scaled_data)
            predictions = [int(prediction) for prediction in predictions]  

            results = []
            for i, row in df.iterrows():
                result = {
                    'id': int(i + 1), 
                    'step': int(row['step']),
                    'type': int(row['type']),
                    'amount': float(row['amount']),
                    'nameOrig': row['nameOrig'],
                    'oldbalanceOrg': float(row['oldbalanceOrg']),
                    'newbalanceOrig': float(row['newbalanceOrig']),
                    'nameDest': row['nameDest'],
                    'oldbalanceDest': float(row['oldbalanceDest']),
                    'newbalanceDest': float(row['newbalanceDest']),
                    'prediction': predictions[i]
                }

                result = {key: (value.item() if isinstance(value, np.generic) else value) for key, value in result.items()}
                results.append(result)

        except Exception as e:
            return JsonResponse({'error': f'Error in making prediction: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return JsonResponse({'error': f'Error processing file: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    return JsonResponse(results, safe=False)


@api_view(['GET'])
def transaction_list(request):
    if request.user.is_authenticated:
        transactions = Transaction.objects.filter(user=request.user)
        serializer = TransactionSerializer(transactions, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({'error': 'User is not authenticated'}, status=401)



@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user

    if request.method == "GET":
        logger.info(f"Fetching profile data for user: {user.username} (ID: {user.id})")
        print(f"User profile data fetched: {user.username}, {user.email}")

        return Response({
            "email": user.email,
            "username": user.username,
        })

    elif request.method == "PUT":
        logger.info(f"Updating profile data for user: {user.username}")
        print("Data received for update:", request.data)

        user.email = request.data.get("email", user.email)
        user.username = request.data.get("username", user.username)
        user.save()


        logger.info(f"Updated profile for user: {user.username}")
        print(f"Profile updated for user: {user.username}, {user.email}")

        return Response({
            "email": user.email,
            "username": user.username,
            "message": "Profile updated successfully."
        })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not old_password or not new_password:
        raise ValidationError("Both old password and new password are required.")

    user = authenticate(username=user.username, password=old_password)

    if user is None:
        return Response({"error": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

    if len(new_password) < 6:
        return Response({"error": "Password must be at least 6 characters long."}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({
        "message": "Password changed successfully."
    })

    

@csrf_exempt
@api_view(['POST'])
def create_transaction(request):
    serializer = TransactionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
def transaction_detail(request, pk):
    try:
        transaction = Transaction.objects.get(pk=pk)
    except Transaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TransactionSerializer(transaction, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        transaction.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



@csrf_exempt
def export_transactions(request):
    if request.method == "POST":
        try:
            transactions = Transaction.objects.all().values()
            if not transactions:
                return JsonResponse({'error': 'No transactions found'}, status=404)

    
            df = pd.DataFrame(transactions)


            directory = settings.EXPORTS_ROOT
            file_path = directory / 'transactions.xlsx'

            logger.debug(f'Saving file to: {file_path}')
            print(f'Saving file to: {file_path}')


            directory.mkdir(parents=True, exist_ok=True)


            df.to_excel(file_path, index=False, sheet_name='Transactions')

            response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = 'attachment; filename=transactions.xlsx'
            with open(file_path, 'rb') as file:
                response.write(file.read())

            return response
        except Exception as e:

            logger.error(f'Error exporting transactions: {e}')
            return JsonResponse({'error': 'An error occurred while exporting transactions'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = None
        if "@" in username:
            user = User.objects.filter(email=username).first()
        else:
            user = User.objects.filter(phone_number=username).first() 

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            role_id = user.role.id if user.role else None
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'role_id': role_id
            }, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['GET'])
def get_transaction(request):
    try:
        user_id = request.user.id 

        user_role = request.user.role_id

   
        if user_role == 1:
            transactions = Transaction.objects.all() 
        elif user_role == 2:
            transactions = Transaction.objects.filter(user_id=user_id)
        else:
            return Response({"message": "Unauthorized access"}, status=status.HTTP_403_FORBIDDEN)

        if not transactions.exists():
            return Response({"message": "No transactions found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def get_transaction_data(request):
    try:
        user_id = request.user.id
        user_role = request.user.role_id

        if user_role == 1:
            transaction_data = Transaction.objects.aggregate(
                fraud=Count('id', filter=Q(isFraud=True)),
                valid=Count('id', filter=Q(isFraud=False)),
                total_transaction=Count('id')
            )
        elif user_role == 2:
            transaction_data = Transaction.objects.filter(user_id=user_id).aggregate(
                fraud=Count('id', filter=Q(isFraud=True)),
                valid=Count('id', filter=Q(isFraud=False)),
                total_transaction=Count('id')
            )
        else:
            return Response({"message": "Unauthorized access"}, status=status.HTTP_403_FORBIDDEN)

        return Response(transaction_data)
    except Exception as e:
        logger.error(f"Error in get_transaction_data: {str(e)}")
        return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
def get_fraud_by_type(request):
    try:
        user_id = request.user.id
        
       
        user_role = request.user.role_id  
        if user_role == 1:
            fraud_data = (
                Transaction.objects
                .values('type')
                .annotate(
                    fraud_count=Count('id', filter=Q(isFraud=True)),
                    valid_count=Count('id', filter=Q(isFraud=False)),
                )
                .order_by('type') 
            )
        elif user_role == 2:
            fraud_data = (
                Transaction.objects
                .values('type') 
                .annotate(
                    fraud_count=Count('id', filter=Q(isFraud=True, user_id=user_id)), 
                    valid_count=Count('id', filter=Q(isFraud=False, user_id=user_id)), 
                )
                .order_by('type') 
            )
        else:
            return Response({"message": "Unauthorized access"}, status=status.HTTP_403_FORBIDDEN)

        data = [
            {
                "type": item['type'],
                "fraud_count": item['fraud_count'],
                "valid_count": item['valid_count'],
            }
            for item in fraud_data
        ]

        return JsonResponse(data, safe=False)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# # jMeter Test
# @api_view(['GET'])
# def get_transaction(request):
#     try:
#         user_role = request.GET.get('user_role')

#         if not user_role:
#             return Response({"error": "user_role is required"}, status=status.HTTP_400_BAD_REQUEST)

#         user_role = int(user_role)

#         if user_role not in [1, 2]:
#             return Response({"error": "Invalid user_role"}, status=status.HTTP_400_BAD_REQUEST)

#         user_id = request.user.id

#         if user_role == 1:
#             transactions = Transaction.objects.all()
#         elif user_role == 2:
#             transactions = Transaction.objects.filter(user_id=user_id)
#         else:
#             return Response({"message": "Unauthorized access"}, status=status.HTTP_403_FORBIDDEN)

#         if not transactions.exists():
#             return Response({"message": "No transactions found"}, status=status.HTTP_404_NOT_FOUND)

#         serializer = TransactionSerializer(transactions, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# @api_view(['GET'])
# def get_transaction_data(request):
#     try:
#         user_role = request.GET.get('user_role')
#         if not user_role:
#             return Response({"error": "user_role is required"}, status=status.HTTP_400_BAD_REQUEST)

#         user_role = int(user_role) 
#         if user_role == 1:
#             transaction_data = Transaction.objects.aggregate(
#                 fraud=Count('id', filter=Q(isFraud=True)),
#                 valid=Count('id', filter=Q(isFraud=False)),
#                 total_transaction=Count('id')
#             )
#         elif user_role == 2:
#             user_id = request.user.id
#             transaction_data = Transaction.objects.filter(user_id=user_id).aggregate(
#                 fraud=Count('id', filter=Q(isFraud=True)),
#                 valid=Count('id', filter=Q(isFraud=False)),
#                 total_transaction=Count('id')
#             )
#         else:
#             return Response({"error": "Invalid user_role"}, status=status.HTTP_400_BAD_REQUEST)

#         return Response(transaction_data)
#     except Exception as e:
#         logger.error(f"Error in get_transaction_data: {str(e)}")
#         return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# @api_view(['GET'])
# def get_fraud_by_type(request):
    try:

        user_role = request.GET.get('user_role')
        
        if not user_role:
            return Response({"error": "user_role is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user_role = int(user_role)
        

        if user_role not in [1, 2]:
            return Response({"error": "Invalid user_role"}, status=status.HTTP_400_BAD_REQUEST)


        if user_role == 1:
            fraud_data = (
                Transaction.objects
                .values('type')
                .annotate(
                    fraud_count=Count('id', filter=Q(isFraud=True)),
                    valid_count=Count('id', filter=Q(isFraud=False)),
                )
                .order_by('type')
            )

        elif user_role == 2:
            user_id = request.user.id 
            fraud_data = (
                Transaction.objects
                .values('type')
                .annotate(
                    fraud_count=Count('id', filter=Q(isFraud=True, user_id=user_id)),
                    valid_count=Count('id', filter=Q(isFraud=False, user_id=user_id)),
                )
                .order_by('type')
            )
        else:
            return Response({"message": "Unauthorized access"}, status=status.HTTP_403_FORBIDDEN)

        data = [
            {
                "type": item['type'],
                "fraud_count": item['fraud_count'],
                "valid_count": item['valid_count'],
            }
            for item in fraud_data
        ]

        return JsonResponse(data, safe=False)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
