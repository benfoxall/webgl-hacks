import {canvas, gl} from './gl'

// A render loop that will automatically use webVR if
// that's cool.
export const VRLoop = (callback) => {

  const orig_w = gl.canvas.width
  const orig_h = gl.canvas.height

  const ratio = orig_w / orig_h

  const projMat = mat4.create()
  mat4.perspective(projMat, Math.PI/4, ratio, 0.1, 10)

  let stop = false

  // Normal rendering
  function loop(t){
    if(stop) return
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
    callback(t, projMat)
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)

  function goVR(display) {
    stop = true

    const leftEye = display.getEyeParameters("left")
    const rightEye = display.getEyeParameters("right")
    const width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2
    const height = Math.max(leftEye.renderHeight, rightEye.renderHeight)
    canvas.width = width
    canvas.height = height

    display.requestPresent([{
      source: canvas
    }])
    .catch(e => {
      console.error("there was a problem with presenting", e)
    })

    const eyeMat = mat4.create()
    const frameData = new VRFrameData()
    const render = (t) => {
      display.requestAnimationFrame(render)
      display.getFrameData(frameData)
      gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)


      gl.viewport(0, 0, canvas.width / 2, canvas.height)
      mat4.multiply(eyeMat, frameData.leftProjectionMatrix, frameData.leftViewMatrix)
      callback(t, eyeMat)

      gl.viewport(canvas.width / 2, 0, canvas.width / 2, canvas.height)
      mat4.multiply(eyeMat, frameData.rightProjectionMatrix, frameData.rightViewMatrix)
      callback(t, eyeMat)

      // callback({display, frameData, canvas})

      if(display.isPresenting)
        display.submitFrame()

    }
    display.requestAnimationFrame(render)



  }


  // check if we have access to a display that can present
  hasDisplay()
    .then(display => {

      window.display = display

      // enable the button
      const vrButton = document.getElementById('vr')
      vrButton.style.display = 'block'

      // when the button is pressed, go into `VR MODE`
      vrButton.addEventListener('click', () => {
        console.log("TOGGGLE VR")
        goVR(display)
      }, false)


    })

}

const hasDisplay = () => {
  if(!navigator.getVRDisplays) return Promise.reject()

  return navigator.getVRDisplays()
    .then(displays => {
      const presentable = displays.filter(
        display => display.capabilities.canPresent
      )
      return presentable.length ? presentable[0] : Promise.reject()
    })
}
