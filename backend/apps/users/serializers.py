from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "phone_number",
            "about_me",
            "achievements",
            "image",
        )
        read_only_fields = ["id"]


class LoginSerializer(serializers.Serializer):
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
        elif len(numbers) == 12 and numbers.startswith("375"):
            return numbers
        elif len(numbers) == 12 and numbers.startswith("380"):
            return numbers
        raise serializers.ValidationError(detail="Номер телефона введен неверно!")


class UserIdOfUserSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
