from fastapi import APIRouter, Depends
from app.api.dependencies import get_verification_service
from app.services.verification_service import VerificationService
from app.schemas.verification import VerificationRecordSchema, VerificationDecisionRequest
from app.schemas.response import StandardResponse, ListResponse
from app.core.errors import ResourceNotFoundException
from app.auth.dependencies import require_permission

router = APIRouter(prefix="/verification", tags=["Verification"])

@router.get("", response_model=ListResponse[VerificationRecordSchema])
def get_verifications(
    service: VerificationService = Depends(get_verification_service),
    user: dict = Depends(require_permission("verification.read")),
):
    records = service.get_verifications()
    return ListResponse(success=True, data=records, total=len(records), message="Verifications retrieved")

@router.get("/{verification_id}", response_model=StandardResponse[VerificationRecordSchema])
def get_verification_by_id(
    verification_id: str,
    service: VerificationService = Depends(get_verification_service),
    user: dict = Depends(require_permission("verification.read")),
):
    rec = service.get_verification_by_id(verification_id)
    if not rec:
        raise ResourceNotFoundException(f"Verification record '{verification_id}' not found")
    return StandardResponse(success=True, data=rec, message="Verification record retrieved")

@router.post("/{verification_id}/decision", response_model=StandardResponse[VerificationRecordSchema])
def submit_verification_decision(
    verification_id: str,
    req: VerificationDecisionRequest,
    service: VerificationService = Depends(get_verification_service),
    user: dict = Depends(require_permission("verification.decide")),
):
    record = service.submit_verification_decision(verification_id, req)
    return StandardResponse(success=True, data=record, message="Verification decision saved")
