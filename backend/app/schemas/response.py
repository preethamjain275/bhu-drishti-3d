from typing import Generic, TypeVar, Optional, List
from pydantic import BaseModel

T = TypeVar("T")

class StandardResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: str = "Request completed successfully"

class ListResponse(BaseModel, Generic[T]):
    success: bool = True
    data: List[T] = []
    total: int = 0
    message: str = "Records retrieved successfully"

class ErrorResponse(BaseModel):
    success: bool = False
    data: None = None
    message: str
    error_code: str
