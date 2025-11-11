// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/sc/login',
  CHANGE_PASSWORD: '/sc/change-password',
  
  // Dashboard
  DASHBOARD: '/sc/dashboard',
  SETTINGS: '/sc/settings',
  
  // Users
  USERS: '/sc/users',
  USER_DETAILS: (id) => `/sc/user-details/${id}`,
  UPDATE_USER_STATUS: (id, status) => `/sc/user-status-update/${id}/${status}`,
  
  // Plans
  PLANS: '/sc/plans',
  EDIT_PLAN: (id) => `/sc/edit-plan-${id}`,
  
  // Investments
  INVESTMENTS: (status) => `/sc/investments/${status}`,
  INVESTMENT_DETAILS: (id) => `/sc/investment-details/${id}`,
  
  // Bot Cast
  BOT_CAST: '/sc/bot-cast',
  
  // Referral
  REFERRAL_CONFIG: '/sc/referral-config',
  UPDATE_REFERRAL_CONFIG: '/sc/update-referral-config',
  
  // Staking
  STAKING_DASHBOARD: '/sc/staking/dashboard',
  STAKING_STAKES: '/sc/staking/stakes',
  STAKING_USER_STAKES: (userId) => `/sc/staking/stakes/user/${userId}`,
  STAKING_UPDATE_STATUS: (stakeId) => `/sc/staking/stakes/${stakeId}/status`,
  STAKING_UPDATE_REWARD: (stakeId) => `/sc/staking/stakes/${stakeId}/reward`,
  STAKING_DELETE: (stakeId) => `/sc/staking/stakes/${stakeId}`,
  STAKING_BULK_UPDATE: '/sc/staking/stakes/bulk-update',
  STAKING_WALLET_POOL: '/sc/staking/wallet-pool',
  STAKING_RELEASE_WALLET: '/sc/staking/wallet-pool/release',
  STAKING_REPORT: '/sc/staking/report',
  STAKING_TOP_STAKERS: '/sc/staking/top-stakers',
};

export default API_BASE_URL;