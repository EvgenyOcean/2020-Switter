from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.contrib.auth import views as auth_views

from tweets.views import home, detail, user 
from accounts import views as accounts_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    # careful here, cuz user may have a username 'register'/'users'
    path('users', accounts_view.users, name='users'),
    path('register', accounts_view.register, name='register'),
    path('login', auth_views.LoginView.as_view(template_name="accounts/login.html", redirect_authenticated_user=True), name='login'),
    path('logout', auth_views.LogoutView.as_view(), name='logout'),
    path('api/tweets/', include('tweets.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('react/', TemplateView.as_view(template_name="react/react.html")),
    path('<int:pk>', detail, name='detail'),
    path('<str:username>', user, name='user'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
