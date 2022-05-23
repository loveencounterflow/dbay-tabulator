
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
  _table_as_html: ( cfg ) ->
    { rows
      fields  }   = cfg
    fields        = { fields..., }
    # for key, value of fields
    #   if value is true then fields[ key ] = {}
    for key, value of fields
      value         = {} if value is true
      fields[ key ] = { @defaults.vgt_field_description_object..., value..., }
    keys          = null
    R             = []
    row_nr        = 0
    has_ths       = false
    #.......................................................................................................
    push_table_headers = ( row = null ) =>
      has_ths = true
      keys = Object.keys switch cfg.keys
        when 'row,cfg'  then { row..., fields..., }
        when 'cfg,row'  then { fields..., row..., }
        when 'row'      then row
        when 'cfg'      then fields
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
        raw_value   = row[ key ]
        value       = raw_value
        field       = fields[ key ] ? null
        value       = field?.undefined ? cfg.undefined ? 'undefined' if value is undefined
        is_done     = false
        inner_html  = null
        if field?
          continue if field.display is false
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
    cfg = { @defaults.vgt_row_as_subtable_html_cfg..., cfg..., }
    @types.validate.vgt_row_as_subtable_html_cfg cfg
    row = if ( @types.isa.object cfg.row ) then cfg.row else JSON.parse cfg.row
    R   = []
    R.push HDML.open 'table', if cfg.class? then { class: cfg.class, } else null
    for k, v of row
      R.push HDML.open 'tr'
      R.push HDML.pair 'th', HDML.text k
      R.push HDML.pair 'td', HDML.text v
      R.push HDML.close 'tr'
    R.push HDML.close 'table'
    return R.join '\n'


  #---------------------------------------------------------------------------------------------------------
  _get_table_name: ( name ) ->
    @types.validate.nonempty_text name
    return "_#{@cfg.prefix}_#{name[1..]}" if name.startsWith '_'
    return "#{@cfg.prefix}_#{name}"



