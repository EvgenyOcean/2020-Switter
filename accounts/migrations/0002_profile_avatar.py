# Generated by Django 3.1 on 2020-08-19 06:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='avatar',
            field=models.ImageField(default='default.jpg', upload_to='profile_pics'),
        ),
    ]
