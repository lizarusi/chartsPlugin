import _ from 'lodash';
import RegistryVisTypesProvider from 'ui/registry/vis_types';
import VisProvider from 'ui/vis';
import VisAggConfigProvider from 'ui/vis/agg_config';
import VisAggConfigsProvider from 'ui/vis/agg_configs';
import PieType from '/home/dobrik/somestaff/kibana/src/core_plugins/kbn_vislib_vis_types/public/pie.js';
import AreaType from '/home/dobrik/somestaff/kibana/src/core_plugins/kbn_vislib_vis_types/public/area.js';
import HistogramType from '/home/dobrik/somestaff/kibana/src/core_plugins/kbn_vislib_vis_types/public/histogram.js';
import LineType from '/home/dobrik/somestaff/kibana/src/core_plugins/kbn_vislib_vis_types/public/line.js';
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
  let AggConfigs = Private(VisAggConfigsProvider);
  vis.setState(Vis.convertOldState(getChartType(), vis.state));
  let type = fakeType();
  let agg = new AggConfig(vis, {schema: 'segment', type: type, params: fakeAggConfigParams(type)});
  vis.aggs = new AggConfigs(vis, [agg]);
  $scope.chart = vis;

  //generate new chart on click
  $scope.chart.listeners.click = switchOnClick;
  $scope.$watch('esResponse', function (resp) {
    console.log(resp);
    // resp.aggregations['2'].buckets = fakeEsResp(type);
    $scope.esResp = resp;
  });

  function fakeAggConfigParams(type){
    let hash = { field: 'bytes' };
    switch(type) {
      case 'histogram':
        hash.interval = randomInterval();
        break;
      case 'range':
        hash.ranges = randomRanges();
        break;
    }
    return hash;
  }

  function fakeEsResp(type){
    let hash = { 'histogram' : fakeHistogramEsResp(Math.floor(Math.random()*5000) + 1000),
             'range' : fakeRangeEsResp(randomRanges())}
    return hash[type];
  };

  function fakeType() {
    let types = ['histogram', 'range'];
    return types[Math.floor(Math.random() * types.length)];
  }

  function fakeRangeEsResp(ranges) {
    let hash = {};
    ranges.forEach(function (el) {
      let key = el.from + '.0-' + el.to + '.0';
      hash[key] = {};
      hash[key].doc_count = Math.floor(Math.random()*3000) + 2000;
      hash[key].from = el.from;
      hash[key].to = el.to;
    })
    return hash;
  }

  function fakeHistogramEsResp(interval) {
    let hash = {};
    let count = Math.floor(Math.random()*25)+5;
    for (let i = 0; i < count; i++) {
      hash[i] = {};
      hash[i].doc_count = Math.floor(Math.random()*3000) + 2000;
      hash[i].key = interval * i;
    }
    return hash;
  }


  function switchOnClick(){
    let vis = $scope.vis;
    vis.setState(Vis.convertOldState(getChartType(), vis.state));
    let type = fakeType();
    let tempAgg = new AggConfig($scope.chart, {schema: 'segment', type: type, params: {field: 'bytes'}});
    vis.aggs  = new AggConfigs($scope.chart, [tempAgg]);
    $scope.chart = vis;
    $scope.chart.listeners.click = switchOnClick;
    let copyEsResp = clone($scope.esResp);
    let esRespp = fakeEsResp(type);
    copyEsResp.aggregations['2'].buckets = esRespp;
    $scope.esResp = copyEsResp;
  }
  function getChartType(current) {
    let chartType = chooseRandomChartType();
    if (current == chartType) {
      getChartType(current);
    }
    return chartType;
  }
  function chooseRandomChartType() {
    let chartTypes = [PieType, HistogramType, LineType, AreaType];
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
  return ranges;
}
