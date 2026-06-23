const { createHandler } = require('@app-core/server');
const deleteCreatorCard = require('../../services/creator-card/delete-card');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'delete',
  middlewares: [],

  async handler(rc, helpers) {
    const response = await deleteCreatorCard(rc.params.slug, rc.body.creator_reference);

    return {
      status: helpers.http_statuses.HTTP_200_OK,
      data: response,
    };
  },
});
