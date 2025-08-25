import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GenericTabsProps, TabsOrientation } from './BaseTabs';


interface StyledTabPanelProps {
    index: number;
    value: number;
}

const TabPanel = styled(({ index, value, ...props }: StyledTabPanelProps & { children?: React.ReactNode }) => (
    <Box role="tabpanel" hidden={value !== index} {...props}>
        {value === index && <Box sx={{ pt: 3 }}>{props.children}</Box>}
    </Box>
))({});

const OrientationContainer = styled(Box)<{ orientation: TabsOrientation }>(
    ({ orientation }) =>
        orientation === 'vertical'
            ? {
                display: 'flex',
                flexDirection: 'row',
                gap: 3,
            }
            : {}
);

const GenericTabs: React.FC<GenericTabsProps> = ({
    tabs,
    orientation = 'horizontal',
    alignment = 'left',
    color = 'primary',  
    defaultTab = 0,
    onChange,
    sx = [],
}) => {
    const [currentTab, setCurrentTab] = useState(defaultTab);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
        if (onChange) onChange(newValue);
    };

    return (
        <Box sx={sx}>
            <OrientationContainer orientation={orientation}>
                <Tabs
                    value={currentTab}
                    onChange={handleChange}
                    orientation={orientation}
                    variant={'scrollable'}
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '1rem',
                            minHeight: 48,
                            color: 'text.secondary',
                            '&.Mui-selected': {
                                color: `${color}.main`,
                            },
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: `${color}.main`,
                        },
                        mb: orientation === 'horizontal' ? 3 : 0,
                        justifyContent: alignment,
                    }}
                >
                    {tabs.map((tab, index) => (
                        <Tab
                            key={`tab-${index}`}
                            label={tab.label}
                            icon={React.isValidElement(tab.icon) || typeof tab.icon === 'string' ? tab.icon : undefined}
                            iconPosition="start"
                            disabled={tab.disabled}
                            wrapped={false}
                            sx={{ ...tab.sx, pt: 4, minWidth: 200, borderBottomWidth:2, borderBottomStyle:'solid', borderBottomColor: 'secondary.main'}}
                        />
                    ))}
                </Tabs>

                <Box flexGrow={1}>
                    {tabs.map((tab, index) => (
                        <TabPanel key={`tabpanel-${index}`} value={currentTab} index={index} sx={{ pl: 8, pr: 8 }}>
                            {tab.content}
                        </TabPanel>
                    ))}
                </Box>
            </OrientationContainer>
        </Box>
    );
};

export default GenericTabs;