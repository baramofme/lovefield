/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
goog.setTestOnly();
goog.provide('lf.testing.MockSchema');

goog.require('goog.string');
goog.require('lf.Order');
goog.require('lf.Type');
goog.require('lf.schema.Database');
goog.require('lf.schema.TableBuilder');



/**
 * Dummy schema implementation to be used in tests.
 * @implements {lf.schema.Database}
 * @constructor
 */
lf.testing.MockSchema = function() {

  var createTable = function(tableName) {
    return new lf.schema.TableBuilder(tableName).
        addColumn('id', lf.Type.STRING).
        addColumn('name', lf.Type.STRING).
        addPrimaryKey(['id']).
        addIndex('idxName', [{'name': 'name', 'order': lf.Order.DESC}]).
        getSchema();
  };

  /** @private {!lf.schema.Table} */
  this.tableA_ = createTable('tableA');

  /** @private {!lf.schema.Table} */
  this.tableB_ = createTable('tableB');

  /**
   * A table with no indices.
   * @private {!lf.schema.Table}
   */
  this.tableC_ = new lf.schema.TableBuilder('tableC').
      addColumn('id', lf.Type.STRING).
      addColumn('name', lf.Type.STRING).
      getSchema();

  /** @private {!lf.schema.Table} */
  this.tableD_ = createTable('tableD');

  /** @private {!lf.schema.Table} */
  this.tableE_ = new lf.schema.TableBuilder('tableE').
      addColumn('id', lf.Type.STRING).
      addColumn('email', lf.Type.STRING).
      addPrimaryKey(['id']).
      addUnique('uq_email', ['email']).
      getSchema();

  /** @private {!lf.schema.Table} */
  this.tablePlusOne_ = createTable('tablePlusOne');

  /** @private {string} */
  this.name_ = 'mock_schema';

  /** @private {number} */
  this.version_ = 1;
};


/** @override */
lf.testing.MockSchema.prototype.tables = function() {
  var tables = [
    this.tableA_, this.tableB_, this.tableC_,
    this.tableD_, this.tableE_
  ];
  if (this.version_ > 1) {
    tables.push(this.tablePlusOne_);
  }
  return tables;
};


/** @override */
lf.testing.MockSchema.prototype.name = function() {
  return this.name_;
};


/** @override */
lf.testing.MockSchema.prototype.version = function() {
  return this.version_;
};


/** @override */
lf.testing.MockSchema.prototype.table = function(tableName) {
  var tables = {
    'tableA': this.tableA_,
    'tableB': this.tableB_,
    'tableC': this.tableC_,
    'tableD': this.tableD_,
    'tableE': this.tableE_
  };
  if (this.version_ > 1) {
    tables['tablePlusOne'] = this.tablePlusOne_;
  }
  return tables[tableName] || null;
};


/** @param {string} name */
lf.testing.MockSchema.prototype.setName = function(name) {
  this.name_ = name;
};


/** @param {number} version */
lf.testing.MockSchema.prototype.setVersion = function(version) {
  this.version_ = version;
};
