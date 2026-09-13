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