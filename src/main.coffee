
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



#===========================================================================================================
class @Tabulator extends Common_mixin()

  #---------------------------------------------------------------------------------------------------------
  as_html: ( cfg ) ->
    cfg       = { @defaults.vgt_as_html_cfg..., cfg..., }
    @types.validate.vgt_as_html_cfg cfg
    { rows }  = cfg
    fields    = @_fields_from_cfg cfg
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
          continue if field.display is false
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
        R.push @_td_from_details d
      #.....................................................................................................
      R.push HDML.close 'tr'
    #.......................................................................................................
    push_table_headers null unless has_ths
    R.push HDML.close 'table'
    return R.join '\n'

  #---------------------------------------------------------------------------------------------------------
  row_as_subtable_html: ( cfg ) ->
    cfg     = { @defaults.vgt_row_as_subtable_html_cfg..., cfg..., }
    @types.validate.vgt_row_as_subtable_html_cfg cfg
    row     = if ( @types.isa.object cfg.row ) then cfg.row else JSON.parse cfg.row
    fields  = @_fields_from_cfg cfg
    keys    = @_keys_from_keys_row_and_fields cfg.keys, row, fields
    R       = []
    R.push HDML.open 'table', if cfg.class? then { class: cfg.class, } else null
    for key in keys
      field       = fields[ key ]
      continue unless ( title = @_title_from_field_and_key field, key )?
      d     = { key, row, field, }
      d     = @_set_value cfg, row, field, key, d
      #.....................................................................................................
      value = row[ key ]
      td    = @_td_from_details d
      R.push HDML.pair 'tr', ( HDML.pair 'th', HDML.text title ) + td
    R.push HDML.close 'table'
    return R.join '\n'

  #---------------------------------------------------------------------------------------------------------
  _fields_from_cfg: ( cfg ) ->
    R = { cfg.fields..., }
    for key, value of R
      value     = {} if value is true
      R[ key ]  = { @defaults.vgt_field_description_object..., value..., }
    return R

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
      return null if field.display is false
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
      return d.field.outer_html d.value, d
    else if d.field?.inner_html?
      return HDML.pair 'td', { class: d.key, }, d.field.inner_html d.value, d
    d.value = rpr d.value unless @types.isa.text d.value
    return HDML.pair 'td', { class: d.key, }, HDML.text d.value


############################################################################################################
@TABULATOR = new @Tabulator()
