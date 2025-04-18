import { jsx as _jsx } from "react/jsx-runtime";
const FolderItem = ({ folder, isActive, onSelect }) => {
    const style = {
        padding: '8px 12px',
        cursor: 'pointer',
        backgroundColor: isActive ? '#e0e0e0' : 'transparent', // Basic highlight
        borderBottom: '1px solid #eee',
    };
    const handleClick = () => {
        onSelect(folder.id);
    };
    return (_jsx("div", { style: style, onClick: handleClick, children: folder.name }));
};
export default FolderItem;
