import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # self.user = self.scope["user"]
        # print(request.user)
        # if self.user.is_authenticated:
        await self.channel_layer.group_add(
            f"user_1",
            self.channel_name
        )
        await self.accept()
        print(f"User connected")
        # else:
            # await self.close()
            # print("Unauthenticated user connection closed")

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(
                f"user_{self.user.id}",
                self.channel_name
            )
            print(f"User {self.user.id} disconnected")

    async def receive(self, text_data):
        pass

    async def send_notification(self, event):
        notification = event['notification']
        print(f"Sending notification: {notification}")
        await self.send(text_data=json.dumps({
            'notification': notification
        }))

class EchoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("dgsdg")
        await self.accept()

    async def disconnect(self, close_code):
        print("dgshkjhkdg")
        pass

    async def receive(self, text_data):
        print("asdfasdf")
        await self.send(text_data=text_data)