# Backend

## Initial Setup
1. Install the dependencies.
```
pip install -r requirements.txt
```

2. Create a virtual environment.
```
python -m venv venv
```

## Running the Backend
1. Start a virtual environment.

For Windows:
```
venv\Scripts\activate
```

For MacOS:
```
source venv\Scripts\activate
```

2. Go to backend directory
```
cd backend
```

3. Start the server.
```
python manage.py runserver
```

## Updating the DB after Model Changes
Run the following commands to generate the migrations and apply them. This will update the DB tables based on the models.

Create the migrations:
```
python manage.py makemigrations
```

Apply the migrations to update the DB:
```
python manage.py migrate
```
