'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/features/ui/card';
import { LoadingIndicator } from '@/features/ui/loading';
import { ScrollArea } from '@/features/ui/scroll-area';
import { Button } from '@/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/ui/sheet';
import { Book } from 'lucide-react';
import { FC } from 'react';
import { inputPromptStore, useInputPromptState } from './input-prompt-store';

interface SliderProps {}

export const PromptSlider: FC<SliderProps> = (props) => {
  const { prompts, isLoading, isOpened } = useInputPromptState();
  return (
    <Sheet
      open={isOpened}
      onOpenChange={(value) => {
        inputPromptStore.updateOpened(value);
      }}
    >
      <SheetTrigger asChild>
        <Button
          size="icon"
          type="button"
          variant={'ghost'}
          onClick={() => inputPromptStore.openPrompt()}
          aria-label="Open prompt library"
        >
          <Book size={16} />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex min-w-[480px] flex-col">
        <SheetHeader>
          <SheetTitle>Prompt Library</SheetTitle>
        </SheetHeader>
        <ScrollArea className="-mx-6 flex flex-1">
          <div className="whitespace-pre-wrap px-6 pb-6">
            <SheetDescription>
              {!isLoading && prompts.length === 0 ? 'There are no prompts' : ''}
            </SheetDescription>
            <LoadingIndicator isLoading={isLoading} />
            {prompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="mt-2 flex cursor-pointer flex-col hover:bg-secondary/80"
                onClick={() => inputPromptStore.selectPrompt(prompt)}
              >
                <CardHeader className="flex flex-row">
                  <CardTitle className="flex-1">{prompt.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 text-muted-foreground">
                  {prompt.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
