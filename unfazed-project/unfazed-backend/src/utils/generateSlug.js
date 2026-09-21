const Therapist = require('../models/Therapist');

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function generateUniqueSlug(name) {
  const base = slugify(name) || 'therapist';
  let slug = base;
  let counter = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await Therapist.exists({ slug })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

module.exports = { slugify, generateUniqueSlug };
