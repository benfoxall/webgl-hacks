
export const scale = (a, b) => (n) => n * (b - a) + a

export const random = (a, b) => scale(a,b)(Math.random())
