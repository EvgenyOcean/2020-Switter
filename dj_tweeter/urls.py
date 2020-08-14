from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.contrib.auth import views as auth_views

from tweets.views import home, detail, user #gotta fix that
from accounts import views as accounts_view

urlpatterns = [
    path('', home, name='home'), #gotta fix that
    # careful here, cuz user may have a username 'register'
    path('register', accounts_view.register, name='register'),
    path('login', auth_views.LoginView.as_view(template_name="accounts/login.html"), name='login'),
    path('logout', auth_views.LogoutView.as_view(template_name="accounts/logout.html"), name='logout'),
    path('api/tweets/', include('tweets.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('admin/', admin.site.urls),
    path('react/', TemplateView.as_view(template_name="react/react.html")),
    path('<int:pk>', detail, name='detail'),
    path('<str:username>', user, name='user'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

#just outta curiosity [<URLPattern '^static/(?P<path>.*)$'>]
print(static(settings.STATIC_URL, document_root=settings.STATIC_ROOT))