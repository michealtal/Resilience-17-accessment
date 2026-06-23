const { ModelSchema, SchemaTypes, DatabaseModel } = require('@app-core/mongoose');

const modelName = 'creator_cards';

/**
 * @typedef {Object} CreatorCard
 * @property {String} _id
 * @property {String} title
 * @property {String} description
 * @property {String} slug
 * @property {String} creator_reference
 * @property {Array<Object>} links
 * @property {Object} service_rates
 * @property {String} status
 * @property {String} access_type
 * @property {String} access_code
 * @property {Number} created
 * @property {Number} updated
 * @property {Number|null} deleted
 */

const schemaConfig = {
  _id: {
    type: SchemaTypes.ULID,
    required: true,
  },

  title: {
    type: SchemaTypes.String,
    required: true,
  },

  description: {
    type: SchemaTypes.String,
  },

  slug: {
    type: SchemaTypes.String,
    required: true,
    unique: true,
    index: true,
  },

  creator_reference: {
    type: SchemaTypes.String,
    required: true,
    index: true,
  },

  links: {
    type: SchemaTypes.Array,
    default: [],
  },

  service_rates: {
    type: SchemaTypes.Mixed,
  },

  status: {
    type: SchemaTypes.String,
    required: true,
    index: true,
  },

  access_type: {
    type: SchemaTypes.String,
    default: 'public',
    index: true,
  },

  access_code: {
    type: SchemaTypes.String,
  },

  created: {
    type: SchemaTypes.Number,
    required: true,
  },

  updated: {
    type: SchemaTypes.Number,
    required: true,
  },

  deleted: {
    type: SchemaTypes.Number,
    default: null,
    index: true,
  },
};

const modelSchema = new ModelSchema(schemaConfig, {
  collection: modelName,
});

/** @type {CreatorCard} */
module.exports = DatabaseModel.model(modelName, modelSchema);
