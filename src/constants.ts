import { DayPlan, NutritionTip, Exercise } from './types';

const COMMON_WARMUP: Exercise[] = [
  {
    id: 'jumping-jacks',
    name: '开合跳 (Jumping Jacks)',
    description: '1. 站立位，双脚并拢，手臂自然下垂。2. 跳起时双脚向两侧分开，同时双手在头顶上方击掌。3. 跳回起始位置，双脚并拢，手臂放下。',
    sets: '1 组',
    reps: '60 秒',
    tips: ['提高心率', '全身热身', '节奏均匀'],
    category: 'Warmup',
    imageUrl: 'https://picsum.photos/seed/jumping-jacks/400/300'
  },
  {
    id: 'arm-circles',
    name: '手臂环绕 (Arm Circles)',
    description: '1. 双脚与肩同宽站立，手臂向两侧平举。2. 以肩关节为轴，手臂做小幅度圆周运动。3. 顺时针和逆时针各做一半时间。',
    sets: '1 组',
    reps: '30 秒',
    tips: ['活动肩关节', '幅度由小到大'],
    category: 'Warmup',
    imageUrl: 'https://picsum.photos/seed/arm-circles/400/300'
  },
  {
    id: 'side-stretch',
    name: '动态侧拉伸 (Dynamic Side Stretch)',
    description: '1. 双脚宽于肩站立。2. 一只手叉腰，另一只手向对侧上方伸展。3. 左右交替进行，感受侧腹拉伸。',
    sets: '1 组',
    reps: '30 秒',
    tips: ['拉伸侧腹', '动作流畅'],
    category: 'Warmup',
    imageUrl: 'https://picsum.photos/seed/side-stretch/400/300'
  },
  {
    id: 'high-knees',
    name: '高抬腿 (High Knees)',
    description: '1. 原地跑步，尽可能将膝盖抬高至腰部高度。2. 摆动双臂配合。3. 保持核心收紧，背部挺直。',
    sets: '1 组',
    reps: '60 秒',
    tips: ['激活下肢', '核心发力'],
    category: 'Warmup',
    imageUrl: 'https://picsum.photos/seed/high-knees/400/300'
  },
  {
    id: 'cat-cow',
    name: '猫驼式 (Cat-Cow)',
    description: '1. 四足跪姿，双手在肩下，膝盖在臀下。2. 吸气抬头塌腰（猫式），呼气低头拱背（驼式）。3. 缓慢有节奏地移动。',
    sets: '1 组',
    reps: '60 秒',
    tips: ['活动脊柱', '配合呼吸'],
    category: 'Warmup',
    imageUrl: 'https://picsum.photos/seed/cat-cow/400/300'
  }
];

const COMMON_COOLDOWN: Exercise[] = [
  {
    id: 'cobra-pose',
    name: '眼镜蛇式 (Cobra Pose)',
    description: '1. 俯卧，双手放在胸部两侧。2. 伸直手臂抬起上半身，髋部保持贴地。3. 抬头看向上方，感受腹部和背部拉伸。',
    sets: '1 组',
    reps: '60 秒',
    tips: ['拉伸腹部', '放松腰椎'],
    category: 'Cooldown',
    imageUrl: 'https://picsum.photos/seed/cobra-pose/400/300'
  },
  {
    id: 'down-dog',
    name: '下犬式 (Downward Dog)',
    description: '1. 四足跪姿，抬起臀部，身体呈倒 V 字型。2. 尽量伸直双腿，脚后跟踩向地面。3. 头部放在双臂之间，感受后背和腿后侧拉伸。',
    sets: '1 组',
    reps: '60 秒',
    tips: ['拉伸全身后侧', '深呼吸'],
    category: 'Cooldown',
    imageUrl: 'https://picsum.photos/seed/down-dog/400/300'
  },
  {
    id: 'dead-hang-cool',
    name: '静态悬挂 (Dead Hang)',
    description: '1. 找到单杠或稳固的支撑物。2. 双手抓牢，全身放松下垂。3. 感受脊柱被重力自然拉开。',
    sets: '1 组',
    reps: '60 秒',
    tips: ['脊柱减压', '彻底放松'],
    category: 'Cooldown',
    imageUrl: 'https://picsum.photos/seed/dead-hang/400/300'
  },
  {
    id: 'quad-stretch',
    name: '站立大腿拉伸 (Quad Stretch)',
    description: '1. 站立，一只手扶墙保持平衡。2. 另一只手向后抓住同侧脚踝，将脚后跟拉向臀部。3. 保持双膝并拢，感受大腿前侧拉伸。',
    sets: '1 组',
    reps: '60 秒',
    tips: ['拉伸股四头肌', '换腿进行'],
    category: 'Cooldown',
    imageUrl: 'https://picsum.photos/seed/quad-stretch/400/300'
  }
];

