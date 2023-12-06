import {
  Box,
  Card,
  CardContent,
  SwipeableDrawer,
  Tab,
  Tabs,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import SpeciesSelect from "../SpeciesSelect"
import TreeDetail from "../TreeDetail";
import { useCallback, useEffect, useState } from "react"
import { useSelectedTree } from "@/zustand";

interface TabPanelProps {
  children?: React.ReactNode;
  id: string;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      className="h-full"
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ height: '100%' }}>{children}</Box>
      )}
    </div>
  );
}

function Puller() {
  const theme = useTheme()

  return (
    <Box
      display="flex"
      justifyContent="center"
    >
      <Box
        sx={{
          width: '30px',
          height: '6px',
          backgroundColor: theme.palette.background.default,
          borderRadius: '3px',
        }}
      ></Box>
    </Box>
  )
}

const drawerBleeding = 86

export default function BaseballCard() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const selectedTree = useSelectedTree.use.tree()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleOnClose = useCallback(() => {
    setMobileOpen(false)
  }, [])

  const handleOnOpen = useCallback(() => {
    setMobileOpen(true)
  }, [])

  const handleTabChange = useCallback((_: unknown, newValue: number) => {
    setTabValue(newValue)
  }, [])

  useEffect(() => {
    if (selectedTree) {
      setTabValue(1)
    } else {
      setTabValue(0)
    }
  }, [selectedTree])

  useEffect(() => {
    if (selectedTree) {
      setTimeout(() => {
        setMobileOpen(true)
      }, 100)
    }
  }, [selectedTree])

  return (
    isMobile ? (
      <SwipeableDrawer
        anchor="bottom"
        className="bottom-drawer"
        disableSwipeToOpen={false}
        onClose={handleOnClose}
        onOpen={handleOnOpen}
        open={mobileOpen}
        swipeAreaWidth={drawerBleeding}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Card
          elevation={16}
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
            height: drawerBleeding,
            boxShadow: 'none',
          }}
        >
          <CardContent>
            <Puller />
            <Tabs
              onChange={handleTabChange}
              value={tabValue}
              variant="fullWidth"
            >
              <Tab label="Map Filters" id="map filters tab" />
              <Tab label="Tree Detail" id="tree detail tab" disabled={!selectedTree} />
            </Tabs>
          </CardContent>
        </Card>
        <Box
          sx={{
            px: 2,
            pb: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <CustomTabPanel index={0} value={tabValue} id="map filters panel">
            <SpeciesSelect />
          </CustomTabPanel>
          <CustomTabPanel index={1} value={tabValue} id="tree detail panel">
            <TreeDetail />
          </CustomTabPanel>
        </Box>
      </SwipeableDrawer>
    ) : (
      <Card
        elevation={3}
        variant="elevation"
        sx={{
          backgroundColor: alpha(theme.palette.background.default, 0.95),
          minHeight: '250px',
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '20vw',
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ height: '100%', paddingTop: 0 }}>
          <Tabs onChange={handleTabChange} value={tabValue} variant="fullWidth">
            <Tab label="Map Filters" id="map filters tab" />
            <Tab label="Tree Detail" id="tree detail tab" disabled={!selectedTree} />
          </Tabs>
          <CustomTabPanel index={0} value={tabValue} id="map filters panel">
            <SpeciesSelect />
          </CustomTabPanel>
          <CustomTabPanel index={1} value={tabValue} id="tree detail panel">
            <TreeDetail />
          </CustomTabPanel>
        </CardContent>
      </Card>
    )
  )
}
