/** Une clases condicionales (versión mínima sin dependencias). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/** Baraja un arreglo (Fisher-Yates) devolviendo una copia nueva. */
export function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Toma N elementos al azar de un arreglo. */
export function sampleN<T>(input: readonly T[], n: number): T[] {
  return shuffle(input).slice(0, n)
}
