from rest_framework.routers import DefaultRouter
from .views import AuthorViewSet, BookViewSet, StudentViewSet, TransactionViewSet
from .views import SettingViewSet

router = DefaultRouter()
router.register('authors', AuthorViewSet)
router.register('books', BookViewSet)
router.register('students', StudentViewSet)
router.register('transactions', TransactionViewSet)
router.register('settings', SettingViewSet)
urlpatterns = router.urls

from django.urls import path
from .views import my_transactions, my_profile

urlpatterns = router.urls + [
    path('my-transactions/', my_transactions, name='my-transactions'),
    path('my-profile/', my_profile, name='my-profile'),
]
from .views import return_my_book
urlpatterns = router.urls + [
    path('my-transactions/', my_transactions, name='my-transactions'),
    path('my-profile/', my_profile, name='my-profile'),
    path('my-transactions/<int:transaction_id>/return/', return_my_book, name='return-my-book'),
]