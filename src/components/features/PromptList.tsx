import React from 'react';
import { Prompt } from '@/types/common';
import { Card } from '@/components/ui/card';
import PromptItem from './PromptItem';

interface PromptListProps {
  prompts: Prompt[];
  onPromptClick: (prompt: Prompt) => void;
  onPromptEdit?: (prompt: Prompt) => void;
  onPromptDelete?: (prompt: Prompt) => void;
  onPromptFavorite?: (prompt: Prompt) => void;
}

export const PromptList: React.FC<PromptListProps> = ({
  prompts,
  onPromptClick,
  onPromptEdit,
  onPromptDelete,
  onPromptFavorite,
}) => {
  if (!prompts.length) {
    return (
      <Card className="p-4 text-center text-gray-500">
        No prompts found
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {prompts.map((prompt) => (
        <PromptItem
          key={prompt.id}
          prompt={prompt}
          onClick={() => onPromptClick(prompt)}
          onEdit={onPromptEdit ? () => onPromptEdit(prompt) : undefined}
          onDelete={onPromptDelete ? () => onPromptDelete(prompt) : undefined}
          onFavorite={onPromptFavorite ? () => onPromptFavorite(prompt) : undefined}
        />
      ))}
    </div>
  );
}; 