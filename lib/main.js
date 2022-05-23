(function() {
  'use strict';
  var CND, Common_mixin, GUY, HDML, SQL, badge, debug, echo, help, info, rpr, urge, warn, whisper;

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
  this.Tabulator = class Tabulator extends Common_mixin() {
    //---------------------------------------------------------------------------------------------------------
    as_html(cfg) {
      cfg = {...this.defaults.vgt_as_html_cfg, ...cfg};
      this.types.validate.vgt_as_html_cfg(cfg);
      return this._table_as_html(cfg);
    }

    //---------------------------------------------------------------------------------------------------------
    _fields_from_cfg(cfg) {
      var R, key, value;
      R = {...cfg.fields};
      for (key in R) {
        value = R[key];
        if (value === true) {
          value = {};
        }
        R[key] = {...this.defaults.vgt_field_description_object, ...value};
      }
      return R;
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
      var ref;
      if (field != null) {
        if (field.display === false) {
          return null;
        }
        return (ref = field.title) != null ? ref : key;
      }
      return key;
    }

    //---------------------------------------------------------------------------------------------------------
    _raw_value_and_value_from_cfg_row_field_and_key(cfg, row, field, key, details) {
      var raw_value, ref, value;
      raw_value = row[key];
      details.raw_value = raw_value;
      value = raw_value;
      if (value === void 0) {
        value = (ref = field != null ? field.undefined : void 0) != null ? ref : cfg.undefined;
      }
      if ((field != null ? field.value : void 0) != null) {
        value = field.value(value, details);
      }
      return {raw_value, value};
    }

    //---------------------------------------------------------------------------------------------------------
    _td_from_field_key_value_and_details(field, key, value, details) {
      if ((field != null ? field.outer_html : void 0) != null) {
        return field.outer_html(value, details);
      } else if ((field != null ? field.inner_html : void 0) != null) {
        return HDML.pair('td', {
          class: key
        }, field.inner_html(value, details));
      }
      if (!this.types.isa.text(value)) {
        value = rpr(value);
      }
      return HDML.pair('td', {
        class: key
      }, HDML.text(value));
    }

    //---------------------------------------------------------------------------------------------------------
    _table_as_html(cfg) {
      var R, details, field, fields, has_ths, i, key, keys, len, push_table_headers, raw_value, ref, row, row_nr, rows, title, value;
      ({rows} = cfg);
      fields = this._fields_from_cfg(cfg);
      keys = null;
      R = [];
      row_nr = 0;
      has_ths = false;
      //.......................................................................................................
      push_table_headers = (row = null) => {
        var field, i, key, len, ref, title;
        has_ths = true;
        keys = this._keys_from_keys_row_and_fields(cfg.keys, row, fields);
        if (keys.length === 0) {
          return;
        }
        R.push(HDML.open('tr'));
        for (i = 0, len = keys.length; i < len; i++) {
          key = keys[i];
          if ((field = fields[key]) != null) {
            if (field.display === false) {
              continue;
            }
            title = (ref = field.title) != null ? ref : key;
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
          field = (ref = fields[key]) != null ? ref : null;
          if ((title = this._title_from_field_and_key(field, key)) == null) {
            continue;
          }
          //...................................................................................................
          details = {key, row_nr, row};
          ({raw_value, value} = this._raw_value_and_value_from_cfg_row_field_and_key(cfg, row, field, key, details));
          R.push(this._td_from_field_key_value_and_details(field, key, value, details));
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

    //---------------------------------------------------------------------------------------------------------
    row_as_subtable_html(cfg) {
      var R, details, field, fields, i, key, keys, len, raw_value, row, td, title, value;
      cfg = {...this.defaults.vgt_row_as_subtable_html_cfg, ...cfg};
      this.types.validate.vgt_row_as_subtable_html_cfg(cfg);
      row = (this.types.isa.object(cfg.row)) ? cfg.row : JSON.parse(cfg.row);
      fields = this._fields_from_cfg(cfg);
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
        details = {key, row};
        ({raw_value, value} = this._raw_value_and_value_from_cfg_row_field_and_key(cfg, row, field, key, details));
        //.....................................................................................................
        value = row[key];
        td = this._td_from_field_key_value_and_details(field, key, value, details);
        R.push(HDML.pair('tr', (HDML.pair('th', HDML.text(key))) + td));
      }
      R.push(HDML.close('table'));
      return R.join('\n');
    }

    //---------------------------------------------------------------------------------------------------------
    _get_table_name(name) {
      this.types.validate.nonempty_text(name);
      if (name.startsWith('_')) {
        return `_${this.cfg.prefix}_${name.slice(1)}`;
      }
      return `${this.cfg.prefix}_${name}`;
    }

  };

}).call(this);

//# sourceMappingURL=main.js.map