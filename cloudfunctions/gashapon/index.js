// 云函数入口
exports.main = async (event, context) => {
  const { brandId } = event;

  // 品牌奶茶数据（本地Mock，后续可迁移到云数据库）
  const milkTeaCatalog = {
    'yidiandian': [
      { id: 'ydd-1', name: '波霸奶茶', description: '大颗珍珠，嚼劲十足' },
      { id: 'ydd-2', name: '四季春茶', description: '清爽茶底，轻盈口感' },
      { id: 'ydd-3', name: '椰果奶茶', description: '椰果Q弹，甜而不腻' },
      { id: 'ydd-4', name: '焦糖奶茶', description: '焦糖香气，温暖甜蜜' },
      { id: 'ydd-5', name: '茉莉绿茶', description: '茉莉花香，清新怡人' },
      { id: 'ydd-6', name: '红豆奶茶', description: '软糯红豆，绵密香甜' },
      { id: 'ydd-7', name: '燕麦奶茶', description: '燕麦香浓，健康之选' },
      { id: 'ydd-8', name: '阿华田', description: '经典港式，浓郁可可' }
    ],
    'xichaha': [
      { id: 'xch-1', name: '多肉葡萄', description: '葡萄果肉饱满，清爽解腻' },
      { id: 'xch-2', name: '芝芝莓莓', description: '草莓+芝士奶盖，层层叠加' },
      { id: 'xch-3', name: '芋泥波波', description: '芋泥绵密，波波Q弹' },
      { id: 'xch-4', name: '生打椰椰', description: '椰奶浓郁，热带风情' },
      { id: 'xch-5', name: '水云雾', description: '抹茶系列，清新回甘' },
      { id: 'xch-6', name: '琉璃', description: '桑葚口味，酸甜可口' },
      { id: 'xch-7', name: '轻芒芒绿', description: '芒果+绿茶，热带风情' },
      { id: 'xch-8', name: '茶茶茶', description: '三倍茶香，浓郁回甘' },
      { id: 'xch-9', name: '杨梅糖', description: '杨梅果香，酸甜开胃' },
      { id: 'xch-10', name: '超满杯葡萄', description: '葡萄果肉满杯，超满足' }
    ],
    'bawangchaji': [
      { id: 'bwcj-1', name: '伯牙绝弦', description: '茉莉雪芽，茶香浓郁' },
      { id: 'bwcj-2', name: '花系大理', description: '玫瑰花瓣，浪漫芬芳' },
      { id: 'bwcj-3', name: '下山闻猎', description: '桂花乌龙，层次分明' },
      { id: 'bwcj-4', name: '露水衣然', description: '露水柠檬，清爽解渴' },
      { id: 'bwcj-5', name: '角色巧遇', description: '巧克力奶茶，香浓幼滑' },
      { id: 'bwcj-6', name: '花田拿铁', description: '花瓣拿铁，颜值担当' },
      { id: 'bwcj-7', name: '踏雪寻梅', description: '草莓乌龙，清新怡人' },
      { id: 'bwcj-8', name: '桂以来', description: '桂花酒酿，创意十足' },
      { id: 'bwcj-9', name: '纸短情长', description: '竹香乌龙，独特风味' }
    ],
    'guming': [
      { id: 'gm-1', name: '桂花系列', description: '桂花乌龙，唇齿留香' },
      { id: 'gm-2', name: '杨枝甘露', description: '芒果+椰奶，热带风情' },
      { id: 'gm-3', name: '芋泥波波', description: '芋泥浓密，饱腹感强' },
      { id: 'gm-4', name: '超A葡萄', description: '葡萄果肉，清爽解腻' },
      { id: 'gm-5', name: '茉莉奶绿', description: '茉莉花香，清新爽口' },
      { id: 'gm-6', name: '杨梅', description: '时令杨梅，酸甜开胃' },
      { id: 'gm-7', name: '柠檬桒', description: '柠檬新品，清爽宜人' },
      { id: 'gm-8', name: '生椰拿铁', description: '生椰+咖啡，潮流之选' }
    ],
    'chabaidao': [
      { id: 'cbd-1', name: '茉莉奶绿', description: '茉莉花香，清新回甘' },
      { id: 'cbd-2', name: '杨枝甘露', description: '芒果椰奶，经典之作' },
      { id: 'cbd-3', name: '招牌芋泥', description: '芋泥浓密，饱腹感强' },
      { id: 'cbd-4', name: '多肉葡萄', description: '葡萄果肉，饱满多汁' },
      { id: 'cbd-5', name: '椰蓝柠檬', description: '椰蓝搭配，清爽一夏' },
      { id: 'cbd-6', name: '手剥西瓜', description: '新鲜西瓜，消暑必备' },
      { id: 'cbd-7', name: '茉莉绿芽', description: '绿茶清爽，夏日首选' },
      { id: 'cbd-8', name: '红豆布丁', description: '红豆+布丁，双重口感' },
      { id: 'cbd-9', name: '椰果奶茶', description: '经典椰果，Q弹爽滑' }
    ],
    'coco': [
      { id: 'coco-1', name: '奶茶三兄弟', description: '珍珠+布丁+椰果，超满足' },
      { id: 'coco-2', name: '杨枝甘露', description: '芒果椰奶，经典不衰' },
      { id: 'coco-3', name: '芋泥牛奶', description: '芋泥浓密，绵密香甜' },
      { id: 'coco-4', name: '柠檬水', description: '柠檬清香，解渴首选' },
      { id: 'coco-5', name: '椰果奶茶', description: '经典椰果，Q弹爽滑' },
      { id: 'coco-6', name: '珍珠奶茶', description: '经典珍珠，奶香浓郁' },
      { id: 'coco-7', name: '茉莉绿', description: '茉莉绿茶，清新爽口' },
      { id: 'coco-8', name: '红豆奶茶', description: '软糯红豆，绵密香甜' }
    ],
    'koi': [
      { id: 'koi-1', name: '伯爵奶茶', description: '伯爵红茶，经典风味' },
      { id: 'koi-2', name: '茉莉奶绿', description: '茉莉花香，清新回甘' },
      { id: 'koi-3', name: '芋泥波波', description: '芋泥浓密，饱腹感强' },
      { id: 'koi-4', name: '杨枝甘露', description: '芒果椰奶，经典之作' },
      { id: 'koi-5', name: '燕麦奶咖', description: '燕麦+咖啡，健康时尚' },
      { id: 'koi-6', name: '金凤茶王', description: '乌龙茶底，回甘明显' },
      { id: 'koi-7', name: '雪耳红枣', description: '养颜佳品，甜蜜滋补' },
      { id: 'koi-8', name: '桂花系列', description: '桂花乌龙，唇齿留香' }
    ],
    'ruixing': [
      { id: 'rx-1', name: '生椰拿铁', description: '生椰+咖啡，潮流之选' },
      { id: 'rx-2', name: '厚乳拿铁', description: '厚乳浓郁，丝滑口感' },
      { id: 'rx-3', name: '陨石拿铁', description: '黑糖波波，视觉冲击' },
      { id: 'rx-4', name: '生酪拿铁', description: '生酪芝士，浓郁奶香' },
      { id: 'rx-5', name: '茶咖系列', description: '茶+咖啡，双重提神' },
      { id: 'rx-6', name: '橙C美式', description: '鲜橙+美式，清爽提神' },
      { id: 'rx-7', name: '柠檬茶', description: '柠檬红茶，经典搭配' },
      { id: 'rx-8', name: '杨枝甘露', description: '芒果椰奶，经典不衰' }
    ],
    'hushangayi': [
      { id: 'hsay-1', name: '手打柠檬茶', description: '柠檬清香，真实果肉' },
      { id: 'hsay-2', name: '超A葡萄', description: '葡萄果肉，清爽解腻' },
      { id: 'hsay-3', name: '杨枝甘露', description: '芒果椰奶，经典之作' },
      { id: 'hsay-4', name: '芋泥波波', description: '芋泥浓密，饱腹感强' },
      { id: 'hsay-5', name: '茉莉奶绿', description: '茉莉花香，清新回甘' },
      { id: 'hsay-6', name: '多肉青提', description: '青提果肉，清爽宜人' },
      { id: 'hsay-7', name: '绿豆燕麦', description: '绿豆清凉，燕麦香浓' },
      { id: 'hsay-8', name: '血糯米奶茶', description: '血糯米软糯，健康之选' },
      { id: 'hsay-9', name: '桂花系列', description: '桂花乌龙，唇齿留香' },
      { id: 'hsay-10', name: '龙眼系列', description: '龙眼果肉，甜蜜滋补' }
    ]
  };

  // 获取品牌对应的奶茶列表
  const brandMilkTeas = milkTeaCatalog[brandId];

  if (!brandMilkTeas || brandMilkTeas.length === 0) {
    return {
      success: false,
      error: '品牌不存在或暂无奶茶数据'
    };
  }

  // 随机选择一款
  const randomIndex = Math.floor(Math.random() * brandMilkTeas.length);
  const selectedMilkTea = brandMilkTeas[randomIndex];

  return {
    success: true,
    data: {
      brandId: brandId,
      milkTea: selectedMilkTea
    }
  };
};
