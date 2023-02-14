import * as dotenv from 'dotenv'
import { Client } from "@notionhq/client"
dotenv.config()

export default async function addItem(text) {
  console.log(process.env.NOTION_KEY)
  console.log(process.env.NOTION_DATABASE_ID)
  const notion = new Client({ auth: process.env.NOTION_KEY })

  const databaseId = process.env.NOTION_DATABASE_ID
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: {
          title:[
            {
              "text": {
                "content": text
              }
            }
          ]
        }
      },
    })
    console.log(response)
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error.body)
  }
}

