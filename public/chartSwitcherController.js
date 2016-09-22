import _ from 'lodash';
import RegistryVisTypesProvider from 'ui/registry/vis_types';
import VisProvider from 'ui/vis';
import VisAggConfigProvider from 'ui/vis/agg_config';
import PieType from '/home/dobrik/somestaff/kibana/src/core_plugins/kbn_vislib_vis_types/public/pie.js';
import AreaType from '/home/dobrik/somestaff/kibana/src/core_plugins/kbn_vislib_vis_types/public/area.js';
import HistogramType from '/home/dobrik/somestaff/kibana/src/core_plugins/kbn_vislib_vis_types/public/histogram.js';
import LineType from '/home/dobrik/somestaff/kibana/src/core_plugins/kbn_vislib_vis_types/public/line.js';
import TileMapType from '/home/dobrik/somestaff/kibana/src/core_plugins/kbn_vislib_vis_types/public/tile_map.js';
import VisLibRenderBotProvider from 'ui/vislib_vis_type/vislib_renderbot';
import VislibVisualizationsVisTypesProvider from 'ui/vislib/visualizations/vis_types';
import VisSchemasProvider from 'ui/vis/schemas';
import template from 'plugins/chartSwitcher/chart.html';
var module = require('ui/modules').get('chartSwitcher');
import 'ui/visualize';

module.controller('ChartSwitcherController', function($scope, $route, Private) {
  let Vis = Private(VisProvider);
  let vis = $scope.vis;
  let AggConfig = Private(VisAggConfigProvider);
  vis.setState(Vis.convertOldState(getChartType(), vis.state));
  $scope.chart = vis;
  //generate new chart on click
  $scope.chart.listeners.click = switchOnClick;
  $scope.$watch('esResponse', function (resp) {
    $scope.esResp = resp;
    console.log(resp);
  });

  function switchOnClick(){
    let tempVis = $scope.chart.clone();
    tempVis.setState(Vis.convertOldState(getChartType(), tempVis.state));
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
});

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}
