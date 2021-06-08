goog.module('os.command.TransformAreas');
goog.module.declareLegacyNamespace();

const TransformVectors = goog.require('os.command.TransformVectors');
const interpolate = goog.require('os.interpolate');
const {getAreaManager} = goog.require('os.query.instance');


/**
 */
class TransformAreas extends TransformVectors {
  /**
   * Constructor.
   * @param {!ol.ProjectionLike} source
   * @param {!ol.ProjectionLike} target
   */
  constructor(source, target) {
    super(source, target);
  }

  /**
   * @inheritDoc
   */
  transform(sourceProjection, targetProjection) {
    var areaManager = getAreaManager();
    if (areaManager) {
      var features = areaManager.getAll();

      for (var i = 0, n = features.length; i < n; i++) {
        var feature = features[i];

        // We are only concerned about features that are not on the map. Anything on the map should be
        // handled by this instance of the superclass command.
        if (feature && !feature.get('shown')) {
          var geom = feature.getGeometry();
          if (geom) {
            geom.transform(sourceProjection, targetProjection);
          }

          var origGeom = /** @type {ol.geom.Geometry} */ (feature.get(interpolate.ORIGINAL_GEOM_FIELD));
          if (origGeom) {
            origGeom.transform(sourceProjection, targetProjection);
          }
        }
      }
    }
  }
}

exports = TransformAreas;
