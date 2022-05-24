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
  this.types.declare('vgt_row_as_subtable_html_row', {
    tests: {
      "( @isa.nonempty_text x ) or ( @isa.object x )": function(x) {
        return (this.isa.nonempty_text(x)) || (this.isa.object(x));
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('_vgt_as_html_from_table_cfg', {
    tests: {
      "@isa.nonempty_text x.table": function(x) {
        return this.isa.nonempty_text(x.table);
      },
      "@isa.unset x.parameters": function(x) {
        return this.isa.unset(x.parameters);
      },
      "@isa.unset x.query": function(x) {
        return this.isa.unset(x.query);
      },
      "@isa.unset x.rows": function(x) {
        return this.isa.unset(x.rows);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('_vgt_as_html_from_query_cfg', {
    tests: {
      "@isa.notunset x.query": function(x) {
        return this.isa.notunset(x.query);
      },
      "@isa_optional.object x.parameters": function(x) {
        return this.isa_optional.object(x.parameters);
      },
      "@isa.unset x.table": function(x) {
        return this.isa.unset(x.table);
      },
      "@isa.unset x.rows": function(x) {
        return this.isa.unset(x.rows);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  /* thx to https://stackoverflow.com/a/32538867/7568091 */
  this.types.declare('vgt_iterable_no_text', {
    tests: {
      "not @isa.text x": function(x) {
        return !this.isa.text(x);
      },
      "( @isa.list x ) or ( x? and @isa.function x[ Symbol.iterator ] )": function(x) {
        return (this.isa.list(x)) || ((x != null) && this.isa.function(x[Symbol.iterator]));
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('_vgt_as_html_from_rows_cfg', {
    tests: {
      "@isa.list x.rows": function(x) {
        return this.isa.list(x.rows);
      },
      "@isa.unset x.parameters": function(x) {
        return this.isa.unset(x.parameters);
      },
      "@isa.unset x.query": function(x) {
        return this.isa.unset(x.query);
      },
      "@isa.unset x.table": function(x) {
        return this.isa.unset(x.table);
      },
      "@isa.vgt_iterable_no_text x.rows": function(x) {
        return this.isa.list(x.rows);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('_vgt_row_as_subtable_html_from_row_cfg', {
    tests: {
      "@isa.vgt_row_as_subtable_html_row x.row": function(x) {
        return this.isa.vgt_row_as_subtable_html_row(x.row);
      },
      "@isa.unset x.parameters": function(x) {
        return this.isa.unset(x.parameters);
      },
      "@isa.unset x.query": function(x) {
        return this.isa.unset(x.query);
      },
      "@isa.unset x.table": function(x) {
        return this.isa.unset(x.table);
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
      "@isa.unset x.parameters": function(x) {
        return this.isa.unset(x.parameters);
      },
      "must give `rows` but not any of table, query, parameters": function(x) {
        if (this.isa._vgt_as_html_from_table_cfg(x)) {
          return false;
        }
        if (this.isa._vgt_as_html_from_query_cfg(x)) {
          return false;
        }
        return this.isa._vgt_as_html_from_rows_cfg(x);
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
      "must give `row` but not any of table, query, parameters": function(x) {
        if (this.isa._vgt_as_html_from_table_cfg(x)) {
          return false;
        }
        if (this.isa._vgt_as_html_from_query_cfg(x)) {
          return false;
        }
        return this.isa._vgt_row_as_subtable_html_from_row_cfg(x);
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