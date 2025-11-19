import React, { useState } from 'react';
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    ListItemText,
    ListItemIcon,
    Chip,
    Box,
    Typography
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useDashboard } from '../../../context/dashboardContext';

const NestedSelectWithCheckmarks = () => {
    const t = useTranslations()
    const { cardIndicatorSelected, setCardIndicatorSelected, preferenceItems } = useDashboard()



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

        setCardIndicatorSelected(value);
    };

    const isSelected = (value: string) => cardIndicatorSelected.includes(value);

    const toggleAllInCategory = (categoryChildren: Array<{ name: string, value: string }>) => {
        const allChildrenValues: Array<string> = categoryChildren.map(child => child.value);
        const allSelected = allChildrenValues.every(val => cardIndicatorSelected.includes(val));

        if (allSelected) {
            // Remove all children from this category
            setCardIndicatorSelected(cardIndicatorSelected.filter((val: string) => !allChildrenValues.includes(val)));
        } else {
            // Add all children from this category
            setCardIndicatorSelected(Array.from(new Set([...cardIndicatorSelected, ...allChildrenValues])));
        }
    };

    const toggleSubCategory = (item: { name: string, value: string }) => {
        if (cardIndicatorSelected.find(e => e === item.value)) {
            // Remove the item from selection
            setCardIndicatorSelected(cardIndicatorSelected.filter(val => val !== item.value));
        } else {
            // Add the item to selection (deduplicated)
            setCardIndicatorSelected(Array.from(new Set([...cardIndicatorSelected, item.value])));
        }
    };

    const isCategoryAllSelected = (categoryChildren: Array<{ name: string, value: string }>) => {
        return categoryChildren.every(child => cardIndicatorSelected.includes(child.value));
    };

    const isCategoryPartialSelected = (categoryChildren: Array<{ name: string, value: string }>) => {
        return categoryChildren.some(child => cardIndicatorSelected.includes(child.value)) &&
            !isCategoryAllSelected(categoryChildren);
    };

    return (<Box>
        <Typography color='textSecondary' variant='body1'>{t('statsCheckbiz.operativeData')}</Typography>
        <FormControl fullWidth>
            <InputLabel>{t('statsCheckbiz.operativeDataLabel')}</InputLabel>
            <Select
                multiple
                label={t('statsCheckbiz.operativeDataLabel')}
                value={cardIndicatorSelected}
                onChange={handleChange}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
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
                                <Chip key={value} label={itemName} size="small" />
                            );
                        })}
                    </Box>
                )}
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