"use client";
import React, { useEffect, useState } from "react";
import scss from "./chat.module.scss";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { SUPA_KEY, SUPA_URL } from "@/constants/supabase";
import { IoVideocam } from "react-icons/io5";
import { stat } from "fs";
import { useParams, useRouter } from "next/navigation";
interface IMessages {
  message: string;
  id: number;
  created_ad: string;
  room_id: string;
  username: string;
}

const Chat = () => {
  // const [channel, setChannel] = useState<null | RealtimeChannel>();
  const [messages, setMessages] = useState<IMessages[]>([]);
  const [value, setValue] = useState("");
  const SUPA_CLIENT = createClient(SUPA_URL, SUPA_KEY);
  const router = useRouter();

  const { room } = useParams();

  // useEffect(() => {
  //   const channel = SUPA_CLIENT.channel("chat");
  //   channel.on(
  //     "postgres_changes",
  //     {
  //       event: "INSERT",
  //       schema: "public",
  //       filter: `room:${room}`,
  //       table: "chat_14",
  //     },
  //     (payload) => {
  //       console.log(payload);

  //       setMessages((prev) => [...prev, payload.new]);
  //     }
  //   );
  //   const initChat = async () => {
  //     const res = await SUPA_CLIENT.from("chat_14")
  //       .select("*")
  //       .eq("room_id", room)
  //       .order("created_at", { ascending: true });
  //     if (res.data) {
  //       setMessages(res.data);
  //     }
  //   };
  //   initChat();

  //   channel.subscribe();
  //   return () => SUPA_CLIENT.removeChannel(channel);
  // }, [room, messages]);

  useEffect(() => {
    const channel = SUPA_CLIENT.channel("chat");

    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        filter: `room:${room}`,
        table: "chat_14",
      },
      (payload) => {
        console.log(payload);
        setMessages((prev) => [...prev, payload.new as IMessages]);
      }
    );

    // Инициализация чата
    const initChat = async () => {
      const res = await SUPA_CLIENT.from("chat_14")
        .select("*")
        .eq("room_id", room)
        .order("created_at", { ascending: true });

      if (res.data) {
        setMessages(res.data);
      }
    };
    initChat();

    // Подписка на канал (async, но cleanup синхронный)
    channel.subscribe();

    return () => {
      // Синхронный cleanup
      SUPA_CLIENT.removeChannel(channel);
    };
  }, [room]); // Убираем messages из зависимостей

  const sendMessage = async () => {
    await SUPA_CLIENT.from("chat_14").insert({
      message: value,
      room_id: room,
    });
    setValue("");
  };

  return (
    <div className={scss.container}>
      <div className={scss.container}>
        <div className={scss.mainContainer}>
          <div className={scss.header}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oghbsuzggpkknQSSU-Ch_xep_9v3m6EeBQ&s"
              alt=""
            />
            <h1>{room}</h1>
            <span onClick={() => router.push("/call")}>
              <IoVideocam />
            </span>
          </div>
          <div className={scss.sender}>
            <input
              value={value}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              type="text"
              placeholder="message a text "
              onChange={(e) => setValue(e.target.value)}
            />
            <button onClick={() => sendMessage()}>Send message</button>
          </div>
          <div className={scss.chat}>
            {messages?.map((el, idx) => (
              <h2 key={idx}>{el.message}</h2>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
