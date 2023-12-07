# myapp/views.py
from django.shortcuts import render
from django.http import HttpResponseRedirect
from .forms import CreerUtilisateur
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import game
from django.http import JsonResponse
import traceback



def index(request):
    return render(request, 'home/index.html')
def classement(request):
    return render(request, 'home/classement.html')
def game_page(request):
    return render(request, 'home/gamemode.html')
@login_required(login_url='gamemode.html')
def memorygame(request):
    return render(request, 'home/memory_game.html')
@login_required(login_url='gamemode.html')
def mortsubite(request):
    return render(request, 'home/mortsubite.html')
def profil(request):
    return render(request, 'home/profil.html')




def Inscription(request) :
    form = CreerUtilisateur()
    if request.method == "POST" :
        form = CreerUtilisateur(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('connexion.html')
    else:
        form = CreerUtilisateur()
        print('Pb connexion')
        if 'submitted' in request.GET:
            submitted = True
    context={'form':form}
    return render(request, "home\\inscription.html", {'form': form})



def Connexion(request) :
    submitted = False
    if request.method == "POST" :
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect('gamemode.html')
        else:
            messages.info(request, "Utilisateur et/ou Mot de passe incorrect")
    return render(request, 'home/connexion.html')

def logoutUser(request):
    logout(request)
    return HttpResponseRedirect('home/connexion.html')


def enregistrer_score(request):
    if request.method == 'POST' and request.user.is_authenticated:
        score = request.POST.get('score')
        pseudo = request.user.username

        # Enregistrez le score dans votre modèle Game
        new_game = game(player=pseudo, score_game=score)
        new_game.save()

        return JsonResponse({'message': 'Score enregistré avec succès'})
    else:
        return JsonResponse({'message': "Erreur lors de l'enregistrement du score"})
    context={'score':score, 'pseudo':pseudo}

def ma_vue(request):
    try:
        # Récupérer les données de la base de données
        games = game.objects.all()

        # Passer les données au contexte de rendu
        context = {'games': games}

        # Rendre la page HTML avec les données
        return render(request, 'votre_template.html', context)

    except Exception as e:
        # Gérer les erreurs si nécessaire
        return JsonResponse({'message': f"Erreur lors de la récupération des données : {str(e)}"})