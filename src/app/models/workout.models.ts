export interface WorkoutPlan {
    planId: number;
    name: string;
    description?: string;
    durationWeeks: number;
    fitnessLevel: string;
}

export interface WorkoutPlanForCreate {
    name: string;
    description?: string;
    durationWeeks: number;
    fitnessLevel: string;
    exercises?: Exercise[];
}

export interface Exercise {
    exerciseId: number;
    name: string;
    description?: string;
    difficultyLevel: string;
    category: string;
    videoUrl?: string;
    duration: number;
}

export interface ExerciseForCreate {
    name: string;
    description?: string;
    difficultyLevel: string;
    category: string;
    videoUrl?: string;
    duration: number;
}

export interface WorkoutPlanExercise {
    planId: number;
    exerciseId: number;
}
