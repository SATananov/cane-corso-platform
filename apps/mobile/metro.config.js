const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const workspacePackagesRoot = path.resolve(workspaceRoot, 'packages');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function pathToPattern(value) {
  return value
    .split(/[\\/]+/)
    .filter(Boolean)
    .map(escapeRegex)
    .join('[/\\\\]');
}

function blockedPathRegex(relativePath) {
  const absolutePath = path.resolve(workspaceRoot, relativePath);
  return new RegExp(`^${pathToPattern(absolutePath)}([/\\\\].*)?$`);
}

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspacePackagesRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;
config.resolver.unstable_enableSymlinks = true;
config.resolver.blockList = exclusionList([
  blockedPathRegex('apps/web/.next'),
  blockedPathRegex('apps/web/node_modules'),
  blockedPathRegex('.git'),
  blockedPathRegex('.turbo'),
]);

module.exports = config;
