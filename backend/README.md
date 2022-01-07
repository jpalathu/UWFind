# Backend

Postman link to join and test some APIs: https://app.getpostman.com/join-team?invite_code=d8c64230aef8c4c2ca6f06196bcfd023

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

## Loading initial data into the DB
Create a JSON file in the fixtures directory and run the following command to load into the DB.
```
python manage.py loaddata <FIXTURE FILE NAME>
```
