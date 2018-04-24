module.exports = (function () {

  const CONVERSEAI_PLUGINDATA_HOST = 'CONVERSEAI_PLUGINDATA_HOST';

  if (!process.env[CONVERSEAI_PLUGINDATA_HOST]) {
    throw `Environment variable ${ CONVERSEAI_PLUGINDATA_HOST } does not exist.`;
  }

  const client = require('@converseai/plugindata')(process.env[CONVERSEAI_PLUGINDATA_HOST]);

  var promiseOrCallback = function (call, data, callback, convert = noConvertResponse) {
    if (callback !== undefined) {
      client[call](data, (err, response) => {
        if (response !== undefined && response.error !== undefined && response.error !== null) {
          err = response.error;
        }
        callback(err, convert(response));
      });
    } else {
      return new Promise(function (resolve, reject) {
        client[call](data, function (err, response) {
          if (response !== undefined && response.error !== undefined && response.error !== null) {
            err = response.error;
          }

          if (err !== undefined && err !== null) {
            return reject(err);
          }

          resolve(convert(response));
        });
      });
    }
  }

  var noConvertResponse = function (response) {
    return response;
  }

  var jsonConvertResponse = function (response) {
    if (response !== undefined) {
      if (response.data !== undefined && response.data !== null && response.data.length > 0) {
        // response.data is stored a Node.js Buffer and therefore must be
        // converted to a utf8 string before parsed as JSON.
        var data = response.data.toString('utf8');
        if (data !== undefined && data !== null && data !== '') {
          response.data = JSON.parse(data);
        }
      } else {
        response.data = undefined;
      }
    }
    return response;
  }

  class PluginOAuth2Info {
    constructor(caller) {
      this.caller = caller;
    }

    /**
     * Gets the OAuth2 information.
     * @param {Number} type use PluginOAuth2Info.OAUTH_USER or PluginOAuth2Info.OAUTH_PROVIDER
     * @param {Function} [callback]
     *
     * @returns {Promise} If no callback argument was given then a promise is returned.
     */
    get(type, callback) {
      return promiseOrCallback('getPluginOAuth2Info', {
        caller: this.caller,
        oAuthType: type
      }, callback);
    }


    /**
     * Create the OAuth2 information.
     *
     * @param {Number} type use PluginOAuth2Info.OAUTH_USER or PluginOAuth2Info.OAUTH_PROVIDER
     * @param {String} data.access_token
     * @param {String} data.token_type
     * @param {string} data.refresh_token
     * @param {Number} data.expires_in
     * @param {String} data.grant_type
     * @param {Object<String, String>} data.metadata
     * @param {String} data.redirect_uri
     * @param {Function} [callback]
     * @returns {Promise} If no callback argument was given then a promise is returned.
     */
    create(type, data, callback) {
      return promiseOrCallback('createPluginOAuth2Info', {
        caller: this.caller,
        oAuthType: type,
        oAuth2Data: data
      }, callback);
    }

    /**
     * Update the OAuth2 information.
     *
     * @param {Number} type use PluginOAuth2Info.OAUTH_USER or PluginOAuth2Info.OAUTH_PROVIDER
     * @param {String} data.access_token
     * @param {String} data.token_type
     * @param {string} data.refresh_token
     * @param {Number} data.expires_in
     * @param {String} data.grant_type
     * @param {Object<String, String>} data.metadata
     * @param {String} data.redirect_uri
     * @param {Function} [callback]
     * @returns {Promise} If no callback argument was given then a promise is returned.
     */
    update(type, data, callback) {
      return promiseOrCallback('updatePluginOAuth2Info', {
        caller: this.caller,
        oAuthType: type,
        oAuth2Data: data
      }, callback);
    }

    /**
     * Delete the OAuth2 information.
     *
     * @param {Number} type use PluginOAuth2Info.OAUTH_USER or PluginOAuth2Info.OAUTH_PROVIDER
     * @param {Function} [callback]
     * @returns {Promise} If no callback argument was given then a promise is returned.
     */
    delete(type, callback) {
      return promiseOrCallback('deletePluginOAuth2Info', {
        caller: this.caller,
        oAuthType: type
      }, callback);
    }

    static get OAUTH_USER() {
      return 0;
    }

    static get OAUTH_PROVIDER() {
      return 1;
    }
  }

  var flattenScope = function (scope) {
    if (scope !== null && typeof scope === 'object') {
      return scope;
    }
    return {
      scope: scope
    };
  }

  class PluginLocalData {
    constructor(caller) {
      this.caller = caller;
    }

    /**
     * Fetch Local Storage information on Converse.AI.
     * @param {String} key the key of the key-value pair.
     * @param {Number|Object} scope use PluginLocalData.SCOPE_USER or PluginLocalData.SCOPE_PROVIDER or an object with properties `scope` and `uuid`.
     * @param {Function} [callback]
     *
     * @returns {Promise} If no callback argument was given then a promise is returned.
     */
    fetch(key, scope = PluginLocalData.SCOPE_USER, callback) {
      var scopeObj = flattenScope(scope);
      return promiseOrCallback('getPluginLocalData', {
        caller: this.caller,
        scope: scopeObj.scope,
        scopeUUID: scopeObj.uuid,
        key: key
      }, callback, jsonConvertResponse);
    }

    /**
     * Store Local Storage information on Converse.AI.
     * @param {String} key the key of the key-value pair.
     * @param {Object} value the value of the key-value pair.
     * @param {Number|Object} scope use PluginLocalData.SCOPE_USER or PluginLocalData.SCOPE_PROVIDER or an object with properties `scope` and `uuid`.
     * @param {Function} [callback]
     *
     * @returns {Promise} If no callback argument was given then a promise is returned.
     */
    store(key, value, scope = PluginLocalData.SCOPE_USER, callback) {
      var scopeObj = flattenScope(scope);
      return promiseOrCallback('storePluginLocalData', {
        caller: this.caller,
        scope: scopeObj.scope,
        scopeUUID: scopeObj.uuid,
        key: key,
        data: Buffer.from(JSON.stringify(value))
      }, callback, jsonConvertResponse);
    }

    /**
     * Delete Local Storage information on Converse.AI.
     * @param {String} key the key of the key-value pair.
     * @param {Number|Object} scope use PluginLocalData.SCOPE_USER or PluginLocalData.SCOPE_PROVIDER or an object with properties `scope` and `uuid`.
     * @param {Function} [callback]
     *
     * @returns {Promise} If no callback argument was given then a promise is returned.
     */
    delete(key, scope = PluginLocalData.SCOPE_USER, callback) {
      var scopeObj = flattenScope(scope);
      return promiseOrCallback('storePluginLocalData', {
        caller: this.caller,
        scope: scopeObj.scope,
        scopeUUID: scopeObj.uuid,
        key: key,
        data: Buffer.from(JSON.stringify({}))
      }, callback, jsonConvertResponse);
    }

    static get SCOPE_PROVIDER() {
      return 0;
    }

    static get SCOPE_USER() {
      return 1;
    }

    // TODO: THESE VARIABLES WILL DO NOTHING ON THE CONVERSE.AI PLATFORM.
    // static get SCOPE_REQUEST() {
    //   return 2;
    // }
    //
    // static get SCOPE_CONVERSATION() {
    //   return 3;
    // }
  }


  return {
    PluginLocalData: PluginLocalData,
    PluginOAuth2Info: PluginOAuth2Info
  }
})();