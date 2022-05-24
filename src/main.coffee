
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-TABULATOR'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
# PATH                      = require 'path'
GUY                       = require 'guy'
{ SQL }                   = GUY.str
{ HDML }                  = require 'hdml'
{ Common_mixin }          = require './common-mixin'
hide_sym                  = Symbol.for 'hide'


#===========================================================================================================
class @Tabulator extends Common_mixin()

  #---------------------------------------------------------------------------------------------------------
  tabulate: ( cfg ) =>
    cfg       = @_add_field_defaults { @defaults.vgt_as_html_cfg..., cfg..., }
    @types.validate.vgt_as_html_cfg cfg
    { fields,
      rows }  = cfg
    keys      = null
    R         = []
    row_nr    = 0
    has_ths   = false
    #.......................................................................................................
    push_table_headers = ( row = null ) =>
      has_ths = true
      keys    = @_keys_from_keys_row_and_fields cfg.keys, row, fields
      return if keys.length is 0
      R.push HDML.open 'tr'
      for key in keys
        if ( field = fields[ key ] )?
          continue if field.hide
          title = field.title ? key
        else
          title = key
        R.push HDML.pair 'th', { class: key, }, HDML.text title
      R.push HDML.close 'tr'
      return null
    #.......................................................................................................
    R.push HDML.open 'table', if cfg.class? then { class: cfg.class, } else null
    #.......................................................................................................
    for row from rows
      row_nr++
      push_table_headers row if row_nr is 1
      #.....................................................................................................
      R.push HDML.open 'tr'
      for key in keys
        field = fields[ key ] ? null
        continue unless ( title = @_title_from_field_and_key field, key )?
        #...................................................................................................
        d     = { key, row_nr, row, field, }
        d     = @_set_value cfg, row, field, key, d
        td    = @_td_from_details d
        if td is hide_sym
          throw new Error "^dbay-tabulator@1^ `Symbol.for 'hide'` only allowed with `summarize()`"
        R.push td
      #.....................................................................................................
      R.push HDML.close 'tr'
    #.......................................................................................................
    push_table_headers null unless has_ths
    R.push HDML.close 'table'
    return R.join '\n'

  #---------------------------------------------------------------------------------------------------------
  summarize: ( cfg ) =>
    cfg        = @_add_field_defaults { @defaults.vgt_row_as_subtable_html_cfg..., cfg..., }
    @types.validate.vgt_row_as_subtable_html_cfg cfg
    row        = if ( @types.isa.object cfg.row ) then cfg.row else JSON.parse cfg.row
    { fields } = cfg
    keys       = @_keys_from_keys_row_and_fields cfg.keys, row, fields
    R          = []
    R.push HDML.open 'table', if cfg.class? then { class: cfg.class, } else null
    for key in keys
      field       = fields[ key ]
      continue unless ( title = @_title_from_field_and_key field, key )?
      d     = { key, row, field, }
      d     = @_set_value cfg, row, field, key, d
      #.....................................................................................................
      value = row[ key ]
      td    = @_td_from_details d
      continue if td is hide_sym
      R.push HDML.pair 'tr', ( HDML.pair 'th', HDML.text title ) + td
    R.push HDML.close 'table'
    return R.join '\n'

  #---------------------------------------------------------------------------------------------------------
  _add_field_defaults: ( cfg ) ->
    fields = { cfg.fields..., }
    for key, value of fields
      value         = {} if value is true
      fields[ key ] = { @defaults.vgt_field_description_object..., value..., }
    cfg.fields = fields
    return cfg

  #---------------------------------------------------------------------------------------------------------
  _keys_from_keys_row_and_fields: ( keys, row, fields ) ->
    return Object.keys switch keys
      when 'row,cfg'  then { row..., fields..., }
      when 'cfg,row'  then { fields..., row..., }
      when 'row'      then row
      when 'cfg'      then fields

  #---------------------------------------------------------------------------------------------------------
  _title_from_field_and_key: ( field, key ) ->
    if field?
      return null if field.hide
      return field.title ? key
    return key

  #---------------------------------------------------------------------------------------------------------
  _set_value: ( cfg, row, field, key, d ) ->
    d.raw_value = row[ key ]
    d.value     = d.raw_value
    d.value     = field?.undefined ? cfg.undefined  if d.value is undefined
    return d

  #---------------------------------------------------------------------------------------------------------
  _td_from_details: ( d ) ->
    if d.field?.outer_html?
      return d.field.outer_html d
    else if d.field?.inner_html?
      value = d.field.inner_html d
      return value if value is hide_sym
      return HDML.pair 'td', { class: d.key, }, value
    d.value = rpr d.value unless @types.isa.text d.value
    return HDML.pair 'td', { class: d.key, }, HDML.text d.value


############################################################################################################
@TABULATOR  = new @Tabulator()
@tabulate   = @TABULATOR.tabulate
@summarize  = @TABULATOR.summarize
