
export interface DawMetadata {
  artist?: string;
  title?: string;
  vendor?: string;
  version?: string;
  comment?: string;
}

export enum TrackType {
    Audio = "Audio",
    Group = "Group",
    Hybrid = "Hybrid",
    Automation = "Automation",
    Video = "Video",
    Other = "Other"
}

export interface DawClip {
    name: string;
    start: number;
    duration: number;
    // Add other clip properties as needed
}

export interface DawLane {
  name: string;
  clips: DawClip[];
}

export interface DawTrack {
  name: string;
  type: TrackType;
  color?: string; // Stored as a hex string e.g. #RRGGBB
  lanes: DawLane[];
}

export interface DawProject {
  application: {
    name: string;
    version: string;
  };
  sampleRate: number;
  timeSignature: {
    numerator: number;
    denominator: number;
  },
  tracks: DawTrack[];
}

export interface DawProjectFile {
  metadata: DawMetadata;
  project: DawProject;
}
