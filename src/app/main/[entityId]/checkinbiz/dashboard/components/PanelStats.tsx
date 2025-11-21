/* eslint-disable react-hooks/exhaustive-deps */
import BoxLoader from "@/components/common/BoxLoader";
import HeaderPage from "@/components/features/dashboard/HeaderPage/HeaderPage";
import { InfoOutline, SettingsOutlined } from "@mui/icons-material";
import { Container, Box, Typography, Popover, IconButton } from "@mui/material";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useDashboard } from "../context/dashboardContext";
import { SelectorBranch } from "./common/Selector";
import { SelectorChart } from "./common/SelectorChart";
import NestedSelectWithCheckmarks from "./common/Preference/NestedSelectWithCheckmarks";
import { SassButton } from "@/components/common/buttons/GenericButton";
import { OperatingHours } from "./cards/OperatingHours";
import { TempActivity } from "./cards/TempActivity";
import { useEntity } from "@/hooks/useEntity";
import { DataReliability } from "./cards/DataReliability";
import { OperatingCosts } from "./cards/OperatingCosts";

export const PanelStats = () => {
  const t = useTranslations();
  const { pending, branchPatternList, cardIndicatorSelected, setCardIndicatorSelected, initialize, preferenceItems, type, setType } = useDashboard()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const { currentEntity } = useEntity()
  const [preferenceSelected, setPreferenceSelected] = useState(cardIndicatorSelected)

  useEffect(() => {
    if (currentEntity?.entity?.id) {
      initialize()
    }
  }, [currentEntity?.entity?.id])


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleSave = () => {
    localStorage.setItem('PANEL_CHECKBIZ_CHART', JSON.stringify(preferenceSelected))
    handleClose()
    setCardIndicatorSelected(preferenceSelected)
  } 


  const InnetContent = () => <Box sx={{ minHeight: 600, p: 3 }}>
    <SelectorBranch />
    {pending && <BoxLoader message={t('statsCheckbiz.loading')} />}

    {branchPatternList.length > 0 && cardIndicatorSelected.filter(e => ['avgStartHour_avgEndHour', 'stdStartHour_stdEndHour'].includes(e)).length > 0 && <Box display={'flex'} flexDirection={'column'} gap={5} pt={5}>
      <OperatingHours />
      <TempActivity />
    </Box>}

    {branchPatternList.length > 0 && cardIndicatorSelected.filter(e => ['avgCostHour', 'avgCycleCost', 'avgCostEfficiency', 'effectiveRealCost'].includes(e)).length > 0 && <Box display={'flex'} flexDirection={'column'} pt={5}>
      <OperatingCosts />
    </Box>}

    {branchPatternList.length > 0 && cardIndicatorSelected.filter(e => ['reliability', 'dataPoints'].includes(e)).length > 0 && <Box display={'flex'} flexDirection={'column'} pt={5}>
      <DataReliability />
    </Box>}


    {branchPatternList.length == 0 && !pending &&
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ minHeight: 400, p: 4 }}>
        <Typography variant="body1"> Debes seleccionar al menos una sucursal/proyecto para ver estadísticas.</Typography>
      </Box>}

  </Box>
  return (

    <Container maxWidth="lg">
      <HeaderPage
        title={
          <Box display={'flex'} gap={1} justifyItems={'center'} alignItems={'center'}>
            <Typography align="center" sx={{ mb: 0, textAlign: 'left', fontSize: 32 }}>
              {t("statsCheckbiz.stats")}
            </Typography>
            <IconButton><InfoOutline sx={{ fontSize: 25 }} /></IconButton>
          </Box>
        }
        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2}>
            <Box display={'flex'} justifyContent={'space-between'}    >
              <Box>
                <SassButton sx={{ minWidth: 210 }} variant="text" onClick={handleClick} startIcon={<SettingsOutlined sx={{ fontSize: 20 }} color='primary' />}>
                  <Typography sx={{ marginLeft: 1 }} variant="body1" color="primary">{t('statsCheckbiz.configPanel')}</Typography>
                </SassButton>
                <Popover
                  id={id}
                  open={open}
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
                    <NestedSelectWithCheckmarks preferenceItems={preferenceItems} value={preferenceSelected} onChange={setPreferenceSelected} />
                    <SelectorChart type={type} setType={setType} />
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
