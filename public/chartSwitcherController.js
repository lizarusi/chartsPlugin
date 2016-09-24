import _ from 'lodash';
import RegistryVisTypesProvider from 'ui/registry/vis_types';
import VisProvider from 'ui/vis';
import VisAggConfigProvider from 'ui/vis/agg_config';
import PieType from '/home/lizarusi/Documents/kibana/src/core_plugins/kbn_vislib_vis_types/public/pie.js';
import AreaType from '/home/lizarusi/Documents/kibana/src/core_plugins/kbn_vislib_vis_types/public/area.js';
import HistogramType from '/home/lizarusi/Documents/kibana/src/core_plugins/kbn_vislib_vis_types/public/histogram.js';
import LineType from '/home/lizarusi/Documents/kibana/src/core_plugins/kbn_vislib_vis_types/public/line.js';
import VisLibRenderBotProvider from 'ui/vislib_vis_type/vislib_renderbot';
import VislibVisualizationsVisTypesProvider from 'ui/vislib/visualizations/vis_types';
import VisSchemasProvider from 'ui/vis/schemas';
import template from 'plugins/chartSwitcher/chart.html';
import AggTypesIndexProvider from 'ui/agg_types/index';
var module = require('ui/modules').get('chartSwitcher');
import 'ui/visualize';

module.controller('ChartSwitcherController', function($scope, $route, Private) {
  let Vis = Private(VisProvider);
  let vis = $scope.vis;
  let AggConfig = Private(VisAggConfigProvider);
  // let vis = new Vis($scope.vis.indexPattern, 'pie', $scope.uiState);
  vis.setState(Vis.convertOldState(Private(PieType), vis.state));
  let agg = new AggConfig(vis, pieAggs());
  console.log(pieAggs());
  vis.aggs.push(agg);
  console.log(vis);
  $scope.chart = vis;

  //generate new chart on click
  $scope.chart.listeners.click = switchOnClick;
  $scope.$watch('esResponse', function (resp) {
    $scope.esResp = resp;
  });
  function switchOnClick(){
    let tempVis = $scope.chart.clone();
    tempVis.setState(Vis.convertOldState(Private(PieType), $scope.vis.state));

    let agg = new AggConfig(tempVis, pieAggs());
    tempVis.aggs.push(agg);
    console.log(tempVis);
    $scope.chart = tempVis;
    $scope.chart.listeners.click = switchOnClick;
    $scope.esResp = clone($scope.esResp);
  }
  function getChartType(current) {
    let chartType = chooseRandomChartType();
    if (current == chartType) {
      getChartType(current);
    }
    return chartType;
  }
  function chooseRandomChartType() {
    let chartTypes = [PieType, HistogramType, LineType];
    return Private(chartTypes[Math.floor(Math.random() * chartTypes.length)]);
  }
  function pieAggs(){
    let schema = 'segment';
    let types = {histogram: {field: randomFields(), interval: randomInterval()}, range: {field: randomFields(), ranges: randomRanges()}}
    let result = {};
    let typesKeys = Object.keys(types);
    let randomType = typesKeys[Math.floor(Math.random()*typesKeys.length)];
    result.schema = schema;
    result.type = randomType;
    result.params = types[randomType];
    return result;
  }
});

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

function randomSegmentParam(){
  let params = {};
  params.interval = randomInterval();
  params.ranges = randomRanges();

}
function randomFields(){
  let fields = ['bytes', 'machine.ram', 'memory'];
  return fields[Math.floor(Math.random() * fields.length)];
}
function randomInterval(){
  return Math.floor(Math.random()*10000);
}
function randomRanges(){
  let ranges = [];
  let rangesNum = Math.floor(Math.random() * 4 + 2);
  for (let i = 0; i <= rangesNum; i++){
      let from = Math.floor(Math.random()*50000);
      let to = Math.floor(Math.random()*50000 + from);
      ranges.push({from: from, to: to });
  }
}
