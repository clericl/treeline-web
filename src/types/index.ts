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
  structure: string;
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
    count: number;
    wikiTitle?: string;
  };
}

export type TreeDetailType = null | {
  OBJECTID: string;
};
