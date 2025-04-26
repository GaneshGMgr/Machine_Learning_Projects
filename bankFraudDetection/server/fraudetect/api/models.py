from django.db import models
from django.contrib.auth.models import User

class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
    

class Transaction(models.Model):
    step = models.IntegerField()
    type = models.IntegerField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    nameOrig = models.CharField(max_length=255)
    oldbalanceOrg = models.DecimalField(max_digits=12, decimal_places=2)
    newbalanceOrig = models.DecimalField(max_digits=12, decimal_places=2)
    nameDest = models.CharField(max_length=255)
    oldbalanceDest = models.DecimalField(max_digits=12, decimal_places=2)
    newbalanceDest = models.DecimalField(max_digits=12, decimal_places=2)
    isFraud = models.BooleanField(default=False)  # Make sure it's a BooleanField
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.nameOrig


User.add_to_class(
    'role',
    models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True, default=2)
)