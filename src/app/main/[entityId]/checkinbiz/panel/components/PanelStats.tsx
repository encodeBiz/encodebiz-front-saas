/* eslint-disable react-hooks/exhaustive-deps */
import BoxLoader from "@/components/common/BoxLoader";
import HeaderPage from "@/components/features/dashboard/HeaderPage/HeaderPage";
import { InfoOutline, SettingsOutlined } from "@mui/icons-material";
import { Container, Box, Typography, Popover, IconButton, Divider } from "@mui/material";
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
import InfoModal from "@/components/common/modals/InfoModal";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { operationData, tempActivityData } from "@/components/common/help/constants";
import { InfoHelp } from "@/components/common/help/InfoHelp";
import { preferenceDashboardItems } from "@/domain/features/checkinbiz/IStats";
import { useLayout } from "@/hooks/useLayout";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import EmptyList from "@/components/common/EmptyState/EmptyList";
import emptyImage from '../../../../../../../public/assets/images/empty/datos.svg';
export const PanelStats = () => {
  const t = useTranslations();
  const { pending, branchPatternList, branchList, cardIndicatorSelected, setCardIndicatorSelected, initialize, type, setType } = useDashboard()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const { currentEntity } = useEntity()
  const { navivateTo } = useLayout()
  const [preferenceSelected, setPreferenceSelected] = useState(cardIndicatorSelected)
  const { open, openModal, closeModal } = useCommonModal()
  useEffect(() => {
    if (currentEntity?.entity?.id) {
      setPreferenceSelected([...cardIndicatorSelected])
    }
  }, [currentEntity?.entity?.id, cardIndicatorSelected.length])

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

  const openTooltip = Boolean(anchorEl);
  const id = openTooltip ? 'simple-popover' : undefined;

  const handleSave = () => {
    localStorage.setItem('PANEL_CHECKBIZ_CHART', JSON.stringify(preferenceSelected))
    handleClose()
    setCardIndicatorSelected(preferenceSelected)
  }


  const InnetContent = () => <Box sx={{ minHeight: 600 }}>
    {branchList.length > 0 && <SelectorBranch />}
    {pending && <BoxLoader message={t('statsCheckbiz.loading')} />}

    {!pending && branchPatternList.length > 0 && cardIndicatorSelected.filter(e => ['avgStartHour_avgEndHour', 'stdStartHour_stdEndHour'].includes(e)).length > 0 && <Box sx={{ p: 3 }} display={'flex'} flexDirection={'column'} gap={5} pt={5}>
      <OperatingHours />
    </Box>}

    {!pending && branchPatternList.length > 0 && cardIndicatorSelected.filter(e => ['avgStartHour_avgEndHour', 'stdStartHour_stdEndHour'].includes(e)).length > 0 && <Divider sx={{ mt: 2, mb: 2 }} flexItem variant="fullWidth" orientation="horizontal" />}


    {!pending && branchPatternList.length > 0 && cardIndicatorSelected.filter(e => ['avgStartHour_avgEndHour', 'stdStartHour_stdEndHour'].includes(e)).length > 0 && <Box sx={{ p: 3 }} display={'flex'} flexDirection={'column'} gap={5} pt={5}>
      <TempActivity />
    </Box>}

    {!pending && branchPatternList.length > 0 && cardIndicatorSelected.filter(e => ['avgCostHour', 'avgCycleCost', 'avgCostEfficiency', 'effectiveRealCost'].includes(e)).length > 0 && <Divider sx={{ mt: 2, mb: 2 }} flexItem variant="fullWidth" orientation="horizontal" />}


    {!pending && branchPatternList.length > 0 && cardIndicatorSelected.filter(e => ['avgCostHour', 'avgCycleCost', 'avgCostEfficiency', 'effectiveRealCost'].includes(e)).length > 0 && <Box sx={{ p: 3 }} display={'flex'} flexDirection={'column'} pt={5}>
      <OperatingCosts />
    </Box>}



    {!pending && branchPatternList.length > 0 && cardIndicatorSelected.filter(e => ['reliability', 'dataPoints'].includes(e)).length > 0 && <Divider sx={{ mt: 2, mb: 2 }} flexItem variant="fullWidth" orientation="horizontal" />}


    {!pending && branchPatternList.length > 0 && cardIndicatorSelected.filter(e => ['reliability', 'dataPoints'].includes(e)).length > 0 && <Box sx={{ p: 3 }} display={'flex'} flexDirection={'column'} pt={5}>
      <DataReliability />
    </Box>}


    {branchList.length > 0 && branchPatternList.length == 0 && !pending &&
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ minHeight: 400, p: 4 }}>
        <Typography variant="body1">{t('employeeDashboard.emptyBranch')}</Typography>
      </Box>}

    {branchList.length == 0 && !pending &&
      <EmptyList
        imageUrl={emptyImage}
        title={t('employeeDashboard.panelNoDataTitle')}
        description={t('employeeDashboard.panelNoDataText')}
      />}



  </Box>
  return (

    <Container maxWidth="lg">
      <HeaderPage
        title={
          <Box display={'flex'} gap={0.2} justifyItems={'center'} alignItems={'center'}>
            <Typography align="center" sx={{ mb: 0, textAlign: 'left', fontSize: 32 }}>
              {t("statsCheckbiz.stats")}
            </Typography>
            <IconButton onClick={() => openModal(CommonModalType.INFO)}><InfoOutline sx={{ fontSize: 25 }} /></IconButton>
          </Box>
        }
        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2}>
            <Box display={'flex'} justifyContent={'space-between'}    >
              {branchList.length > 0 && <Box>
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
                  </Box>

                  <Box display={'flex'} justifyContent={'flex-end'} flexDirection={'row'} gap={1} padding={4}>
                    <SassButton onClick={handleClose} variant="outlined" color="primary">{t('core.button.cancel')}</SassButton>
                    <SassButton onClick={handleSave} variant="contained" color="primary">{t('core.button.save')}</SassButton>
                  </Box>
                </Popover>
              </Box>}
            </Box>
          </Box>
        }
      > <InnetContent /></HeaderPage>

      {open.type === CommonModalType.INFO && <InfoModal
        centerBtn cancelBtn={false} closeBtn={false} closeIcon={false}
        htmlDescription={<InfoHelp title={t('employeeDashboard.helpPanel')} data={[...tempActivityData(t), ...operationData(t)]} />}
        onClose={() => closeModal(CommonModalType.INFO)}
      />}

      {open.type === CommonModalType.INFO && open.args?.empthy && <InfoModal
        centerBtn cancelBtn={false} closeBtn={false} closeIcon={false}
        description={t('employeeDashboard.helpPanelEmpty')}
        title={t('employeeDashboard.helpPanelEmptyTitle')}
        onClose={() => {
          closeModal(CommonModalType.INFO)
          navivateTo(`${CHECKINBIZ_MODULE_ROUTE}/employee`)
        }}
      />}
    </Container>

  );
}
