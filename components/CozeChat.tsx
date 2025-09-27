"use client";

import { useEffect } from "react";

export default function CozeChat() {
  useEffect(() => {
    // Tải script SDK từ Coze
    const script = document.createElement("script");
    script.src =
      "https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.2.0-beta.6/libs/oversea/index.js";
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.CozeWebSDK) {
        // @ts-ignore
        new window.CozeWebSDK.WebChatClient({
          config: {
            bot_id: "7550480391825096711",
          },
          componentProps: {
            title: "Coze",
          },
          auth: {
            type: "token",
            token:
              "pat_zNFjKcdVY5MMdXCpNz3E51nZkIxGVy3ygbw7qLkZCc48LY1gnn7uBwIiyhN0fgFV",
            onRefreshToken: function () {
              return "pat_zNFjKcdVY5MMdXCpNz3E51nZkIxGVy3ygbw7qLkZCc48LY1gnn7uBwIiyhN0fgFV";
            },
          },
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
