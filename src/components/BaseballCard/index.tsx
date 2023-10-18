import {
  Box,
  Card,
  CardContent,
  Tab,
  Tabs,
} from "@mui/material"
import SpeciesSelect from "../SpeciesSelect"
import { useCallback, useState } from "react"

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
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ paddingTop: 3, paddingBottom: 3, }}>{children}</Box>
      )}
    </div>
  );
}

export default function BaseballCard() {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = useCallback((_: unknown, newValue: number) => {
    setTabValue(newValue)
  }, [])

  return (
    <Card variant="outlined" sx={{ width: '20vw', height: '400px' }}>
      <CardContent sx={{ paddingTop: 0 }}>
        <Tabs onChange={handleTabChange} value={tabValue} variant="fullWidth">
          <Tab label="Map Filters" id="map filters tab" />
          <Tab label="Tree Detail" id="tree detail tab" />
        </Tabs>
        <CustomTabPanel index={0} value={tabValue} id="map filters panel">
          <SpeciesSelect />
        </CustomTabPanel>
        <CustomTabPanel index={1} value={tabValue} id="tree detail panel">
          hello world!
        </CustomTabPanel>
      </CardContent>
    </Card>
  )
}
