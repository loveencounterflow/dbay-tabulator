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
      var R, details, field, fields, has_ths, i, key, keys, len, push_table_headers, ref, row, row_nr, rows, title;
      cfg = {...this.defaults.vgt_as_html_cfg, ...cfg};
      this.types.validate.vgt_as_html_cfg(cfg);
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
          details = {key, row_nr, row, field};
          details = this._set_value(cfg, row, field, key, details);
          R.push(this._td_from_details(details));
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
      var R, details, field, fields, i, key, keys, len, row, td, title, value;
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
        details = {key, row, field};
        details = this._set_value(cfg, row, field, key, details);
        debug('^35345^', details);
        //.....................................................................................................
        value = row[key];
        td = this._td_from_details(details);
        R.push(HDML.pair('tr', (HDML.pair('th', HDML.text(title))) + td));
      }
      R.push(HDML.close('table'));
      return R.join('\n');
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
    _set_value(cfg, row, field, key, details) {
      var ref;
      details.raw_value = row[key];
      details.value = details.raw_value;
      if (details.value === void 0) {
        details.value = (ref = field != null ? field.undefined : void 0) != null ? ref : cfg.undefined;
      }
      return details;
    }

    //---------------------------------------------------------------------------------------------------------
    _td_from_details(details) {
      var ref, ref1;
      if (((ref = details.field) != null ? ref.outer_html : void 0) != null) {
        return details.field.outer_html(details.value, details);
      } else if (((ref1 = details.field) != null ? ref1.inner_html : void 0) != null) {
        return HDML.pair('td', {
          class: details.key
        }, details.field.inner_html(details.value, details));
      }
      if (!this.types.isa.text(details.value)) {
        details.value = rpr(details.value);
      }
      return HDML.pair('td', {
        class: details.key
      }, HDML.text(details.value));
    }

  };

  //###########################################################################################################
  this.TABULATOR = new this.Tabulator();

}).call(this);

//# sourceMappingURL=main.js.map