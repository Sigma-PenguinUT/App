export interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: string;
  reps: string;
  tips: string[];
  category: 'Lower' | 'Upper Push' | 'Upper Pull' | 'Core' | 'Full Body' | 'Running' | 'Rest' | 'Warmup' | 'Cooldown';
  imageUrl?: string;
}

export interface DayPlan {
  day: string;
  focus: string;
  exercises: Exercise[];
  warmup: Exercise[];
  cooldown: Exercise[];
  isRest?: boolean;
  isCircuit?: boolean;
}

export interface NutritionTip {
  title: string;
  content: string;
  icon: string;
}