export const WEEKLY_PLAN: DayPlan[] = [
  {
    day: '周一',
    focus: '计划 A：全身爆发力与跑步专项',
    isCircuit: true,
    warmup: COMMON_WARMUP,
    cooldown: COMMON_COOLDOWN,
    exercises: [
      {
        id: 'burpees',
        name: '波比跳 (Burpees)',
        description: '1. 从站立姿势开始，下蹲并将双手放在地面。2. 双脚向后跳出成俯卧撑姿势。3. 做一个完整的俯卧撑（胸部触地）。4. 双脚跳回手部位置。5. 全力向上跳起，双手在头顶击掌。',
        sets: '3 轮',
        reps: '45 秒',
        tips: ['全身爆发力训练', '动作连贯', '保持呼吸节奏'],
        category: 'Full Body',
        imageUrl: 'https://picsum.photos/seed/burpees/400/300'
      },
      {
        id: 'bulgarian-left',
        name: '保加利亚剪蹲 (左)',
        description: '1. 背对椅子站立，左脚脚背平放在椅子面上。2. 右脚向前迈出一大步。3. 垂直下蹲，直到右大腿与地面平行，左膝盖接近地面。4. 发力推起回到起始位置。',
        sets: '3 轮',
        reps: '45 秒',
        tips: ['重心稍微前倾', '后膝轻轻触地', '保持平衡'],
        category: 'Lower',
        imageUrl: 'https://picsum.photos/seed/lunge-left/400/300'
      },
      {
        id: 'bulgarian-right',
        name: '保加利亚剪蹲 (右)',
        description: '1. 背对椅子站立，右脚脚背平放在椅子面上。2. 左脚向前迈出一大步。3. 垂直下蹲，直到左大腿与地面平行，右膝盖接近地面。4. 发力推起回到起始位置。',
        sets: '3 轮',
        reps: '45 秒',
        tips: ['核心收紧', '膝盖不要内扣', '控制下降速度'],
        category: 'Lower',
        imageUrl: 'https://picsum.photos/seed/lunge-right/400/300'
      },
      {
        id: 'step-ups',
        name: '椅子登阶 (Step-ups)',
        description: '1. 面对稳固的椅子站立。2. 将一只脚全脚掌踩在椅子中心。3. 另一只脚发力蹬地，全身站直在椅子上。4. 控制速度，一只脚接一只脚退回地面。',
        sets: '3 轮',
        reps: '45 秒',
        tips: ['全脚掌踩稳', '利用大腿发力', '换腿进行'],
        category: 'Lower',
        imageUrl: 'https://picsum.photos/seed/step-ups/400/300'
      },
      {
        id: 'squat-jumps',
        name: '深蹲跳 (Squat Jumps)',
        description: '1. 双脚与肩同宽站立。2. 下蹲至大腿与地面平行。3. 核心收紧，全力向上爆发跳起。4. 落地时脚尖先着地，顺势下蹲缓冲。',
        sets: '3 轮',
        reps: '45 秒',
        tips: ['落地要轻盈缓冲', '爆发力输出', '挺胸抬头'],
        category: 'Lower',
        imageUrl: 'https://picsum.photos/seed/squat-jumps/400/300'
      },
      {
        id: 'calf-raises',
        name: '单腿提踵 (Calf Raises)',
        description: '1. 单脚站立在台阶边缘，脚后跟悬空。2. 另一只脚勾在站立腿后方。3. 尽力抬高脚后跟，感受小腿收缩。4. 缓慢下放脚后跟至低于台阶平面。',
        sets: '3 轮',
        reps: '45 秒',
        tips: ['增强踝关节稳定性', '最高点稍作停留', '换腿进行'],
        category: 'Running',
        imageUrl: 'https://picsum.photos/seed/calf-raises/400/300'
      },
      {
        id: 'plank-crawl',
        name: '平板支撑爬行',
        description: '1. 进入标准平板支撑姿势（手肘支撑）。2. 核心极度收紧，像壁虎一样交替移动手肘和脚尖向前。3. 保持臀部不晃动，爬行 3-5 步后向后退回。',
        sets: '3 轮',
        reps: '45 秒',
        tips: ['核心/肩膀稳定性', '身体保持水平', '动作要稳'],
        category: 'Core',
        imageUrl: 'https://picsum.photos/seed/plank-crawl/400/300'
      },
      {
        id: 'mountain-climber',
        name: '登山者 (Mountain Climber)',
        description: '1. 俯撑姿势，双手在肩部正下方。2. 核心收紧，背部平直。3. 快速交替将膝盖向胸部提拉，像在陡坡上快速奔跑。',
        sets: '3 轮',
        reps: '45 秒',
        tips: ['保持腹部收紧', '高频率交替', '背部平直'],
        category: 'Core',
        imageUrl: 'https://picsum.photos/seed/mountain-climber/400/300'
      }
    ]
  },
  {
    day: '周二',
    focus: '计划 B：挺拔体态与上肢增肌',
    isCircuit: true,
    warmup: COMMON_WARMUP,
    cooldown: COMMON_COOLDOWN,
    exercises: [
      {
        id: 'pushups',
        name: '标准俯卧撑',
        description: '1. 双手略宽于肩放在地面。2. 身体从头到脚呈一直线。3. 下压至胸部距离地面 5 厘米。4. 呼气推起。力竭时可换成膝盖着地的跪姿。',
        sets: '3 轮',
        reps: '45 秒',
        tips: ['核心收紧', '手肘不要过度外展', '挺胸抬头'],
        category: 'Upper Push',
        imageUrl: 'https://picsum.photos/seed/pushups/400/300'
      },
      {
        id: 'dips',
        name: '椅子臂屈伸 (Dips)',
        description: '1. 双手撑在椅子边缘，指尖朝前。2. 双腿向前伸直，脚跟着地。3. 弯曲手臂下沉臀部，直到上臂与地面平行。4. 用三头肌力量撑起。',
        sets: '3 轮',
        reps: '45 秒',
        tips: ['锻炼肱三头肌', '背部贴近椅子', '手臂垂直上下'],
        category: 'Upper Push',
        imageUrl: 'https://picsum.photos/seed/dips/400/300'
      },
      {
        id: 'superman',
        name: '超人式 (Superman)',
        description: '1. 俯卧在地面，手臂向前伸直。2. 同时抬起手臂、胸部和双腿，仅腹部着地。3. 感受后背肌肉强烈收缩，坚持 2 秒。4. 缓慢放下。',
        sets: '3 轮',
        reps: '45 秒',
        tips: ['像超人飞行一样', '感受后背发力', '动作缓慢受控'],
        category: 'Upper Pull',
        imageUrl: 'https://picsum.photos/seed/superman/400/300'
      },
      {
        id: 'inverted-row',
        name: '桌下划船 (Inverted Row)',
        description: '1. 钻到结实的桌子下方。2. 双手抓牢桌子边缘，身体笔直。3. 发力将胸部拉向桌面。4. 缓慢有控制地放下。',
        sets: '3 轮',
        reps: '45 秒',
        tips: ['确保桌子稳固', '肩胛骨收紧', '身体保持笔直'],
        category: 'Upper Pull',
        imageUrl: 'https://picsum.photos/seed/row/400/300'
      },
      {
        id: 'diamond-pushups',
        name: '钻石俯卧撑',
        description: '1. 双手放在胸口正下方，食指和拇指相触形成钻石形状。2. 身体呈直线。3. 下压至胸部触碰手背。4. 强力推起。',
        sets: '3 轮',
        reps: '45 秒',
        tips: ['高强度动作', '手肘贴近身体', '核心收紧'],
        category: 'Upper Push',
        imageUrl: 'https://picsum.photos/seed/diamond-pushups/400/300'
      },
      {
        id: 'wall-w-stretch',
        name: '靠墙 W 拉伸',
        description: '1. 背靠墙站立，脚后跟、臀部、肩胛骨和后脑勺贴墙。2. 手臂弯曲成 W 形贴在墙上。3. 缓慢向上滑动手臂成 Y 形，全程保持手臂和手背贴墙。',
        sets: '3 轮',
        reps: '45 秒',
        tips: ['肩胛骨/姿态矫正', '手臂全程贴墙', '缓慢移动'],
        category: 'Rest',
        imageUrl: 'https://picsum.photos/seed/wall-stretch/400/300'
      },
      {
        id: 'dynamic-plank',
        name: '动态平板支撑',
        description: '1. 从手肘支撑的平板支撑开始。2. 右手撑地，左手撑地，变成手掌支撑。3. 右肘下放，左肘下放，回到起始位置。4. 保持核心极度稳定。',
        sets: '3 轮',
        reps: '45 秒',
        tips: ['核心/手臂力量', '身体尽量不晃动', '交替领先手'],
        category: 'Core',
        imageUrl: 'https://picsum.photos/seed/dynamic-plank/400/300'
      },
      {
        id: 'leg-raises',
        name: '仰卧举腿',
        description: '1. 平躺，双手放在臀部两侧。2. 双腿并拢伸直，抬起至与地面垂直。3. 缓慢下放双腿，直到脚后跟距离地面 5 厘米。4. 再次抬起。',
        sets: '3 轮',
        reps: '45 秒',
        tips: ['控制核心', '腰部贴紧地面', '慢速下放'],
        category: 'Core',
        imageUrl: 'https://picsum.photos/seed/leg-raises/400/300'
      }
    ]
  },
  {
    day: '周三',
    focus: '身高优化日 (Low Impact)',
    isRest: true,
    warmup: COMMON_WARMUP,
    cooldown: COMMON_COOLDOWN,
    exercises: [
      {
        id: 'dead-hang',
        name: '悬挂 (Dead Hang)',
        description: '找到能抓的地方挂着，放松脊柱。',
        sets: '5 组',
        reps: '30 秒',
        tips: ['彻底放松身体', '感受脊柱拉伸'],
        category: 'Rest',
        imageUrl: 'https://picsum.photos/seed/dead-hang/400/300'
      },
      {
        id: 'yoga',
        name: '瑜伽动作 (下犬式/猫驼式)',
        description: '通过瑜伽动作拉伸全身。',
        sets: '1 组',
        reps: '10 分钟',
        tips: ['配合深呼吸', '动作柔和'],
        category: 'Rest',
        imageUrl: 'https://picsum.photos/seed/yoga/400/300'
      },
      {
        id: 'easy-run',
        name: '轻松跑',
        description: '20 分钟轻松慢跑。',
        sets: '1 组',
        reps: '20 分钟',
        tips: ['放松心情', '保持节奏'],
        category: 'Running',
        imageUrl: 'https://picsum.photos/seed/run/400/300'
      }
    ]
  },
  {
    day: '周四',
    focus: '计划 A：全身爆发力与跑步专项',
    isCircuit: true,
    warmup: COMMON_WARMUP,
    cooldown: COMMON_COOLDOWN,
    exercises: []
  },
  {
    day: '周五',
    focus: '计划 B：挺拔体态与上肢增肌',
    isCircuit: true,
    warmup: COMMON_WARMUP,
    cooldown: COMMON_COOLDOWN,
    exercises: []
  },
  {
    day: '周六',
    focus: '计划 A：全身爆发力与跑步专项',
    isCircuit: true,
    warmup: COMMON_WARMUP,
    cooldown: COMMON_COOLDOWN,
    exercises: []
  },
  {
    day: '周日',
    focus: '身高优化日 (Low Impact)',
    isRest: true,
    warmup: COMMON_WARMUP,
    cooldown: COMMON_COOLDOWN,
    exercises: []
  }
];

// Populate the repeated days
WEEKLY_PLAN[3].exercises = [...WEEKLY_PLAN[0].exercises];
WEEKLY_PLAN[4].exercises = [...WEEKLY_PLAN[1].exercises];
WEEKLY_PLAN[5].exercises = [...WEEKLY_PLAN[0].exercises];
WEEKLY_PLAN[6].exercises = [...WEEKLY_PLAN[2].exercises];

export const NUTRITION_TIPS: NutritionTip[] = [
  {
    title: '训练后营养公式',
    content: '训练后 30 分钟内：1 个香蕉/2 片面包 + 2 个鸡蛋。',
    icon: 'Zap'
  },
  {
    title: '钙质补给',
    content: '每天建议 1200mg 钙。除了牛奶，多吃菠菜、西兰花等绿叶蔬菜。',
    icon: 'Sun'
  },
  {
    title: '不喝含糖饮料',
    content: '糖分会抑制生长激素分泌。坚持喝白开水或纯牛奶。',
    icon: 'Ban'
  },
  {
    title: '渐进性超负荷',
    content: '记录次数。如果这周做了 20 个，下周尝试 22 个。',
    icon: 'Flame'
  }
];
