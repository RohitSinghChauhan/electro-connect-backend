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