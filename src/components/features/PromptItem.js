import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
const PromptItem = ({ prompt, onClick, onEdit, onDelete, onFavorite, }) => {
    return (_jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-medium", children: prompt.title }), onFavorite && (_jsx(Button, { variant: "ghost", size: "icon", onClick: onFavorite, className: "text-yellow-500", children: prompt.isFavorite ? '⭐' : '☆' }))] }), _jsx("p", { className: "mt-2 text-sm text-gray-600 line-clamp-2", children: prompt.content }), _jsxs("div", { className: "mt-4 flex gap-2 justify-end", children: [onClick && (_jsx(Button, { variant: "default", onClick: onClick, children: "Use" })), onEdit && (_jsx(Button, { variant: "outline", onClick: onEdit, children: "Edit" })), onDelete && (_jsx(Button, { variant: "destructive", onClick: onDelete, children: "Delete" }))] })] }));
};
export default PromptItem;
