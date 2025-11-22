import React, { useState } from 'react';
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    ListItemText,
    ListItemIcon,
    Box,
    Typography
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
 
const NestedSelectWithCheckmarks = ({ value, onChange, preferenceItems, title, label }: {
    title?:string,
    label?:string
    value: Array<string>
    onChange: (data: Array<string>) => void
    preferenceItems: Array<{ name: string, children: Array<{ name: string, value: string }> }>

}) => {
    const t = useTranslations()
 

    const [expandedCategories, setExpandedCategories] = useState<Array<any>>([]);

    const toggleCategory = (categoryName: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(item => item !== categoryName)
                : [...prev, categoryName]
        );
    };

    const handleChange = (event: any) => {
        const value = event.target.value;
        // If it's a category header click, don't select it
        if ((preferenceItems as any).some((cat: { name: string, value: string }) => cat.name === value)) return;

        onChange(value);
    };

    const isSelected = (v: string) => value.includes(v);

    const toggleAllInCategory = (categoryChildren: Array<{ name: string, value: string }>) => {
        const allChildrenValues: Array<string> = categoryChildren.map(child => child.value);
        const allSelected = allChildrenValues.every(val => value.includes(val));

        if (allSelected) {
            // Remove all children from this category
            onChange(value.filter((val: string) => !allChildrenValues.includes(val)));
        } else {
            // Add all children from this category
            onChange(Array.from(new Set([...value, ...allChildrenValues])));
        }
    };

    const toggleSubCategory = (item: { name: string, value: string }) => {
        if (value.find(e => e === item.value)) {
            // Remove the item from selection
            onChange(value.filter(val => val !== item.value));
        } else {
            // Add the item to selection (deduplicated)
            onChange(Array.from(new Set([...value, item.value])));
        }
    };

    const isCategoryAllSelected = (categoryChildren: Array<{ name: string, value: string }>) => {
        return categoryChildren.every(child => value.includes(child.value));
    };

    const isCategoryPartialSelected = (categoryChildren: Array<{ name: string, value: string }>) => {
        return categoryChildren.some(child => value.includes(child.value)) &&
            !isCategoryAllSelected(categoryChildren);
    };

    const mapperValue = (selected: Array<string>) => {
        return selected.filter(e => e !== undefined).map((value) => {
            // Find the item name from the nested structure
            let itemName = value;
            preferenceItems.forEach((category: {
                name: string,
                children: Array<{ name: string, value: string }>
            }) => {
                const found = category.children.find(child => child.value === value);
                if (found) itemName = found.name;
            });
            return (
                itemName + ','
            );
        })

    }
    return (<Box >
        <Typography textTransform={'uppercase'} color='textSecondary' variant='body1'>{title?title:t('statsCheckbiz.operativeData')}</Typography>
        <FormControl sx={{ m: 1, width: 340 }}>
            <InputLabel>{label?label:t('statsCheckbiz.operativeDataLabel')}</InputLabel>
            <Select
                multiple
                label={label?label:t('statsCheckbiz.operativeDataLabel')}
                value={value}
                onChange={handleChange}
                renderValue={(selected) => mapperValue(selected).join(',')}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 400,
                        },
                    },
                }}
            >
                {preferenceItems.map((category: {
                    name: string,
                    children: Array<{ name: string, value: string }>
                }) => (
                    <div key={category.name}>
                        {/* Category Header */}
                        <MenuItem
                            onClick={() => toggleCategory(category.name)}
                            sx={{
                                backgroundColor: 'grey.100',
                                '&:hover': { backgroundColor: 'grey.200' }
                            }}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={isCategoryAllSelected(category.children)}
                                    indeterminate={isCategoryPartialSelected(category.children)}
                                    onChange={() => toggleAllInCategory(category.children)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={category.name}
                                sx={{ fontWeight: 'bold' }}
                            />
                            {expandedCategories.includes(category.name) ? <ExpandLess /> : <ExpandMore />}
                        </MenuItem>

                        {/* Category Children */}
                        {expandedCategories.includes(category.name) &&
                            category.children.map((child) => (
                                <MenuItem
                                    key={child.value}
                                    value={child.value}
                                    sx={{ pl: 4 }}
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            onChange={() => toggleSubCategory(child)}
                                            onClick={(e) => e.stopPropagation()}
                                            checked={isSelected(child.value)} />
                                    </ListItemIcon>
                                    <ListItemText primary={child.name} />
                                </MenuItem>
                            ))}
                    </div>
                ))}
            </Select>
        </FormControl>
    </Box>
    );
};

export default NestedSelectWithCheckmarks;