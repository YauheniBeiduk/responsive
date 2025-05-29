import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  title: string;
}

export const ChatGroup = (props: Props) => {
  return (
    <div className="flex flex-col">
      <div className="p-3 text-sm text-muted-foreground">{props.title}</div>
      <div>{props.children}</div>
    </div>
  );
};
