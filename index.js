/* eslint-env es6 */

'use strict';

const fs = require('fs');
const path = require('path');
const resolver = require('opensphere-build-resolver/utils');


/**
 * Directory containing build artifacts generated by `bits-resolver`.
 * @type {string}
 */
const buildDir = '.build';


/**
 * Path to the build directory.
 * @type {string}
 */
const buildPath = path.join(__dirname, buildDir);


/**
 * Path to the built version file.
 * @type {string}
 */
const versionFile = path.join(buildPath, 'version');


/**
 * Relative path of the built version directory.
 * @type {string}
 */
const version = fs.readFileSync(versionFile, 'utf8').trim()
    .replace(/.*\//, '');


/**
 * Version value from the package.json file. Used in about/feedback/what's new
 * @type {string}
 */
const packageVersion = require('./package').version;


/**
 * Path to the override version file - exists if a plugin package.json file provides overrideVersion
 * @type {string}
 */
const overrideVersionFile = path.join(buildPath, 'overrideVersion');


/**
 * Allow a plugin to override the app version of opensphere that is passed to index-template.html
 * @type {string}
 */
const overrideVersion = fs.existsSync(overrideVersionFile) ? fs.readFileSync(overrideVersionFile, 'utf8') : undefined;


/**
 * Resources for `bits-index` to include in the distribution and both
 * `index.html` and `tools.html`.
 * @type {Array<Object>}
 */
const sharedResources = [
  {
    source: 'scripts/electron',
    target: 'electron',
    scripts: ['electronvendorpre.js']
  },
  {
    source: buildPath,
    target: '',
    scripts: ['modernizr.js']
  },
  {
    source: __dirname,
    target: '',
    scripts: ['browserCheck.js']
  },
  {
    source: resolver.resolveModulePath('openlayers/dist', __dirname),
    target: 'vendor/openlayers',
    css: ['ol.css']
  },
  {
    source: resolver.resolveModulePath('jquery/dist', __dirname),
    target: 'vendor/jquery',
    scripts: ['jquery.min.js']
  },
  {
    source: 'src/worker',
    target: 'src/worker',
    files: ['computeframediffs.js', 'dataurltoarray.js']
  },
  {
    source: 'vendor/jquery',
    target: 'vendor/jquery',
    scripts: ['jquery.event.drag-2.3.0.js']
  },
  {
    source: resolver.resolveModulePath('css-element-queries/src', __dirname),
    target: 'vendor/css-element-queries',
    scripts: ['ResizeSensor.js']
  },
  {
    source: 'vendor/jquery-ui',
    target: 'vendor/jquery-ui',
    css: ['lightness/jquery-ui-1.12.1.min.css'],
    scripts: ['jquery-ui-1.12.1.min.js'],
    files: ['lightness/images']
  },
  {
    source: resolver.resolveModulePath('bootstrap/dist', __dirname),
    target: 'vendor/bootstrap',
    scripts: ['js/bootstrap.bundle.min.js']
  },
  {
    source: 'vendor/bootstrap2',
    target: 'vendor/bootstrap2',
    scripts: ['typeahead.js']
  },
  {
    source: resolver.resolveModulePath('select2', __dirname),
    target: 'vendor/select2',
    css: ['select2.css'],
    scripts: ['select2.js'],
    files: ['*.+(gif|png)']
  },
  {
    source: 'vendor/slick',
    target: 'vendor/slickgrid',
    css: ['slick.grid.css'],
    scripts: [
      'slick.core.js',
      'slick.dataview.js',
      'slick.editors.js',
      'slick.formatters.js',
      'slick.rowselectionmodel.js',
      'slick.grid.js'
    ],
    files: ['images']
  },
  {
    source: resolver.resolveModulePath('@toast-ui/editor/dist', __dirname),
    target: 'vendor/toastui',
    css: ['toastui-editor.css']
  },
  {
    source: resolver.resolveModulePath('codemirror/lib', __dirname),
    target: 'vendor/toastui',
    css: ['codemirror.css']
  },
  {
    source: 'vendor/os-minified/',
    target: 'vendor/os-minified/',
    scripts: ['os-toastui-editor.min.js']
  },
  {
    source: resolver.resolveModulePath('markdown-it/dist', __dirname),
    scripts: ['markdown-it.min.js']
  },
  {
    source: resolver.resolveModulePath('crossfilter2', __dirname),
    target: 'vendor/crossfilter',
    scripts: ['crossfilter.min.js']
  },
  {
    source: resolver.resolveModulePath('font-awesome', __dirname),
    target: 'vendor/font-awesome',
    css: ['css/font-awesome.min.css'],
    files: ['fonts']
  },
  {
    source: resolver.resolveModulePath('moment/min', __dirname),
    target: 'vendor/moment',
    scripts: ['moment.min.js']
  },
  {
    source: resolver.resolveModulePath('angular', __dirname),
    target: 'vendor/angular',
    scripts: ['angular.min.js']
  },
  {
    source: resolver.resolveModulePath('angular-animate', __dirname),
    target: 'vendor/angular',
    scripts: ['angular-animate.min.js']
  },
  {
    source: resolver.resolveModulePath('angular-sanitize', __dirname),
    target: 'vendor/angular',
    scripts: ['angular-sanitize.min.js']
  },
  {
    source: resolver.resolveModulePath('angular-route', __dirname),
    target: 'vendor/angular',
    scripts: ['angular-route.min.js']
  },
  {
    source: 'vendor/angular-ui',
    target: 'vendor/angular',
    scripts: [
      'angular-ui.js',
      'angular-ui-utils/scroll/ui-scroll.js',
      'angular-ui-utils/scroll/ui-scroll-jqlite.js'
    ]
  },
  {
    source: resolver.resolveModulePath('text-encoding/lib', __dirname),
    target: 'vendor/text-encoding',
    scripts: [
      'encoding-indexes.js',
      'encoding.js']
  },
  {
    source: resolver.resolveModulePath('blob-polyfill', __dirname),
    target: 'vendor/polyfill',
    scripts: ['Blob.js']
  },
  {
    source: resolver.resolveModulePath('file-saver', __dirname),
    target: 'vendor/polyfill',
    scripts: ['FileSaver.js']
  },
  {
    source: resolver.resolveModulePath('core-js-bundle', __dirname),
    target: 'vendor/polyfill',
    scripts: ['minified.js']
  },
  {
    source: resolver.resolveModulePath('zip-js/WebContent', __dirname),
    target: 'vendor/zip-js',
    scripts: ['zip.js', 'zip-ext.js'],
    files: ['deflate.js', 'inflate.js', 'z-worker.js']
  },
  {
    source: 'vendor/geomag',
    target: 'vendor/geomag',
    scripts: ['cof2Obj.js', 'geomag.js'],
    files: ['WMM.txt']
  },
  {
    source: resolver.resolveModulePath('jsts/dist', __dirname),
    target: 'vendor/jsts',
    scripts: ['jsts.min.js']
  },
  {
    source: resolver.resolveModulePath('jschardet/dist', __dirname),
    target: 'vendor/jschardet',
    scripts: ['jschardet.min.js']
  },
  {
    source: buildPath,
    target: 'vendor/xml-lexer',
    scripts: ['xml-lexer.min.js']
  },
  {
    source: resolver.resolveModulePath('oboe/dist', __dirname),
    target: 'vendor/oboe',
    scripts: ['oboe-browser.min.js']
  },
  {
    source: resolver.resolveModulePath('navigator.sendbeacon', __dirname),
    target: 'vendor/sendbeacon',
    scripts: ['sendbeacon.js']
  },
  {
    source: 'scripts/electron',
    target: 'electron',
    scripts: ['electronvendorpost.js']
  },
  {
    source: resolver.resolveModulePath('pluralize', __dirname),
    target: 'vendor/pluralize',
    scripts: ['pluralize.js']
  }
];

const indexResources = sharedResources.concat([
  {
    source: '',
    target: '',
    files: ['images']
  },
  {
    source: resolver.resolveModulePath('opensphere-asm/dist', __dirname),
    target: '',
    scripts: ['os-load.js'],
    files: [
      'os-wasm.js',
      'os-wasm.wasm',
      'os-asm.js',
      'os-asm.js.mem'
    ]
  },
  {
    source: resolver.resolveModulePath('cesium/Build/Cesium', __dirname),
    target: 'vendor/cesium',
    files: [
      'Cesium.js',
      'Assets',
      'ThirdParty',
      'Workers'
    ]
  },
  {
    source: resolver.resolveModulePath('d3', __dirname),
    target: 'vendor/d3',
    scripts: ['d3.min.js']
  },
  {
    source: resolver.resolveModulePath('d3-tip', __dirname),
    target: 'vendor/d3',
    scripts: ['index.js']
  },
  {
    source: resolver.resolveModulePath('save-svg-as-png', __dirname),
    target: 'vendor/save-svg-as-png',
    scripts: ['saveSvgAsPng.js']
  },
  {
    source: resolver.resolveModulePath('html2canvas/dist', __dirname),
    target: 'vendor/html2canvas',
    scripts: ['html2canvas.min.js']
  },
  {
    source: resolver.resolveModulePath('papaparse', __dirname),
    target: 'vendor/papaparse',
    scripts: ['papaparse.min.js']
  },
  {
    source: resolver.resolveModulePath('proj4/dist', __dirname),
    target: 'vendor/proj4',
    scripts: ['proj4.js']
  },
  {
    source: resolver.resolveModulePath('suncalc', __dirname),
    target: 'vendor/suncalc',
    scripts: ['suncalc.js']
  },
  {
    source: 'vendor/gif',
    target: 'vendor/gif',
    files: ['gif.js', 'gif.worker.js']
  }
]);


/**
 * Resources for unsupported browser page to include in `old.html`
 * @type {Array<Object>}
 */
const oldResources = [
  {
    source: resolver.resolveModulePath('platform', __dirname),
    target: '',
    scripts: ['platform.js']
  },
  {
    source: buildPath,
    target: '',
    scripts: ['modernizr.js']
  },
  {
    source: __dirname,
    target: '',
    scripts: ['browserCheck.js']
  },
  {
    source: resolver.resolveModulePath('font-awesome', __dirname),
    target: 'vendor/font-awesome',
    css: ['css/font-awesome.min.css'],
    files: ['fonts']
  }
];

const addLayerResources = [
  {
    source: resolver.resolveModulePath('jquery/dist', __dirname),
    target: 'vendor/jquery',
    scripts: ['jquery.min.js']
  },
  {
    source: resolver.resolveModulePath('bootstrap/dist', __dirname),
    target: 'vendor/bootstrap',
    scripts: ['js/bootstrap.min.js'],
    css: ['css/bootstrap.min.css']
  },
  {
    source: buildPath,
    target: '',
    scripts: ['addlayer.js']
  }
];


/**
 *
 */
module.exports = {
  appVersion: version,
  packageVersion: packageVersion,
  overrideVersion: overrideVersion,
  basePath: __dirname,
  distPath: path.join('dist', 'opensphere'),
  templates: [
    {
      id: 'index',
      file: 'index-template.html',
      resources: indexResources
    }, {
      id: 'old',
      file: 'old-template.html',
      resources: oldResources
    }, {
      id: 'addlayer',
      file: 'addlayer-template.html',
      resources: addLayerResources
    }
  ],
  debugCss: path.join(buildDir, 'themes/default.combined.css'),
  debugJs: path.join(buildDir, 'opensphere.js'),
  compiledCss: path.join(version, 'styles', 'themes/default.min.css'),
  compiledJs: path.join(version, 'opensphere.min.js'),
  sharedResources: sharedResources
};
