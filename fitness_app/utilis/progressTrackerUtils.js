export const calculateAverageWeight = (workouts) => {
    if (workouts.length === 0) return 0; 
    const totalWeight = workouts.reduce((sum, workout) => sum + workout.weight, 0);
    return totalWeight / workouts.length;
  };
  