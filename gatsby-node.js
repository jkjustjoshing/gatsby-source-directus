'use strict';

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _process = require('./process');

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gatsbySourceFilesystem = require('gatsby-source-filesystem');

var _graphql = require('gatsby/graphql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _url = '';
var _apiKey = '';
var _version = '1.1';
var _requestParams = {
    depth: 1
};
var _fileRequestParams = {};
var _auth = {};

exports.sourceNodes = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, _ref2) {
        var boundActionCreators = _ref.boundActionCreators,
            getNode = _ref.getNode,
            store = _ref.store,
            cache = _ref.cache,
            createNodeId = _ref.createNodeId;
        var url = _ref2.url,
            protocol = _ref2.protocol,
            apiKey = _ref2.apiKey,
            version = _ref2.version,
            nameExceptions = _ref2.nameExceptions,
            requestParams = _ref2.requestParams,
            fileRequestParams = _ref2.fileRequestParams,
            auth = _ref2.auth;

        var createNode, fetcher, allFilesData, filesDownloaded, allFiles, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fileData, fileNode, localFileNode, semanticName, newAbsolutePath, allTablesData, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, tableData, tableNode, tableItems, name, ItemNode, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, tableItemData, tableItemNode;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        createNode = boundActionCreators.createNode;


                        protocol = protocol !== undefined && protocol !== '' ? protocol : 'http';
                        protocol = protocol + "://";

                        // Trim any trailing slashes from the URL
                        url = url.replace(/\/$/, "");

                        // Assign the version
                        _version = version !== undefined && version !== '' ? version : _version;

                        // Merge the URL with a protocol
                        _url = protocol + url + ('/api/' + _version + '/');

                        // Assign the API key
                        _apiKey = apiKey;

                        // Set request parameters
                        _requestParams = requestParams || _requestParams;

                        // Set parameters for file fetching
                        _fileRequestParams = fileRequestParams || _fileRequestParams;

                        // Set htaccess auth for file download
                        _auth = auth || _auth;

                        // Initialize the Fetcher class with API key and URL
                        fetcher = new _fetch2.default(_apiKey, _url, _version, _requestParams, _fileRequestParams);


                        console.log('gatsby-source-directus'.cyan, 'Fetching Directus files data...');

                        _context.next = 14;
                        return fetcher.getAllFiles();

                    case 14:
                        allFilesData = _context.sent;


                        console.log('gatsby-source-directus'.blue, 'success'.green, 'Fetched', allFilesData.length.toString().yellow, 'files from Directus.');
                        console.log('gatsby-source-directus'.cyan, 'Downloading Directus files...');

                        filesDownloaded = 0, allFiles = [];
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 21;
                        _iterator = allFilesData[Symbol.iterator]();

                    case 23:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 51;
                            break;
                        }

                        fileData = _step.value;
                        fileNode = (0, _process.FileNode)(fileData);
                        localFileNode = void 0;
                        _context.prev = 27;
                        _context.next = 30;
                        return (0, _gatsbySourceFilesystem.createRemoteFileNode)({
                            url: protocol + url + fileNode.url,
                            store: store,
                            cache: cache,
                            createNode: createNode,
                            createNodeId: createNodeId,
                            auth: _auth
                        });

                    case 30:
                        localFileNode = _context.sent;


                        // Move file to semantic name, within hash folder
                        semanticName = (fileNode.title || localFileNode.name).replace(/[^a-z0-9]/gi, '_');
                        newAbsolutePath = _path2.default.join(localFileNode.dir, semanticName + localFileNode.ext);
                        _context.next = 35;
                        return _fsExtra2.default.move(localFileNode.absolutePath, newAbsolutePath, {
                            overwrite: true
                        });

                    case 35:

                        // Rewrite the gatsby-source-filesystem "File" node to reflect the new path
                        localFileNode.absolutePath = newAbsolutePath;
                        localFileNode.base = semanticName + localFileNode.ext;
                        localFileNode.name = semanticName;
                        localFileNode.relativeDirectory = _path2.default.relative(process.cwd(), localFileNode.dir);
                        localFileNode.relativePath = _path2.default.join(localFileNode.relativeDirectory, localFileNode.base);
                        _context.next = 45;
                        break;

                    case 42:
                        _context.prev = 42;
                        _context.t0 = _context['catch'](27);

                        console.error('\ngatsby-source-directus'.blue, 'error'.red, 'gatsby-source-directus: An error occurred while downloading the files.', _context.t0);

                    case 45:

                        if (localFileNode) {
                            filesDownloaded++;
                            fileNode.localFile___NODE = localFileNode.id;

                            // When `gatsby-source-filesystem` creates the file nodes, all reference
                            // to the original data source is wiped out. This object links the
                            // directus reference (that's used by other objects to reference files)
                            // to the gatsby reference (that's accessible in GraphQL queries). Then,
                            // when each table row is created (in ./process.js), if a file is on a row
                            // we find it in this array and put the Gatsby URL on the directus node.
                            //
                            // This is a hacky solution, but it does the trick for very basic raw file capture
                            // TODO see if we can implement gatsby-transformer-sharp style queries
                            allFiles.push({
                                directus: fileNode,
                                gatsby: localFileNode
                            });
                        }

                        _context.next = 48;
                        return createNode(fileNode);

                    case 48:
                        _iteratorNormalCompletion = true;
                        _context.next = 23;
                        break;

                    case 51:
                        _context.next = 57;
                        break;

                    case 53:
                        _context.prev = 53;
                        _context.t1 = _context['catch'](21);
                        _didIteratorError = true;
                        _iteratorError = _context.t1;

                    case 57:
                        _context.prev = 57;
                        _context.prev = 58;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 60:
                        _context.prev = 60;

                        if (!_didIteratorError) {
                            _context.next = 63;
                            break;
                        }

                        throw _iteratorError;

                    case 63:
                        return _context.finish(60);

                    case 64:
                        return _context.finish(57);

                    case 65:

                        if (filesDownloaded === allFilesData.length) {
                            console.log('gatsby-source-directus'.blue, 'success'.green, 'Downloaded all', filesDownloaded.toString().yellow, 'files from Directus.');
                        } else {
                            console.log('gatsby-source-directus'.blue, 'warning'.yellow, 'skipped', (filesDownloaded - allFilesData.length).toString().yellow, 'files from downloading');
                        }

                        console.log('gatsby-source-directus'.cyan, 'Fetching Directus tables data...');

                        // Fetch all the tables with data from Directus in a raw format
                        _context.next = 69;
                        return fetcher.getAllTablesData();

                    case 69:
                        allTablesData = _context.sent;


                        console.log('gatsby-source-directus'.blue, 'success'.green, 'Fetched', allTablesData.length.toString().yellow, 'tables from Directus.');

                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context.prev = 74;
                        _iterator2 = allTablesData[Symbol.iterator]();

                    case 76:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context.next = 123;
                            break;
                        }

                        tableData = _step2.value;
                        tableNode = (0, _process.TableNode)(tableData);
                        _context.next = 81;
                        return createNode(tableNode);

                    case 81:
                        _context.next = 83;
                        return fetcher.getAllItemsForTable(tableData.name);

                    case 83:
                        tableItems = _context.sent;

                        console.log('gatsby-source-directus'.blue, 'success'.green, 'Fetched', tableItems.length.toString().cyan, 'items for ', tableData.name.cyan, ' table...');

                        // Get the name for this node type
                        name = (0, _process.getNodeTypeNameForTable)(tableData.name, nameExceptions);

                        console.log('gatsby-source-directus'.blue, 'info'.cyan, 'Generating Directus' + name + ' node type...');

                        // We're creating a separate Item Type for every table
                        ItemNode = (0, _process.createTableItemFactory)(name, allFiles);

                        if (!(tableItems && tableItems.length > 0)) {
                            _context.next = 119;
                            break;
                        }

                        // Get all the items for the table above and create a gatsby node for it
                        _iteratorNormalCompletion3 = true;
                        _didIteratorError3 = false;
                        _iteratorError3 = undefined;
                        _context.prev = 92;
                        _iterator3 = tableItems[Symbol.iterator]();

                    case 94:
                        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                            _context.next = 102;
                            break;
                        }

                        tableItemData = _step3.value;

                        // Create a Table Item node based on the API response
                        tableItemNode = ItemNode(tableItemData, {
                            parent: tableNode.id
                        });

                        // Pass it to Gatsby to create a node

                        _context.next = 99;
                        return createNode(tableItemNode);

                    case 99:
                        _iteratorNormalCompletion3 = true;
                        _context.next = 94;
                        break;

                    case 102:
                        _context.next = 108;
                        break;

                    case 104:
                        _context.prev = 104;
                        _context.t2 = _context['catch'](92);
                        _didIteratorError3 = true;
                        _iteratorError3 = _context.t2;

                    case 108:
                        _context.prev = 108;
                        _context.prev = 109;

                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }

                    case 111:
                        _context.prev = 111;

                        if (!_didIteratorError3) {
                            _context.next = 114;
                            break;
                        }

                        throw _iteratorError3;

                    case 114:
                        return _context.finish(111);

                    case 115:
                        return _context.finish(108);

                    case 116:
                        console.log('gatsby-source-directus'.blue, 'success'.green, 'Directus' + name + ' node generated');
                        _context.next = 120;
                        break;

                    case 119:
                        console.log('gatsby-source-directus'.blue, 'warning'.yellow, tableData.name + ' table has no rows. Skipping...');

                    case 120:
                        _iteratorNormalCompletion2 = true;
                        _context.next = 76;
                        break;

                    case 123:
                        _context.next = 129;
                        break;

                    case 125:
                        _context.prev = 125;
                        _context.t3 = _context['catch'](74);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context.t3;

                    case 129:
                        _context.prev = 129;
                        _context.prev = 130;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 132:
                        _context.prev = 132;

                        if (!_didIteratorError2) {
                            _context.next = 135;
                            break;
                        }

                        throw _iteratorError2;

                    case 135:
                        return _context.finish(132);

                    case 136:
                        return _context.finish(129);

                    case 137:

                        console.log("AFTER");

                    case 138:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[21, 53, 57, 65], [27, 42], [58,, 60, 64], [74, 125, 129, 137], [92, 104, 108, 116], [109,, 111, 115], [130,, 132, 136]]);
    }));

    return function (_x, _x2) {
        return _ref3.apply(this, arguments);
    };
}();

