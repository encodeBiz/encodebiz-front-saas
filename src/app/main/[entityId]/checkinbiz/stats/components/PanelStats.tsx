/* eslint-disable react-hooks/exhaustive-deps */
import BoxLoader from "@/components/common/BoxLoader";
import HeaderPage from "@/components/features/dashboard/HeaderPage/HeaderPage";
import { SettingsOutlined } from "@mui/icons-material";
import { Container, Box, Typography, IconButton, Popover } from "@mui/material";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { useCheckBizStats } from "../context/checkBizStatsContext";
import { HeuristicAnalize } from "./HeuristicAnalize/HeuristicAnalize";
import { SelectorBranch } from "./Selector";
import { SelectorCard } from "./SelectorCard";
import { SelectorChart } from "./SelectorChart";
import { SelectorIndicator } from "./SelectorIndicator";
import { StatsPattern } from "./Stats";
import { useEntity } from "@/hooks/useEntity";




export const PanelStats = ({ branchId, employeeId, type }: { type?: 'employee' | 'branch' , branchId?: string | null, employeeId?: string | null }) => {
  const t = useTranslations();
  const { currentEntity } = useEntity()
  const { pending, branchOne, heuristicAnalizeError, branchTwo, heuristicDataOne, heuristicDataTwo, initialize } = useCheckBizStats()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;



  useEffect(() => {
    initialize(branchId ? branchId : null, employeeId ? employeeId : null, type as  'employee' | 'branch' )
  }, [branchId, currentEntity?.entity?.id])

  const InnetContent = () => <>
    {pending && <BoxLoader message={t('statsCheckbiz.loading')} />}
    {!pending && branchOne && <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }} p={2}>
      <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
        {!pending && !!branchOne && <Box>
          <Typography variant='h6' sx={{ width: '100%' }}>{t('statsCheckbiz.operationData')}</Typography>
        </Box>}
        <Box>
          <IconButton onClick={handleClick}><SettingsOutlined sx={{ fontSize: 40 }} color='primary' /></IconButton>
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
              <SelectorCard />
              <SelectorIndicator />
              <SelectorChart />
            </Box>
          </Popover>
        </Box>
      </Box>
      <StatsPattern />
    </Box>}

    <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
      {!pending && <Box display={'flex'} justifyContent={'space-between'} alignItems='center' gap={2} sx={{ width: '100%' }} p={2}>
        <Typography variant='h6' sx={{ width: '100%' }}>{t('statsCheckbiz.heuristicAnalize')}</Typography>
      </Box>}


      {!pending && heuristicAnalizeError && <Box display={'flex'} justifyContent={'center'} alignItems={'center'} p={2} pb={4} textAlign={'center'} sx={{ width: '60%', margin: 'auto' }}>
        <Typography variant='body1' color='textSecondary'>
          {heuristicAnalizeError}
        </Typography>
      </Box>}
      {!pending && heuristicDataOne.length > 0 && <Box display={'flex'} justifyContent={'space-between'} alignItems='center' gap={2} sx={{ width: '100%' }}>


        {heuristicDataOne.length > 0 && branchOne && !heuristicAnalizeError && <HeuristicAnalize branchPattern={branchOne} data={heuristicDataOne} />}
        {heuristicDataTwo.length > 0 && branchTwo && !heuristicAnalizeError && <HeuristicAnalize branchPattern={branchTwo} data={heuristicDataTwo} />}
      </Box>}
    </Box>
  </>
  return (

    <Container maxWidth="lg">
      {branchId ? <InnetContent /> :
        <HeaderPage
          title={t("layout.side.menu.Stats")}
          actions={branchId ? null :
            <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
              <SelectorBranch />
            </Box>
          }
        > <InnetContent /></HeaderPage>}
    </Container>

  );
}
