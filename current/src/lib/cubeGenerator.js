import normal from 'triangle-normal'

const cubeGenerator = (size = 1) => {

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
    7, 5, 4,  4, 6, 7
  ]

  const normals = []

  const recomputeNormals = () => {
    
    normals.splice(0,normals.length)

    for (let i = 0; i < indices.length; i+=3) {

      let output = normal(
        positions[indices[i]][0],
        positions[indices[i]][1],
        positions[indices[i]][2],

        positions[indices[i + 1]][0],
        positions[indices[i + 1]][1],
        positions[indices[i + 1]][2],

        positions[indices[i + 2]][0],
        positions[indices[i + 2]][1],
        positions[indices[i + 2]][2]
      )

      // easier to plot colors
      // .map( m => (m + 1)/2)

      //urgh
      normals.push(output,output,output)

    }
  }

  recomputeNormals()


  return {
    positions,
    indices,
    normals,
    recomputeNormals
  }

}

export default cubeGenerator
