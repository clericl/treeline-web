import {
  Box,
  Card,
  CardContent,
  Tab,
  Tabs,
  alpha,
  useTheme,
} from "@mui/material"
import SpeciesSelect from "../SpeciesSelect"
import TreeDetail from "../TreeDetail";
import { useCallback, useEffect, useMemo, useState } from "react"
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
        <Box sx={{ height: '100%', paddingTop: 3, paddingBottom: 3 }}>{children}</Box>
      )}
    </div>
  );
}

export default function BaseballCard() {
  const [tabValue, setTabValue] = useState(0)
  const selectedTree = useSelectedTree.use.tree()
  const theme = useTheme()

  const handleTabChange = useCallback((_: unknown, newValue: number) => {
    setTabValue(newValue)
  }, [])

  const innerContent = useMemo(() => (
    <>
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
    </>
  ), [handleTabChange, selectedTree, tabValue])

  useEffect(() => {
    setTabValue(selectedTree ? 1 : 0)
  }, [selectedTree])

  return (
    <Card
      elevation={3}
      variant="elevation"
      sx={{
        backgroundColor: alpha(theme.palette.background.default, 0.95),
        minHeight: '250px',
        width: '20vw',
      }}
    >
      <CardContent sx={{ height: '100%', paddingTop: 0 }}>
        {innerContent}
      </CardContent>
    </Card>
  )
}
