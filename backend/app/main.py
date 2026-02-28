from fastapi import FastAPI, HTTPException
from typing import List

# Import your DB connection and Pydantic models
from .db import task_collection
from .models import TaskCreate, TaskResponse

app = FastAPI(title="Task API")

# Helper function to format the MongoDB document into a clean dictionary
def task_helper(task) -> dict:
    return {
        "id": str(task["_id"]),
        "title": task["title"],
        "description": task.get("description"),
        "completed": task["completed"]
    }

# POST /tasks -> Create a new task
@app.post("/tasks", response_model=TaskResponse, status_code=201)
async def create_task(task: TaskCreate):
    # Convert the validated Pydantic model into a dictionary
    task_dict = task.model_dump()
    
    # Insert it into MongoDB
    new_task = await task_collection.insert_one(task_dict)
    
    # Fetch the newly created task to return it
    created_task = await task_collection.find_one({"_id": new_task.inserted_id})
    
    return task_helper(created_task)

# GET /tasks -> Fetch all tasks
@app.get("/tasks", response_model=List[TaskResponse])
async def get_tasks():
    tasks = []
    # Iterate through all documents in the collection
    async for task in task_collection.find():
        tasks.append(task_helper(task))
    return tasks