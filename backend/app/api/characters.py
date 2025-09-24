from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Character
from ..schemas import CharacterResponse, CharacterCreate, CharacterUpdate, SearchRequest, SearchResponse
from ..services.character_service import CharacterService

router = APIRouter(prefix="/characters", tags=["characters"])

@router.get("/", response_model=List[CharacterResponse])
async def get_characters(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    category: Optional[str] = Query(None, regex="^(Animation|Comics|Games)$"),
    db: Session = Depends(get_db)
):
    """获取角色列表"""
    service = CharacterService(db)
    characters = service.get_characters(skip=skip, limit=limit, category=category)
    return characters

@router.get("/{character_id}", response_model=CharacterResponse)
async def get_character(character_id: int, db: Session = Depends(get_db)):
    """获取单个角色详情"""
    service = CharacterService(db)
    character = service.get_character(character_id)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return character

@router.post("/", response_model=CharacterResponse)
async def create_character(character: CharacterCreate, db: Session = Depends(get_db)):
    """创建新角色"""
    service = CharacterService(db)
    return service.create_character(character)

@router.put("/{character_id}", response_model=CharacterResponse)
async def update_character(
    character_id: int, 
    character_update: CharacterUpdate, 
    db: Session = Depends(get_db)
):
    """更新角色信息"""
    service = CharacterService(db)
    character = service.update_character(character_id, character_update)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return character

@router.delete("/{character_id}")
async def delete_character(character_id: int, db: Session = Depends(get_db)):
    """删除角色"""
    service = CharacterService(db)
    success = service.delete_character(character_id)
    if not success:
        raise HTTPException(status_code=404, detail="Character not found")
    return {"message": "Character deleted successfully"}

@router.get("/search/", response_model=SearchResponse)
async def search_characters(
    query: str = Query(..., min_length=1, max_length=200),
    category: Optional[str] = Query(None, regex="^(Animation|Comics|Games)$"),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """搜索角色"""
    service = CharacterService(db)
    characters, total = service.search_characters(query, category, limit)
    return SearchResponse(
        characters=characters,
        total=total,
        query=query
    )

@router.get("/popular/", response_model=List[CharacterResponse])
async def get_popular_characters(
    limit: int = Query(10, ge=1, le=50),
    category: Optional[str] = Query(None, regex="^(Animation|Comics|Games)$"),
    db: Session = Depends(get_db)
):
    """获取热门角色"""
    service = CharacterService(db)
    characters = service.get_popular_characters(limit, category)
    return characters

@router.post("/{character_id}/increment-popularity")
async def increment_popularity(character_id: int, db: Session = Depends(get_db)):
    """增加角色人气值"""
    service = CharacterService(db)
    success = service.increment_popularity(character_id)
    if not success:
        raise HTTPException(status_code=404, detail="Character not found")
    return {"message": "Popularity incremented successfully"}

