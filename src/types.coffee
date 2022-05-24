


'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/TYPES'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
jr                        = JSON.stringify
GUY                       = require 'guy'
@types                    = new ( require 'intertype' ).Intertype()
@defaults                 = {}



#===========================================================================================================
# HTML
#-----------------------------------------------------------------------------------------------------------
### thx to https://stackoverflow.com/a/32538867/7568091 ###
@types.declare 'vgt_iterable', tests:
  "( @isa.list x ) or ( x? and @isa.function x[ Symbol.iterator ] )": \
    ( x ) -> ( @isa.list x ) or ( x? and @isa.function x[ Symbol.iterator ] )
@types.declare 'vgt_iterable_no_text', tests:
  "not @isa.text x":                                          ( x ) -> not @isa.text x
  "@isa.vgt_iterable x":                                      ( x ) -> @isa.vgt_iterable x

#-----------------------------------------------------------------------------------------------------------
@types.declare 'vgt_row_as_subtable_html_row', tests:
  "( @isa.nonempty_text x ) or ( @isa.object x )": ( x ) -> ( @isa.nonempty_text x ) or ( @isa.object x )

#-----------------------------------------------------------------------------------------------------------
@types.declare 'vgt_as_html_cfg', tests:
  "@isa.object x":                                            ( x ) -> @isa.object x
  "@isa.vgt_as_html_keys x.keys":                             ( x ) -> @isa.vgt_as_html_keys x.keys
  "@isa_optional.vgt_fieldset_cfg x.fields":                  ( x ) -> @isa_optional.vgt_fieldset_cfg x.fields
  "@isa_optional.notunset x.undefined":                       ( x ) -> @isa_optional.notunset x.undefined
  "@isa.unset x.table":                                       ( x ) -> @isa.unset x.table
  "@isa.unset x.query":                                       ( x ) -> @isa.unset x.query
  "@isa.unset x.parameters":                                  ( x ) -> @isa.unset x.parameters
  "@isa.vgt_iterable_no_text x.rows":                         ( x ) -> @isa.vgt_iterable_no_text x.rows
#...........................................................................................................
@defaults.vgt_as_html_cfg =
  rows:             null
  undefined:        undefined
  class:            null
  keys:             'row,cfg'
  fields:           GUY.lft.freeze {}

#-----------------------------------------------------------------------------------------------------------
@types.declare 'vgt_row_as_subtable_html_cfg', tests:
  "@isa.object x":                                            ( x ) -> @isa.object x
  "@isa.vgt_as_html_keys x.keys":                             ( x ) -> @isa.vgt_as_html_keys x.keys
  "@isa_optional.vgt_fieldset_cfg x.fields":                  ( x ) -> @isa_optional.vgt_fieldset_cfg x.fields
  "@isa_optional.object x.parameters":                        ( x ) -> @isa_optional.object x.parameters
  "@isa_optional.notunset x.undefined":                       ( x ) -> @isa_optional.notunset x.undefined
  "@isa.unset x.table":                                       ( x ) -> @isa.unset x.table
  "@isa.unset x.query":                                       ( x ) -> @isa.unset x.query
  "@isa.unset x.parameters":                                  ( x ) -> @isa.unset x.parameters
  "@isa.vgt_row_as_subtable_html_row x.row":                  ( x ) -> @isa.vgt_row_as_subtable_html_row x.row
#...........................................................................................................
@defaults.vgt_row_as_subtable_html_cfg =
  row:              null
  undefined:        undefined
  class:            null
  keys:             'row,cfg'
  fields:           GUY.lft.freeze {}

#-----------------------------------------------------------------------------------------------------------
@types.declare 'vgt_fieldset_cfg', tests:
  "each value is a vgt_field_description":         ( x ) ->
    for _, value of x
      return false unless @isa.vgt_field_description value
    return true

#-----------------------------------------------------------------------------------------------------------
@types.declare 'vgt_field_description', tests:
  "( x is true ) or ( @isa.vgt_field_description_object x )": ( x ) ->
    return ( x is true ) or ( @isa.vgt_field_description_object x )

#-----------------------------------------------------------------------------------------------------------
@types.declare 'vgt_field_description_object', tests:
  "@isa.object x":                                    ( x ) -> @isa.object x
  "@isa.unset x.value":                               ( x ) -> @isa.unset x.value
  "@isa_optional.function x.outer_html":              ( x ) -> @isa_optional.function x.outer_html
  "@isa_optional.function x.inner_html":              ( x ) -> @isa_optional.function x.inner_html
  "@isa_optional.notunset x.undefined":               ( x ) -> @isa_optional.notunset x.undefined
  "can only have one of x.inner_html, x.outer_html":  ( x ) -> not ( x.inner_html? and x.outer_html? )
  "@isa_optional.text x.title":                       ( x ) -> @isa_optional.text x.title
  "@isa.boolean x.hide":                              ( x ) -> @isa.boolean x.hide
#...........................................................................................................
@defaults.vgt_field_description_object =
  outer_html:     null
  inner_html:     null
  undefined:      undefined
  title:          null
  hide:           false

#-----------------------------------------------------------------------------------------------------------
@types.declare 'vgt_as_html_keys', tests:
  "x in [ 'row,cfg', 'cfg,row', 'row', 'cfg', ]": ( x ) -> x in [ 'row,cfg', 'cfg,row', 'row', 'cfg', ]
