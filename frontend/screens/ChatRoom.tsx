import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

import {
  Channel,
  MessageList,
  MessageInput,
  useChatContext,
  Thread,
} from "stream-chat-expo";

const ChatRoom = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { client } = useChatContext();

  const [channel, setChannel] = useState<any>(null);
  const [thread, setThread] = useState<any>(null);

  const { channelID } = route.params || {};

  useEffect(() => {
    const getChannel = async () => {
      setChannel(null);
      const channels = await client.queryChannels({ id: { $eq: channelID } });
      if (channels.length > 0) {
        setChannel(channels[0]);
      } else {
        console.log("No channels found");
      }
      navigation.setOptions({ title: "PLACEHOLDER" });
    };

    getChannel();
  }, [channelID]);

  if (!channel) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <Channel channel={channel} keyboardVerticalOffset={0} thread={thread}>
      {thread ? (
        <Thread />
      ) : (
        <>
          <MessageList onThreadSelect={setThread} />
          <MessageInput />
        </>
      )}
    </Channel>
  );
};

export default ChatRoom;
