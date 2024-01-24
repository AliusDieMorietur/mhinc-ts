import { ChatId, InlineMarkup, Photo } from "../types/telegram";
import { ServiceError } from "../types/error";
import { HttpServiceI } from "../types/http";

export type TelegramChannelOptions = {
  serverUrl: string;
  apiUrl: string;
  token: string;
  http: HttpServiceI;
};

export class TelegramChannel {
  private serverUrl: TelegramChannelOptions["serverUrl"];
  private http: TelegramChannelOptions["http"];
  private apiUrl: TelegramChannelOptions["apiUrl"];
  private token: TelegramChannelOptions["token"];

  constructor({ serverUrl, http, apiUrl, token }: TelegramChannelOptions) {
    this.http = http;
    this.serverUrl = serverUrl;
    this.apiUrl = apiUrl;
    this.token = token;
  }

  async start() {
    if (!this.serverUrl) {
      throw new ServiceError("Server url is required");
    }
    console.log(
      "WEBHOOK_URL",
      `${this.apiUrl}${this.token}/setWebhook?url=${this.serverUrl}/telegram/webhook`
    );
    const response = await this.http.requestJson(
      `${this.apiUrl}${this.token}/setWebhook?url=${this.serverUrl}/telegram/webhook`,
      { method: "GET" }
    );

    console.log("response", response);
  }

  async sendMessage(chatId: ChatId, text: string) {
    const url = `${this.apiUrl}${this.token}/sendMessage`;

    const response = await this.http.requestJson(url, {
      method: "POST",
      body: { text, chat_id: chatId },
    });

    console.log("response", response);
  }

  async sendPhoto(
    chatId: ChatId,
    fileId: string,
    replyMarkup: InlineMarkup = {},
    caption = ""
  ) {
    const url = `${this.apiUrl}${this.token}/sendPhoto`;
    const response = await this.http.requestJson(url, {
      method: "POST",
      body: {
        chat_id: chatId,
        photo: fileId,
        caption,
        reply_markup: replyMarkup,
      },
    });

    console.log("response", response);
  }

  async sendMediaGroup(photos: Photo[], chatId: ChatId, caption: string) {
    const media = photos.map(({ file_unique_id }) => ({
      type: "photo",
      media: file_unique_id,
    }));

    const url = `${this.apiUrl}${this.token}/sendMediaGroup`;
    const response = await this.http.requestJson(url, {
      method: "POST",
      body: {
        chat_id: chatId,
        media,
        caption,
      },
    });

    console.log("response", response);
  }

  async answerCallback(id: string) {
    const url = `${this.apiUrl}${this.token}/answerCallbackQuery`;
    const response = await this.http.requestJson(url, {
      method: "POST",
      body: {
        callback_query_id: id,
      },
    });

    console.log("response", response);
  }
}

// package telegram

// import (
// 	"bytes"
// 	"encoding/json"
// 	"fmt"
// 	"net/http"
// )

// const CHANNEL_ID = -1001665648035

// func (t *TelegramChannel) Start() {
// 	fmt.Println(fmt.Sprintf("%s%s/setWebhook?url=%s", t.apiUrl, t.token, t.serverUrl+"/telegram/webhook"))
// 	response, err := http.Get(fmt.Sprintf("%s%s/setWebhook?url=%s", t.apiUrl, t.token, t.serverUrl+"/telegram/webhook"))
// 	if err != nil {
// 		fmt.Println(err)
// 		return
// 	}
// 	fmt.Println("telegram", response)
// 	defer response.Body.Close()
// }

// func (t *TelegramChannel) UpdateServerUrl(url string) {
// 	t.serverUrl = url
// }

// func (t *TelegramChannel) SendMessage(text string, chatId interface{}) {
// 	var data = []byte(fmt.Sprintf(`{"text":"%s", "chat_id":%v}`, text, chatId))

// 	var url = fmt.Sprintf("%s%s/sendMessage", t.apiUrl, t.token)

// 	fmt.Println(url)
// 	fmt.Println(string(data))

// 	req, err := http.NewRequest("POST", url, bytes.NewBuffer(data))
// 	req.Header.Set("Content-Type", "application/json")

// 	client := &http.Client{}
// 	resp, err := client.Do(req)
// 	if err != nil {
// 		panic(err)
// 	}

// 	fmt.Println("response", resp)
// }

// func (t *TelegramChannel) SendPhoto(payload *PhotoPayload) {
// 	fmt.Println("payload", payload)
// 	var url = fmt.Sprintf("%s%s/sendPhoto", t.apiUrl, t.token)
// 	payloadBytes, err := json.Marshal(payload)
// 	fmt.Println("payloadBytes", string(payloadBytes))
// 	if err != nil {
// 		panic(err)
// 	}
// 	req, err := http.NewRequest("POST", url, bytes.NewBuffer(payloadBytes))
// 	req.Header.Set("Content-Type", "application/json")

// 	client := &http.Client{}
// 	resp, err := client.Do(req)
// 	if err != nil {
// 		panic(err)
// 	}

// 	fmt.Println("response", resp)
// }

// func (t *TelegramChannel) SendMediaGroup(photos []Photo, chatId interface{}, caption string) {
// 	media := []*InputMediaPhoto{}
// 	for _, photo := range photos {
// 		inputMediaPhoto := InputMediaPhoto{Type: "photo", Media: photo.FileId}
// 		media = append(media, &inputMediaPhoto)
// 	}
// 	payload := MediaGroupPayload{
// 		ChatId:  chatId,
// 		Media:   media,
// 		Caption: caption,
// 	}
// 	fmt.Println("payload", payload)
// 	var url = fmt.Sprintf("%s%s/sendMediaGroup", t.apiUrl, t.token)
// 	payloadBytes, err := json.Marshal(payload)
// 	fmt.Println("payloadBytes", string(payloadBytes))
// 	if err != nil {
// 		panic(err)
// 	}
// 	req, err := http.NewRequest("POST", url, bytes.NewBuffer(payloadBytes))
// 	req.Header.Set("Content-Type", "application/json")

// 	client := &http.Client{}
// 	resp, err := client.Do(req)
// 	if err != nil {
// 		panic(err)
// 	}

// 	fmt.Println("response", resp)
// }

// func (t *TelegramChannel) AnswerCallback(id string) {
// 	var data = []byte(fmt.Sprintf(`{"callback_query_id":"%s"}`, id))
// 	var url = fmt.Sprintf("%s%s/answerCallbackQuery", t.apiUrl, t.token)
// 	fmt.Println("answerCallback", "data",string(data))
// 	req, err := http.NewRequest("POST", url, bytes.NewBuffer(data))
// 	req.Header.Set("Content-Type", "application/json")

// 	client := &http.Client{}
// 	resp, err := client.Do(req)
// 	if err != nil {
// 		panic(err)
// 	}

// 	fmt.Println("response", resp)
// }

// func NewTelegramChannel(token string, apiUrl string, serverUrl string) TelegramChannel {
// 	return TelegramChannel{
// 		token,
// 		serverUrl,
// 		apiUrl,
// 	}
// }
