import os
import django_heroku

#Project related 
MIN_TWEET_LENGTH = 5
MAX_TWEET_LENGTH = 250
ALLOWED_TWEET_ACTIONS = ['LIKE', 'DISLIKE', 'RETWEET']


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = (os.environ.get('DEBUG_VALUE') == 'True')
DEBUG = (os.environ.get('DEBUG_VALUE') == 'True')

ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'djtweeter.herokuapp.com']


# Application definition
INSTALLED_APPS = [
    #classic
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    #internal
    'tweets.apps.TweetsConfig',
    'accounts.apps.AccountsConfig',

    #third parties 
    'rest_framework',
    'corsheaders',
    'storages',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'dj_tweeter.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR), 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'dj_tweeter.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
# to take the files from
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
# to automatically upload to
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

# if DEBUG:
#     DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

# LOGIN STUFF
LOGIN_URL = 'login'
LOGIN_REDIRECT_URL = "home"
LOGOUT_REDIRECT_URL = '/login'

# MEDIA STUFF
# where uploaded files will be located on the file system
MEDIA_ROOT = os.path.join(BASE_DIR, 'media') 
# how to get access to the media files via url
MEDIA_URL = '/media/'


# REST FRAMEWORK SECTION 
REST_FRAMEWORK = {
  'DEFAULT_RENDERER_CLASSES': [
      'rest_framework.renderers.JSONRenderer',
  ],
  'DEFAULT_AUTHENTICATION_CLASSES': [
    'rest_framework.authentication.SessionAuthentication',
    'rest_framework.authentication.BasicAuthentication'
  ]
}

if DEBUG:
    REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'].append('rest_framework.renderers.BrowsableAPIRenderer')
    # REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] = ['dj_tweeter.dev.DevAuthentication']


#CORS HEADERS SECTION
CORS_ORIGIN_WHITELIST = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:9000",
    "https://djtweeter.herokuapp.com"
]

#AWS BUCKETS 
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')

AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL = None

AWS_S3_REGION_NAME = 'eu-west-2'
AWS_S3_SIGNATURE_VERSION = 's3v4'
AWS_S3_ADDRESSING_STYLE = "virtual"

#HEROKU
if not DEBUG:
    django_heroku.settings(locals())