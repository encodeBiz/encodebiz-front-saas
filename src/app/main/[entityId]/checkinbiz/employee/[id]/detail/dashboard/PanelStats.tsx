/* eslint-disable react-hooks/exhaustive-deps */
import BoxLoader from "@/components/common/BoxLoader";
import HeaderPage from "@/components/features/dashboard/HeaderPage/HeaderPage";
import { useEntity } from "@/hooks/useEntity";
import { SettingsOutlined } from "@mui/icons-material";
import { Container, Box, Typography, Popover, Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { OperatingHours } from "./cards/OperatingHours";
import { TempActivity } from "./cards/TempActivity";
import { SassButton } from "@/components/common/buttons/GenericButton";
import NestedSelectWithCheckmarks from "../../../../panel/components/common/Preference/NestedSelectWithCheckmarks";
import { SelectorChart } from "../../../../panel/components/common/SelectorChart";
import { RulesAnalize } from "./cards/RulesAnalize";
import { useDashboardEmployee } from "./DashboardEmployeeContext";
import { DispercionActivity } from "./cards/DispercionActivity";
import { preferenceDashboardEmployeeItems } from "@/domain/features/checkinbiz/IStats";
import EmptyState from "@/components/common/EmptyState/EmptyState";


export const PanelStats = () => {
  const t = useTranslations();
  const { employeeId, employeePatternList, pending, cardIndicatorSelected, setCardIndicatorSelected, type, setType } = useDashboardEmployee()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const { currentEntity } = useEntity()
  const [preferenceSelected, setPreferenceSelected] = useState(cardIndicatorSelected)
  const [preferenceTypeSelected, setPreferenceTypeSelected] = useState(type)


  useEffect(() => {
    if (currentEntity?.entity?.id) {
      setPreferenceSelected([...cardIndicatorSelected])
      setPreferenceTypeSelected(type)
    }
  }, [currentEntity?.entity?.id, cardIndicatorSelected.length, type])


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openTooltip = Boolean(anchorEl);
  const id = openTooltip ? 'simple-popover' : undefined;

  const handleSave = () => {
    localStorage.setItem('PANEL_EMPLOYEE_CHECKBIZ_CHART_' + employeeId, JSON.stringify({ preferenceSelected }))
    localStorage.setItem('PANEL_EMPLOYEE_CHECKBIZ_CHART_TIME_' + employeeId, preferenceTypeSelected)
    handleClose()
    setCardIndicatorSelected(preferenceSelected)
    setType(preferenceTypeSelected)
  }


  const InnetContent = () => <Box sx={{ minHeight: 600 }}>

    {!pending && employeePatternList.length == 0 && <Box display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ minHeight: 100 }}>
      <EmptyState text={t('employeeDashboard.emptyPattern')} />
    </Box>}
    {pending && <BoxLoader message={t('statsCheckbiz.loading')} />}


    {!pending && employeePatternList.length > 0 && <Box sx={{ p: 3 }} display={'flex'} flexDirection={'column'} gap={5}>
      <OperatingHours />
    </Box>}

    {!pending && employeePatternList.length > 0 && <Divider sx={{ mt: 2, mb: 2 }} flexItem variant="fullWidth" orientation="horizontal" />}


    {!pending && employeePatternList.length > 0 && <Box sx={{ p: 3 }} display={'flex'} flexDirection={'column'} gap={5}>
      <TempActivity />
    </Box>}

    {!pending && employeePatternList.length > 0 && <Divider sx={{ mt: 2, mb: 2 }} flexItem variant="fullWidth" orientation="horizontal" />}


    {!pending && employeePatternList.length > 0 && <Box sx={{ p: 3 }} display={'flex'} flexDirection={'column'} gap={5}>
      <DispercionActivity />
    </Box>}

    {!pending && employeePatternList.length > 0 && <Divider sx={{ mt: 2, mb: 2 }} flexItem variant="fullWidth" orientation="horizontal" />}


    {!pending && employeePatternList.length > 0 && <Box sx={{ p: 3 }} display={'flex'} flexDirection={'column'} gap={5} pt={5}>
      <RulesAnalize />
    </Box>}



  </Box>
  return (

    <Container maxWidth="lg">
      <HeaderPage

        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2}>
            <Box display={'flex'} justifyContent={'space-between'}    >
              <Box>
                <SassButton sx={{ minWidth: 210 }} variant="text" onClick={handleClick} startIcon={<SettingsOutlined sx={{ fontSize: 20 }} color='primary' />}>
                  <Typography sx={{ marginLeft: 1 }} variant="body1" color="primary">{t('statsCheckbiz.configPanel')}</Typography>
                </SassButton>
                <Popover
                  id={id}
                  open={openTooltip}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <Box display={'flex'} flexDirection={'column'} gap={4} padding={4}>
                    <Box display={'flex'} flexDirection={'column'} textAlign={'center'}>
                      <Typography variant="body1">{t('statsCheckbiz.configPanel')}</Typography>
                    </Box>
                    <NestedSelectWithCheckmarks preferenceItems={preferenceDashboardEmployeeItems(t)} value={preferenceSelected} onChange={setPreferenceSelected} />
                    <SelectorChart type={preferenceTypeSelected} setType={setPreferenceTypeSelected} />
                  </Box>

                  <Box display={'flex'} justifyContent={'flex-end'} flexDirection={'row'} gap={1} padding={4}>
                    <SassButton onClick={handleClose} variant="outlined" color="primary">{t('core.button.cancel')}</SassButton>
                    <SassButton onClick={handleSave} variant="contained" color="primary">{t('core.button.save')}</SassButton>
                  </Box>
                </Popover>
              </Box>
            </Box>
          </Box>
        }
      > <InnetContent /></HeaderPage>


    </Container>

  );
}
