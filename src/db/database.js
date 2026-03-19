import Dexie from 'dexie'
import { seedExercises } from './seedExercises'

export const db = new Dexie('IronLog')

const SCHEMA = {
  users: '++id, name',
  exercises: '++id, name, muscleGroup, category, isCustom',
  logs: '++id, userId, exerciseId, sessionId, timestamp',
  sessions: '++id, userId, startedAt, endedAt',
}

db.version(1).stores(SCHEMA)

db.version(2).stores(SCHEMA).upgrade(async (tx) => {
  const cardioExercises = seedExercises.filter((ex) => ex.exerciseType === 'cardio')
  const existing = await tx.exercises.where('muscleGroup').equals('Cardio').count()
  if (existing === 0) {
    await tx.exercises.bulkAdd(cardioExercises)
  }
})

db.version(3).stores(SCHEMA).upgrade(async (tx) => {
  const cardioExercises = await tx.exercises.where('muscleGroup').equals('Cardio').toArray()
  for (const ex of cardioExercises) {
    if (ex.cardioFields && !ex.cardioFields.includes('calories')) {
      await tx.exercises.update(ex.id, { cardioFields: [...ex.cardioFields, 'calories'] })
    }
  }
})

db.on('populate', async () => {
  await db.exercises.bulkAdd(seedExercises)
})

export async function getUser() {
  return db.users.toCollection().first()
}

export async function createUser(name, preferredUnit = 'kg') {
  const id = await db.users.add({ name, preferredUnit, createdAt: Date.now() })
  return db.users.get(id)
}

export async function updateUser(id, changes) {
  await db.users.update(id, changes)
  return db.users.get(id)
}

export async function getExercises() {
  return db.exercises.toArray()
}

export async function addCustomExercise(name, muscleGroup, category, exerciseType = 'strength', cardioFields = [], prField = 'duration') {
  const id = await db.exercises.add({
    name,
    muscleGroup,
    category,
    isCustom: true,
    createdAt: Date.now(),
    ...(exerciseType === 'cardio' && { exerciseType, cardioFields, prField }),
  })
  return db.exercises.get(id)
}

export async function deleteExercise(id) {
  return db.exercises.delete(id)
}

export async function startSession(userId) {
  const id = await db.sessions.add({
    userId,
    startedAt: Date.now(),
    endedAt: null,
    totalExercises: 0,
    notes: null,
  })
  return db.sessions.get(id)
}

export async function endSession(sessionId) {
  const count = await db.logs.where('sessionId').equals(sessionId).count()
  await db.sessions.update(sessionId, {
    endedAt: Date.now(),
    totalExercises: count,
  })
  return db.sessions.get(sessionId)
}

export async function getActiveSession(userId) {
  return db.sessions
    .where('userId')
    .equals(userId)
    .filter((s) => s.endedAt === null)
    .first()
}

export async function getLastSession(userId) {
  const sessions = await db.sessions
    .where('userId')
    .equals(userId)
    .filter((s) => s.endedAt !== null)
    .toArray()
  return sessions.sort((a, b) => b.endedAt - a.endedAt)[0] || null
}

export async function addLog(userId, exerciseId, sessionId, data) {
  const id = await db.logs.add({
    userId,
    exerciseId,
    sessionId,
    weightKg: data.weightKg ?? null,
    sets: data.sets ?? null,
    reps: data.reps ?? null,
    rpe: data.rpe || null,
    notes: data.notes || null,
    duration: data.duration ?? null,
    distance: data.distance ?? null,
    speed: data.speed ?? null,
    incline: data.incline ?? null,
    resistance: data.resistance ?? null,
    level: data.level ?? null,
    calories: data.calories ?? null,
    timestamp: Date.now(),
  })
  return db.logs.get(id)
}

export async function getLogsForExercise(userId, exerciseId) {
  return db.logs
    .where('userId')
    .equals(userId)
    .filter((l) => l.exerciseId === exerciseId)
    .toArray()
}

export async function getLogsForSession(sessionId) {
  return db.logs.where('sessionId').equals(sessionId).toArray()
}

export async function getLastLogForExercise(userId, exerciseId) {
  const logs = await getLogsForExercise(userId, exerciseId)
  return logs.sort((a, b) => b.timestamp - a.timestamp)[0] || null
}

export async function exportAllData(userId) {
  const user = await db.users.get(userId)
  const exercises = await db.exercises.filter((ex) => ex.isCustom === true).toArray()
  const logs = await db.logs.where('userId').equals(userId).toArray()
  const sessions = await db.sessions.where('userId').equals(userId).toArray()
  return JSON.stringify({ user, exercises, logs, sessions }, null, 2)
}

export async function importAllData(jsonString) {
  let parsed
  try {
    parsed = JSON.parse(jsonString)
  } catch {
    throw new Error('Invalid JSON file — could not parse backup data.')
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid backup format — expected a JSON object.')
  }

  const { user, exercises, logs, sessions } = parsed

  if (exercises && !Array.isArray(exercises)) throw new Error('Invalid backup: exercises must be an array.')
  if (logs && !Array.isArray(logs)) throw new Error('Invalid backup: logs must be an array.')
  if (sessions && !Array.isArray(sessions)) throw new Error('Invalid backup: sessions must be an array.')

  const MAX_IMPORT_ITEMS = 50000
  if ((exercises?.length || 0) + (logs?.length || 0) + (sessions?.length || 0) > MAX_IMPORT_ITEMS) {
    throw new Error(`Import too large — max ${MAX_IMPORT_ITEMS} total items.`)
  }

  await db.transaction('rw', db.users, db.exercises, db.logs, db.sessions, async () => {
    if (user) {
      const existing = await db.users.get(user.id)
      if (existing) await db.users.update(user.id, user)
      else await db.users.add(user)
    }
    for (const ex of exercises || []) {
      const existing = await db.exercises.get(ex.id)
      if (!existing) await db.exercises.add(ex)
    }
    for (const log of logs || []) {
      const existing = await db.logs.get(log.id)
      if (!existing) await db.logs.add(log)
    }
    for (const session of sessions || []) {
      const existing = await db.sessions.get(session.id)
      if (!existing) await db.sessions.add(session)
    }
  })
}

export async function clearAllData() {
  await db.transaction('rw', db.users, db.logs, db.sessions, async () => {
    await db.users.clear()
    await db.logs.clear()
    await db.sessions.clear()
  })
}
