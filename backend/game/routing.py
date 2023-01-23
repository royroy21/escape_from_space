from django.urls import re_path

from game import consumers

websocket_urlpatterns = [
    re_path(
        r"ws/game/(?P<game_name>\w+)/(?P<channel_name>\w+)/$",
        consumers.GameConsumer.as_asgi(),
    ),
]
