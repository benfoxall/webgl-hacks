

navigator.getVRDisplays().then(displays => {
  // Filter down to devices that can present.
  displays = displays.filter(display => display.capabilities.canPresent);

  // If there are no devices available, quit out.
  if (displays.length === 0) {
    console.warn('No devices available able to present.');
    return;
  }

  // Store the first display we find. A more production-ready version should
  // allow the user to choose from their available displays.
  this._vr.display = displays[0];
  this._vr.display.depthNear = DemoVR.CAMERA_SETTINGS.near;
  this._vr.display.depthFar = DemoVR.CAMERA_SETTINGS.far;
})
