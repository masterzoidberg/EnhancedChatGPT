import { jsx as _jsx } from "react/jsx-runtime";
import { Card } from '@/components/ui/card';
import PromptItem from './PromptItem';
export const PromptList = ({ prompts, onPromptClick, onPromptEdit, onPromptDelete, onPromptFavorite, }) => {
    if (!prompts.length) {
        return (_jsx(Card, { className: "p-4 text-center text-gray-500", children: "No prompts found" }));
    }
    return (_jsx("div", { className: "space-y-2", children: prompts.map((prompt) => (_jsx(PromptItem, { prompt: prompt, onClick: () => onPromptClick(prompt), onEdit: onPromptEdit ? () => onPromptEdit(prompt) : undefined, onDelete: onPromptDelete ? () => onPromptDelete(prompt) : undefined, onFavorite: onPromptFavorite ? () => onPromptFavorite(prompt) : undefined }, prompt.id))) }));
};
