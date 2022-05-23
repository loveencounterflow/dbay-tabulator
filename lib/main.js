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
      var ref, table_i;
      cfg = {...this.defaults.vgt_as_html_cfg, ...cfg};
      this.types.validate.vgt_as_html_cfg(cfg);
      if (cfg.table != null) {
        table_i = this.db.sql.I(cfg.table);
        cfg.rows = this.db(SQL`select * from ${table_i};`);
      } else if (cfg.query != null) {
        cfg.rows = this.db(cfg.query, (ref = cfg.parameters) != null ? ref : {});
      } else if (cfg.rows != null) {
        null;
      }
      return this._table_as_html(cfg);
    }

    // try return @_table_as_html cfg catch error then null
    // return error.message

      //---------------------------------------------------------------------------------------------------------
    _table_as_html(cfg) {
      /* TAINT move this to DBay */
      /* TAINT use SQL generation facility from DBay (TBW) */
      var R, as_html, details, field, fields, has_ths, i, inner_html, is_done, key, keys, len, push_table_headers, raw_value, ref, ref1, ref2, ref3, ref4, row, row_nr, rows, value;
      ({rows, fields} = cfg);
      fields = {...fields};
// for key, value of fields
//   if value is true then fields[ key ] = {}
      for (key in fields) {
        value = fields[key];
        if (value === true) {
          value = {};
        }
        fields[key] = {...this.defaults.vgt_field_description_object, ...value};
      }
      keys = null;
      R = [];
      row_nr = 0;
      has_ths = false;
      //.......................................................................................................
      push_table_headers = (row = null) => {
        var field, i, len, ref, title;
        has_ths = true;
        keys = Object.keys((function() {
          switch (cfg.keys) {
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
          raw_value = row[key];
          value = raw_value;
          field = (ref = fields[key]) != null ? ref : null;
          if (value === void 0) {
            value = (ref1 = (ref2 = field != null ? field.undefined : void 0) != null ? ref2 : cfg.undefined) != null ? ref1 : 'undefined';
          }
          is_done = false;
          inner_html = null;
          if (field != null) {
            if (field.display === false) {
              continue;
            }
            details = {key, raw_value, row_nr, row};
            if (field.value != null) {
              value = field.value(value, details);
            }
            if ((as_html = (ref3 = field.outer_html) != null ? ref3 : null) != null) {
              is_done = true;
              R.push(as_html(value, details));
            } else if ((as_html = (ref4 = field.inner_html) != null ? ref4 : null) != null) {
              inner_html = as_html(value, details);
            }
          }
          if (!is_done) {
            if (inner_html != null) {
              R.push(HDML.pair('td', {
                class: key
              }, inner_html));
            } else {
              if (!this.types.isa.text(value)) {
                value = rpr(value);
              }
              R.push(HDML.pair('td', {
                class: key
              }, HDML.text(value)));
            }
          }
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
      var R, k, row, v;
      cfg = {...this.defaults.vgt_row_as_subtable_html_cfg, ...cfg};
      this.types.validate.vgt_row_as_subtable_html_cfg(cfg);
      row = (this.types.isa.object(cfg.row)) ? cfg.row : JSON.parse(cfg.row);
      R = [];
      R.push(HDML.open('table', cfg.class != null ? {
        class: cfg.class
      } : null));
      for (k in row) {
        v = row[k];
        R.push(HDML.open('tr'));
        R.push(HDML.pair('th', HDML.text(k)));
        R.push(HDML.pair('td', HDML.text(v)));
        R.push(HDML.close('tr'));
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