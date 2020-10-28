/**
 * The animation frame, determines at which frequency the animation will be refreshed.
 */
export const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  function(func) {
    return window.setTimeout(func, 1000 / 60);
  };

/**
 * The config for avtars' display
 */
export const config = {
  /**
   * Avatar config
   */
  radius: 50,
  velocity: 1,
  initialVelocity: 20,
  decayRatio: 0.98,

  /**
   * Relation config
   */
  lineWidth: 1,
  lineColor: "rgb(100, 150, 150)"
};
