<template>
  <div id="home">
    <div class="row" style="height: 100%">
      <div class="col-8" height="100%">
        <map-controller
          ref="map-controller"
          @cancel="mapCancelHandler"
          @select="mapSelectHandler"
          :style="showPersonController ? 'filter: blur(2px);' : ''"
        ></map-controller>
        <person-controller
          ref="person-controller"
          @cancel="personCancelHandler"
          @select="personSelectHandler"
          @click="personClickHandler"
        ></person-controller>
      </div>
      <div class="col-4" height="100%">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Taiwan Politics</h3>
            <select class="select mb-2" v-model="selectedYear">
              <option v-for="year in yearOptions" :key="year">{{
                year
              }}</option>
            </select>
            <div v-if="selectedPerson">
              <div class="avatar mb-2 mt-2">
                <avatar
                  :radius="50"
                  :img="selectedPerson.avatar"
                  :party="selectedPerson.party"
                ></avatar>
                <p>{{ selectedPerson.name }}</p>
              </div>
              <div style="height: 500px; overflow: auto">
                <div v-if="selectedPerson.city">
                  <span>地区</span
                  ><span class="ml-4">{{ selectedPerson.city }}</span>
                </div>
                <div v-if="selectedPerson.party">
                  <span>党派</span
                  ><span class="ml-4">{{ selectedPerson.party }}</span>
                </div>
                <div v-if="selectedPerson.policies">
                  <span>选举主张</span>
                  <ol>
                    <li v-for="policy in selectedPerson.policies" :key="policy">
                      {{ policy }}
                    </li>
                  </ol>
                </div>
                <div v-if="selectedPerson.views">
                  <span>两岸观点</span>
                  <ol>
                    <li v-for="view in selectedPerson.views" :key="view">
                      {{ view }}
                    </li>
                  </ol>
                </div>
                <div v-if="selectedPerson.experience">
                  <span>政治经历</span>
                  <ol>
                    <li
                      v-for="experience in selectedPerson.experience"
                      :key="experience"
                    >
                      {{ experience }}
                    </li>
                  </ol>
                </div>
                <video src="/video/example.mp4" controls width="100%"></video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PersonController from "@/components/PersonController";
import MapController from "@/components/MapController";
import Avatar from "@/components/Avatar.vue";

export default {
  name: "home",
  components: {
    PersonController,
    MapController,
    Avatar
  },
  data: function() {
    return {
      /**
       * @type {!Object<string, *>} the selected person's profile
       */
      selectedPerson: null,
      //TODO: The options should be generated automatically by scanning the data files,
      //      but I haven't found out how to do it on the server side.
      /**
       * @type {!Array<number>} the years to be selected
       */
      yearOptions: [2018, 2020],
      selectedYear: null,
      /**
       * @type {Boolean} whether to show the person controller component or not
       * When the person controller is visible, the map controller will be overlapped
       * by the person controller, then the mouse click event on the map will be prevented.
       * So when we need to click on the map, we must make the person controller invisible.
       */
      showPersonController: null
    };
  },
  mounted() {
    this.selectedYear = 2018;
    this.showPersonController = false;
  },
  methods: {
    /**
     * This function handles the cancel event emitted by PersonController.
     */
    personCancelHandler() {
      this.selectedPerson = null;
    },
    /**
     * This function handles the select event emitted by PersonController.
     * @param {!Object} person the person selected
     */
    personSelectHandler(person) {
      this.selectedPerson = person;
    },
    /**
     * This function handles the click event emitted by PersonController.
     * @param {!MouseEvent} event the click event
     */
    personClickHandler() {
      this.resetPersonController();
      this.$refs["map-controller"].cancelSelect();
    },
    /**
     * This function handles the cancel event emitted by MapController.
     */
    mapCancelHandler() {},
    /**
     * This function handles the select event emitted by MapController.
     * @param {string} region the region selected
     */
    mapSelectHandler(region) {
      this.showPersonController = true;
      this.$forceUpdate();
      this.$refs["person-controller"].addPersonsByYearAndRegion(
        this.selectedYear,
        region
      );
    },
    resetPersonController() {
      this.showPersonController = false;
      this.$refs["person-controller"].clear();
      this.selectedPerson = null;
    }
  },
  watch: {
    selectedYear() {
      this.resetPersonController();
      this.$refs["map-controller"].showMapByYear(this.selectedYear);
    },
    showPersonController() {
      if (this.showPersonController) {
        this.$refs["person-controller"].setZIndex(1);
      } else {
        this.$refs["person-controller"].setZIndex(-1);
      }
    }
  }
};
</script>

<style scoped>
#home {
  position: fixed;
  height: 100%;
  width: 100%;
}

.card {
  background-color: rgb(20, 24, 30);
  height: 100%;
  width: 100%;
}

.card-title {
  text-align: center;
}

.avatar {
  text-align: center;
}

.select {
  width: 100%;
  background-color: dimgray;
  color: white;
}
</style>
