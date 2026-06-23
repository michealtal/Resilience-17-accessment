const CreatorCardRepository = require('@app/repository/creator-card');
const CreatorCardMessages = require('@app/messages/creator-card');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');

async function getCreatorCard(slug, accessCode) {
  // NF01
  const card = await CreatorCardRepository.findOne({
    query: {
      slug,
      deleted: null,
    },
  });

  if (!card) {
    throwAppError(CreatorCardMessages.NF01, ERROR_CODE.NOTFOUND);
  }

  // NF02
  if (card.status === 'draft') {
    throwAppError(CreatorCardMessages.NF02, ERROR_CODE.NOTFOUND);
  }

  // AC03
  if (card.access_type === 'private' && !accessCode) {
    throwAppError(CreatorCardMessages.AC03, ERROR_CODE.AUTHERR);
  }

  // AC04
  if (card.access_type === 'private' && card.access_code !== accessCode) {
    throwAppError(CreatorCardMessages.AC04, ERROR_CODE.AUTHERR);
  }

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
    created: card.created,
    updated: card.updated,
    deleted: card.deleted,
  };
}

module.exports = getCreatorCard;
