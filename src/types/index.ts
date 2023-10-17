import { Geometry } from 'geojson';
import { ReactNode } from 'react';

/** The state of a controller */
export type InteractionState = {
  /** If the view state is in transition */
  inTransition?: boolean;
  /** If the user is dragging */
  isDragging?: boolean;
  /** If the view is being panned, either from user input or transition */
  isPanning?: boolean;
  /** If the view is being rotated, either from user input or transition */
  isRotating?: boolean;
  /** If the view is being zoomed, either from user input or transition */
  isZooming?: boolean;
}

/** Parameters passed to the onViewStateChange callback */
export type ViewStateChangeParameters = {
  /** The next view state, either from user input or transition */
  viewState: Record<string, any>;
  /** Object describing the nature of the view state change */
  interactionState: InteractionState;
  /** The current view state */
  oldViewState?: Record<string, any>;
}

export interface RedisGeoSearchType {
  member: string;
  coordinates?: {
    longitude: string;
    latitude: string;
  };
  species: string;
}

export type TreeMarkerType = {
  id: number;
  species: string;
  condition: string;
  diameter: number;
  location: {
    longitude: number;
    latitude: number;
  };
};

export type NtaDatumType = {
  ntaCode: string;
  ntaName: string;
  geometry: Geometry;
  treeCount: number;
  center: {
    longitude: number;
    latitude: number;
  };
};

export type SpeciesNameType = {
  id: string;
  title: string;
};

export type ControllerProps = {
  children: ReactNode;
};

export interface SpeciesDetailsType {
  [key: string]: {
    commonNames: string;
    color: number[];
    description: string;
  };
}

export type TreeDetailType = null | {
  tree_id: number;
  block_id: number;
  created_at: {
    value: Date;
  };
  tree_dbh: number;
  stump_diam: number;
  curb_loc: string;
  status: string;
  health: string;
  spc_latin: string;
  spc_common: string;
  steward: string;
  guards: string;
  sidewalk: string;
  user_type: string;
  problems: string;
  root_stone: boolean;
  root_grate: boolean;
  root_other: boolean;
  trunk_wire: boolean;
  trnk_light: boolean;
  trnk_other: boolean;
  brch_light: boolean;
  brch_shoe: boolean;
  brch_other: boolean;
  address: string;
  postcode: number;
  zip_city: string;
  community_board: number;
  borocode: number;
  borough: string;
  cncldist: number;
  st_assem: number;
  st_senate: number;
  nta: string;
  nta_name: string;
  boro_ct: number;
  state: string;
  latitude: number;
  longitude: number;
  x_sp: number;
  y_sp: number;
  council_district: number;
  census_tract: number;
  bin: number;
  bbl: number;
};
