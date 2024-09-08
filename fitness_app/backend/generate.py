
import random
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson import ObjectId


client = MongoClient('mongodb+srv://lchen044:D1feO3qOMgvW4zIx@cluster0.xoh5n5k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')  # Adjust connection string as needed
db = client['test']  
collection = db['workouts']


start_date = datetime(2024, 3, 1)
end_date = datetime(2024, 8, 20)

#generate a random date
def random_date(start, end):
    return start + timedelta(days=random.randint(0, (end - start).days))

#generate a random exercise
def random_exercise():
    return {
        "exercise_id": f"{random.randint(1, 95):04d}",
        "reps": random.randint(1, 14),
        "sets": random.randint(1, 4),
        "weight": random.randint(1, 39),
        "duration": random.randint(1, 24)
    }

# generate a workout
def generate_workout(date):
    return {
        "_id": ObjectId(),  
        "exercises": [random_exercise() for _ in range(random.randint(1, 5))],
        "date": date  
    }

#generate and insert data
current_date = start_date
while current_date <= end_date:
    if current_date.weekday() < 5:  #i want weekdays only
        workout = generate_workout(current_date)
        collection.insert_one(workout)  #insert into mongodb directly
    current_date += timedelta(days=random.choice([1, 2]))

print("Sample data generated and inserted into MongoDB")
