
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
    cfg         = { @defaults.vgt_as_html_cfg..., cfg..., }
    @types.validate.vgt_as_html_cfg cfg
    return @_table_as_html cfg

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
  _table_as_html: ( cfg ) ->
    { rows }      = cfg
    fields        = @_fields_from_cfg cfg
    keys          = null
    R             = []
    row_nr        = 0
    has_ths       = false
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
        field       = fields[ key ] ? null
        continue unless ( title = @_title_from_field_and_key )?
        #...................................................................................................
        raw_value   = row[ key ]
        value       = raw_value
        value       = field?.undefined ? cfg.undefined ? 'undefined' if value is undefined
        is_done     = false
        inner_html  = null
        if field?
          details = { key, raw_value, row_nr, row, }
          if field.value?
            value = field.value value, details
          if ( as_html = field.outer_html ? null )?
            is_done = true
            R.push as_html value, details
          else if ( as_html = field.inner_html ? null )?
            inner_html = as_html value, details
        unless is_done
          if inner_html?
            R.push HDML.pair 'td', { class: key, }, inner_html
          else
            value = rpr value unless @types.isa.text value
            R.push HDML.pair 'td', { class: key, }, HDML.text value
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
      field = fields[ key ]
      continue unless ( title = @_title_from_field_and_key field, key )?
      #.....................................................................................................
      value = row[ key ]
      R.push HDML.open 'tr'
      R.push HDML.pair 'th', HDML.text key
      R.push HDML.pair 'td', HDML.text value
      R.push HDML.close 'tr'
    R.push HDML.close 'table'
    return R.join '\n'


  #---------------------------------------------------------------------------------------------------------
  _get_table_name: ( name ) ->
    @types.validate.nonempty_text name
    return "_#{@cfg.prefix}_#{name[1..]}" if name.startsWith '_'
    return "#{@cfg.prefix}_#{name}"