// This is mostly copied from `gatsby-source-filesystem. However, it removes the hash from the filename,
// since it's guaranteed that the file is alone in its directory with gatsby-source-filesystem v2.0.12
exports.setFieldsOnGraphQLNodeType = function (_ref4) {
    var type = _ref4.type,
        getNodeAndSavePathDependency = _ref4.getNodeAndSavePathDependency,
        _ref4$pathPrefix = _ref4.pathPrefix,
        pathPrefix = _ref4$pathPrefix === undefined ? '' : _ref4$pathPrefix;

    if (type.name !== 'File') {
        return {};
    }

    return {
        publicURL: {
            type: _graphql.GraphQLString,
            args: {},
            description: 'Copy file to static directory and return public url to it',
            resolve: function resolve(file, fieldArgs, context) {
                var details = getNodeAndSavePathDependency(file.id, context.path);
                var fileName = '' + file.name + details.ext;
                var publicPath = _path2.default.join(process.cwd(), 'public', 'static', file.internal.contentDigest, fileName);

                if (!_fsExtra2.default.existsSync(publicPath)) {
                    _fsExtra2.default.copy(details.absolutePath, publicPath, function (err) {
                        if (err) {
                            console.error('error copying file from ' + details.absolutePath + ' to ' + publicPath, err);
                        }
                    });
                }

                return pathPrefix + '/static/' + file.internal.contentDigest + '/' + fileName;
            }
        }
    };
};