import { ExtensionModel } from '@/features/extensions-page/extension-services/models';
import { Button } from '@/features/ui/button';
import { ScrollArea } from '@/features/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/features/ui/sheet';
import { Switch } from '@/features/ui/switch';
import { PocketKnife } from 'lucide-react';
import { FC } from 'react';
import { chatStore } from '../chat-store';

interface Props {
  extensions: Array<ExtensionModel>;
  chatThreadId: string;
  installedExtensionIds: Array<string> | undefined;
  disabled: boolean;
}

export const ExtensionDetail: FC<Props> = (props) => {
  const toggleInstall = async (isChecked: boolean, extensionId: string) => {
    if (isChecked) {
      await chatStore.AddExtensionToChatThread(extensionId);
    } else {
      await chatStore.RemoveExtensionFromChatThread(extensionId);
    }
  };

  const installedCount = props.installedExtensionIds?.length ?? 0;
  const totalCount = props.extensions.length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={'outline'}
          className="gap-2"
          disabled={props.disabled}
          aria-label="Current Chat Extensions Menu"
        >
          <PocketKnife size={16} /> {installedCount} ({totalCount})
        </Button>
      </SheetTrigger>
      <SheetContent className="flex min-w-[480px] flex-col sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Extensions</SheetTitle>
        </SheetHeader>
        <ScrollArea className="-mx-6 flex flex-1" type="always">
          <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
            {props.extensions.map((extension) => {
              const isInstalled = props.installedExtensionIds?.includes(extension.id) ?? false;
              return (
                <div
                  className="flex items-center justify-between gap-2 rounded-md border p-4"
                  key={extension.id}
                >
                  <div className="flex flex-1 flex-col gap-2">
                    <div>{extension.name}</div>
                    <div className="text-muted-foreground">{extension.description}</div>
                  </div>
                  <div>
                    <Switch
                      defaultChecked={isInstalled}
                      onCheckedChange={(e) => toggleInstall(e, extension.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
