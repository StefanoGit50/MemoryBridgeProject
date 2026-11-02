import type { Block, ChatActions } from '../../../types';
import { PersonCardBlock } from '../PersonCardBlock/PersonCardBlock';
import { PersonListBlock } from '../PersonListBlock/PersonListBlock';
import { PostDraftBlock } from '../PostDraftBlock/PostDraftBlock';

interface BlockRendererProps {
  blocks: Block[];
  actions: ChatActions;
}

export function BlockRenderer({ blocks, actions }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'person':
            return <PersonCardBlock key={index} person={block.person} actions={actions} />;
          case 'personList':
            return <PersonListBlock key={index} people={block.people} actions={actions} />;
          case 'postDraft':
            return <PostDraftBlock key={index} draft={block.draft} actions={actions} />;
        }
      })}
    </>
  );
}
