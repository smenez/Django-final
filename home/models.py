from django.contrib.auth.models import User
from django.db import models

class game(models.Model):
    player = models.CharField(max_length=100, default="defaultplayer")
    # date_game = models.DateField(auto_now=True)
    score_game = models.IntegerField()