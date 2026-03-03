// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/sc/login',
  CHANGE_PASSWORD: '/sc/change-password',
  
  // Dashboard
  DASHBOARD: '/sc/dashboard',
  SETTINGS: '/sc/settings',
  UPDATE_SETTINGS: '/sc/settings/update',
  
  // Users
  USERS: '/sc/users',
  USER_DETAILS: (id) => `/sc/user-details/${id}`,
  UPDATE_USER_STATUS: (id, status) => `/sc/user-status-update/${id}/${status}`,
  UPDATE_USER_BALANCE: (id) => `/sc/user-balance-update/${id}`,
  
  // Plans
  PLANS: '/sc/plans',
  CREATE_PLAN: '/sc/plans',
  EDIT_PLAN: (id) => `/sc/edit-plan-${id}`,
  TOGGLE_PLAN_STATUS: (id) => `/sc/plan-status-${id}`,
  
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

  // Legacy Levels
  LEGACY_LEVELS: '/sc/legacy-levels',
  LEGACY_LEVEL_DETAILS: (id) => `/sc/legacy-levels/${id}`,
  CREATE_LEGACY_LEVEL: '/sc/legacy-levels',
  UPDATE_LEGACY_LEVEL: (id) => `/sc/legacy-levels/${id}`,
  DELETE_LEGACY_LEVEL: (id) => `/sc/legacy-levels/${id}`,

  // Legacy Level Requirements
  LEGACY_REQUIREMENTS: '/sc/legacy-level-requirements',
  LEGACY_REQUIREMENT_DETAILS: (id) => `/sc/legacy-level-requirements/${id}`,
  CREATE_LEGACY_REQUIREMENT: '/sc/legacy-level-requirements',
  UPDATE_LEGACY_REQUIREMENT: (id) => `/sc/legacy-level-requirements/${id}`,
  DELETE_LEGACY_REQUIREMENT: (id) => `/sc/legacy-level-requirements/${id}`,

  // Deposits
  DEPOSITS: '/sc/deposits',
  DEPOSIT_DETAILS: (id) => `/sc/deposits/${id}`,
  UPDATE_DEPOSIT_STATUS: (id) => `/sc/deposits/${id}/status`,

  // Transactions
  TRANSACTIONS: '/sc/transactions',
  TRANSACTION_DETAILS: (id) => `/sc/transactions/${id}`,

  // Exchange Transactions
  EXCHANGE_TRANSACTIONS: '/sc/exchange-transactions',
  EXCHANGE_TRANSACTION_DETAILS: (id) => `/sc/exchange-transactions/${id}`,

  // Currency Pairs
  CURRENCY_PAIRS: '/sc/currency-pairs',
  CREATE_CURRENCY_PAIR: '/sc/currency-pairs',
  UPDATE_CURRENCY_PAIR: (id) => `/sc/currency-pairs/${id}`,
  DELETE_CURRENCY_PAIR: (id) => `/sc/currency-pairs/${id}`,
  TOGGLE_CURRENCY_PAIR: (id) => `/sc/currency-pairs/${id}/toggle`,

  // Wallet Pools
  WALLET_POOLS: '/sc/wallet-pools',
  CREATE_WALLET_POOL: '/sc/wallet-pools',
  UPDATE_WALLET_POOL: (id) => `/sc/wallet-pools/${id}`,
  DELETE_WALLET_POOL: (id) => `/sc/wallet-pools/${id}`,
  TOGGLE_WALLET_POOL: (id) => `/sc/wallet-pools/${id}/toggle`,
  RELEASE_WALLET_POOL: (id) => `/sc/wallet-pools/${id}/release`,

  // User Rankings
  USER_RANKINGS: '/sc/user-rankings',
  CREATE_USER_RANKING: '/sc/user-rankings',
  UPDATE_USER_RANKING: (id) => `/sc/user-rankings/${id}`,
  DELETE_USER_RANKING: (id) => `/sc/user-rankings/${id}`,
  TOGGLE_USER_RANKING: (id) => `/sc/user-rankings/${id}/toggle`,
};

export default API_BASE_URL;