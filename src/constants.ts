import { DayPlan, NutritionTip, Exercise, WorkoutSet } from './types';

export const MASTER_EXERCISE_LIBRARY: Exercise[] = [
  // WARMUP
  {
    id: 'jumping-jacks',
    name: '开合跳 (Jumping Jacks)',
    description: '站立位，双脚并拢，手臂自然下垂。跳起时双脚向两侧分开，同时双手在头顶上方击掌。',
    sets: '1 组',
    reps: '60 秒',
    tips: ['提高心率', '全身热身', '节奏均匀'],
    category: 'Warmup',
    equipment: 'None',
    targetMuscles: ['Full Body', 'Heart'],
    demonstrationSteps: [
      { step: '准备', instruction: '双脚并拢站立，手臂放在身体两侧。', audioCue: '准备开始' },
      { step: '跳跃', instruction: '跳起并将双腿分开，同时双手在头顶上方击掌。', audioCue: '向上跳' },
      { step: '返回', instruction: '跳回起始位置，双脚并拢。', audioCue: '收回' }
    ]
  },
  {
    id: 'arm-circles',
    name: '手臂环绕 (Arm Circles)',
    description: '双脚与肩同宽站立，手臂向两侧平举。以肩关节为轴，手臂做小幅度圆周运动。',
    sets: '1 组',
    reps: '30 秒',
    tips: ['活动肩关节', '幅度由小到大'],
    category: 'Warmup',
    equipment: 'None',
    targetMuscles: ['Shoulders'],
    demonstrationSteps: [
      { step: '准备', instruction: '双臂向两侧平举，掌心向下。', audioCue: '手臂平举' },
      { step: '环绕', instruction: '以肩部为轴，做顺时针或逆时针的小圆周运动。', audioCue: '开始环绕' }
    ]
  },
  {
    id: 'high-knees',
    name: '高抬腿 (High Knees)',
    description: '原地跑步，尽可能将膝盖抬高至腰部高度。摆动双臂配合。',
    sets: '1 组',
    reps: '60 秒',
    tips: ['激活下肢', '核心发力'],
    category: 'Warmup',
    equipment: 'None',
    targetMuscles: ['Legs', 'Core'],
    demonstrationSteps: [
      { step: '准备', instruction: '双脚与肩同宽站立。', audioCue: '准备' },
      { step: '动作', instruction: '交替抬高膝盖至腰部高度，手臂配合摆动。', safetyTip: '保持背部挺直，不要后仰。', audioCue: '抬高膝盖' }
    ]
  },
  {
    id: 'dynamic-side-stretch',
    name: '动态侧拉伸 (Dynamic Side Stretch)',
    description: '双脚宽于肩站立，双手叉腰。身体向一侧倾斜，感受侧腹拉伸，然后换另一侧。',
    sets: '1 组',
    reps: '30 秒',
    tips: ['动作轻柔', '感受拉伸'],
    category: 'Warmup',
    equipment: 'None',
    targetMuscles: ['Obliques'],
    demonstrationSteps: [
      { step: '准备', instruction: '双脚宽距站立。', audioCue: '准备' },
      { step: '拉伸', instruction: '身体向侧方倾斜，手臂举过头顶。', audioCue: '向侧方拉伸' }
    ]
  },
  // PLAN A - LOWER / EXPLOSIVE
  {
    id: 'squats',
    name: '深蹲 (Squats)',
    description: '双脚与肩同宽，脚尖微外展。臀部向后下方坐，膝盖不要超过脚尖，下蹲至大腿与地面平行。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['重心在脚跟', '挺胸收腹', '膝盖与脚尖方向一致'],
    category: 'Lower',
    equipment: 'None',
    targetMuscles: ['Quads', 'Glutes', 'Hamstrings'],
    demonstrationSteps: [
      { step: '准备', instruction: '双脚与肩同宽站立，双手前平举或叉腰。', audioCue: '准备深蹲' },
      { step: '下蹲', instruction: '吸气，臀部向后坐，膝盖微曲，下蹲至大腿平行地面。', safetyTip: '膝盖不要内扣。', audioCue: '慢慢下蹲' },
      { step: '站起', instruction: '呼气，脚跟发力站起，回到起始位置。', audioCue: '发力站起' }
    ]
  },
  {
    id: 'lunges',
    name: '箭步蹲 (Lunges)',
    description: '双脚并拢站立。向前迈出一大步，下蹲至双膝呈 90 度，后膝接近地面。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['身体垂直下蹲', '前膝不要超过脚尖', '保持平衡'],
    category: 'Lower',
    equipment: 'None',
    targetMuscles: ['Quads', 'Glutes'],
    demonstrationSteps: [
      { step: '准备', instruction: '双脚并拢站立，双手叉腰。', audioCue: '准备箭步蹲' },
      { step: '迈步', instruction: '向前迈出一大步，重心垂直下移。', safetyTip: '前膝不要超过脚尖。', audioCue: '向前迈步' },
      { step: '返回', instruction: '前脚发力推回，回到起始位置。', audioCue: '收回' }
    ]
  },
  {
    id: 'burpees',
    name: '波比跳 (Burpees)',
    description: '从站立姿势开始，下蹲并将双手着地，双脚向后跳成平板支撑，做一个俯卧撑，双脚向前跳回，最后垂直跳起。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['增加心率', '刺激生长激素', '动作连贯'],
    category: 'Full Body',
    equipment: 'None',
    targetMuscles: ['Full Body', 'Heart', 'Legs'],
    demonstrationSteps: [
      { step: '下蹲', instruction: '从站立姿势下蹲，双手撑地。', audioCue: '蹲下' },
      { step: '后跳', instruction: '双脚向后跳成平板支撑。', audioCue: '向后跳' },
      { step: '俯卧撑', instruction: '做一个俯卧撑（可选）。', audioCue: '俯卧撑' },
      { step: '收回', instruction: '双脚向前跳回手部位置。', audioCue: '收回' },
      { step: '跳跃', instruction: '垂直向上跳起，双手举过头顶。', audioCue: '向上跳' }
    ]
  },
  {
    id: 'bulgarian-split-squat-l',
    name: '保加利亚剪蹲 (左)',
    description: '背对椅子站立，左脚面搭在椅子上。右脚向前迈出一大步，下蹲至右大腿与地面平行。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['跑步推进力的核心来源', '保持背部挺直', '重心在右脚跟'],
    category: 'Lower',
    equipment: 'Chair',
    targetMuscles: ['Glutes', 'Quads', 'Hamstrings'],
    demonstrationSteps: [
      { step: '准备', instruction: '左脚搭在椅子上，右脚向前迈步。', audioCue: '准备' },
      { step: '下蹲', instruction: '重心垂直下降，直到右大腿平行地面。', safetyTip: '保持躯干挺直。', audioCue: '下蹲' },
      { step: '站起', instruction: '右脚发力站起。', audioCue: '站起' }
    ]
  },
  {
    id: 'bulgarian-split-squat-r',
    name: '保加利亚剪蹲 (右)',
    description: '背对椅子站立，右脚面搭在椅子上。左脚向前迈出一大步，下蹲至左大腿与地面平行。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['跑步推进力的核心来源', '保持背部挺直', '重心在左脚跟'],
    category: 'Lower',
    equipment: 'Chair',
    targetMuscles: ['Glutes', 'Quads', 'Hamstrings'],
    demonstrationSteps: [
      { step: '准备', instruction: '右脚搭在椅子上，左脚向前迈步。', audioCue: '准备' },
      { step: '下蹲', instruction: '重心垂直下降，直到左大腿平行地面。', safetyTip: '保持躯干挺直。', audioCue: '下蹲' },
      { step: '站起', instruction: '左脚发力站起。', audioCue: '站起' }
    ]
  },
  {
    id: 'vertical-jumps',
    name: '垂直跳 (Vertical Jumps)',
    description: '双脚与肩同宽，微蹲蓄力，然后全力向上跳起，手臂向上摆动。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['全力起跳', '落地缓冲', '核心收紧'],
    category: 'Lower',
    equipment: 'None',
    targetMuscles: ['Legs', 'Explosive Power'],
    demonstrationSteps: [
      { step: '蓄力', instruction: '微蹲，手臂向后摆。', audioCue: '蓄力' },
      { step: '起跳', instruction: '全力向上跳，手臂向上摆。', audioCue: '跳！' },
      { step: '落地', instruction: '脚掌着地，膝盖微曲缓冲。', safetyTip: '落地要轻。', audioCue: '缓冲' }
    ]
  },
  {
    id: 'calf-raises',
    name: '单腿提踵 (Calf Raises)',
    description: '单脚站立在台阶边缘或平地，脚跟尽量下压，然后发力提起脚跟至最高点。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['提升跑步时的支撑力', '慢放快提', '感受小腿拉伸'],
    category: 'Lower',
    equipment: 'None',
    targetMuscles: ['Calves'],
    demonstrationSteps: [
      { step: '准备', instruction: '单脚站立，手可以扶墙保持平衡。', audioCue: '准备' },
      { step: '提踵', instruction: '发力提起脚跟，直到最高点。', audioCue: '提踵' },
      { step: '下放', instruction: '缓慢放下脚跟。', audioCue: '慢慢放下' }
    ]
  },
  {
    id: 'plank',
    name: '平板支撑 (Plank)',
    description: '双肘支撑在地面，身体呈一直线，核心收紧，保持不动。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['不要塌腰', '不要翘臀', '均匀呼吸'],
    category: 'Core',
    equipment: 'None',
    targetMuscles: ['Core', 'Abs'],
    demonstrationSteps: [
      { step: '准备', instruction: '手肘撑地，双脚向后伸直。', audioCue: '撑起身体' },
      { step: '保持', instruction: '身体呈一直线，核心发力。', safetyTip: '不要塌腰。', audioCue: '坚持住' }
    ]
  },
  {
    id: 'step-ups',
    name: '椅子登阶 (Step-ups)',
    description: '面对椅子站立，一只脚踏上椅子，发力站起，另一只脚跟上。交替进行。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['重心在支撑脚', '控制下放速度', '核心收紧'],
    category: 'Lower',
    equipment: 'Chair',
    targetMuscles: ['Quads', 'Glutes'],
    demonstrationSteps: [
      { step: '准备', instruction: '面对椅子站立。', audioCue: '准备' },
      { step: '登阶', instruction: '一只脚踏上椅子并站直。', audioCue: '踏上' },
      { step: '下放', instruction: '缓慢回到地面。', audioCue: '走下' }
    ]
  },
  {
    id: 'squat-jumps',
    name: '深蹲跳 (Squat Jumps)',
    description: '深蹲至大腿平行地面，然后全力向上跳起，落地后立即进入下一次深蹲。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['全力起跳', '轻盈落地', '动作连贯'],
    category: 'Lower',
    equipment: 'None',
    targetMuscles: ['Quads', 'Glutes', 'Explosive Power'],
    demonstrationSteps: [
      { step: '深蹲', instruction: '下蹲至大腿平行地面。', audioCue: '蹲下' },
      { step: '跳跃', instruction: '全力向上跳起。', audioCue: '跳！' },
      { step: '落地', instruction: '轻盈落地并缓冲。', audioCue: '落地' }
    ]
  },
  {
    id: 'plank-crawl',
    name: '平板支撑爬行',
    description: '呈平板支撑姿势，双手和双脚配合向前或向后小幅度爬行。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['保持身体平直', '核心极度收紧', '小步移动'],
    category: 'Core',
    equipment: 'None',
    targetMuscles: ['Core', 'Shoulders'],
    demonstrationSteps: [
      { step: '准备', instruction: '呈平板支撑姿势。', audioCue: '准备' },
      { step: '爬行', instruction: '手脚配合向前小步爬行。', audioCue: '开始爬行' }
    ]
  },
  {
    id: 'diamond-pushups',
    name: '钻石俯卧撑',
    description: '双手食指和拇指相对呈钻石型放在胸下，下压并撑起。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['侧重三头肌', '手肘贴近身体', '核心收紧'],
    category: 'Upper Push',
    equipment: 'None',
    targetMuscles: ['Triceps', 'Chest'],
    demonstrationSteps: [
      { step: '准备', instruction: '双手呈钻石型撑地。', audioCue: '准备' },
      { step: '下压', instruction: '身体下降。', audioCue: '向下' },
      { step: '撑起', instruction: '发力撑起。', audioCue: '向上' }
    ]
  },
  {
    id: 'mountain-climber',
    name: '登山者 (Mountain Climber)',
    description: '双手撑地呈平板支撑，双腿交替快速向胸部提膝，模拟快速奔跑。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['保持腹部收紧', '模拟快速奔跑', '频率均匀'],
    category: 'Core',
    equipment: 'None',
    targetMuscles: ['Core', 'Heart'],
    demonstrationSteps: [
      { step: '准备', instruction: '双手撑地呈平板支撑姿势。', audioCue: '准备' },
      { step: '动作', instruction: '交替快速向胸部提膝。', audioCue: '开始跑' }
    ]
  },
  // PLAN B - UPPER / POSTURE
  {
    id: 'standard-pushups',
    name: '标准俯卧撑',
    description: '双手略宽于肩。身体呈一直线，下压至胸部接近地面。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['如果力竭，可以换成跪姿', '核心收紧', '挺胸'],
    category: 'Upper Push',
    equipment: 'None',
    targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
    demonstrationSteps: [
      { step: '准备', instruction: '双手撑地，略宽于肩。', audioCue: '准备' },
      { step: '下压', instruction: '身体下降直到胸部接近地面。', safetyTip: '身体保持直线。', audioCue: '向下' },
      { step: '撑起', instruction: '发力推回起始位置。', audioCue: '向上推' }
    ]
  },
  {
    id: 'pike-pushups',
    name: 'Pike 俯卧撑',
    description: '身体呈倒 V 型，双手撑地，头向下压至接近地面，然后撑起。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['锻炼肩部力量', '控制速度'],
    category: 'Upper Push',
    equipment: 'None',
    targetMuscles: ['Shoulders', 'Triceps'],
    demonstrationSteps: [
      { step: '准备', instruction: '身体呈倒 V 型。', audioCue: '准备' },
      { step: '下压', instruction: '头向双手之间下压。', audioCue: '向下' },
      { step: '撑起', instruction: '发力撑起。', audioCue: '向上' }
    ]
  },
  {
    id: 'dips',
    name: '椅子臂屈伸 (Dips)',
    description: '双手撑在椅子边缘，双腿向前伸直。屈肘下放臀部，然后发力撑起。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['臀部贴近椅子', '手臂垂直上下', '侧重三头肌'],
    category: 'Upper Push',
    equipment: 'Chair',
    targetMuscles: ['Triceps', 'Shoulders'],
    demonstrationSteps: [
      { step: '准备', instruction: '双手撑在椅子边缘，双腿前伸。', audioCue: '准备' },
      { step: '下放', instruction: '屈肘下放臀部。', safetyTip: '臀部贴近椅子。', audioCue: '向下' },
      { step: '撑起', instruction: '发力撑起。', audioCue: '向上' }
    ]
  },
  {
    id: 'inverted-row',
    name: '桌下划船 (Inverted Row)',
    description: '钻到结实的桌子下方，双手抓住桌边，身体呈一直线，向上拉起胸部。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['改善圆肩', '背部/二头肌发力', '确保桌子稳固'],
    category: 'Upper Pull',
    equipment: 'Table',
    targetMuscles: ['Back', 'Biceps'],
    demonstrationSteps: [
      { step: '准备', instruction: '仰卧在桌下，双手抓稳桌边。', audioCue: '抓稳桌子' },
      { step: '拉起', instruction: '发力将胸部拉向桌边。', safetyTip: '肩胛骨收紧。', audioCue: '向上拉' },
      { step: '下放', instruction: '缓慢放下。', audioCue: '慢慢放下' }
    ]
  },
  {
    id: 'sit-ups',
    name: '仰卧起坐 (Sit-ups)',
    description: '仰卧，膝盖弯曲，双脚平放。利用腹部力量将上半身抬起，直到胸部接近膝盖。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['不要抱头', '腹部发力', '控制速度'],
    category: 'Core',
    equipment: 'None',
    targetMuscles: ['Abs', 'Core'],
    demonstrationSteps: [
      { step: '准备', instruction: '仰卧，膝盖弯曲，双手放在耳侧或胸前。', audioCue: '准备' },
      { step: '起坐', instruction: '腹部发力抬起上半身。', safetyTip: '不要用手拉脖子。', audioCue: '坐起来' },
      { step: '下放', instruction: '缓慢躺下。', audioCue: '慢慢躺下' }
    ]
  },
  {
    id: 'superman',
    name: '超人式 (Superman)',
    description: '俯卧在地面，同时抬起双臂和双腿，胸部离地，保持 2 秒后放下。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['拉开脊柱间隙', '后背/脊柱发力', '不要仰头'],
    category: 'Upper Pull',
    equipment: 'None',
    targetMuscles: ['Lower Back', 'Glutes'],
    demonstrationSteps: [
      { step: '准备', instruction: '俯卧，手臂向前伸直。', audioCue: '准备' },
      { step: '抬起', instruction: '同时抬起手臂和双腿。', audioCue: '起！' },
      { step: '放下', instruction: '缓慢放下。', audioCue: '放下' }
    ]
  },
  {
    id: 'wall-w-stretch',
    name: '靠墙 W 拉伸',
    description: '背靠墙站立，手臂贴墙呈 W 型。缓慢向上滑动至 Y 型，再回到 W 型。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['手臂贴墙滑动', '矫正体态', '肩胛骨收紧'],
    category: 'Upper Pull',
    equipment: 'Wall',
    targetMuscles: ['Shoulders', 'Upper Back'],
    demonstrationSteps: [
      { step: '准备', instruction: '背靠墙，手臂呈 W 型。', audioCue: '贴墙' },
      { step: '滑动', instruction: '手臂贴墙向上滑动成 Y 型。', audioCue: '向上滑' }
    ]
  },
  {
    id: 'dynamic-plank',
    name: '动态平板支撑',
    description: '从手肘支撑平板切换到手掌支撑平板，再切回手肘支撑。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['核心/手臂发力', '手肘手掌交替切换', '身体不要晃动'],
    category: 'Core',
    equipment: 'None',
    targetMuscles: ['Core', 'Shoulders', 'Triceps'],
    demonstrationSteps: [
      { step: '准备', instruction: '手肘撑地呈平板支撑。', audioCue: '准备' },
      { step: '切换', instruction: '单手撑起变手掌支撑，再换回手肘。', audioCue: '开始切换' }
    ]
  },
  {
    id: 'leg-raises',
    name: '仰卧举腿',
    description: '仰卧，双手抓稳椅子腿。双腿伸直缓慢抬起至垂直，再慢速下放。',
    sets: '3 轮',
    reps: '45 秒',
    tips: ['慢速下放', '控制核心', '下腹部发力'],
    category: 'Core',
    equipment: 'Chair',
    targetMuscles: ['Abs', 'Core'],
    demonstrationSteps: [
      { step: '准备', instruction: '仰卧，双手抓稳支撑点。', audioCue: '准备' },
      { step: '举腿', instruction: '双腿伸直抬起至垂直。', audioCue: '抬腿' },
      { step: '下放', instruction: '缓慢下放双腿。', audioCue: '慢慢放下' }
    ]
  },
  // HEIGHT OPTIMIZATION
  {
    id: 'dead-hang',
    name: '悬挂 (Dead Hang)',
    description: '双手抓住单杠 or 稳固支撑点，全身放松自然下垂。',
    sets: '5 组',
    reps: '60 秒',
    tips: ['拉开脊柱间隙', '全身放松'],
    category: 'Full Body',
    equipment: 'Bar',
    targetMuscles: ['Back', 'Spine'],
    demonstrationSteps: [
      { step: '准备', instruction: '双手抓紧单杠。', audioCue: '抓紧' },
      { step: '悬挂', instruction: '全身放松下垂。', audioCue: '放松' }
    ]
  },
  {
    id: 'cobra-pose',
    name: '眼镜蛇式 (Cobra Pose)',
    description: '俯卧，双手撑在胸侧，发力抬起上半身，感受腹部拉伸。',
    sets: '1 组',
    reps: '60 秒',
    tips: ['不要耸肩', '深呼吸'],
    category: 'Full Body',
    equipment: 'None',
    targetMuscles: ['Abs', 'Lower Back'],
    demonstrationSteps: [
      { step: '准备', instruction: '俯卧在地面。', audioCue: '准备' },
      { step: '撑起', instruction: '双手撑地抬起上半身。', audioCue: '向上撑起' }
    ]
  },
  {
    id: 'quad-stretch',
    name: '站立大腿拉伸 (Quad Stretch)',
    description: '单脚站立，另一只手向后抓住脚踝，将脚跟拉向臀部。',
    sets: '1 组',
    reps: '60 秒',
    tips: ['保持平衡', '感受大腿前侧拉伸'],
    category: 'Full Body',
    equipment: 'None',
    targetMuscles: ['Quads'],
    demonstrationSteps: [
      { step: '准备', instruction: '单脚站立。', audioCue: '准备' },
      { step: '拉伸', instruction: '向后抓脚踝，拉向臀部。', audioCue: '开始拉伸' }
    ]
  },
  {
    id: 'downward-dog',
    name: '下犬式 (Downward Dog)',
    description: '身体呈倒 V 型，手脚撑地，臀部向斜上方顶起。',
    sets: '3 组',
    reps: '60 秒',
    tips: ['拉伸后侧', '背部挺直'],
    category: 'Full Body',
    equipment: 'None',
    targetMuscles: ['Hamstrings', 'Back'],
    demonstrationSteps: [
      { step: '准备', instruction: '手脚撑地。', audioCue: '准备' },
      { step: '顶起', instruction: '臀部向斜上方顶起成倒 V 型。', audioCue: '顶起臀部' }
    ]
  },
  {
    id: 'cat-cow',
    name: '猫驼式 (Cat-Cow)',
    description: '四足跪姿，吸气时塌腰抬头，呼气时拱背收腹。',
    sets: '3 组',
    reps: '60 秒',
    tips: ['活动脊柱', '呼吸配合'],
    category: 'Full Body',
    equipment: 'None',
    targetMuscles: ['Spine', 'Core'],
    demonstrationSteps: [
      { step: '准备', instruction: '四足跪姿。', audioCue: '准备' },
      { step: '猫式', instruction: '拱背收腹。', audioCue: '拱背' },
      { step: '驼式', instruction: '塌腰抬头。', audioCue: '抬头' }
    ]
  }
];

