import taiwanJson from "echarts/map/json/province/taiwan.json";
import { mergeCounties, getMap } from "./utils";
import ECharts from "vue-echarts";

let mapInfo = {
  2018: {
    partitions: {
      北部地区: [
        "新竹市",
        "新竹县",
        "桃园市",
        "台北市",
        "基隆市",
        "新北市",
        "宜兰县",
        "苗栗县"
      ],
      中部地区: [
        "台中市",
        "彰化县",
        "南投县",
        "花莲县",
        "澎湖县",
        "金门县",
        "连江县"
      ],
      南部地区: [
        "台南市",
        "高雄市",
        "屏东市",
        "嘉义市",
        "台东市",
        "嘉义县",
        "云林县",
        "台东县",
        "屏东县"
      ]
    },
    parties: {
      国民党: [
        "高雄市",
        "新竹市",
        "新竹县",
        "宜兰县",
        "苗栗县",
        "新北市",
        "彰化县",
        "嘉义县",
        "花莲县",
        "南投县",
        "台中市",
        "云林县",
        "台东县",
        "澎湖县",
        "金门县",
        "连江县"
      ],
      民进党: ["屏东县", "台南市", "基隆市", "桃园市", "嘉义市"],
      无党派: ["台北市"],
      其他: []
    },
    json: JSON.parse(JSON.stringify(taiwanJson))
  },
  2016: {
    partitions: {
      北部地区: [
        "新竹市",
        "新竹县",
        "桃园市",
        "台北市",
        "基隆市",
        "新北市",
        "宜兰县",
        "苗栗县"
      ],
      中部地区: [
        "台中市",
        "彰化县",
        "南投县",
        "花莲县",
        "澎湖县",
        "金门县",
        "连江县"
      ],
      南部地区: [
        "台南市",
        "高雄市",
        "屏东市",
        "嘉义市",
        "台东市",
        "嘉义县",
        "云林县",
        "台东县",
        "屏东县"
      ]
    },
    parties: {
      国民党: ["新竹县", "苗栗县", "新北市", "南投县", "台东县", "连江县"],
      民进党: [
        "高雄市",
        "屏东县",
        "台南市",
        "新竹市",
        "宜兰县",
        "基隆市",
        "桃园市",
        "彰化县",
        "嘉义县",
        "嘉义市",
        "台中市",
        "云林县",
        "澎湖县"
      ],
      无党派: ["台北市", "花莲县", "金门县"],
      其他: []
    },
    json: JSON.parse(JSON.stringify(taiwanJson))
  }
};

let map = {};

for (let year in mapInfo) {
  let partitions = mapInfo[year].partitions;
  for (let partition in partitions) {
    console.log(partition);
    mergeCounties(mapInfo[year].json, partitions[partition], {
      name: partition
    });
  }
  console.log(mapInfo[year].json);
  map[year] = getMap(year, mapInfo[year].parties);
  ECharts.registerMap("taiwan" + year, mapInfo[year].json);
}
// mergeCounties(taiwanJson, taibeiParams.names, taibeiParams.properties);
// let map = getMap(2018, data);

export { ECharts, map };
