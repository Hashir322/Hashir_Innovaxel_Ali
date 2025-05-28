from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('shorten/', views.create_short_url, name='create_short_url'),
    path('shorten/<str:short_code>/', views.get_short_url, name='get_short_url'),
    path('shorten/<str:short_code>/update/', views.update_short_url, name='update_short_url'),
    path('shorten/<str:short_code>/delete/', views.delete_short_url, name='delete_short_url'),
    path('shorten/<str:short_code>/stats/', views.get_url_stats, name='get_url_stats'),
    path('<str:short_code>/', views.redirect_to_original, name='redirect_to_original'),
    path('<str:short_code>/stats/', views.stats, name='stats'),
     path('shorten/<str:short_code>/retrieve/', views.retrieve_original_url, name='retrieve_original_url'),
]