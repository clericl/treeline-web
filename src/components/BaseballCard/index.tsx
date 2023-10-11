import {
  Card,
  CardContent,
} from "@mui/material"
import SpeciesSelect from "../SpeciesSelect"

export default function BaseballCard() {
  return (
    <Card variant="outlined" sx={{ width: '20vw' }}>
      <CardContent>
        <SpeciesSelect />
      </CardContent>
    </Card>
  )
}
