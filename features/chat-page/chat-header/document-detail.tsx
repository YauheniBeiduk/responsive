import { Button } from '@/features/ui/button';
import { ScrollArea } from '@/features/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/features/ui/sheet';
import { File } from 'lucide-react';
import { FC } from 'react';
import { ChatDocumentModel } from '../chat-services/models';

interface Props {
  chatDocuments: Array<ChatDocumentModel>;
}

export const DocumentDetail: FC<Props> = (props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={'outline'} className="gap-2" aria-label="Current Chat Documents Menu">
          <File size={16} /> {props.chatDocuments.length}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex min-w-[480px] flex-col sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Documents</SheetTitle>
        </SheetHeader>
        <ScrollArea className="-mx-6 flex flex-1" type="always">
          <div className="flex flex-1 flex-col gap-2 px-6 pb-6">
            {props.chatDocuments.map((doc) => {
              return (
                <div className="flex items-center gap-2" key={doc.id}>
                  <File size={16} /> <div>{doc.name}</div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
