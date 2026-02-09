import { coffeeSchema } from "@/schema/coffee";
import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, generateText, Output } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const modelMessages = await convertToModelMessages(messages);
  console.log({ messages });
  console.log(modelMessages);

  const { output } = await generateText({
    model: openai("gpt-4o-mini"),
    output: Output.object({ schema: coffeeSchema }),
    messages: modelMessages,
  });

  return Response.json(output);
}
