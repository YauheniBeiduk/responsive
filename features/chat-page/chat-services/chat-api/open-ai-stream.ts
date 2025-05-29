import { AI_NAME } from '@/features/theme/theme-config';
import { ChatCompletionStreamingRunner } from 'openai/resources/beta/chat/completions';
import { CreateChatMessage } from '../chat-message-service';
import { AzureChatCompletion, AzureChatCompletionAbort, ChatThreadModel } from '../models';

export const OpenAIStream = (props: {
  runner: ChatCompletionStreamingRunner;
  chatThread: ChatThreadModel;
}) => {
  const encoder = new TextEncoder();

  const { runner, chatThread } = props;

  const readableStream = new ReadableStream({
    async start(controller) {
      const streamResponse = (event: string, value: string) => {
        controller.enqueue(encoder.encode(`event: ${event} \n`));
        controller.enqueue(encoder.encode(`data: ${value} \n\n`));
      };

      let lastMessage = '';

      runner
        .on('content', (content) => {
          const completion = runner.currentChatCompletionSnapshot;

          if (completion) {
            const response: AzureChatCompletion = {
              type: 'content',
              response: completion,
            };
            lastMessage = completion.choices[0].message.content ?? '';
            streamResponse(response.type, JSON.stringify(response));
          }
        })
        .on('functionCall', async (functionCall) => {
          const response: AzureChatCompletion = {
            type: 'functionCall',
            response: functionCall,
          };
          streamResponse(response.type, JSON.stringify(response));
        })
        .on('functionCallResult', async (functionCallResult) => {
          const response: AzureChatCompletion = {
            type: 'functionCallResult',
            response: functionCallResult,
          };

          streamResponse(response.type, JSON.stringify(response));
        })
        .on('abort', (error) => {
          const response: AzureChatCompletionAbort = {
            type: 'abort',
            response: 'Chat aborted',
          };
          streamResponse(response.type, JSON.stringify(response));
          controller.close();
        })
        .on('error', async (error) => {
          console.log('🔴 error', error);
          const response: AzureChatCompletion = {
            type: 'error',
            response: error.message,
          };

          // if there is an error still save the last message even though it is not complete

          streamResponse(response.type, JSON.stringify(response));
          controller.close();
        })
        .on('finalContent', async (content: string) => {
          const response: AzureChatCompletion = {
            type: 'finalContent',
            response: content,
          };
          streamResponse(response.type, JSON.stringify(response));
          controller.close();
        });
    },
  });

  return readableStream;
};
