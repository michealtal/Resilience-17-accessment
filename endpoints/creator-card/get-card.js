const { createHandler } = require('@app-core/server');
const getCreatorCard = require('../../services/creator-card/get-card');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'get',
  middlewares: [],

  async handler(rc, helpers) {
    const response = await getCreatorCard(rc.params.slug, rc.query.access_code);

    return {
      status: helpers.http_statuses.HTTP_200_OK,
      data: response,
    };
  },
});
