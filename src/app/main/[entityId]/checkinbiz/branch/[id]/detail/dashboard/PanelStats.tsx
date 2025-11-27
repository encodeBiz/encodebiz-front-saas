/* eslint-disable react-hooks/exhaustive-deps */
import BoxLoader from "@/components/common/BoxLoader";
import HeaderPage from "@/components/features/dashboard/HeaderPage/HeaderPage";
import { useEntity } from "@/hooks/useEntity";
import { SettingsOutlined } from "@mui/icons-material";
import { Container, Box, Typography, Popover } from "@mui/material";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { OperatingHours } from "./cards/OperatingHours";
import { TempActivity } from "./cards/TempActivity";
import { SassButton } from "@/components/common/buttons/GenericButton";
import NestedSelectWithCheckmarks from "../../../../panel/components/common/Preference/NestedSelectWithCheckmarks";
import { SelectorChart } from "../../../../panel/components/common/SelectorChart";
import { useDashboardBranch } from "./DashboardBranchContext";
import { HeuristicAnalize } from "./cards/HeuristicAnalize";
import { preferenceDashboardItems } from "@/domain/features/checkinbiz/IStats";


export const PanelStats = () => {
  const t = useTranslations();
  const { branchId, pending, branchPatternList, cardHeuristicsIndicatorSelected, setCardHeuristicsIndicatorSelected, cardIndicatorSelected, setCardIndicatorSelected, heuristicsItems, type, setType } = useDashboardBranch()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const { currentEntity } = useEntity()
  const [preferenceSelected, setPreferenceSelected] = useState(cardIndicatorSelected)
  const [preferenceHeuristicSelected, setPreferenceHeuristicSelected] = useState(cardHeuristicsIndicatorSelected)
  useEffect(() => {
    if (currentEntity?.entity?.id) {
      setPreferenceSelected([...cardIndicatorSelected])
      setPreferenceHeuristicSelected([...cardHeuristicsIndicatorSelected])

    }
  }, [currentEntity?.entity?.id, cardIndicatorSelected.length])

  

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openTooltip = Boolean(anchorEl);
  const id = openTooltip ? 'simple-popover' : undefined;

  const handleSave = () => {
    localStorage.setItem('PANEL_BRANCH_CHECKBIZ_CHART_' + branchId, JSON.stringify({ preferenceSelected, preferenceHeuristicSelected }))
    handleClose()
    setCardIndicatorSelected(preferenceSelected)
    setCardHeuristicsIndicatorSelected(preferenceHeuristicSelected)
  }


  const InnetContent = () => <Box sx={{ minHeight: 600, p: 3 }}>

    {pending && <BoxLoader message={t('statsCheckbiz.loading')} />}

    {!pending && branchPatternList.length > 0 && <Box display={'flex'} flexDirection={'column'} gap={5}>
      <OperatingHours />
    </Box>}

    {!pending && branchPatternList.length > 0 && <Box display={'flex'} flexDirection={'column'} gap={5}>
      <TempActivity />
    </Box>}

    {!pending && branchPatternList.length > 0 && <Box display={'flex'} flexDirection={'column'} gap={5} pt={5}>
      <HeuristicAnalize />
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
                    <NestedSelectWithCheckmarks preferenceItems={preferenceDashboardItems(t)} value={preferenceSelected} onChange={setPreferenceSelected} />
                    <SelectorChart type={type} setType={setType} />
                    <NestedSelectWithCheckmarks title='INDICADORES HEURÍSTICOS' label='Indicadores heurísticos' preferenceItems={heuristicsItems} value={preferenceHeuristicSelected} onChange={setPreferenceHeuristicSelected} />

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
