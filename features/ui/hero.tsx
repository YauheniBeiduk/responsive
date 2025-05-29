import { Button } from '@/features/ui/button';
import { FC, PropsWithChildren } from 'react';

interface HeroProps extends PropsWithChildren {
  title: React.ReactNode;
  description: string;
}

export const Hero: FC<HeroProps> = (props) => {
  return (
    <div className="w-full border-b py-16">
      <div className="container flex h-full max-w-4xl flex-col gap-16">
        <div className="flex flex-col items-start gap-6">
          <h1 className="flex items-center gap-2 text-4xl font-bold">{props.title}</h1>
          <p className="max-w-xl text-muted-foreground">{props.description}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">{props.children}</div>
      </div>
    </div>
  );
};

interface HeroButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

export const HeroButton: FC<HeroButtonProps> = (props) => {
  return (
    <Button
      variant={'outline'}
      className="flex h-auto flex-col items-start justify-start gap-4 p-4 text-start"
      onClick={props.onClick}
    >
      <span className="flex items-center gap-2 text-primary">
        <span>{props.icon}</span>
        <span className="">{props.title}</span>
      </span>

      <span className="whitespace-break-spaces font-normal text-muted-foreground">
        {props.description}
      </span>
    </Button>
  );
};
