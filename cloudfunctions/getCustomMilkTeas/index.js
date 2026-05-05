const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event, context) => {
  const { openid } = cloud.getWXContext();
  if (!openid) {
    return { success: false, error: '未获取到用户信息' };
  }

  const { brandId } = event;

  try {
    const userRes = await db.collection('users').where({ openid }).get();

    if (userRes.data.length === 0) {
      return { success: true, data: { customMilkTeas: [] } };
    }

    const user = userRes.data[0];
    const customMilkTeas = (user.customMilkTeas || []).filter(
      c => !brandId || c.brandId === brandId
    );

    return { success: true, data: { customMilkTeas } };
  } catch (err) {
    console.error('getCustomMilkTeas error:', err);
    return { success: false, error: err.message };
  }
};
