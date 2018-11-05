goog.provide('plugin.cesium.Plugin');

goog.require('os.layer.Group');
goog.require('os.plugin.AbstractPlugin');
goog.require('os.webgl.SynchronizerManager');
goog.require('plugin.cesium.CesiumRenderer');
goog.require('plugin.cesium.mixin.olcs');
goog.require('plugin.cesium.mixin.renderloop');
goog.require('plugin.cesium.sync.DrawingLayerSynchronizer');
goog.require('plugin.cesium.sync.ImageSynchronizer');
goog.require('plugin.cesium.sync.TileSynchronizer');
goog.require('plugin.cesium.sync.VectorSynchronizer');
goog.require('plugin.cesium.tiles.LayerConfig');


/**
 * Provides a WebGL renderer for the map, powered by Cesium.
 * @extends {os.plugin.AbstractPlugin}
 * @constructor
 */
plugin.cesium.Plugin = function() {
  plugin.cesium.Plugin.base(this, 'constructor');
  this.id = plugin.cesium.Plugin.ID;
};
goog.inherits(plugin.cesium.Plugin, os.plugin.AbstractPlugin);


/**
 * The plugin identifier.
 * @type {string}
 * @const
 */
plugin.cesium.Plugin.ID = 'cesium';


/**
 * @inheritDoc
 */
plugin.cesium.Plugin.prototype.init = function() {
  os.MapContainer.getInstance().setWebGLRenderer(new plugin.cesium.CesiumRenderer());

  // register the default set of synchronizers
  var sm = os.webgl.SynchronizerManager.getInstance();
  sm.registerSynchronizer(os.layer.SynchronizerType.VECTOR, plugin.cesium.sync.VectorSynchronizer);
  sm.registerSynchronizer(os.layer.SynchronizerType.TILE, plugin.cesium.sync.TileSynchronizer);
  sm.registerSynchronizer(os.layer.SynchronizerType.IMAGE, plugin.cesium.sync.ImageSynchronizer);
  sm.registerSynchronizer(os.layer.SynchronizerType.DRAW, plugin.cesium.sync.DrawingLayerSynchronizer);

  // add 3D layer group
  var group = new os.layer.Group();
  group.setPriority(3);
  group.setOSType(plugin.cesium.CESIUM_ONLY_LAYER);
  group.setCheckFunc(function(layer) {
    if (os.implements(layer, os.layer.ILayer.ID)) {
      return /** @type {os.layer.ILayer} */ (layer).getOSType() === plugin.cesium.CESIUM_ONLY_LAYER;
    }
    return false;
  });

  os.map.mapContainer.addGroup(group);

  // register 3D tiles layers
  var tileId = '3dtiles';
  var lcm = os.layer.config.LayerConfigManager.getInstance();
  lcm.registerLayerConfig(tileId, plugin.cesium.tiles.LayerConfig);
};
