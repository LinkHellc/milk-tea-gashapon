const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const ACHIEVEMENTS = {
  'first_draw': { name: '首次抽取', description: '完成第一次抽取', icon: '🎯' },
  'newbie': { name: '新人奖', description: '累计抽取3次', icon: '🌱' },
  'enthusiast': { name: '奶茶爱好者', description: '累计抽取10次', icon: '☕' },
  'addict': { name: '沉迷奶茶', description: '累计抽取50次', icon: '🧋' },
  'hidden': { name: '隐藏款', description: '抽到概率极低的隐藏款', icon: '✨' },
  'collector': { name: '品牌收集家', description: '集齐9个品牌各一款', icon: '🏆' }
};

const db = cloud.database();

exports.main = async (event, context) => {
  const { openid } = cloud.getWXContext();
  if (!openid) {
    return { success: false, error: '未获取到用户信息' };
  }

  try {
    const userRes = await db.collection('users').where({ openid }).get();

    if (userRes.data.length === 0) {
      return {
        success: true,
        data: {
          points: 0,
          totalDraws: 0,
          achievements: [],
          brandsDrawn: [],
          history: []
        }
      };
    }

    const user = userRes.data[0];
    const achievements = (user.achievements || []).map(id => ({
      id,
      ...ACHIEVEMENTS[id],
      unlocked: true,
      unlockedAt: null
    }));

    // Add locked achievements
    Object.keys(ACHIEVEMENTS).forEach(id => {
      if (!user.achievements.includes(id)) {
        achievements.push({
          id,
          ...ACHIEVEMENTS[id],
          unlocked: false
        });
      }
    });

    return {
      success: true,
      data: {
        points: user.points || 0,
        totalDraws: user.totalDraws || 0,
        achievements,
        brandsDrawn: user.brandsDrawn || [],
        history: user.history || []
      }
    };
  } catch (err) {
    console.error('getUserData error:', err);
    return { success: false, error: err.message };
  }
};
