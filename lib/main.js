(function() {
  'use strict';
  var CND, Common_mixin, GUY, HDML, SQL, badge, debug, echo, help, info, ref, rpr, urge, warn, whisper,
    boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-TABULATOR';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  // PATH                      = require 'path'
  GUY = require('guy');

  ({SQL} = GUY.str);

  ({HDML} = require('hdml'));

  ({Common_mixin} = require('./common-mixin'));

  //===========================================================================================================
  ref = this.Tabulator = class Tabulator extends Common_mixin() {
    constructor() {
      super(...arguments);
      //---------------------------------------------------------------------------------------------------------
      this.tabulate = this.tabulate.bind(this);
      //---------------------------------------------------------------------------------------------------------
      this.summarize = this.summarize.bind(this);
    }

    tabulate(cfg) {
      var R, d, field, fields, has_ths, i, key, keys, len, push_table_headers, ref1, row, row_nr, rows, title;
      boundMethodCheck(this, ref);
      cfg = this._add_field_defaults({...this.defaults.vgt_as_html_cfg, ...cfg});
      this.types.validate.vgt_as_html_cfg(cfg);
      ({fields, rows} = cfg);
      keys = null;
      R = [];
      row_nr = 0;
      has_ths = false;
      //.......................................................................................................
      push_table_headers = (row = null) => {
        var field, i, key, len, ref1, title;
        has_ths = true;
        keys = this._keys_from_keys_row_and_fields(cfg.keys, row, fields);
        if (keys.length === 0) {
          return;
        }
        R.push(HDML.open('tr'));
        for (i = 0, len = keys.length; i < len; i++) {
          key = keys[i];
          if ((field = fields[key]) != null) {
            if (field.hide) {
              continue;
            }
            title = (ref1 = field.title) != null ? ref1 : key;
          } else {
            title = key;
          }
          R.push(HDML.pair('th', {
            class: key
          }, HDML.text(title)));
        }
        R.push(HDML.close('tr'));
        return null;
      };
      //.......................................................................................................
      R.push(HDML.open('table', cfg.class != null ? {
        class: cfg.class
      } : null));
//.......................................................................................................
      for (row of rows) {
        row_nr++;
        if (row_nr === 1) {
          push_table_headers(row);
        }
        //.....................................................................................................
        R.push(HDML.open('tr'));
        for (i = 0, len = keys.length; i < len; i++) {
          key = keys[i];
          field = (ref1 = fields[key]) != null ? ref1 : null;
          if ((title = this._title_from_field_and_key(field, key)) == null) {
            continue;
          }
          //...................................................................................................
          d = {key, row_nr, row, field};
          d = this._set_value(cfg, row, field, key, d);
          R.push(this._td_from_details(d));
        }
        //.....................................................................................................
        R.push(HDML.close('tr'));
      }
      if (!has_ths) {
        //.......................................................................................................
        push_table_headers(null);
      }
      R.push(HDML.close('table'));
      return R.join('\n');
    }

    summarize(cfg) {
      var R, d, field, fields, i, key, keys, len, row, td, title, value;
      boundMethodCheck(this, ref);
      cfg = this._add_field_defaults({...this.defaults.vgt_row_as_subtable_html_cfg, ...cfg});
      this.types.validate.vgt_row_as_subtable_html_cfg(cfg);
      row = (this.types.isa.object(cfg.row)) ? cfg.row : JSON.parse(cfg.row);
      ({fields} = cfg);
      keys = this._keys_from_keys_row_and_fields(cfg.keys, row, fields);
      R = [];
      R.push(HDML.open('table', cfg.class != null ? {
        class: cfg.class
      } : null));
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        field = fields[key];
        if ((title = this._title_from_field_and_key(field, key)) == null) {
          continue;
        }
        d = {key, row, field};
        d = this._set_value(cfg, row, field, key, d);
        //.....................................................................................................
        value = row[key];
        td = this._td_from_details(d);
        R.push(HDML.pair('tr', (HDML.pair('th', HDML.text(title))) + td));
      }
      R.push(HDML.close('table'));
      return R.join('\n');
    }

    //---------------------------------------------------------------------------------------------------------
    _add_field_defaults(cfg) {
      var fields, key, value;
      fields = {...cfg.fields};
      for (key in fields) {
        value = fields[key];
        if (value === true) {
          value = {};
        }
        fields[key] = {...this.defaults.vgt_field_description_object, ...value};
        debug('^32243-1^', key, fields[key]);
      }
      cfg.fields = fields;
      return cfg;
    }

    //---------------------------------------------------------------------------------------------------------
    _keys_from_keys_row_and_fields(keys, row, fields) {
      return Object.keys((function() {
        switch (keys) {
          case 'row,cfg':
            return {...row, ...fields};
          case 'cfg,row':
            return {...fields, ...row};
          case 'row':
            return row;
          case 'cfg':
            return fields;
        }
      })());
    }

    //---------------------------------------------------------------------------------------------------------
    _title_from_field_and_key(field, key) {
      var ref1;
      if (field != null) {
        if (field.hide) {
          return null;
        }
        return (ref1 = field.title) != null ? ref1 : key;
      }
      return key;
    }

    //---------------------------------------------------------------------------------------------------------
    _set_value(cfg, row, field, key, d) {
      var ref1;
      d.raw_value = row[key];
      d.value = d.raw_value;
      if (d.value === void 0) {
        d.value = (ref1 = field != null ? field.undefined : void 0) != null ? ref1 : cfg.undefined;
      }
      return d;
    }

    //---------------------------------------------------------------------------------------------------------
    _td_from_details(d) {
      var ref1, ref2;
      if (((ref1 = d.field) != null ? ref1.outer_html : void 0) != null) {
        return d.field.outer_html(d);
      } else if (((ref2 = d.field) != null ? ref2.inner_html : void 0) != null) {
        return HDML.pair('td', {
          class: d.key
        }, d.field.inner_html(d));
      }
      if (!this.types.isa.text(d.value)) {
        d.value = rpr(d.value);
      }
      return HDML.pair('td', {
        class: d.key
      }, HDML.text(d.value));
    }

  };

  //###########################################################################################################
  this.TABULATOR = new this.Tabulator();

  this.tabulate = this.TABULATOR.tabulate;

  this.summarize = this.TABULATOR.summarize;

}).call(this);

//# sourceMappingURL=main.js.map