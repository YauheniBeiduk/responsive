'use client';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/ui/sheet';
import { useSession } from 'next-auth/react';
import { FC } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { ServerActionResponse } from '../common/server-action-response';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { LoadingIndicator } from '../ui/loading';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { addOrUpdatePrompt, promptStore, usePromptState } from './prompt-store';

interface SliderProps {}

export const AddPromptSlider: FC<SliderProps> = (props) => {
  const initialState: ServerActionResponse | undefined = undefined;

  const { isOpened, prompt } = usePromptState();

  const [formState, formAction] = useFormState(addOrUpdatePrompt, initialState);

  const { data } = useSession();

  const PublicSwitch = () => {
    if (data === undefined || data === null) return null;

    if (data?.user?.isAdmin) {
      return (
        <div className="flex items-center space-x-2">
          <Switch name="isPublished" defaultChecked={prompt.isPublished} />
          <Label htmlFor="description">Publish</Label>
        </div>
      );
    }
  };

  return (
    <Sheet
      open={isOpened}
      onOpenChange={(value) => {
        promptStore.updateOpened(value);
      }}
    >
      <SheetContent className="flex min-w-[480px] flex-col sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Persona</SheetTitle>
        </SheetHeader>
        <form action={formAction} className="flex flex-1 flex-col">
          <ScrollArea className="-mx-6 flex max-h-[calc(100vh-140px)] flex-1" type="always">
            <div className="flex flex-1 flex-col gap-8 px-6 pb-6">
              <input type="hidden" name="id" defaultValue={prompt.id} />
              {formState && formState.status === 'OK' ? null : (
                <>
                  {formState &&
                    formState.errors.map((error, index) => (
                      <div key={index} className="text-red-500">
                        {error.message}
                      </div>
                    ))}
                </>
              )}
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  type="text"
                  required
                  name="name"
                  defaultValue={prompt.name}
                  placeholder="Name of the prompt"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Short description</Label>
                <Textarea
                  required
                  defaultValue={prompt.description}
                  name="description"
                  className="h-96"
                  placeholder="eg: Write a funny joke that a 5 year old would understand"
                />
              </div>
            </div>
          </ScrollArea>
          <SheetFooter className="flex flex-row py-2 sm:justify-between">
            <PublicSwitch /> <Submit />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

function Submit() {
  const status = useFormStatus();
  return (
    <Button disabled={status.pending} className="gap-2">
      <LoadingIndicator isLoading={status.pending} />
      Save
    </Button>
  );
}
