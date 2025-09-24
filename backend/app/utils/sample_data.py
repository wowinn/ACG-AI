from sqlalchemy.orm import Session
from ..models import Character, User
from ..schemas import CharacterCreate, UserCreate
from ..services.character_service import CharacterService
from ..services.user_service import UserService
from .logging_config import get_logger

logger = get_logger(__name__)

def create_sample_data(db: Session):
    """创建示例数据"""
    
    logger.info("正在创建示例数据...")

    # 创建示例角色
    character_service = CharacterService(db)
    
    # 1. 桐谷和人 (刀剑神域)
    if not character_service.get_character_by_name("桐谷和人"):
        kirito = CharacterCreate(
            name="桐谷和人",
            name_en="Kirito",
            name_jp="キリト",
            series="刀剑神域",
            series_en="Sword Art Online",
            category="Animation",
            description="《刀剑神域》的主角，拥有超群的游戏天赋和强大的实力。在死亡游戏SAO中展现出了非凡的勇气和智慧。",
            personality="冷静、沉着、善良、有责任感",
            abilities="二刀流、星爆气流斩、超反应速度",
            background="被困在死亡游戏SAO中，为了生存而战斗。最终成为SAO的攻略者，拯救了所有玩家。",
            image_url="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=face",
            voice_actor="松冈祯丞",
            age=16,
            gender="男",
            birthday="10月7日",
            height="172cm",
            weight="58kg",
            blood_type="A型",
            tags="SAO, 虚拟世界, 剑士, 主角, 游戏",
            popularity_score=95
        )
        character_service.create_character(kirito)
        logger.info("创建角色: 桐谷和人")

    # 2. 蕾姆 (Re:从零开始的异世界生活)
    if not character_service.get_character_by_name("蕾姆"):
        rem = CharacterCreate(
            name="蕾姆",
            name_en="Rem",
            name_jp="レム",
            series="Re:从零开始的异世界生活",
            series_en="Re:Zero - Starting Life in Another World",
            category="Animation",
            description="《Re:从零开始的异世界生活》中的主要角色，罗兹瓦尔宅邸的双胞胎女仆之一。拥有强大的战斗能力和治愈魔法。",
            personality="温柔、忠诚、勇敢、有点自卑",
            abilities="鬼化、治愈魔法、战斗技巧、家务全能",
            background="曾经因为嫉妒而伤害过姐姐拉姆，后来被昴拯救，从此对昴忠心耿耿。",
            image_url="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=face",
            voice_actor="水濑祈",
            age=17,
            gender="女",
            birthday="2月2日",
            height="154cm",
            weight="43kg",
            blood_type="A型",
            tags="Re:Zero, 女仆, 鬼族, 治愈, 忠诚",
            popularity_score=98
        )
        character_service.create_character(rem)
        logger.info("创建角色: 蕾姆")

    # 3. 亚丝娜 (刀剑神域)
    if not character_service.get_character_by_name("亚丝娜"):
        asuna = CharacterCreate(
            name="亚丝娜",
            name_en="Asuna",
            name_jp="アスナ",
            series="刀剑神域",
            series_en="Sword Art Online",
            category="Animation",
            description="《刀剑神域》的女主角，SAO中的顶级玩家之一。拥有出色的剑术和领导能力，被称为'闪光'。",
            personality="坚强、温柔、有领导力、专一",
            abilities="细剑术、闪光斩击、领导能力、料理技能",
            background="SAO中的攻略组成员，后来与桐人相遇并相恋。在游戏中展现出了非凡的战斗技巧。",
            image_url="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=face",
            voice_actor="户松遥",
            age=17,
            gender="女",
            birthday="9月30日",
            height="168cm",
            weight="55kg",
            blood_type="B型",
            tags="SAO, 闪光, 细剑, 女主角, 攻略组",
            popularity_score=92
        )
        character_service.create_character(asuna)
        logger.info("创建角色: 亚丝娜")

    # 4. 盖伦 (英雄联盟)
    if not character_service.get_character_by_name("盖伦"):
        garen = CharacterCreate(
            name="盖伦",
            name_en="Garen",
            series="英雄联盟",
            series_en="League of Legends",
            category="Games",
            description="《英雄联盟》中的一名战士英雄，德玛西亚的典范。拥有强大的防御能力和正义感。",
            personality="英勇、正直、坚韧、忠诚",
            abilities="审判、德玛西亚正义、勇气、坚韧",
            background="德玛西亚之力，无畏先锋的领袖。为了保护德玛西亚而战斗。",
            image_url="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=face",
            voice_actor="未知",
            gender="男",
            tags="LOL, 德玛西亚, 战士, 正义, 无畏先锋",
            popularity_score=85
        )
        character_service.create_character(garen)
        logger.info("创建角色: 盖伦")

    # 5. 路飞 (海贼王)
    if not character_service.get_character_by_name("蒙奇·D·路飞"):
        luffy = CharacterCreate(
            name="蒙奇·D·路飞",
            name_en="Monkey D. Luffy",
            name_jp="モンキー・D・ルフィ",
            series="海贼王",
            series_en="One Piece",
            category="Animation",
            description="《海贼王》的主角，草帽海贼团的船长。拥有橡胶果实能力，梦想成为海贼王。",
            personality="乐观、勇敢、单纯、重义气",
            abilities="橡胶果实、霸气、格斗技巧、领导力",
            background="从小梦想成为海贼王，踏上了寻找ONE PIECE的冒险之旅。",
            image_url="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=face",
            voice_actor="田中真弓",
            age=19,
            gender="男",
            birthday="5月5日",
            height="174cm",
            weight="70kg",
            blood_type="F型",
            tags="海贼王, 橡胶果实, 草帽, 海贼王, 冒险",
            popularity_score=96
        )
        character_service.create_character(luffy)
        logger.info("创建角色: 蒙奇·D·路飞")
    
    # 创建示例用户
    user_service = UserService(db)
    if not user_service.get_user_by_username("testuser"):
        test_user = UserCreate(
            username="testuser",
            email="test@example.com",
            password="password123",
            preferences='{"favorite_category": "Animation"}'
        )
        user_service.create_user(test_user)
        logger.info("创建用户: testuser")

    logger.info("示例数据创建完成。")
