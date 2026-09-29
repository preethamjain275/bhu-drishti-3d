from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from app.core.logging import logger

class APIException(HTTPException):
    def __init__(self, status_code: int, message: str, error_code: str = "INTERNAL_ERROR"):
        super().__init__(status_code=status_code, detail=message)
        self.message = message
        self.error_code = error_code

class ResourceNotFoundException(APIException):
    def __init__(self, message: str = "Requested resource was not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, message=message, error_code="RESOURCE_NOT_FOUND")

class BadRequestException(APIException):
    def __init__(self, message: str = "Invalid request payload"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, message=message, error_code="BAD_REQUEST")

async def api_exception_handler(request: Request, exc: APIException):
    logger.warning(f"API Exception [{exc.error_code}]: {exc.message} on path {request.url.path}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "data": None,
            "message": exc.message,
            "error_code": exc.error_code,
        },
    )

async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "data": None,
            "message": "An unexpected internal server error occurred",
            "error_code": "INTERNAL_SERVER_ERROR",
        },
    )
