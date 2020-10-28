function mergeCounties(geoJson, counties, properties) {
  geoJson = decode(geoJson);
  let features = geoJson.features;
  let polygons = [];
  for (let i = 0; i < counties.length; i++) {
    for (let j = 0; j < features.length; j++) {
      if (features[j].properties.name == counties[i]) {
        if (features[j].geometry.type == "MultiPolygon") {
          for (let k = 0; k < features[j].geometry.coordinates.length; k++) {
            polygons.push(features[j].geometry.coordinates[k]);
          }
        } else {
          polygons.push(features[j].geometry.coordinates);
        }
        break;
      }
    }
  }
  let feature = {
    type: "Feature",
    properties: {
      name: properties.name || ""
    },
    geometry: {
      type: "MultiPolygon",
      coordinates: polygons
    }
  };
  if (properties.cp) {
    feature.properties.cp = properties.cp;
  }
  features.push(feature);
}

function decode(json) {
  if (!json.UTF8Encoding) {
    return json;
  }
  var encodeScale = json.UTF8Scale;
  if (encodeScale == null) {
    encodeScale = 1024;
  }
  var features = json.features;
  for (let i = 0; i < features.length; i++) {
    let feature = features[i];
    let geometry = feature.geometry;
    let coordinates = geometry.coordinates;
    let encodeOffsets = geometry.encodeOffsets;

    for (let j = 0; j < coordinates.length; j++) {
      let coordinate = coordinates[j];
      if (geometry.type == "Polygon") {
        coordinates[j] = decodePolygon(
          coordinate,
          encodeOffsets[j],
          encodeScale
        );
      } else if (geometry.type == "MultiPolygon") {
        for (let k = 0; k < coordinate.length; k++) {
          let polygon = coordinate[k];
          coordinate[k] = decodePolygon(
            polygon,
            encodeOffsets[j][k],
            encodeScale
          );
        }
      }
    }
  }
  json.UTF8Encoding = false;
  return json;
}

function decodePolygon(coordinate, encodeOffsets, encodeScale) {
  let result = [];
  let prevX = encodeOffsets[0];
  let prevY = encodeOffsets[1];
  for (let i = 0; i < coordinate.length; i += 2) {
    let x = coordinate.charCodeAt(i) - 64;
    let y = coordinate.charCodeAt(i + 1) - 64;
    x = (x >> 1) ^ -(x & 1);
    y = (y >> 1) ^ -(y & 1);
    x += prevX;
    y += prevY;
    prevX = x;
    prevY = y;
    result.push([x / encodeScale, y / encodeScale]);
  }
  return result;
}

function getMap(year, data) {
  const parties = ["国民党", "民进党", "无党派", "其他"];
  const PARTY_VALUE = {
    国民党: 0,
    民进党: 1,
    无党派: 2,
    其他: 3
  };
  const PARTY_COLOR = {
    国民党: "rgb(82, 154, 202)",
    民进党: "rgb(158, 192, 81)",
    无党派: "rgb(6, 8, 7)",
    其他: "rgb(85, 86, 90)"
  };
  let map = {
    // backgroundColor: '#404a59',
    visualMap: {
      type: "piecewise",
      pieces: [],
      textStyle: {
        color: "#ffffff"
      },
      inverse: true
    },
    geo: {
      map: "taiwan" + year,
      label: {
        emphasis: {
          show: false
        }
      },
      itemStyle: {
        normal: {
          areaColor: "rgba(0,0,0,0)",
          borderColor: "#ffffff"
          //color: '#323c48'
        },
        emphasis: {
          areaColor: "rgba(225, 225, 225, 0.5)"
        }
      },
      selectedMode: "single"
    },
    series: [
      {
        type: "map",
        map: "taiwan" + year,
        geoIndex: 0,
        data: []
      }
    ]
  };
  for (let party of parties) {
    map.visualMap.pieces.push({
      value: PARTY_VALUE[party],
      label: party,
      color: PARTY_COLOR[party]
    });
    if (data[party] != null) {
      for (let county of data[party]) {
        map.series[0].data.push({ name: county, value: PARTY_VALUE[party] });
      }
    }
  }
  return map;
}

export { mergeCounties, getMap };
