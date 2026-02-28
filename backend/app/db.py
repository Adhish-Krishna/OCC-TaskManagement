import os
from motor.motor_asyncio import AsyncIOMotorClient

# Pull the MongoDB connection string from environment variables.
# If it's not set (like in local dev), default to a local MongoDB instance.
MONGO_DETAILS = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Initialize the MongoDB client
client = AsyncIOMotorClient(MONGO_DETAILS)

# Connect to a database named 'task_database' (MongoDB creates this automatically if it doesn't exist)
database = client.task_database

# Connect to a collection named 'tasks' within that database
task_collection = database.get_collection("tasks")