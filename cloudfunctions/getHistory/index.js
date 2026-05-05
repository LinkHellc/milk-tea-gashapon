const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event, context) => {
  const { openid } = cloud.getWXContext();
  if (!openid) {
    return { success: false, error: '未获取到用户信息' };
  }

  const { skip = 0, limit = 20 } = event;

  try {
    const userRes = await db.collection('users').where({ openid }).get();

    if (userRes.data.length === 0) {
      return { success: true, data: { history: [], total: 0 } };
    }

    const user = userRes.data[0];
    const history = (user.history || []).reverse().slice(skip, skip + limit);

    return {
      success: true,
      data: {
        history,
        total: (user.history || []).length
      }
    };
  } catch (err) {
    console.error('getHistory error:', err);
    return { success: false, error: err.message };
  }
};
