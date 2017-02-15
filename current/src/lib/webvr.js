import {canvas} from './gl'

export let display = null

export const setup = (callback) => {
  console.log("ASDF")

  navigator.getVRDisplays().then(displays => {
    // Filter down to devices that can present.
    displays = displays.filter(display => display.capabilities.canPresent)

    // If there are no devices available, quit out.
    if (displays.length === 0) {
      console.warn('No devices available able to present.')
      return;
    }


    display = displays[0]

    // Store the first display we find. A more production-ready version should
    // allow the user to choose from their available displays.
    // this._vr.display = displays[0]
    // this._vr.display.depthNear = DemoVR.CAMERA_SETTINGS.near
    // this._vr.display.depthFar = DemoVR.CAMERA_SETTINGS.far


    canvas.className = 'vrcanvas'

    // todo - resize canvas
    const leftEye = display.getEyeParameters("left")
    const rightEye = display.getEyeParameters("right")
    const width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2
    const height = Math.max(leftEye.renderHeight, rightEye.renderHeight)
    canvas.width = width
    canvas.height = height


    // display.requestPresent([{
    //   source: canvas
    // }])

    document.getElementById('vr').addEventListener('click', () => {
      display.requestPresent([{
        source: canvas
      }])
    }, false)

    // .then()


    const frameData = new VRFrameData()

    const render = () => {
      display.requestAnimationFrame(render)
      display.getFrameData(frameData)
      callback({display, frameData, canvas})
    }
    display.requestAnimationFrame(render)




  })

}

const createCanvas = (display) => {

  const leftEye = display.getEyeParameters("left")
  const rightEye = display.getEyeParameters("right")

  const width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2
  const height = Math.max(leftEye.renderHeight, rightEye.renderHeight)

  console.log(width, height)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  return canvas

}


/*

navigator.getVRDisplays().then(displays => {
  // Filter down to devices that can present.
  displays = displays.filter(display => display.capabilities.canPresent)

  // If there are no devices available, quit out.
  if (displays.length === 0) {
    console.warn('No devices available able to present.')
    return;
  }

  // Store the first display we find. A more production-ready version should
  // allow the user to choose from their available displays.
  this._vr.display = displays[0]
  this._vr.display.depthNear = DemoVR.CAMERA_SETTINGS.near
  this._vr.display.depthFar = DemoVR.CAMERA_SETTINGS.far
})

*/
