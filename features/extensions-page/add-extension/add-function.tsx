import { Button } from '@/features/ui/button';
import { Input } from '@/features/ui/input';
import { Label } from '@/features/ui/label';
import { cn } from '@/features/ui/lib';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/ui/select';
import { SheetTitle } from '@/features/ui/sheet';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import { ChevronDown, ChevronUp, Copy, Plus, Trash } from 'lucide-react';
import { useTheme } from 'next-themes';
import { extensionStore, useExtensionState } from '../extension-store';

export const AddFunction = () => {
  const { extension } = useExtensionState();

  const { theme } = useTheme();
  return (
    <div className="flex flex-col gap-4 rounded-md border bg-foreground/[0.02] p-4 text-sm">
      <div className="flex items-center justify-between">
        <SheetTitle>Functions</SheetTitle>
        <Button
          type="button"
          className="flex gap-2"
          variant={'outline'}
          onClick={() => extensionStore.addFunction()}
        >
          <Plus size={18} /> Add Function
        </Button>
      </div>
      {extension.functions.map((func, index) => (
        <div key={index} className="flex flex-col gap-4 rounded-md border bg-background">
          <div
            className="flex cursor-pointer items-center justify-between p-3"
            onClick={() => extensionStore.toggleFunction(func.id)}
          >
            <SheetTitle>{`${index + 1}. ${getName(func.code)}`}</SheetTitle>
            {func.isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          <div
            className={cn(
              'flex flex-col gap-8 p-3 pb-2',
              func.isOpen ? 'h-0 overflow-hidden p-0 opacity-0' : '',
            )}
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  className="flex gap-2"
                  variant={'outline'}
                  onClick={() =>
                    extensionStore.cloneFunction({
                      ...func,
                    })
                  }
                >
                  <Copy size={18} /> Clone
                </Button>
                <Button
                  className="flex gap-2"
                  variant={'outline'}
                  onClick={() => extensionStore.removeFunction(func.id)}
                >
                  <Trash size={18} /> Delete
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>API endpoint</Label>
              <div className="flex gap-2">
                <Select defaultValue={func.endpointType} name="endpoint-type[]" required>
                  <SelectTrigger
                    className="w-[80px]"
                    aria-label="Select HTTP method for API endpoint"
                  >
                    <SelectValue placeholder="GET" defaultValue={'GET'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  required
                  name="endpoint[]"
                  defaultValue={func.endpoint}
                  placeholder="Enter URL"
                />
              </div>
            </div>

            <Label>GPT Function call definition (JSON)</Label>
            <div className="w-[580px] max-w-[580px]">
              <input type="hidden" name="code[]" value={func.code} />
              <CodeMirror
                value={func.code}
                lang="json"
                id="code-mirror"
                onChange={(value) => {
                  extensionStore.updateFunctionCode(func.id, value);
                }}
                extensions={[javascript()]}
                theme={theme === 'dark' ? 'dark' : ('light' as const)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const getName = (value: string) => {
  try {
    const val = JSON.parse(value);
    return val.name;
  } catch (e) {
    return 'Unknown';
  }
};
