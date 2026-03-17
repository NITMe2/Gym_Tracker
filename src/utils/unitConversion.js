export function kgToLbs(kg) {
  return +(kg * 2.20462).toFixed(1)
}

export function lbsToKg(lbs) {
  return +(lbs / 2.20462).toFixed(2)
}

export function displayWeight(weightKg, unit) {
  if (unit === 'lbs') return `${kgToLbs(weightKg)} lbs`
  return `${weightKg} kg`
}

export function toKg(value, unit) {
  return unit === 'lbs' ? lbsToKg(value) : +value
}
