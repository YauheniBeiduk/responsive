import React, { FC } from 'react';

interface Prop {
  documentField: any;
}

export const RecursiveUI: FC<Prop> = (props) => {
  const { documentField } = props;
  let node: React.ReactNode = null;

  if (
    typeof documentField === 'string' ||
    typeof documentField === 'number' ||
    typeof documentField === 'boolean' ||
    typeof documentField === 'bigint' ||
    typeof documentField === 'symbol' ||
    typeof documentField === 'undefined' ||
    typeof documentField === 'function'
  ) {
    node = <div className="flex flex-col gap-1">{documentField}</div>;
  }

  return (
    <div className="flex flex-col gap-3 overflow-x-auto rounded border border-foreground/5 p-3 text-sm">
      {node
        ? node
        : Object.entries(props.documentField).map(([key, value], index) => {
            if (typeof value === 'object' && value !== null) {
              return (
                <div key={index} className="flex flex-col gap-1">
                  <span className="text-muted-foreground">{key}</span>{' '}
                  <RecursiveUI documentField={value} />
                </div>
              );
            } else {
              return (
                <div key={index} className="">
                  <span className="text-muted-foreground">{key}:</span> {value as React.ReactNode}{' '}
                </div>
              );
            }
          })}
    </div>
  );
};
