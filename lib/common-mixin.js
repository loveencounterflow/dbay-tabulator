(function() {
  'use strict';
  var CND, GUY, _types, badge, debug, echo, help, info, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-TABULATOR/COMMON';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  GUY = require('guy');

  _types = require('./types');

  //===========================================================================================================
  this.Common_mixin = (clasz = Object) => {
    return class extends clasz {
      //---------------------------------------------------------------------------------------------------------
      constructor() {
        super();
        GUY.props.hide(this, 'types', _types.types);
        GUY.props.hide(this, 'defaults', _types.defaults);
        return void 0;
      }

    };
  };

}).call(this);

//# sourceMappingURL=common-mixin.js.map