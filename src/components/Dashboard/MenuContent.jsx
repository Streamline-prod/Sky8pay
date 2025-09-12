import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import {  ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MenuItem = ({ item }) => {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const hasChildren = item.children && item.children.length > 0;

    const handleClick = () => {
        if (hasChildren) {
            setOpen(!open);
        } 
        else if (item.path) {            
            navigate(item.path);
        }
    };
    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
            <ListItem disablePadding>
                <ListItemButton onClick={handleClick} sx={{ pl: hasChildren ? 2 : 4 }}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {hasChildren ? (open ? <ExpandLess /> : <ExpandMore />) : null}
                </ListItemButton>
            </ListItem>
            {hasChildren && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.children.map((child, index) => (
                            <MenuItem key={index} item={child} />
                        ))}
                    </List>
                </Collapse>
            )}
        </Stack>
    );
};
export default function MenuContent({ items }) {
    return (
        <List dense>
            {items.map((item, index) => (
                <MenuItem key={index} item={item} />
            ))}
        </List>
    )
}