export const WORKOUT_SETS: WorkoutSet[] = [
  {
    id: 'plan-a',
    name: '计划 A：全身爆发力与跑步专项',
    description: '侧重下肢力量与爆发力，适合周一、周四、周六。',
    difficulty: 'Intermediate',
    category: 'Lower',
    exercises: [
      'burpees', 'bulgarian-split-squat-l', 'bulgarian-split-squat-r', 
      'step-ups', 'squat-jumps', 'calf-raises', 'plank-crawl', 'mountain-climber'
    ].map(id => MASTER_EXERCISE_LIBRARY.find(ex => ex.id === id)!)
  },
  {
    id: 'plan-b',
    name: '计划 B：挺拔体态与上肢增肌',
    description: '侧重上肢与背部，改善圆肩体态，适合周二、周五。',
    difficulty: 'Intermediate',
    category: 'Upper',
    exercises: [
      'standard-pushups', 'dips', 'superman', 'inverted-row', 
      'diamond-pushups', 'wall-w-stretch', 'dynamic-plank', 'leg-raises'
    ].map(id => MASTER_EXERCISE_LIBRARY.find(ex => ex.id === id)!)
  },
  {
    id: 'height-day',
    name: '身高优化日',
    description: '低强度拉伸与悬挂，促进骨骼生长，适合周三、周日。',
    difficulty: 'Beginner',
    category: 'Full Body',
    exercises: MASTER_EXERCISE_LIBRARY.filter(ex => [
      'dead-hang', 'downward-dog', 'cat-cow'
    ].includes(ex.id))
  }
];

