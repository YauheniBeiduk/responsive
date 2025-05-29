import { CHAT_DEFAULT_SYSTEM_PROMPT } from '@/features/theme/theme-config';
import { Button } from '@/features/ui/button';
import { Label } from '@/features/ui/label';
import { ScrollArea } from '@/features/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/features/ui/sheet';
import { VenetianMask } from 'lucide-react';
import { FC } from 'react';
import { ChatThreadModel } from '../chat-services/models';

interface Props {
  chatThread: ChatThreadModel;
}

export const PersonaDetail: FC<Props> = (props) => {
  const persona = props.chatThread.personaMessageTitle;
  const personaMessage = props.chatThread.personaMessage;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={'outline'} size={'icon'} aria-label="Current Chat Persona Menu">
          <VenetianMask size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex min-w-[480px] flex-col sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Persona</SheetTitle>
        </SheetHeader>
        <ScrollArea className="-mx-6 flex flex-1" type="always">
          <div className="flex flex-1 flex-col gap-8 px-6 pb-6">
            <div className="grid gap-2">
              <Label>Name</Label>
              <div>{persona}</div>
            </div>

            <div className="grid flex-1 gap-2">
              <Label htmlFor="personaMessage">Personality</Label>
              <div className="whitespace-pre-wrap">{`${CHAT_DEFAULT_SYSTEM_PROMPT}`}</div>
              <div className="whitespace-pre-wrap">{`${personaMessage}`}</div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
