const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const POINTS_PER_DRAW = 10;
const POINTS_HIDDEN = 50;
const POINTS_ACHIEVEMENT = 20;

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

  const { brandId, milkTeaName, isHidden } = event;
  const now = new Date();

  try {
    // Get or create user record
    let userRes = await db.collection('users').where({ openid }).get();
    let user;

    if (userRes.data.length === 0) {
      // Create new user
      user = {
        openid,
        points: 0,
        totalDraws: 0,
        achievements: [],
        history: [],
        brandsDrawn: [],
        createdAt: now
      };
      await db.collection('users').add({ data: user });
    } else {
      user = userRes.data[0];
    }

    // Calculate points
    let pointsEarned = POINTS_PER_DRAW;
    if (isHidden) pointsEarned += POINTS_HIDDEN;

    // Update user
    const newPoints = user.points + pointsEarned;
    const newTotalDraws = user.totalDraws + 1;

    // Add to brands drawn if new brand
    const brandsDrawn = user.brandsDrawn || [];
    if (brandId && !brandsDrawn.includes(brandId)) {
      brandsDrawn.push(brandId);
    }

    // Check achievements
    const unlockedAchievements = [];
    const existingAchievements = user.achievements || [];

    // first_draw
    if (!existingAchievements.includes('first_draw')) {
      unlockedAchievements.push('first_draw');
    }
    // newbie (3 draws)
    if (newTotalDraws >= 3 && !existingAchievements.includes('newbie')) {
      unlockedAchievements.push('newbie');
    }
    // enthusiast (10 draws)
    if (newTotalDraws >= 10 && !existingAchievements.includes('enthusiast')) {
      unlockedAchievements.push('enthusiast');
    }
    // addict (50 draws)
    if (newTotalDraws >= 50 && !existingAchievements.includes('addict')) {
      unlockedAchievements.push('addict');
    }
    // hidden
    if (isHidden && !existingAchievements.includes('hidden')) {
      unlockedAchievements.push('hidden');
    }
    // collector (9 brands)
    if (brandsDrawn.length >= 9 && !existingAchievements.includes('collector')) {
      unlockedAchievements.push('collector');
    }

    // Add achievement unlock points
    let totalPointsEarned = pointsEarned;
    if (unlockedAchievements.length > 0) {
      totalPointsEarned += unlockedAchievements.length * POINTS_ACHIEVEMENT;
    }

    // Add to history
    const historyEntry = {
      brandId,
      milkTeaName,
      timestamp: now.getTime()
    };

    // Update user in database
    await db.collection('users').where({ openid }).update({
      data: {
        points: newPoints + (unlockedAchievements.length * POINTS_ACHIEVEMENT),
        totalDraws: newTotalDraws,
        achievements: [...existingAchievements, ...unlockedAchievements],
        brandsDrawn,
        history: db.command.push([historyEntry])
      }
    });

    return {
      success: true,
      data: {
        pointsEarned: totalPointsEarned,
        totalPoints: newPoints + (unlockedAchievements.length * POINTS_ACHIEVEMENT),
        totalDraws: newTotalDraws,
        unlockedAchievements: unlockedAchievements.map(id => ({
          id,
          ...ACHIEVEMENTS[id]
        }))
      }
    };
  } catch (err) {
    console.error('recordDraw error:', err);
    return { success: false, error: err.message };
  }
};
