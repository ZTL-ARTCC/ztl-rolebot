export interface RoleArr {
  id: number;
  cid: number;
  facility: string;
  role: string;
  created_at: string;
}

export interface APIResponse {
  data: {
    cid: number;
    fname: string;
    lname: string;
    email: string | null;
    facility: string;
    rating: number;
    created_at: string;
    updated_at: string;
    flag_needbasic: boolean;
    flag_xferOverride: boolean;
    facility_join: string;
    flag_homecontroller: boolean;
    lastactivity: string;
    flag_broadcastOptedIn: boolean | null;
    flag_preventStaffAssign: boolean | null;
    last_cert_sync: string;
    flag_nameprivacy: boolean;
    last_competency_date: string | null;
    promotion_eligible: boolean;
    transfer_eligible: boolean;
    roles: RoleArr[];
    rating_short: string;
    visiting_facilities: {
      id: number;
      cid: number;
      facility: string;
      created_at: string;
      updated_at: string;
    }[];
    isMentor: boolean;
    isSupIns: boolean;
    last_promotion: string;
  };
  testing: boolean;
}

export enum ZTLRole {
  ATM = "Air Traffic Manager",
  DATM = "Deputy Air Traffic Manager",
  TA = "Training Administrator",
  EC = "Events Coordinator",
  FE = "Facility Engineer",
  WM = "Webmaster",
  ZTLSRSTAFF = "ZTL Sr Staff",
  ZTLSTAFF = "ZTL Staff",
  TRNGTEAM = "Training Team",
  VATUSA = "VATUSA",
  ZTL = "ZTL",
  VISITOR = "Visitors",
  VATSIM = "VATSIM Member",
  OBS = "Observer",
  S1 = "S1",
  S2 = "S2",
  S3 = "S3",
  C1 = "C1",
  C3 = "C3",
  I1 = "I1",
  I3 = "I3",
  SUP = "SUP",
  ADM = "ADM",
}
