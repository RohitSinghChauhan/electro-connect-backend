export const SHOP_STATUS = {
    REJECTED: -1,
    PENDING: 0,
    APPROVED: 1,
} as const;
  
export const SHOP_STATUS_LABEL = {
  [SHOP_STATUS.REJECTED]: 'Rejected',
  [SHOP_STATUS.PENDING]: 'Pending',
  [SHOP_STATUS.APPROVED]: 'Approved',
}

export const LEARN_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const;

export const JOB_STATUS = {
  OPEN: "open",
  CLOSED: "closed",
} as const;

export const EMPLOYMENT_TYPE = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  INTERNSHIP: "internship",
  FREELANCE: "freelance",
} as const;

export const SHOP_SERVICES = [
  "AC Repair & Maintenance",
  "Fan Repair",
  "Bulb/Light Repair",
  "Switch & Socket Repair",
  "Electrical Wiring",
  "MCB/DB Repair",
  "Inverter & Battery Services",
  "CCTV Installation & Repair",
  "Appliance Repair",
] as const;

export type ShopService = (typeof SHOP_SERVICES)[number];

export const SERVICE_ORDER_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  ON_THE_WAY: "on_the_way",
  COMPLETED: "completed",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
} as const;

export type ServiceOrderStatus =
  (typeof SERVICE_ORDER_STATUS)[keyof typeof SERVICE_ORDER_STATUS];