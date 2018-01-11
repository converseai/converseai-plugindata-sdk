
module.exports = (function(){

  const CONVERSEAI_PLUGINDATA_HOST = 'CONVERSEAI_PLUGINDATA_HOST';

  if (!process.env[CONVERSEAI_PLUGINDATA_HOST]) {
    throw `Environment variable ${ CONVERSEAI_PLUGINDATA_HOST } does not exist.`;
  }

  const client = require('@converseai/plugindata')(process.env[CONVERSEAI_PLUGINDATA_HOST]);

  var promiseOrCallback = function(call, data, callback) {
    if (callback !== undefined) {
      client[call](data, (err, response) => {
        if (response !== undefined && response.error !== undefined && response.error !== null) {
          err = response.error;
        }
        callback(err, response);
      });
    } else {
      return new Promise(function(resolve, reject){
       client[call](data, function(err, response){
         if (response !== undefined && response.error !== undefined && response.error !== null) {
           err = response.error;
         }

         if (err !== undefined && err !== null) {
           return reject(err);
         }

         resolve(response);
       });
     });
    }
  }

  class PluginOAuth2Info {
    constructor(caller) {
      this.caller = caller;
    }

    get(type, callback) {
      return promiseOrCallback('getPluginOAuth2Info', {
        caller: this.caller,
        oAuthType: type
      }, callback);
    }

    update(type, data, callback) {
      return promiseOrCallback('updatePluginOAuth2Info', {
        caller: this.caller,
        oAuthType: type,
        oAuth2Data: data
      }, callback);
    }

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

  class PluginLocalData {
    constructor(caller) {
      this.caller = caller;
    }

    fetch(key, scope = PluginLocalData.SCOPE_USER, callback) {
      return promiseOrCallback('getPluginLocalData', {
        caller: this.caller,
        scope: scope,
        key: key
      }, callback);
    }

    store(key, value, scope = PluginLocalData.SCOPE_USER, callback) {
      return promiseOrCallback('storePluginLocalData', {
        caller: this.caller,
        scope: scope,
        key: key,
        data: value
      }, callback);
    }

    delete(key, scope = PluginLocalData.SCOPE_USER, callback) {
      return promiseOrCallback('storePluginLocalData', {
        caller: this.caller,
        scope: scope,
        key: key,
        data: null
      }, callback);
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
