from rest_framework import viewsets
from .models import Author, Book, Student, Transaction, Setting
from .serializers import AuthorSerializer, BookSerializer, StudentSerializer, TransactionSerializer, SettingSerializer
from .permissions import IsAdminOrLibrarian, IsAdminOnly

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAdminOrLibrarian]


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrLibrarian]


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAdminOrLibrarian]


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAdminOrLibrarian]


class SettingViewSet(viewsets.ModelViewSet):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    permission_classes = [IsAdminOnly]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_transactions(request):
    try:
        student = request.user.student_profile
    except Student.DoesNotExist:
        return Response({'detail': 'No student profile linked to this account.'}, status=404)

    transactions = Transaction.objects.filter(student=student)
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_profile(request):
    try:
        profile = request.user.profile
        role = profile.role
    except:
        role = 'unknown'

    return Response({
        'username': request.user.username,
        'role': role,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def return_my_book(request, transaction_id):
    try:
        student = request.user.student_profile
    except Student.DoesNotExist:
        return Response({'detail': 'No student profile linked.'}, status=404)

    try:
        transaction = Transaction.objects.get(id=transaction_id, student=student)
    except Transaction.DoesNotExist:
        return Response({'detail': 'Transaction not found or not yours.'}, status=404)

    from django.utils import timezone
    transaction.return_date = timezone.now().date()
    transaction.save()
    return Response(TransactionSerializer(transaction).data)