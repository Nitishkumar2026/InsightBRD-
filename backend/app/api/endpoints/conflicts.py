from sqlalchemy.orm import Session, joinedload

router = APIRouter()

@router.get("/project/{project_id}", response_model=List[schemas.Conflict])
def get_project_conflicts(
    project_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Trigger detection and return list of active conflicts for a project.
    """
    # 1. Trigger detection (In a real app, this might be async or background)
    IntelligenceService.detect_conflicts(str(project_id), db)
    
    # 2. Fetch and return with joined requirements and stakeholders
    conflicts = db.query(models.Conflict).options(
        joinedload(models.Conflict.req_a).joinedload(models.Requirement.stakeholder),
        joinedload(models.Conflict.req_b).joinedload(models.Requirement.stakeholder)
    ).filter(
        models.Conflict.project_id == project_id,
        models.Conflict.is_resolved == False
    ).all()
    
    return conflicts

@router.post("/{conflict_id}/resolve")
def resolve_conflict(
    conflict_id: UUID,
    action: str, # apply, deprecate, ignore
    db: Session = Depends(get_db)
):
    """
    Handle conflict resolution actions.
    """
    conflict = db.query(models.Conflict).filter(models.Conflict.id == conflict_id).first()
    if not conflict:
        raise HTTPException(status_code=404, detail="Conflict not found")
        
    if action == "apply":
        # In a real app, we would apply a specific resolution summary.
        # For now, we mark as resolved.
        conflict.is_resolved = True
    elif action == "deprecate":
        # Mark both requirements as deprecated
        req_a = db.query(models.Requirement).filter(models.Requirement.id == conflict.req_a_id).first()
        req_b = db.query(models.Requirement).filter(models.Requirement.id == conflict.req_b_id).first()
        if req_a: req_a.status = "deprecated"
        if req_b: req_b.status = "deprecated"
        conflict.is_resolved = True
    elif action == "ignore":
        conflict.is_resolved = True
    else:
        raise HTTPException(status_code=400, detail="Invalid action")
        
    db.commit()
    return {"status": "success", "message": f"Conflict {action}ed successfully"}
