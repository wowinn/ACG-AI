from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional, Tuple
from ..models import Character
from ..schemas import CharacterCreate, CharacterUpdate, CharacterResponse

class CharacterService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_characters(
        self, 
        skip: int = 0, 
        limit: int = 10, 
        category: Optional[str] = None
    ) -> List[CharacterResponse]:
        """获取角色列表"""
        query = self.db.query(Character).filter(Character.is_active == True)
        
        if category:
            query = query.filter(Character.category == category)
        
        characters = query.offset(skip).limit(limit).all()
        return [CharacterResponse.from_orm(char) for char in characters]
    
    def get_character(self, character_id: int) -> Optional[CharacterResponse]:
        """获取单个角色"""
        character = self.db.query(Character).filter(
            Character.id == character_id,
            Character.is_active == True
        ).first()
        
        if character:
            return CharacterResponse.from_orm(character)
        return None
    
    def get_character_by_name(self, name: str) -> Optional[Character]:
        """根据名称获取角色"""
        character = self.db.query(Character).filter(
            Character.name == name,
            Character.is_active == True
        ).first()
        return character
    
    def create_character(self, character_data: CharacterCreate) -> CharacterResponse:
        """创建新角色"""
        character = Character(**character_data.dict())
        self.db.add(character)
        self.db.commit()
        self.db.refresh(character)
        return CharacterResponse.from_orm(character)
    
    def update_character(
        self, 
        character_id: int, 
        character_update: CharacterUpdate
    ) -> Optional[CharacterResponse]:
        """更新角色信息"""
        character = self.db.query(Character).filter(
            Character.id == character_id,
            Character.is_active == True
        ).first()
        
        if not character:
            return None
        
        update_data = character_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(character, field, value)
        
        self.db.commit()
        self.db.refresh(character)
        return CharacterResponse.from_orm(character)
    
    def delete_character(self, character_id: int) -> bool:
        """软删除角色"""
        character = self.db.query(Character).filter(
            Character.id == character_id,
            Character.is_active == True
        ).first()
        
        if not character:
            return False
        
        character.is_active = False
        self.db.commit()
        return True
    
    def search_characters(
        self, 
        query: str, 
        category: Optional[str] = None, 
        limit: int = 10
    ) -> Tuple[List[CharacterResponse], int]:
        """搜索角色"""
        search_query = self.db.query(Character).filter(Character.is_active == True)
        
        # 构建搜索条件
        search_conditions = or_(
            Character.name.contains(query),
            Character.name_en.contains(query),
            Character.name_jp.contains(query),
            Character.series.contains(query),
            Character.series_en.contains(query),
            Character.series_jp.contains(query),
            Character.description.contains(query),
            Character.personality.contains(query),
            Character.abilities.contains(query)
        )
        
        search_query = search_query.filter(search_conditions)
        
        if category:
            search_query = search_query.filter(Character.category == category)
        
        # 获取总数
        total = search_query.count()
        
        # 获取结果
        characters = search_query.order_by(Character.popularity_score.desc()).limit(limit).all()
        
        return [CharacterResponse.from_orm(char) for char in characters], total
    
    def get_popular_characters(
        self, 
        limit: int = 10, 
        category: Optional[str] = None
    ) -> List[CharacterResponse]:
        """获取热门角色"""
        query = self.db.query(Character).filter(Character.is_active == True)
        
        if category:
            query = query.filter(Character.category == category)
        
        characters = query.order_by(Character.popularity_score.desc()).limit(limit).all()
        return [CharacterResponse.from_orm(char) for char in characters]
    
    def increment_popularity(self, character_id: int) -> bool:
        """增加角色人气值"""
        character = self.db.query(Character).filter(
            Character.id == character_id,
            Character.is_active == True
        ).first()
        
        if not character:
            return False
        
        character.popularity_score += 1
        self.db.commit()
        return True
    
    def get_characters_by_series(self, series: str) -> List[CharacterResponse]:
        """根据作品获取角色"""
        characters = self.db.query(Character).filter(
            Character.is_active == True,
            or_(
                Character.series == series,
                Character.series_en == series,
                Character.series_jp == series
            )
        ).all()
        
        return [CharacterResponse.from_orm(char) for char in characters]
    
    def get_character_statistics(self) -> dict:
        """获取角色统计信息"""
        total_characters = self.db.query(Character).filter(Character.is_active == True).count()
        
        animation_count = self.db.query(Character).filter(
            Character.is_active == True,
            Character.category == "Animation"
        ).count()
        
        comics_count = self.db.query(Character).filter(
            Character.is_active == True,
            Character.category == "Comics"
        ).count()
        
        games_count = self.db.query(Character).filter(
            Character.is_active == True,
            Character.category == "Games"
        ).count()
        
        return {
            "total_characters": total_characters,
            "animation_characters": animation_count,
            "comics_characters": comics_count,
            "games_characters": games_count
        }

