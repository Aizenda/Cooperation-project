from fastapi import *
from backend.schemas.webhook import Webhook_model, get_webhook_form
from backend.model.bot_CRUD import create_webhook_data, update_webhook_data
from fastapi.responses import JSONResponse
router = APIRouter(prefix="/api")


@router.post("/webhook_url")
def create_webhook(webhook: Webhook_model = Depends(get_webhook_form)):
    print(webhook.email,  webhook.webhook_url,
          webhook.city,  webhook.notify_time)
    data = create_webhook_data(webhook.email,  webhook.webhook_url,
                               webhook.city,  webhook.notify_time)
    return JSONResponse(content=data, status_code=200)


@router.post("/webhook_url/update")
def update_webhook(webhook: Webhook_model = Depends(get_webhook_form)):
    data = update_webhook_data(webhook.email,  webhook.webhook_url,
                               webhook.city,  webhook.notify_time)
    return JSONResponse(content=data, status_code=200)
