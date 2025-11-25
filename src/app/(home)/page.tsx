"use client";
import Chat from "@/components/chat/Chat";
import React from "react";
import scss from "./page.module.scss";
import { useRouter } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";

const page = () => {
  const router = useRouter();
  const users = [
    { name: "Aslan", roomLink: "Aslan" },
    { name: "ali", roomLink: "Ali" },
    { name: "umar", roomLink: "Umar" },
    { name: "ali", roomLink: "Ali" },
  ];
  return (
    <div className={scss.chat}>
      <div className={scss.chat_header}>
        <span>
          <GiHamburgerMenu />
        </span>
        <input type="text" placeholder="search" />
      </div>

      {users.map((item, idx) => (
        <div key={idx} className={scss.users}>
          <div
            onClick={() => router.push(`chat/${item.roomLink}`)}
            className={scss.card}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oghbsuzggpkknQSSU-Ch_xep_9v3m6EeBQ&s"
              alt=""
            />
            <h4>{item.name}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;
