const Cube = (size = 1) => {

  const positions = [
    [-1, -1, -1],  [-1,  1, -1],
    [ 1, -1, -1],  [ 1,  1, -1],
    [-1, -1,  1],  [-1,  1,  1],
    [ 1, -1,  1],  [ 1,  1,  1]
  ].map( p => p.map(v => v * size))

  /*
    0       1

       2        3


    4       5

       6        7
  */

  // triangles
  const indices = [

    //top
    0, 1, 3,  3, 2, 0,

    // front
    2, 3, 7,  7, 6, 2,

    // right
    3, 1, 5,  5, 7, 3,

    //back
    1, 0, 4,  4, 5, 1,

    // left
    0, 2, 6,  6, 4, 0,

    // bottom
    4, 5, 7,  7, 6, 4
  ]

  return {
    positions,
    indices
  }

}

export default Cube
