from pydantic import BaseModel, Field
from typing import Optional

# 1. Schema for creating a task (Input Validation)
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="The title of the task")
    description: Optional[str] = Field(None, max_length=500, description="Detailed description")
    assignee: Optional[str] = Field(None, max_length=100, description="Person assigned to the task")
    completed: bool = Field(default=False, description="Status of the task")

# 2. Schema for partial updates (all fields optional)
class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    assignee: Optional[str] = Field(None, max_length=100)
    completed: Optional[bool] = None

# 3. Schema for returning a task (Output Formatting)
class TaskResponse(BaseModel):
    id: str = Field(..., alias="_id")  # Maps MongoDB's '_id' to '_id' in JSON output
    title: str
    description: Optional[str] = None
    assignee: Optional[str] = None
    completed: bool

    class Config:
        populate_by_name = True