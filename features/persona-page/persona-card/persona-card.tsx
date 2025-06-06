import { FC } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { PersonaModel } from '../persona-services/models';
import { PersonaCardContextMenu } from './persona-card-context-menu';
import { ViewPersona } from './persona-view';
import { StartNewPersonaChat } from './start-new-persona-chat';

interface Props {
  persona: PersonaModel;
  showContextMenu: boolean;
}

export const PersonaCard: FC<Props> = (props) => {
  const { persona } = props;
  return (
    <Card key={persona.id} className="flex flex-col">
      <CardHeader className="flex flex-row">
        <CardTitle className="flex-1">{persona.name}</CardTitle>
        {props.showContextMenu && (
          <div>
            <PersonaCardContextMenu persona={persona} />
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 text-muted-foreground">{persona.description}</CardContent>
      <CardFooter className="f content-stretch gap-1">
        {props.showContextMenu && <ViewPersona persona={persona} />}

        <StartNewPersonaChat persona={persona} />
      </CardFooter>
    </Card>
  );
};
