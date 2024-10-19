import { coffeeSchema } from "@/schema/coffee";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, generateObject } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log({ messages });
  console.log(convertToCoreMessages(messages));

  const objectResult = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: coffeeSchema,
    messages: convertToCoreMessages(messages),
  });

  return objectResult.toJsonResponse();
}
