from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.users.models import User, VerificationCode
from apps.users.serializers import UserSerializer, PhoneNumberSerializer, VerifyCodeSerializer
from apps.users.smsc_api import send_sms
from apps.users.utils import generate_code


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    @action(methods=["post"], detail=False, serializer_class=UserSerializer, permission_classes=[AllowAny])
    def create_user(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=["post"], detail=False, serializer_class=PhoneNumberSerializer, permission_classes=[AllowAny])
    def send_sms(self, request, *args, **kwargs):
        serializer = PhoneNumberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.data["phone_number"]

        # Генерация и отправка кода
        random_number = generate_code()
        send_sms(phone_number, random_number)

        # Сохранение кода в базе данных
        VerificationCode.objects.update_or_create(
            phone_number=phone_number,
            code=random_number
        )

        return Response({'message': 'Успешно'})

    @action(methods=["post"], detail=False, serializer_class=VerifyCodeSerializer, permission_classes=[AllowAny])
    def verify_code(self, request, *args, **kwargs):
        serializer = VerifyCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.data["phone_number"]
        code = serializer.data["code"]

        try:
            verification_code = VerificationCode.objects.get(phone_number=phone_number, code=code)
            # Удалите код после успешной проверки, чтобы он не мог быть использован повторно
            verification_code.delete()
            return Response({'message': 'Код подтвержден'}, status=status.HTTP_200_OK)
        except VerificationCode.DoesNotExist:
            raise ValidationError(
                detail="Неверный код подтверждения", code=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=["get", "patch"], permission_classes=[IsAuthenticated])
    def me(self, request, *args, **kwargs):
        if request.method == "PATCH":
            serializer = UserSerializer(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            request.user.refresh_from_db()
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
