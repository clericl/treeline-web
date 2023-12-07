import BaseballCard from "../BaseballCard";
import ReactMap from "../ReactMap";
import { Paper, Stack } from "@mui/material";

function Layout() {
  return (
    <Stack justifyContent="center" sx={{ height: 1, position: "relative" }}>
      <Paper sx={{ width: 1, height: 1 }}>
        <ReactMap />
        <BaseballCard />
      </Paper>
    </Stack>
  );
}

export default Layout;
