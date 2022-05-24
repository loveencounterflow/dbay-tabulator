(function() {
  'use strict';
  var CND, GUY, alert, badge, debug, help, info, jr, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/TYPES';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  jr = JSON.stringify;

  GUY = require('guy');

  this.types = new (require('intertype')).Intertype();

  this.defaults = {};

  //===========================================================================================================
  // HTML
  //-----------------------------------------------------------------------------------------------------------
  /* thx to https://stackoverflow.com/a/32538867/7568091 */
  this.types.declare('vgt_iterable', {
    tests: {
      "( @isa.list x ) or ( x? and @isa.function x[ Symbol.iterator ] )": function(x) {
        return (this.isa.list(x)) || ((x != null) && this.isa.function(x[Symbol.iterator]));
      }
    }
  });

  this.types.declare('vgt_iterable_no_text', {
    tests: {
      "not @isa.text x": function(x) {
        return !this.isa.text(x);
      },
      "@isa.vgt_iterable x": function(x) {
        return this.isa.vgt_iterable(x);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('vgt_row_as_subtable_html_row', {
    tests: {
      "( @isa.nonempty_text x ) or ( @isa.object x )": function(x) {
        return (this.isa.nonempty_text(x)) || (this.isa.object(x));
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('vgt_as_html_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa.vgt_as_html_keys x.keys": function(x) {
        return this.isa.vgt_as_html_keys(x.keys);
      },
      "@isa_optional.vgt_fieldset_cfg x.fields": function(x) {
        return this.isa_optional.vgt_fieldset_cfg(x.fields);
      },
      "@isa_optional.notunset x.undefined": function(x) {
        return this.isa_optional.notunset(x.undefined);
      },
      "@isa.unset x.table": function(x) {
        return this.isa.unset(x.table);
      },
      "@isa.unset x.query": function(x) {
        return this.isa.unset(x.query);
      },
      "@isa.unset x.parameters": function(x) {
        return this.isa.unset(x.parameters);
      },
      "@isa.vgt_iterable_no_text x.rows": function(x) {
        return this.isa.vgt_iterable_no_text(x.rows);
      }
    }
  });

  //...........................................................................................................
  this.defaults.vgt_as_html_cfg = {
    rows: null,
    undefined: void 0,
    class: null,
    keys: 'row,cfg',
    fields: GUY.lft.freeze({})
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('vgt_row_as_subtable_html_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa.vgt_as_html_keys x.keys": function(x) {
        return this.isa.vgt_as_html_keys(x.keys);
      },
      "@isa_optional.vgt_fieldset_cfg x.fields": function(x) {
        return this.isa_optional.vgt_fieldset_cfg(x.fields);
      },
      "@isa_optional.object x.parameters": function(x) {
        return this.isa_optional.object(x.parameters);
      },
      "@isa_optional.notunset x.undefined": function(x) {
        return this.isa_optional.notunset(x.undefined);
      },
      "@isa.unset x.table": function(x) {
        return this.isa.unset(x.table);
      },
      "@isa.unset x.query": function(x) {
        return this.isa.unset(x.query);
      },
      "@isa.unset x.parameters": function(x) {
        return this.isa.unset(x.parameters);
      },
      "@isa.vgt_row_as_subtable_html_row x.row": function(x) {
        return this.isa.vgt_row_as_subtable_html_row(x.row);
      }
    }
  });

  //...........................................................................................................
  this.defaults.vgt_row_as_subtable_html_cfg = {
    row: null,
    undefined: void 0,
    class: null,
    keys: 'row,cfg',
    fields: GUY.lft.freeze({})
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('vgt_fieldset_cfg', {
    tests: {
      "each value is a vgt_field_description": function(x) {
        var _, value;
        for (_ in x) {
          value = x[_];
          if (!this.isa.vgt_field_description(value)) {
            return false;
          }
        }
        return true;
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('vgt_field_description', {
    tests: {
      "( x is true ) or ( @isa.vgt_field_description_object x )": function(x) {
        return (x === true) || (this.isa.vgt_field_description_object(x));
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('vgt_field_description_object', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa_optional.function x.value": function(x) {
        return this.isa_optional.function(x.value);
      },
      "@isa_optional.function x.outer_html": function(x) {
        return this.isa_optional.function(x.outer_html);
      },
      "@isa_optional.function x.inner_html": function(x) {
        return this.isa_optional.function(x.inner_html);
      },
      "@isa_optional.notunset x.undefined": function(x) {
        return this.isa_optional.notunset(x.undefined);
      },
      "can only have one of x.inner_html, x.outer_html": function(x) {
        return !((x.inner_html != null) && (x.outer_html != null));
      },
      "@isa_optional.text x.title": function(x) {
        return this.isa_optional.text(x.title);
      },
      "@isa_optional.boolean x.display": function(x) {
        return this.isa_optional.boolean(x.display);
      }
    }
  });

  //...........................................................................................................
  this.defaults.vgt_field_description_object = {
    value: null,
    outer_html: null,
    inner_html: null,
    undefined: void 0,
    title: null,
    display: null
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('vgt_as_html_keys', {
    tests: {
      "x in [ 'row,cfg', 'cfg,row', 'row', 'cfg', ]": function(x) {
        return x === 'row,cfg' || x === 'cfg,row' || x === 'row' || x === 'cfg';
      }
    }
  });

}).call(this);

//# sourceMappingURL=types.js.map