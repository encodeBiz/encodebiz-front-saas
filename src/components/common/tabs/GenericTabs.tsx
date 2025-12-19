import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GenericTabsProps, TabsOrientation } from './BaseTabs';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';


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
    scrollable = false,
    fullWidth = true,
    orientation = 'horizontal',
    alignment = 'left',
    color = 'primary',
    defaultTab = 0,
    onChange,
    sx = [],
    syncUrl = true,
}) => {
    const [currentTab, setCurrentTab] = useState(defaultTab);
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
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
                    variant={fullWidth ? 'fullWidth' : scrollable ? 'scrollable' : 'standard'}
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
                        '& .MuiTabs-disabled': {
                            backgroundColor: `${color}.secondary`,
                            color: 'text.disabled',
                        },
                        mb: orientation === 'horizontal' ? 3 : 0,
                        justifyContent: alignment,
                    }}
                >
                    {tabs.map((tab, index) => (
                        <Tab
                            onClick={() => {
                                if (syncUrl && tab.id) {
                                    const params = new URLSearchParams(searchParams.toString())
                                    params.set('tab', tab.id as string)
                                    router.push(pathname + '?' + params.toString())
                                }
                            }}
                            key={`tab-${index}`}
                            label={tab.label}
                            icon={React.isValidElement(tab.icon) || typeof tab.icon === 'string' ? tab.icon : undefined}
                            iconPosition="start"
                            disabled={tab.disabled}
                            wrapped={false}
                            sx={{
                                ...tab.sx,
                                pt: 4,
                                minWidth: 200,
                                borderBottomWidth: 2,
                                borderBottomStyle: 'solid',
                                borderBottomColor: 'secondary.main',
                                '&.Mui-disabled': {
                                    color: 'secondary.main',
                                }
                            }}
                        />
                    ))}
                </Tabs>

                <Box flexGrow={1}>
                    {tabs.map((tab, index) => (
                        <TabPanel key={`tabpanel-${index}`} value={currentTab} index={index} sx={{ pl: 8, pr: 8, background: (theme) => theme.palette.background.paper }}>
                            {tab.content}
                        </TabPanel>
                    ))}
                </Box>
            </OrientationContainer>
        </Box>
    );
};

export default GenericTabs;
