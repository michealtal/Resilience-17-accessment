const validator = require('@app-core/validator');
const { ulid } = require('ulid');
const CreatorCardRepository = require('@app/repository/creator-card');
const CreatorCardMessages = require('@app/messages/creator-card');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');
}

function generateRandomSuffix(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

async function ensureUniqueSlug(title) {
  const baseSlug = generateSlug(title);

  const trySlug = async (slugToTry) => {
    const existing = await CreatorCardRepository.findOne({
      query: {
        slug: slugToTry,
        deleted: null,
      },
    });

    return !existing ? slugToTry : null;
  };

  // First attempt
  const slug = baseSlug.length < 5 ? `${baseSlug}-${generateRandomSuffix()}` : baseSlug;

  let result = await trySlug(slug);
  if (result) return result;

  // Second attempt
  const secondSlug = `${baseSlug}-${generateRandomSuffix()}`;
  result = await trySlug(secondSlug);
  if (result) return result;

  // Final fallback
  return `${baseSlug}-${Date.now()}`;
}

const creatorCardSpec = `
root {
  title string<trim|minLength:3|maxLength:100>
  description? string<maxLength:500>
  slug? string<minLength:5|maxLength:50>
  creator_reference string<trim|minLength:11|maxLength:20>
  status string(draft|published)
  access_type? string(public|private)
  access_code? string<length:6>
}
`;

const parsedSpec = validator.parse(creatorCardSpec);

async function createCreatorCard(payload) {
  const data = validator.validate(payload, parsedSpec);

  const accessType = data.access_type || 'public';

  // AC01
  if (accessType === 'private' && !data.access_code) {
    throwAppError(CreatorCardMessages.AC01, ERROR_CODE.INVLDDATA);
  }

  // AC05
  if (accessType === 'public' && data.access_code) {
    throwAppError(CreatorCardMessages.AC05, ERROR_CODE.INVLDDATA);
  }

  let slug;

  // Client supplied slug
  if (data.slug) {
    const existing = await CreatorCardRepository.findOne({
      query: {
        slug: data.slug,
        deleted: null,
      },
    });

    if (existing) {
      throwAppError(CreatorCardMessages.SL02, ERROR_CODE.INVLDDATA);
    }

    slug = data.slug;
  } else {
    slug = await ensureUniqueSlug(data.title);
  }

  const now = Date.now();

  const creatorCard = {
    _id: ulid(),
    title: data.title,
    description: data.description || '',
    slug,
    creator_reference: data.creator_reference,
    links: data.links || [],
    service_rates: data.service_rates || null,
    status: data.status,
    access_type: accessType,
    access_code: data.access_code || null,
    created: now,
    updated: now,
    deleted: null,
  };

  const saved = await CreatorCardRepository.create(creatorCard);

  return {
    id: saved._id,
    title: saved.title,
    description: saved.description,
    slug: saved.slug,
    creator_reference: saved.creator_reference,
    links: saved.links,
    service_rates: saved.service_rates,
    status: saved.status,
    access_type: saved.access_type,
    access_code: saved.access_code,
    created: saved.created,
    updated: saved.updated,
    deleted: saved.deleted,
  };
}

module.exports = createCreatorCard;
