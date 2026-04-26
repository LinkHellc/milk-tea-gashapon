/**
 * Auth utility functions for milk tea gashapon mini-program
 * Uses 'milkTeaGashapon_' prefixed Storage keys to avoid DevTools collisions
 */

const STORAGE_KEY = 'milkTeaGashapon_userInfo';

/**
 * Get stored user info
 * @returns {Object|null} userInfo or null if not logged in
 */
function getStoredUserInfo() {
  return wx.getStorageSync(STORAGE_KEY) || null;
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
function isAuthenticated() {
  return !!getStoredUserInfo();
}

/**
 * Save user info to storage
 * @param {Object} userInfo - from wx.getUserProfile success callback
 */
function saveUserInfo(userInfo) {
  wx.setStorageSync(STORAGE_KEY, userInfo);
}

/**
 * Clear user info (logout)
 */
function clearUserInfo() {
  wx.removeStorageSync(STORAGE_KEY);
}

/**
 * Request user authorization via getUserProfile
 * @param {Function} success - callback(userInfo)
 * @param {Function} fail - callback() for when user cancels
 */
function requestAuth(success, fail) {
  wx.getUserProfile({
    desc: '用于展示您的头像和昵称',
    success: (res) => {
      saveUserInfo(res.userInfo);
      success(res.userInfo);
    },
    fail: () => {
      fail && fail();
    }
  });
}

module.exports = {
  getStoredUserInfo,
  isAuthenticated,
  saveUserInfo,
  clearUserInfo,
  requestAuth
};