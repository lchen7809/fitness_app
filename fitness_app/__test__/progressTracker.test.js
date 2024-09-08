import { calculateAverageWeight } from '../utilis/progressTrackerUtils'; 

describe('Progress Tracker Calculations', () => {
  test('correctly computes average weight from workouts', () => {
    const workouts = [
      { weight: 100 },
      { weight: 150 },
      { weight: 200 }
    ];

    const averageWeight = calculateAverageWeight(workouts);
    
    expect(averageWeight).toBe(150);
  });

  test('returns 0 for an empty array', () => {
    const workouts = [];

    const averageWeight = calculateAverageWeight(workouts);
    
    expect(averageWeight).toBe(0);
  });

  test('correctly computes average weight for single workout', () => {
    const workouts = [{ weight: 120 }];

    const averageWeight = calculateAverageWeight(workouts);

    expect(averageWeight).toBe(120);
  });
});
