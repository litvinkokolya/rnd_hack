from django.contrib.auth.forms import UserCreationForm
from django import forms

from apps.users.models import User


class UserCreateForm(UserCreationForm):
    username = forms.CharField(label="username", max_length=100)
    phone_number = forms.CharField(label="phone_number", max_length=11)

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "phone_number")

    def save(self, *args, **kwargs):
        self.username = self.phone_number
        super().save(*args, **kwargs)