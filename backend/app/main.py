from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from bson import ObjectId

# Import your DB connection and Pydantic models
from .db import task_collection
from .models import TaskCreate, TaskUpdate, TaskResponse

app = FastAPI(title="Task API")

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allow the React frontend (and any origin during development) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Tighten for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helpers ───────────────────────────────────────────────────────────────────
def task_helper(task) -> dict:
    """Format a MongoDB document into a clean dictionary for the API response."""
    return {
        "_id": str(task["_id"]),
        "title": task["title"],
        "description": task.get("description"),
        "assignee": task.get("assignee"),
        "completed": task["completed"],
    }


# ── POST /tasks ───────────────────────────────────────────────────────────────
@app.post("/tasks", response_model=TaskResponse, status_code=201)
async def create_task(task: TaskCreate):
    task_dict = task.model_dump()
    new_task = await task_collection.insert_one(task_dict)
    created_task = await task_collection.find_one({"_id": new_task.inserted_id})
    return task_helper(created_task)


# ── GET /tasks ────────────────────────────────────────────────────────────────
@app.get("/tasks", response_model=List[TaskResponse])
async def get_tasks():
    tasks = []
    async for task in task_collection.find():
        tasks.append(task_helper(task))
    return tasks


# ── PATCH /tasks/{id} ────────────────────────────────────────────────────────
@app.patch("/tasks/{id}", response_model=TaskResponse)
async def update_task(id: str, task_update: TaskUpdate):
    # Only send fields that were explicitly provided (not None)
    update_data = {k: v for k, v in task_update.model_dump().items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = await task_collection.update_one(
        {"_id": ObjectId(id)}, {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    updated_task = await task_collection.find_one({"_id": ObjectId(id)})
    return task_helper(updated_task)


# ── DELETE /tasks/{id} ───────────────────────────────────────────────────────
@app.delete("/tasks/{id}", status_code=204)
async def delete_task(id: str):
    result = await task_collection.delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")