import {canvas, gl} from './gl'

// A render loop that will automatically use webVR if
// that's cool.
export const VRLoop = (callback, {draggable=true}) => {

  const orig_w = gl.canvas.width
  const orig_h = gl.canvas.height

  const ratio = orig_w / orig_h

  const projMat = mat4.create()
  mat4.perspective(projMat, Math.PI/4, ratio, 0.1, 10)


  if(draggable) {
    // add a conroller
    addController(projMat)
  }


  let inVR = false

  // Normal rendering
  function loop(t){
    if(inVR) return
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
    callback(t, projMat)
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)


  function goVR(display) {
    inVR = true

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
      if(!inVR) return

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


  // from VR to normal
  function goBack(display) {
    inVR = false
    display.exitPresent()

    canvas.width = orig_w
    canvas.height = orig_h

    gl.viewport(0, 0, canvas.width, canvas.height)
    requestAnimationFrame(loop)
  }


  // check if we have access to a display that can present
  hasDisplay()
    .then(display => {

      window.display = display

      // enable the button
      const vrButton = document.getElementById('vr')
      vrButton.style.display = 'block'

      // when the button is pressed, go into `VR MODE`
      const toggle = () => {
        console.log("TOGGGLE VR")
        if(!inVR)
          goVR(display)
        else
          goBack(display)
      }

      vrButton.addEventListener('click', toggle, false)

      // window.addEventListener('keydown', toggle, false)
      // toggle()




    })
    .catch(err => {
      console.info(`Couldn't get VR display: ${err}`)
    })

}

const hasDisplay = () => {
  if(!navigator.getVRDisplays) return Promise.reject('WebVR not supported')

  return navigator.getVRDisplays()
    .then(displays => {
      const presentable = displays.filter(
        display => display.capabilities.canPresent
      )
      return presentable.length ? presentable[0] : Promise.reject('No screens found (but WebVR *is* supported)')
    })
}



const addController = (transform) => {
  const base = mat4.clone(transform)

  let down, last, tx = 0, ty = 0, mousemoved = false

  document.addEventListener('mousemove', e => {
    if(!down) return last = null

    if(last) {

      tx += (last.clientX - e.clientX) / 400
      ty += (last.clientY - e.clientY) / 400

      mat4.rotateX(transform, base, ty)
      mat4.rotateY(transform, transform, tx)
    }
    last = e
  }, false)

  document.addEventListener('mousedown', e => {
    mousemoved = down = true
  }, false)

  document.addEventListener('mouseup', e => {
    down = false
  }, false)

  const torad = Math.PI/180
  window.addEventListener('deviceorientation', e => {
    if(mousemoved) return
    const a = transform, b = base
    mat4.rotateY(a, b, -e.gamma*torad)
    mat4.rotateX(a, a, -e.beta*torad)
    mat4.rotateZ(a, a, -e.alpha*torad)
  })


}
