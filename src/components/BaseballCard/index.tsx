import {
  Box,
  Card,
  CardContent,
  Tab,
  Tabs,
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
        <Box sx={{ height: '100%', paddingTop: 3, paddingBottom: 3 }}>{children}</Box>
      )}
    </div>
  );
}

export default function BaseballCard() {
  const [tabValue, setTabValue] = useState(0)
  const selectedTreeId = useSelectedTree.use.id()

  const handleTabChange = useCallback((_: unknown, newValue: number) => {
    setTabValue(newValue)
  }, [])

  useEffect(() => {
    setTabValue(selectedTreeId ? 1 : 0)
  }, [selectedTreeId])

  return (
    <Card elevation={3} variant="outlined" sx={{ width: '20vw', minHeight: '250px' }}>
      <CardContent sx={{ height: '100%', paddingTop: 0 }}>
        <Tabs onChange={handleTabChange} value={tabValue} variant="fullWidth">
          <Tab label="Map Filters" id="map filters tab" />
          <Tab label="Tree Detail" id="tree detail tab" disabled={!selectedTreeId} />
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
}
