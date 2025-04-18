import React from 'react';
import { Prompt } from '@/types/common';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PromptItemProps {
  prompt: Prompt;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onFavorite?: () => void;
}

const PromptItem: React.FC<PromptItemProps> = ({
  prompt,
  onClick,
  onEdit,
  onDelete,
  onFavorite,
}) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{prompt.title}</h3>
        {onFavorite && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onFavorite}
            className="text-yellow-500"
          >
            {prompt.isFavorite ? '⭐' : '☆'}
          </Button>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{prompt.content}</p>
      <div className="mt-4 flex gap-2 justify-end">
        {onClick && (
          <Button variant="default" onClick={onClick}>
            Use
          </Button>
        )}
        {onEdit && (
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PromptItem; 