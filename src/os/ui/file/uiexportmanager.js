goog.module('os.ui.exportManager');
goog.module.declareLegacyNamespace();

const ExportManager = goog.require('os.ui.file.ExportManager');


/**
 * Global export manager reference.
 * @type {ExportManager}
 */
exports = ExportManager.getInstance();
