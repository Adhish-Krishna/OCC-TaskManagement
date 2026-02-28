from pydantic import BaseModel, Field
from typing import Optional

# 1. Schema for creating a task (Input Validation)
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="The title of the task")
    description: Optional[str] = Field(None, max_length=500, description="Detailed description")
    completed: bool = Field(default=False, description="Status of the task")

# 2. Schema for returning a task (Output Formatting)
class TaskResponse(TaskCreate):
    id: str = Field(alias="_id") # Maps MongoDB's internal '_id' to a clean 'id' for the frontend

    class Config:
        # Allows Pydantic to populate the model using either 'id' or '_id'
        populate_by_name = True