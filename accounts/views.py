from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from .forms import UserRegisterFrom

# Create your views here.
def register(request):
    if request.method == 'POST':
        form = UserRegisterFrom(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            print(f'New account for {username} was created')
            return redirect('home')
    else: 
        form = UserRegisterFrom()
    print(form)
    return render(request, 'accounts/register.html', {'form': form})