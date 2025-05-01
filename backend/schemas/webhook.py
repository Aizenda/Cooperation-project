from pydantic import BaseModel, validator
from datetime import datetime
from fastapi import Form, HTTPException
from typing import Optional


class Webhook_model(BaseModel):
    email: str
    webhook_url: Optional[str] = None
    city:  Optional[str] = None
    notify_time:  Optional[str] = None

    @validator("email")
    def email_validator(cls, v):
        try:
            if "@" not in v:
                raise ValueError
            return v
        except ValueError:
            raise HTTPException(status_code=400, detail="email格式錯誤")

    @validator("notify_time")
    def validate_notify_time_format(cls, v):
        if not v or v.strip() == "":
            return None
        v = v.strip()
        try:
            datetime.strptime(v, "%H:%M")
        except ValueError:
            raise HTTPException(
                status_code=400, detail="時間格式錯誤，請使用 24 小時制，例如 08:30 或 17:45")
        return v


def get_webhook_form(
        email: str = Form(...),
        webhook_url: Optional[str] = Form(None),
        city: Optional[str] = Form(None),
        notify_time: Optional[str] = Form(None)):
    return Webhook_model(
        email=email,
        webhook_url=webhook_url,
        city=city,
        notify_time=notify_time
    )
