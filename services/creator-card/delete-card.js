const CreatorCardRepository = require('@app/repository/creator-card');
const CreatorCardMessages = require('@app/messages/creator-card');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');

async function deleteCreatorCard(slug) {
  const card = await CreatorCardRepository.findOne({
    query: {
      slug,
      deleted: null,
    },
  });

  // NF01
  if (!card) {
    throwAppError(CreatorCardMessages.NF01, ERROR_CODE.NOTFOUND);
  }

  const deletedTime = Date.now();

  await CreatorCardRepository.updateOne({
    query: {
      _id: card._id,
    },
    updateValues: {
      deleted: deletedTime,
      updated: deletedTime,
    },
  });

  return {
    id: card._id,
    title: card.title,
    description: card.description,
    slug: card.slug,
    creator_reference: card.creator_reference,
    links: card.links,
    service_rates: card.service_rates,
    status: card.status,
    access_type: card.access_type,
    access_code: card.access_code,
    created: card.created,
    updated: deletedTime,
    deleted: deletedTime,
  };
}

module.exports = deleteCreatorCard;
