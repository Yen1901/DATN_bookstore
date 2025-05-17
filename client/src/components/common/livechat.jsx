import { useEffect } from "react";

export default function LiveChat() {
  useEffect(() => {
    const liveChatBaseUrl = document.location.protocol + "//" + "livechat.fpt.ai/v36/src";
    const LiveChatSocketUrl = "livechat.fpt.ai:443";
    let FptAppCode = "584b5f18c4faba4e47d41833f317fa98";
    const FptAppName = "Nhà sách Tiến Thọ";

    const CustomStyles = {
      headerBackground: "#3C3737FF",
      headerTextColor: "#ffffffff",
      headerLogoEnable: true,
      headerLogoLink: "https://chatbot-tools.fpt.ai/livechat-builder/img/theme/digital_agency/logo_head.svg",
      headerText: "Nhà sách Tiến Thọ",
      primaryColor: "#EB6C0FFF",
      secondaryColor: "#ecececff",
      primaryTextColor: "#ffffffff",
      secondaryTextColor: "#000000DE",
      buttonColor: "#b4b4b4B3",
      buttonTextColor: "#ffffffff",
      bodyBackgroundEnable: true,
      bodyBackgroundLink: "https://chatbot-tools.fpt.ai/livechat-builder/img/theme/digital_agency/body.png",
      avatarBot: "https://chatbot-tools.fpt.ai/livechat-builder/img/theme/digital_agency/bot.svg",
      sendMessagePlaceholder: "Nhập tin nhắn",
      floatButtonLogo: "https://chatbot-tools.fpt.ai/livechat-builder/img/theme/digital_agency/logo.svg",
      floatButtonTooltip: "Mình có thể giúp gì cho bạn?",
      floatButtonTooltipEnable: true,
      customerLogo: "https://chatbot-tools.fpt.ai/livechat-builder/img/theme/digital_agency/logo.svg",
      customerWelcomeText: "Vui lòng nhập tên",
      customerButtonText: "Bắt đầu",
      prefixEnable: false,
      prefixType: "radio",
      prefixOptions: ["Anh", "Chị"],
      prefixPlaceholder: "Danh xưng",
      css: `
        #fpt_ai_livechat_container {
          right: auto !important;
          left: 20px !important;
          bottom: 20px !important;
        }
      `
    };

    if (!FptAppCode) {
      const appCodeFromHash = window.location.hash.substr(1);
      if (appCodeFromHash.length === 32) {
        FptAppCode = appCodeFromHash;
      }
    }

    const FptLiveChatConfigs = {
      appName: FptAppName,
      appCode: FptAppCode,
      themes: "",
      styles: CustomStyles,
    };

    const script = document.createElement("script");
    script.src = `${liveChatBaseUrl}/static/fptai-livechat.js`;
    script.id = "fpt_ai_livechat_script";
    script.onload = () => {
      window.fpt_ai_render_chatbox(FptLiveChatConfigs, liveChatBaseUrl, LiveChatSocketUrl);

      setTimeout(() => {
        const style = document.createElement("style");
        style.innerHTML = `
          #fpt_ai_livechat_button img {
            width: 60px !important;
            height: 36px !important;
          }
          body #fpt_ai_livechat_button img {
            width: 60px !important;
            height: 36px !important;
          }
        `;
        document.head.appendChild(style);
      }, 100);
    };

    const css = document.createElement("link");
    css.href = `${liveChatBaseUrl}/static/fptai-livechat.css`;
    css.rel = "stylesheet";
    css.id = "fpt_ai_livechat_style";

    document.body.appendChild(script);
    document.body.appendChild(css);

    return () => {
      document.getElementById("fpt_ai_livechat_script")?.remove();
      document.getElementById("fpt_ai_livechat_style")?.remove();
      document.getElementById("fpt_ai_livechat_container")?.remove();
    };
  }, []);

  return null;
}
