
export const scale = (a, b) => (n) => n * (b - a) + a

export const random = (a, b) => scale(a,b)(Math.random())

// shallow
export const flatten = array =>
  array.reduce( (memo, item) => memo.concat(item), [] )
