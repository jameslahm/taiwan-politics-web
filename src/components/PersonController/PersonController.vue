<template>
  <div id="person-controller">
    <canvas ref="canvas" id="canvas" @click="clickOnCanvas($event)"></canvas>
    <avatar
      v-for="person of persons.values()"
      :key="person.name"
      :id="person.name"
      :radius="avatarRadius"
      :party="person.party"
      :img="person.avatar"
      @click.native="clicked(person)"
      @mouseover.native="
        hovered = person.name;
        person.isStopped = true;
      "
      @mouseleave.native="
        hovered = '';
        person.isStopped = false;
      "
      :class="person.selected ? 'avatar selected' : 'avatar'"
    >
    </avatar>
  </div>
</template>

<script>
import Person from "./Person";
import Avatar from "../Avatar";
import { requestAnimationFrame, config } from "./utils";

const AVATAR_RADIUS = config.radius;

export default {
  name: "person-controller",
  components: {
    Avatar
  },
  data: function() {
    return {
      /**
       * @type {!Map<string, !Person>} The persons that are shown on the webpage
       */
      persons: new Map(),

      /**
       * The name of the hovered person
       * The hovered person will stop moving
       * @type {string}
       */
      hovered: "",

      /**
       * @type {Person} The selected person
       */
      selectedPerson: null,
      /**
       * @type {boolean} lock the persons
       */
      personsLock: false
    };
  },
  mounted() {
    this.requestFrame(this.step);
  },
  methods: {
    /**
     * The animation frame
     * @param {function*} func The function that will be called every interval
     */
    requestFrame(func) {
      this.tid = requestAnimationFrame(() => func.call(this));
    },

    /**
     * Add person by name
     * @param {!Object<*, *>} person The profile of the person
     */
    addPerson(person) {
      console.log(this.$refs["canvas"].clientHeight);
      this.persons.set(person.name, new Person(person, this.$el));
      this.$forceUpdate(); // Have to force update here, otherwise the svg would not be rendered(don't know why)
    },

    /**
     * Add persons by year and region
     * @param {number} year the year, e.g. 2018
     * @param {string} region the region, e.g. "台南"
     */
    addPersonsByYearAndRegion(year, region) {
      try {
        const json = require("@/data/people/" + String(year) + ".json");
        if (!json[region]) return;
        for (let person of json[region]) {
          this.addPerson(person);
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Update the velocity and the position of the avatars; called every interval.
     */
    step() {
      while (this.personsLock);
      this.personsLock = true;
      /**
       * Display the avatars
       */
      for (let i of this.persons.keys()) {
        this.persons.get(i).updateVelocity(this.persons, this.$el);
        if (i == this.hovered) continue;
        this.persons.get(i).step();
        let style = document.getElementById(i).style;
        let left = this.persons.get(i).x - AVATAR_RADIUS;
        let top = this.persons.get(i).y - AVATAR_RADIUS;
        style.left = left;
          //this.persons.get(i).x - AVATAR_RADIUS;
        style.top = top;
          //this.persons.get(i).y - AVATAR_RADIUS;
      }
      /**
       * Display the relations if neccessary
       */
      if (this.selectedPerson) {
        const context = this.$refs.canvas.getContext("2d");
        const width = this.$el.clientWidth;
        const height = this.$el.clientHeight;
        this.$refs.canvas.height = height;
        this.$refs.canvas.width = width;
        context.clearRect(0, 0, width, height);
        for (let name of this.selectedPerson.relations) {
          const other = this.persons.get(name);
          context.beginPath();
          context.lineWidth = config.lineWidth;
          context.strokeStyle = config.lineColor;
          context.moveTo(this.selectedPerson.x, this.selectedPerson.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }

      this.personsLock = false;
      this.requestFrame(this.step);
    },

    /**
     * Triggered when a person is clicked
     * set the status of the clicked person and emit an event that tells the parent component
     * @param {!Person} person the person clicked
     */
    clicked(person) {
      if (this.selectedPerson == person) {
        person.selected = false;
        this.selectedPerson = null;
        this.$emit("cancel");
      } else {
        if (this.selectedPerson) {
          this.selectedPerson.selected = false;
        }
        person.selected = true;
        this.selectedPerson = person;
        this.$emit("select", person);
      }

      // The canvas should be cleared, otherwise if no person is selected,
      // the lines would not be cleared in step() either.
      this.clearContext();

      this.$forceUpdate();
    },

    /**
     * Reset the person controller
     */
    clear() {
      while (this.personsLock);
      this.personsLock = true;
      this.selectedPerson = null;
      this.persons.clear();
      this.clearContext();
      this.$forceUpdate();
      this.personsLock = false;
    },

    /**
     * Clear the context
     */
    clearContext() {
      const context = this.$refs.canvas.getContext("2d");
      const width = this.$el.clientWidth;
      const height = this.$el.clientHeight;
      context.clearRect(0, 0, width, height);
    },

    /**
     * Pass the click coordinate to parent component,
     * since the PersonController overlaps the MapController
     */
    clickOnCanvas(event) {
      this.$emit("click", event);
    },
    setZIndex(value) {
      this.$el.style["z-index"] = value;
    }
  },
  computed: {
    /**
     * @returns {number} the radius of the avatar
     */
    avatarRadius() {
      return AVATAR_RADIUS;
    }
  }
};
</script>

<style scoped>
.avatar {
  position: absolute;
  filter: saturate(50%);
}

.avatar:hover {
  filter: saturate(100%);
}

.avatar.selected {
  filter: saturate(100%);
}

#person-controller {
  width: 100%;
  height: 100%;
  position: absolute;
}

#canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
