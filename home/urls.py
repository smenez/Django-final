from django.urls import path
from .views import game_page, classement, memorygame, mortsubite, Inscription, Connexion, logoutUser, profil, enregistrer_score


urlpatterns = [
    path('', game_page, name='game_page'),
    path('gamemode.html',game_page, name='game_page'),
    path('classement.html', classement, name='classement'),
    path('memory_game.html', memorygame, name='memory_game'),
    path('mortsubite.html', mortsubite, name='mortsubite'),
    path('inscription.html', Inscription, name='inscription'),
    path('connexion.html', Connexion, name='connexion'),
    path('deconnexion.html', logoutUser, name='deconnexion'),
    path('profil.html', profil, name='profil'),
    path('enregistrer_score/', enregistrer_score, name='enregistrer_score'),
]