const COMMON_WARMUP = MASTER_EXERCISE_LIBRARY.filter(ex => ['jumping-jacks', 'arm-circles', 'dynamic-side-stretch', 'high-knees', 'cat-cow'].includes(ex.id));
const COMMON_COOLDOWN = MASTER_EXERCISE_LIBRARY.filter(ex => ['cat-cow', 'cobra-pose', 'downward-dog', 'dead-hang', 'quad-stretch'].includes(ex.id));

export const WEEKLY_PLAN: DayPlan[] = [
  {
    day: '周一',
    focus: '计划 A：全身爆发力',
    isCircuit: true,
    warmup: COMMON_WARMUP,
    cooldown: COMMON_COOLDOWN,
    exercises: WORKOUT_SETS.find(s => s.id === 'plan-a')!.exercises
  },
  {
    day: '周二',
    focus: '计划 B：挺拔体态',
    isCircuit: true,
    warmup: COMMON_WARMUP,
    cooldown: COMMON_COOLDOWN,
    exercises: WORKOUT_SETS.find(s => s.id === 'plan-b')!.exercises
  },
  {
    day: '周三',
    focus: '身高优化日',
    isRest: true,
    warmup: COMMON_WARMUP,
    cooldown: COMMON_COOLDOWN,
    exercises: WORKOUT_SETS.find(s => s.id === 'height-day')!.exercises
  },
  {
    day: '周四',
    focus: '计划 A：全身爆发力',
    isCircuit: true,
    warmup: COMMON_WARMUP,
    cooldown: COMMON_COOLDOWN,
    exercises: WORKOUT_SETS.find(s => s.id === 'plan-a')!.exercises
  },
  {
    day: '周五',
    focus: '计划 B：挺拔体态',
    isCircuit: true,
    warmup: COMMON_WARMUP,
    cooldown: COMMON_COOLDOWN,
    exercises: WORKOUT_SETS.find(s => s.id === 'plan-b')!.exercises
  },
  {
    day: '周六',
    focus: '计划 A：全身爆发力',
    isCircuit: true,
    warmup: COMMON_WARMUP,
    cooldown: COMMON_COOLDOWN,
    exercises: WORKOUT_SETS.find(s => s.id === 'plan-a')!.exercises
  },
  {
    day: '周日',
    focus: '身高优化日',
    isRest: true,
    warmup: COMMON_WARMUP,
    cooldown: COMMON_COOLDOWN,
    exercises: WORKOUT_SETS.find(s => s.id === 'height-day')!.exercises
  }
];

export const NUTRITION_TIPS: NutritionTip[] = [
  {
    title: "训练后“黄金 30 分钟”",
    content: "训练结束后立即补充：1 根香蕉 + 1 杯牛奶/蛋白粉。碳水触发胰岛素分泌，帮助蛋白质进入肌肉。",
    icon: "zap"
  },
  {
    title: "钙质是身高的地基",
    content: "每天保证 500ml 牛奶或 200g 豆腐。钙质不仅强健骨骼，还能提高神经传导效率。",
    icon: "info"
  },
  {
    title: "拒绝“生长小偷”",
    content: "严格戒掉含糖饮料（可乐、奶茶）。高糖会抑制生长激素的分泌，让你白练了。",
    icon: "x"
  }
];
