from django.contrib import admin
from .models import Setting
from .models import Author, Book, Student, Transaction
from .models import Profile


admin.site.register(Profile)
admin.site.register(Author)
admin.site.register(Book)
admin.site.register(Student)
admin.site.register(Transaction)
admin.site.register(Setting)