<template>
  <div id="map-controller">
    <v-chart
      :options="map"
      autoresize
      ref="map"
      style="height: 100%; width: 100%"
      @click="clicked"
    ></v-chart>
  </div>
</template>

<script>
import "echarts/lib/chart/line";
import "echarts/lib/component/polar";
import "echarts/map/js/china";
import { ECharts, map } from "@/data/map";

export default {
  name: "map-controller",
  components: {
    "v-chart": ECharts
  },
  data: function() {
    return {
      /**
       * @type {Number} the selected year
       */
      year: null,
      map: null,
      region: null
    };
  },
  methods: {
    /**
     * Show the map according to the year given.
     * @param {number} year
     */
    showMapByYear(year) {
      this.year = year;
    },
    clicked(param) {
      console.log(param);
      let region = param.name;
      if (this.region == region) {
        this.region = null;
        this.$emit("cancel");
      } else {
        this.region = region;
        this.$emit("select", region);
      }
    },
    cancelSelect() {
      this.$refs["map"].dispatchAction({
        type: "geoUnSelect",
        name: this.region
      });
      this.region = null;
    }
  },
  watch: {
    year() {
      this.map = map[this.year];
    }
  }
};
</script>

<style scoped>
.center {
  position: absolute;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  left: 0;
  right: 0;
  margin: auto;
}

.rect {
  height: 33%;
  width: 100%;
}

#map-controller {
  width: 100%;
  height: 100%;
  position: absolute;
  text-align: center;
  vertical-align: middle;
}
</style>
