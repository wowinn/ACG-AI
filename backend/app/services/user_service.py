from sqlalchemy.orm import Session
from typing import List, Optional
from ..models import User
from ..schemas import UserCreate, UserUpdate, UserResponse
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_user(self, user_id: int) -> Optional[UserResponse]:
        """获取用户信息"""
        user = self.db.query(User).filter(
            User.id == user_id,
            User.is_active == True
        ).first()
        
        if user:
            return UserResponse.from_orm(user)
        return None
    
    def get_user_by_username(self, username: str) -> Optional[User]:
        """根据用户名获取用户"""
        return self.db.query(User).filter(
            User.username == username,
            User.is_active == True
        ).first()
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """根据邮箱获取用户"""
        return self.db.query(User).filter(
            User.email == email,
            User.is_active == True
        ).first()
    
    def get_users(self, skip: int = 0, limit: int = 10) -> List[UserResponse]:
        """获取用户列表"""
        users = self.db.query(User).filter(User.is_active == True).offset(skip).limit(limit).all()
        return [UserResponse.from_orm(user) for user in users]
    
    def create_user(self, user_data: UserCreate) -> UserResponse:
        """创建新用户"""
        hashed_password = pwd_context.hash(user_data.password)
        
        user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password
        )
        
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return UserResponse.from_orm(user)
    
    def update_user(self, user_id: int, user_update: UserUpdate) -> Optional[UserResponse]:
        """更新用户信息"""
        user = self.db.query(User).filter(
            User.id == user_id,
            User.is_active == True
        ).first()
        
        if not user:
            return None
        
        update_data = user_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        self.db.commit()
        self.db.refresh(user)
        return UserResponse.from_orm(user)
    
    def delete_user(self, user_id: int) -> bool:
        """软删除用户"""
        user = self.db.query(User).filter(
            User.id == user_id,
            User.is_active == True
        ).first()
        
        if not user:
            return False
        
        user.is_active = False
        self.db.commit()
        return True
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """验证密码"""
        return pwd_context.verify(plain_password, hashed_password)
    
    def authenticate_user(self, username: str, password: str) -> Optional[User]:
        """用户认证"""
        user = self.get_user_by_username(username)
        if not user:
            return None
        if not self.verify_password(password, user.hashed_password):
            return None
        return user

