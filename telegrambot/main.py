import asyncio
import os
from aiogram.client.session import aiohttp
from aiohttp import ClientSession

from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart

load_dotenv()

BACKEND_URL = os.getenv('BACKEND_URL')
bot = Bot(token=os.getenv('TELEGRAM_SECRET_KEY'))

dp = Dispatcher()


@dp.message(CommandStart())
async def start(message: types.Message):
    start_command = message.text
    work_id = start_command[7:]
    global work_id_storage, video_received

    work_id_storage = work_id
    video_received = False

    await message.answer(f"Здравствуйте! Отправьте видео, чтобы прикрепить его к вашему участию с номером {work_id}!")


@dp.message()
async def send_work(message: types.Message):
    global work_id_storage, video_received

    if video_received:
        await message.answer("Вы уже прикрепили видео. Отправка дополнительных видео запрещена.")
        return

    work_id = work_id_storage
    try:
        if message.content_type != 'video' or message.media_group_id is not None:
            await message.answer("Пожалуйста, отправьте только одно видео в сообщении.")
            return

        async with ClientSession() as session:
            async with session.patch(f"{BACKEND_URL}/api/v1/works/{work_id}/", json=
            {"url_video": message.video.file_id, "user": "telegram"},
                                     headers={"Content-Type": "application/json"}) as response:
                if response.status == 200:
                    await message.answer("Видео успешно отправлено!")
                    video_received = True
    except aiohttp.ClientError as e:
        await message.answer(f"Произошла ошибка при отправке видео: {str(e)}")


@dp.message
async def ignore_other_messages(message: types.Message):
    if not video_received:
        await message.answer("Пожалуйста, отправьте видео. Я не воспринимаю других сообщений.")


async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot, allowed_updates=['message'])


asyncio.run(main())
