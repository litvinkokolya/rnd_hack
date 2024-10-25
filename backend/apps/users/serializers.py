from rest_framework import serializers

from apps.users.models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):

        user = User.objects.create_user(
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
        )

        return user

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'username': {'required': False},
        }


class PhoneNumberSerializer(serializers.Serializer):
    phone_number = serializers.CharField()

    def validate_phone_number(self, value):
        numbers = "".join([str(i) for i in str(value) if i.isdigit()])
        if len(numbers) == 11:
            if numbers[0] == "7":
                return numbers
            elif numbers[0] == "8":
                return "7" + numbers[1:]
            else:
                return serializers.ValidationError(
                    detail="Номер телефона введен неверно!"
                )
        raise serializers.ValidationError(detail='Номер телефона введен неверно!')


class VerifyCodeSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)
    code = serializers.CharField(max_length=6)

    def validate_phone_number(self, value):
        numbers = "".join([str(i) for i in str(value) if i.isdigit()])
        if len(numbers) == 11:
            if numbers[0] == "7":
                return numbers
            elif numbers[0] == "8":
                return "7" + numbers[1:]
            else:
                return serializers.ValidationError(
                    detail="Номер телефона введен неверно!"
                )
        raise serializers.ValidationError(detail='Номер телефона введен неверно!')

