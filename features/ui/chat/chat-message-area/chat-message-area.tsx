'use client';
import { cn } from '@/ui/lib';
import { CheckIcon, ClipboardIcon, PocketKnife, UserCircle } from 'lucide-react';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SetLikeToChatMessage } from '../../../chat-page/chat-services/chat-message-service';
import * as microsoftTeams from '@microsoft/teams-js';
export const ChatMessageArea = (props: {
  children?: React.ReactNode;
  profilePicture?: string | null;
  profileName?: string;
  reaction?: string;
  messageId: string;
  role: 'function' | 'user' | 'assistant' | 'system' | 'tool';
  links?: { url: string; title: string }[];
  onCopy: () => void;
}) => {
  const [isIconChecked, setIsIconChecked] = useState(false);
  const [userReaction, setUserReaction] = useState(props.reaction);
  const [token, setToken] = useState<string | null>(null);
  const t = useTranslations('Chat');

  useEffect(() => {
    async function fetchData() {
      let token;
      try {
        // If microsoftTeams.app.initialize throw error that mean app ran in browser.
        // we need to check that to use token from Tean SDK or server side token
        await microsoftTeams.app.initialize();
        const context = await microsoftTeams.app.getContext();
        token = await microsoftTeams.authentication.getAuthToken();
        setToken(token);
      } catch (e) {}
    }

    fetchData();
  }, []);

  const handleButtonClick = () => {
    props.onCopy();
    setIsIconChecked(true);
  };

  const handleReaction = (reaction: string) => {
    if (reaction === userReaction) {
      setUserReaction('unspecified');
      SetLikeToChatMessage(props.messageId, 'unspecified', token);
    } else {
      setUserReaction(reaction);
      SetLikeToChatMessage(props.messageId, reaction, token);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsIconChecked(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isIconChecked]);

  return (
    <div
      className={`mix-w-[30%] flex max-w-[80%] flex-col overflow-y-scroll rounded-md border shadow-md ${props.role === 'user' ? 'self-end' : 'bg-[#FFF9EB]'}`}
    >
      <div className="flex items-center justify-between"></div>
      <div className="flex flex-1 flex-col gap-2 px-10">
        <div className="prose prose-slate max-w-none whitespace-break-spaces dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
          {props.children}
        </div>
        {props.role === 'assistant' && (
          <div className="mb-10 mt-10 flex flex-col">
            {props?.links?.length != 0 && (
              <>
                <div className="mb-2 font-semibold"> {t('references')}: </div>
                <ul>
                  {props.links?.map((link, i) => (
                    <li className="mb-3" key={i}>
                      <Link target="blank" href={link.url}>
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="mt-5 flex justify-end">
              <SentimentVeryDissatisfiedIcon
                onClick={() => handleReaction('dislike')}
                sx={{
                  cursor: 'pointer',
                  color: userReaction === 'dislike' ? '#f44336' : '#ffcdd2',
                  fontSize: 'large',
                  mr: 2,
                }}
              />
              <SentimentSatisfiedAltIcon
                onClick={() => handleReaction('like')}
                sx={{
                  cursor: 'pointer',
                  color: userReaction === 'like' ? '#4caf50' : '#c8e6c9',
                  fontSize: 'large',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
