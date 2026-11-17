import { levelA, levelB, levelC } from './beginner'
import { level1 } from './level1'
import { level2 } from './level2'
import { levelDates, levelMoney, levelNumbers, levelTime } from './themes'
import type { CourseLevel } from './types'

export const allLevels: CourseLevel[] = [levelA, levelB, levelC, level1, level2, levelNumbers, levelMoney, levelDates, levelTime]
