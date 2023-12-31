import {
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { MAP_STYLES } from "../ReactMap";
import { MapStyle, useMapStyle } from "@/zustand";
import { useCallback } from "react";

export default function MapStyleList() {
  const mapStyle = useMapStyle.use.style();
  const setMapStyle = useMapStyle.use.set();

  const handleListItemClick = useCallback(
    (newMapStyle: MapStyle) => {
      setMapStyle(newMapStyle);
    },
    [setMapStyle],
  );

  return (
    <List
      dense={true}
      subheader={
        <ListSubheader sx={{ fontWeight: 700 }}>Map Styles</ListSubheader>
      }
    >
      {Object.keys(MAP_STYLES).map((mapStyleName) => (
        <ListItemButton
          key={mapStyleName}
          selected={mapStyleName === mapStyle}
          onClick={() => handleListItemClick(mapStyleName as MapStyle)}
        >
          <ListItemText primary={mapStyleName} />
        </ListItemButton>
      ))}
    </List>
  );
}
