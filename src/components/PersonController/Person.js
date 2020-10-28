import { config } from "./utils";

/**
 * @type {number} The radius of the avatar
 */
let RADIUS = config.radius;

/**
 * @type {number} The velocity of the avatar
 */
let VELOCITY = config.velocity;

/**
 * @type {number}
 */
let INITIAL_VELOCITY = config.initialVelocity;

/**
 * @type {number}
 */
let DECAY_RATIO = config.decayRatio;

/**
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
const squaredEuclideanDistance = (x1, y1, x2, y2) => {
  return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
};

export default class Person {
  /**
   *
   * @param {!Object} person
   * @param {!Object<*, *>} el the DOM on which the person will be displayed
   */
  constructor(person, el) {
    /**
     * The Profile
     */

    /**
     * @type {string}
     */
    this.name = person.name;
    /**
     * the DOM on which the person will be displayed
     * it is stored to get access to the boundary (height and width)
     * @type {!Object<*, *>}
     */
    this.el = el;
    /**
     * @type {string} The source url of the avatar, directed to the public folder, then can be found by webpack
     */
    this.avatar = "/img/avatars/icon_" + person.name + ".svg";
    /**
     * @type {!Array<string>} The relations with other persons
     */
    this.relations = person.relations;
    /**
     * @type {!Array<string>}
     */
    this.policies = person.policies;
    /**
     * @type {string} The source url of the media
     */
    this.media = "";
    /**
     * @type {string} The party which the person belongs to
     */
    this.party = person.party;
    /**
     * @type {string} The city which the person stays in
     */
    this.city = person.city;
    this.views = person.views;
    this.experience = person.experience;

    /**
     * The Display
     */
    const height = this.el.clientHeight;
    const width = this.el.clientWidth;
    /**
     * the position on x-axis
     * @type {number}
     */
    this.x = width / 2;
    /**
     * the position on y-axis
     * @type {number}
     */
    this.y = height / 2;
    /**
     * - The velocity is initialized randomly
     * - It is a fast speed when initialized, and then decreases to the normal speed
     */
    /**
     * the velocity on x-axis
     * @type {number}
     */
    this.vx = Math.random() * 2 * INITIAL_VELOCITY - INITIAL_VELOCITY;
    /**
     * the velocity on y-axis
     * @type {number}
     */
    this.vy =
      Math.sqrt(INITIAL_VELOCITY * INITIAL_VELOCITY - this.vx * this.vx) *
      (Math.random() > 0.5 ? 1 : -1);
    /**
     * @type {Boolean} whether the avatar is selected or not
     * it is used to bind a css style to avatar
     */
    this.selected = false;
    /**
     * @type {boolean} whether the avatar is stopped
     * it is used to handle collision.
     */
    this.isStopped = false;
  }
  /**
   * Update the velocity
   * Handle the collision with other persons and the walls
   * @param {!Map<string, Person>} persons All the persons on the screen
   */
  updateVelocity(persons) {
    /**
     * Decrease the velocity if neccessary
     */
    if (this.vx * this.vx + this.vy * this.vy > VELOCITY * VELOCITY) {
      this.vx = this.vx * DECAY_RATIO;
      this.vy = this.vy * DECAY_RATIO;
    }
    /**
     * Handle the collision with other persons
     */
    let flag = false;
    for (let i of persons.keys()) {
      if (i != this.name && !flag) continue;
      if (i == this.name) {
        flag = true;
        continue;
      }
      let other = persons.get(i);

      //TODO: The collision model should be upgraded
      // Now I have to use the next tick's status to avoid overlapping, so that
      // I can more easily determine whether the avatars are at their initial satus,
      // saying there are positioned at the same point, overlapped with each other,
      // and should not be processed with the collision model.
      let nextThisX = this.x + this.vx;
      let nextThisY = this.y + this.vy;
      let nextOtherX = other.x + other.vx;
      let nextOtherY = other.y + other.vy;
      // If in the next tick, the two objects will overlap, but in this tick they are
      // not overlap, then process with the collision model.
      if (
        squaredEuclideanDistance(nextThisX, nextThisY, nextOtherX, nextOtherY) <
          4 * RADIUS * RADIUS &&
        squaredEuclideanDistance(this.x, this.y, other.x, other.y) >
          4 * RADIUS * RADIUS
      ) {
        const tan = (other.y - this.y) / (other.x - this.x + 0.001); // in case of overflow
        const cosSquare = 1 / (1 + tan * tan);
        const sinSquare = (tan * tan) / (1 + tan * tan);
        const sinTimesCos = tan / (1 + tan * tan);
        if (!this.isStopped && !other.isStopped) {
          // if both the two objects are moving, then treat them as mass-equal, so their tangetial
          // velocities will maintain the same, but the normal velocities will be swapped with each other.
          const vx1 =
            this.vx * sinSquare +
            other.vx * cosSquare +
            (other.vy - this.vy) * sinTimesCos;
          const vy1 =
            this.vy * cosSquare +
            other.vy * sinSquare +
            (other.vx - this.vx) * sinTimesCos;
          const vx2 =
            other.vx * sinSquare +
            this.vx * cosSquare +
            (this.vy - other.vy) * sinTimesCos;
          const vy2 =
            other.vy * cosSquare +
            this.vy * sinSquare +
            (this.vx - other.vx) * sinTimesCos;
          this.vx = vx1;
          this.vy = vy1;
          other.vx = vx2;
          other.vy = vy2;
        } else if (this.isStopped) {
          // if one of the objects is stopped (by cursor), then the stopped object will be treated as a wall,
          // or say a mass-infinity object. then the other object colliding with this one will maintain its
          // tangential velocity and reverse its normal velocity.
          const vx2 =
            other.vx * (cosSquare - sinSquare) + other.vy * 2 * sinTimesCos;
          const vy2 =
            other.vy * (cosSquare - sinSquare) - other.vx * 2 * sinTimesCos;
          other.vx = vx2;
          other.vy = vy2;
        } else if (other.isStopped) {
          const vx1 =
            this.vx * (cosSquare - sinSquare) + this.vy * 2 * sinTimesCos;
          const vy1 =
            this.vy * (cosSquare - sinSquare) - this.vx * 2 * sinTimesCos;
          this.vx = vx1;
          this.vy = vy1;
        }
      }
    }
    /**
     * Handle the collision with the wall
     */
    const height = this.el.clientHeight;
    const width = this.el.clientWidth;
    if (
      (this.x + RADIUS > width && this.vx > 0) ||
      (this.x - RADIUS < 0 && this.vx < 0)
    ) {
      this.vx = -this.vx;
    }
    if (
      (this.y + RADIUS > height && this.vy > 0) ||
      (this.y - RADIUS < 0 && this.vy < 0)
    ) {
      this.vy = -this.vy;
    }
  }

  /**
   * Update the position according to the velocity
   */
  step() {
    this.x += this.vx;
    this.y += this.vy;
  }
}
