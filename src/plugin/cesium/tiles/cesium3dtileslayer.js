goog.provide('plugin.cesium.tiles.Layer');

goog.require('os.config.DisplaySetting');
goog.require('os.events.PropertyChangeEvent');
goog.require('os.layer.PropertyChange');
goog.require('plugin.cesium');
goog.require('plugin.cesium.PrimitiveLayer');


/**
 * @extends {plugin.cesium.PrimitiveLayer}
 * @constructor
 */
plugin.cesium.tiles.Layer = function() {
  plugin.cesium.tiles.Layer.base(this, 'constructor');

  /**
   * @type {string}
   * @protected
   */
  this.url = '';

  this.setOSType(plugin.cesium.CESIUM_ONLY_LAYER);
  this.setExplicitType('3D Tiles');
};
goog.inherits(plugin.cesium.tiles.Layer, plugin.cesium.PrimitiveLayer);


/**
 * @inheritDoc
 */
plugin.cesium.tiles.Layer.prototype.checkCesiumEnabled = function() {
  plugin.cesium.tiles.Layer.base(this, 'checkCesiumEnabled');

  if (this.url && !this.hasError()) {
    var tileset = new Cesium.Cesium3DTileset({
      url: this.url
    });

    this.setPrimitive(tileset);
  }
};


/**
 * @inheritDoc
 */
plugin.cesium.tiles.Layer.prototype.restore = function(config) {
  plugin.cesium.tiles.Layer.base(this, 'restore', config);

  if (config['url']) {
    this.url = /** @type {string} */ (config['url']);
  }

  this.checkCesiumEnabled();
};
