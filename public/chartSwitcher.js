require('plugins/chartSwitcher/chartSwitcherController');
require('plugins/chartSwitcher/styles/main.less');
define(function(require) {
  function ChartSwitcherProvider(Private) {
    var TemplateVisType = Private(require('ui/template_vis_type/template_vis_type'));

    return new TemplateVisType({
      name: 'Chart Switcher', // the internal id of the visualization
      title: 'Chart Switcher', // the name shown in the visualize list
      icon: 'fa-chart', // the class of the font awesome icon for this
      description: 'Add a randomly charts in dashboard.', // description shown to the user
      requiresSearch: false, // Cannot be linked to a search
      template: require('plugins/chartSwitcher/chartSwitcher.html'), // Load the template of the visualization
    });
  }

  require('ui/registry/vis_types').register(ChartSwitcherProvider);
  return ChartSwitcherProvider;
});

