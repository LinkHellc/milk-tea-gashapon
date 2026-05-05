const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event, context) => {
  const { openid } = cloud.getWXContext();
  if (!openid) {
    return { success: false, error: '未获取到用户信息' };
  }

  const { brandId, name, description } = event;

  if (!brandId || !name) {
    return { success: false, error: '缺少参数' };
  }

  if (name.length > 20) {
    return { success: false, error: '名称不能超过20个字符' };
  }

  try {
    // Get or create user record
    let userRes = await db.collection('users').where({ openid }).get();
    let user;

    if (userRes.data.length === 0) {
      user = {
        openid,
        points: 0,
        totalDraws: 0,
        achievements: [],
        history: [],
        brandsDrawn: [],
        customMilkTeas: [],
        createdAt: new Date()
      };
      await db.collection('users').add({ data: user });
    } else {
      user = userRes.data[0];
    }

    // Add custom milk tea
    const customMilkTea = {
      id: 'custom_' + Date.now(),
      brandId,
      name: name.trim(),
      description: description || '',
      createdAt: Date.now()
    };

    // Check for duplicates
    const existing = (user.customMilkTeas || []).find(
      c => c.brandId === brandId && c.name === name.trim()
    );
    if (existing) {
      return { success: false, error: '该定制已存在' };
    }

    // Update user
    await db.collection('users').where({ openid }).update({
      data: {
        customMilkTeas: db.command.push([customMilkTea])
      }
    });

    return { success: true, data: customMilkTea };
  } catch (err) {
    console.error('addCustomMilkTea error:', err);
    return { success: false, error: err.message };
  }
};
