from fastapi import APIRouter, Depends
from app.api.dependencies import get_recommendation_service
from app.services.recommendation_service import RecommendationService
from app.schemas.recommendation import RecommendationSchema, GenerateRecommendationRequest
from app.schemas.response import StandardResponse, ListResponse
from app.core.errors import ResourceNotFoundException

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("", response_model=ListResponse[RecommendationSchema])
def get_recommendations(
    service: RecommendationService = Depends(get_recommendation_service),
):
    recs = service.get_recommendations()
    return ListResponse(success=True, data=recs, total=len(recs), message="Recommendations retrieved")

@router.get("/{recommendation_id}", response_model=StandardResponse[RecommendationSchema])
def get_recommendation_by_id(
    recommendation_id: str,
    service: RecommendationService = Depends(get_recommendation_service),
):
    rec = service.get_recommendation_by_id(recommendation_id)
    if not rec:
        raise ResourceNotFoundException(f"Recommendation '{recommendation_id}' not found")
    return StandardResponse(success=True, data=rec, message="Recommendation retrieved")

@router.post("/generate", response_model=StandardResponse[RecommendationSchema])
def generate_recommendation(
    req: GenerateRecommendationRequest,
    service: RecommendationService = Depends(get_recommendation_service),
):
    rec = service.generate_recommendation(req)
    return StandardResponse(success=True, data=rec, message="Recommendation generated")
