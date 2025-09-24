import logging
import sys
from pathlib import Path
from typing import Optional

# 配置日志格式
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

def setup_logging(
    level: str = "INFO",
    log_file: Optional[str] = None,
    log_format: str = LOG_FORMAT,
    date_format: str = DATE_FORMAT
) -> logging.Logger:
    """
    设置日志配置
    
    Args:
        level: 日志级别 (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: 日志文件路径，如果为None则只输出到控制台
        log_format: 日志格式
        date_format: 日期格式
    
    Returns:
        配置好的logger实例
    """
    # 创建logger
    logger = logging.getLogger("acg_ai")
    logger.setLevel(getattr(logging, level.upper()))
    
    # 清除已有的handlers
    logger.handlers.clear()
    
    # 创建formatter
    formatter = logging.Formatter(log_format, date_format)
    
    # 控制台handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(getattr(logging, level.upper()))
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # 文件handler（如果指定了日志文件）
    if log_file:
        # 确保日志目录存在
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        
        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setLevel(getattr(logging, level.upper()))
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger

def get_logger(name: str = "acg_ai") -> logging.Logger:
    """
    获取logger实例
    
    Args:
        name: logger名称
    
    Returns:
        logger实例
    """
    return logging.getLogger(name)

# 默认logger
logger = get_logger()
