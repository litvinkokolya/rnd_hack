from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, phone_number, password, **extra_fields):
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self.create_user(phone_number, password, **extra_fields)

class User(AbstractUser):
    avatar = models.ImageField(
        upload_to="media/avatars/%Y/%m/%d", null=True, blank=True
    )

    phone_number = models.CharField(
        max_length=12,
        help_text="Введите номер телефона пользователя",
        verbose_name="Номер телефона", unique=True,
    )

    call_code = models.CharField(max_length=10, null=True, blank=True)

    about_me = models.TextField(max_length=500, null=True, blank=True)

    USERNAME_FIELD = 'phone_number'

    objects = UserManager()

    # class Meta(AbstractUser.Meta):
    #     pass

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.phone_number
        super().save(*args, **kwargs)

    def __str__(self):
        if not self.last_name or not self.first_name:
            return self.phone_number
        return f"{self.last_name} {self.first_name[0]}."


class VerificationCode(models.Model):
    phone_number = models.CharField(max_length=15, unique=True)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.phone_number} - {self.code}"