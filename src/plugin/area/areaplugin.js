goog.declareModuleId('plugin.area.AreaPlugin');

import CSVAreaImportUI from './csvareaimportui.js';
import GeoJSONAreaImportUI from './geojsonareaimportui.js';
import KMLAreaImportUI from './kmlareaimportui.js';
import SHPAreaImportUI from './shpareaimportui.js';

const csv = goog.require('os.file.mime.csv');
const {getAreaImportManager, getAreaFileManager} = goog.require('os.query');
const AbstractPlugin = goog.require('os.plugin.AbstractPlugin');
const ImportMethod = goog.require('os.ui.file.method.ImportMethod');
const pluginFileGeojsonMime = goog.require('plugin.file.geojson.mime');
const pluginFileKmlMime = goog.require('plugin.file.kml.mime');
const mime = goog.require('plugin.file.shp.mime');


/**
 */
class AreaPlugin extends AbstractPlugin {
  /**
   * Constructor.
   */
  constructor() {
    super();
    this.id = AreaPlugin.ID;
    this.errorMessage = null;
  }

  /**
   * @inheritDoc
   */
  init() {
    // initialize managers used by the area plugin
    var aim = getAreaImportManager();
    var afm = getAreaFileManager();

    // register file import method
    afm.registerFileMethod(new ImportMethod(false));

    // csv
    aim.registerImportUI(csv.TYPE, new CSVAreaImportUI());
    aim.registerImportDetails('CSV', true);

    // geojson
    aim.registerImportUI(pluginFileGeojsonMime.TYPE, new GeoJSONAreaImportUI());
    aim.registerImportDetails('GeoJSON', true);

    // kml
    aim.registerImportUI(pluginFileKmlMime.TYPE, new KMLAreaImportUI());
    aim.registerImportUI(pluginFileKmlMime.KMZ_TYPE, new KMLAreaImportUI());
    aim.registerImportDetails('KML/KMZ', true);

    // shp
    aim.registerImportUI(mime.TYPE, new SHPAreaImportUI());
    aim.registerImportUI(mime.ZIP_TYPE, new SHPAreaImportUI());
    aim.registerImportDetails('Shapefile (SHP/DBF or ZIP)', true);
  }
}


/**
 * @type {string}
 * @const
 */
AreaPlugin.ID = 'areas';


export default AreaPlugin;
