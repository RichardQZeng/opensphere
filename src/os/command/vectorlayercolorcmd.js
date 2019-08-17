goog.provide('os.command.VectorLayerColor');

goog.require('os.command.AbstractVectorStyle');
goog.require('os.command.style');
goog.require('os.events.PropertyChangeEvent');
goog.require('os.metrics');
goog.require('os.source.PropertyChange');



/**
 * Changes the color of a layer
 *
 * @extends {os.command.AbstractVectorStyle}
 * @param {string} layerId
 * @param {Array<number>|string} color
 * @param {(Array<number>|string)=} opt_oldColor
 * @param {os.command.style.ColorChangeType=} opt_changeMode
 * @constructor
 */
os.command.VectorLayerColor = function(layerId, color, opt_oldColor, opt_changeMode) {
  /**
   * The color change mode. Determines how the config color is set.
   * @type {os.command.style.ColorChangeType}
   * @protected
   */
  this.changeMode = opt_changeMode || os.command.style.ColorChangeType.COMBINED;

  os.command.VectorLayerColor.base(this, 'constructor', layerId, color, opt_oldColor);

  switch (this.changeMode) {
    case os.command.style.ColorChangeType.FILL:
      this.title = 'Change Fill Color';
      this.metricKey = os.metrics.Layer.VECTOR_FILL_COLOR;
      this.defaultColor = os.style.DEFAULT_FILL_COLOR;
      break;
    case os.command.style.ColorChangeType.STROKE:
      this.title = 'Change Color';
      this.metricKey = os.metrics.Layer.VECTOR_COLOR;
      this.defaultColor = os.style.DEFAULT_LAYER_COLOR;
      break;
    case os.command.style.ColorChangeType.COMBINED:
    default:
      this.title = 'Change Color';
      this.metricKey = os.metrics.Layer.VECTOR_COLOR;
      this.defaultColor = os.style.DEFAULT_LAYER_COLOR;
      break;
  }

  if (!color) {
    var layer = /** @type {os.layer.Vector} */ (os.MapContainer.getInstance().getLayer(this.layerId));
    if (layer) {
      var options = layer.getLayerOptions();
      color = /** @type {string} */ (options && options['baseColor'] || this.defaultColor);
    }
  }

  // make sure the value is a string
  this.value = os.style.toRgbaString(color);
};
goog.inherits(os.command.VectorLayerColor, os.command.AbstractVectorStyle);


/**
 * @inheritDoc
 */
os.command.VectorLayerColor.prototype.getOldValue = function() {
  var config = os.style.StyleManager.getInstance().getLayerConfig(this.layerId);
  var ret;

  if (config) {
    switch (this.changeMode) {
      case os.command.style.ColorChangeType.FILL:
        ret = os.style.getConfigColor(config, false, os.style.StyleField.FILL);
        break;
      case os.command.style.ColorChangeType.STROKE:
        ret = os.style.getConfigColor(config, false, os.style.StyleField.STROKE);
        break;
      case os.command.style.ColorChangeType.COMBINED:
      default:
        ret = os.style.getConfigColor(config);
        break;
    }
  } else {
    ret = this.defaultColor;
  }

  return ret;
};


/**
 * @inheritDoc
 */
os.command.VectorLayerColor.prototype.applyValue = function(config, value) {
  var color = os.style.toRgbaString(/** @type {string} */ (value));

  switch (this.changeMode) {
    case os.command.style.ColorChangeType.FILL:
      os.style.setFillColor(config, color);

      // Make sure the fill color and opacity are updated as well
      if (config['fillColor']) {
        config['fillColor'] = color;
      }
      break;
    case os.command.style.ColorChangeType.STROKE:
      os.style.setConfigColor(config, color);

      if (config['fillColor']) {
        os.style.setFillColor(config, config['fillColor']);
      }

      os.ui.adjustIconSet(this.layerId, color);
      break;
    case os.command.style.ColorChangeType.COMBINED:
    default:
      os.style.setConfigColor(config, color);

      // Make sure the fill color and opacity are updated as well
      if (config['fillColor']) {
        config['fillColor'] = color;
      }
      if (config['fillOpacity'] !== undefined) {
        var colorArray = os.color.toRgbArray(value);
        config['fillOpacity'] = colorArray[3];
      }

      os.ui.adjustIconSet(this.layerId, color);

      break;
  }

  os.command.VectorLayerColor.base(this, 'applyValue', config, value);
};


/**
 * @inheritDoc
 */
os.command.VectorLayerColor.prototype.finish = function(config) {
  // dispatch the color change event on the source for the histogram
  var source = os.osDataManager.getSource(this.layerId);
  source.dispatchEvent(new os.events.PropertyChangeEvent(os.source.PropertyChange.COLOR, this.value));

  if (source instanceof os.source.Vector) {
    // a color change on the layer should clear any color model on the source
    source.setColorModel(null);
  }

  os.command.VectorLayerColor.base(this, 'finish', config);
};
