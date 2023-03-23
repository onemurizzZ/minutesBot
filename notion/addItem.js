import * as dotenv from 'dotenv'
import { Client } from "@notionhq/client"
dotenv.config()

export default async function addItem(text) {
  const NOTION_KEY = process.env.NOTION_KEY
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

  console.log("using NOTION_KEY: ", NOTION_KEY)
  console.log("using NOTION_DATABASE_ID: ", NOTION_DATABASE_ID)

  const notion = new Client({ auth: NOTION_KEY })

  try {
    const response = await notion.pages.create({
      "icon": {
        "type": "emoji",
        "emoji": "😼"
      },
      "parent": { database_id: NOTION_DATABASE_ID },
      "properties": {
        "Name": {
          "title": [
            {
              "text": {
                "content": text
              }
            }
          ]
        },
        "participants": {
          "people": [],
        },
      },
      "children": [
        {
          "type": "heading_1",
          "heading_1": {
            "rich_text": [
              {
                "text": {
                  "content": "議題 📌"
                }
              }
            ]
          }
        },
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "",
                  "link": null
                }
              }
            ],
            "color": "default"
          }
        },
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "",
                  "link": null
                }
              }
            ],
            "color": "default"
          }
        },
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "",
                  "link": null
                }
              }
            ],
            "color": "default"
          }
        },
        {
          "type": "heading_1",
          "heading_1": {
            "rich_text": [
              {
                "text": {
                  "content": "共有メモ 🚄"
                }
              }
            ]
          }
        },
        {
          "type": "bulleted_list_item",
          "bulleted_list_item": {
            "rich_text": [{
              "type": "text",
              "text": {
                "content": "",
                "link": null
              }
            }],
            "color": "default"
          }
        },
        {
          "type": "heading_1",
          "heading_1": {
            "rich_text": [
              {
                "text": {
                  "content": "議事録 💬"
                }
              }
            ]
          }
        },
        {
          "type": "paragraph",
          "paragraph": {
            "rich_text": [{
              "type": "text",
              "text": {
                "content": "",
                "link": null,
              }
            }],
            "color": "default"
          }
        },
        {
          "type": "paragraph",
          "paragraph": {
            "rich_text": [{
              "type": "text",
              "text": {
                "content": "",
                "link": null,
              }
            }],
            "color": "default"
          }
        },
        {
          "type": "paragraph",
          "paragraph": {
            "rich_text": [{
              "type": "text",
              "text": {
                "content": "",
                "link": null,
              }
            }],
            "color": "default"
          }
        },
        {
          "type": "heading_1",
          "heading_1": {
            "rich_text": [
              {
                "text": {
                  "content": "次やること ✅"
                }
              }
            ]
          }
        },
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "",
                  "link": null
                }
              }
            ],
            "color": "default"
          }
        },
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "",
                  "link": null
                }
              }
            ],
            "color": "default"
          }
        },
        {
          "type": "to_do",
          "to_do": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "",
                  "link": null
                }
              }
            ],
            "color": "default"
          }
        },
        {
          "type": "heading_1",
          "heading_1": {
            "rich_text": [
              {
                "text": {
                  "content": "資料 📎"
                }
              }
            ]
          }
        },
      ]
    })
    console.log(response)
    console.log("Success! Entry added.")
    return response
  } catch (error) {
    console.error(error.body)
  }
}
