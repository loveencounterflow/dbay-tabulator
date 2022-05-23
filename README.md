

# DBay Tabulator


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [DBay Tabulator](#dbay-tabulator)
  - [API Notes](#api-notes)
  - [To Do](#to-do)
  - [Is Done](#is-done)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



# DBay Tabulator

## API Notes

* `{ Tabulator } = require 'dbay-tabulator'`
* `tabulator = new Tabulator()`
* `tabulator.as_html: ( cfg ) ->`: returns a string with data rendered according to the settings `cfg`
* Data is passed in as the `rows` property; this can be a list of or an iterator over objects.
* Optionally, individual fields may be formatted using the `fields` property, which should be and object
  whose keys are field names and whose values are either `true` (to indicate, 'include this field' even if
  not present in the data, or to clarify the ordering of fields in the table).
* if `fields[ key ]` is an object:
  * `optional.text x.title`: when given, defines the text to be used in the table header
  * `optional.function x.value`: when given, must be function that accepts a value (and optionally a
    field description object) and returns another. Returned value will be stringified with
    `node:util.inspect()` unless it already is a string.
  * `optional.function x.outer_html`: when given, must be a function that accepts a value (and
    optionally a field description object) and returns an HTML representation of it *including the
    containing `<td>` element*
  * `optional.function x.inner_html`: when given, must be a function that accepts a value (and
    optionally a field description object) and returns an HTML representation of it *including the
    containing `<td>` element*
  * `optional.function x.attrs`: when given, must be a function that accepts a value (and
    optionally a field description object) and returns an object that will be used for
    the attributes of the enclosing (`<td>`) element
  * `optional.boolean x.display`: if set to `false`, inhibits column from being displayed and any of
    `value()`, `outer_html()`, `inner_html()` to be called

* Configuration options may be modified in the future to make it simpler to add ID, CSS class,
  `data-` and other attributes to the enclosing element without having to touch the value or to generate the
  correct outer HTML
* `value()`, `outer_html()`, `inner_html()` and `attr()` will be called as `f value, details`, where
  `value` is the current value of the respective field in the current row, and `details` is an object with
  the properties
  * `name`—name of the field;
  * `raw_value`—value of the field *before* `value()` was applied;
  * `row_nr`—one-based row number;
  * `row`—the row as returned by the DB query.

* with columns...
  * `x.keys: 'row'`: only those in `row`
  * `x.keys: 'cfg'`: only those in `cfg`
  * `x.keys: 'row,cfg'`: both, from `row` first
  * `x.keys: 'cfg,row'`: both, from `cfg` first


## To Do

  * **[–]** implement `rows` so anything iterable may be passed in
  * **[–]** allow prefix for CSS classes
  * **[–]** allow to set CSS class like title (or use `attrs`?)
  * **[–]** correct way to add field to table should be to add it to `fields`, not to hijack existing column
  * **[–]** allow to specify whether column names in `fields` is inlcusive or exclusive, i.e. whether they leave
    unmentioned ones in place or cause them to be hidden
  * **[–]** make ordering in `fields` the ordering in display
  * **[–]** implement nested subtables by providing a method `as_subtable_html()` that should be called from
    `field.inner_html()`
  * **[–]** integrate code from `icql-dba-tabular` for output to command line

## Is Done

  * **[+]** move to <del>DBay</del> <ins>DBay Tabulator</ins>
  * **[+]** implement `inner_html`
  * **[+]** `html` -> `outer_html`
  * **[+]** `format` -> `value`
