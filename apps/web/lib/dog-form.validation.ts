import { getDictionary, type Locale } from '@/lib/i18n';
import type { DogFormErrors, DogFormValues } from './dog-form.types';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const microchipPattern = /^[0-9]{15}$/;

export function validateDogForm(values: DogFormValues, locale: Locale = 'en'): DogFormErrors {
  const errors: DogFormErrors = {};
  const t = getDictionary(locale).form.validation;

  if (!values.name.trim()) {
    errors.name = t.nameRequired;
  }

  if (!values.slug.trim()) {
    errors.slug = t.slugRequired;
  } else if (!slugPattern.test(values.slug.trim())) {
    errors.slug = t.slugPattern;
  }

  if (!values.sex || values.sex === 'unknown') {
    errors.sex = t.sexRequired;
  }

  if (!values.dateOfBirth) {
    errors.dateOfBirth = t.birthDateRequired;
  }

  if (!(values.color ?? '').trim()) {
    errors.color = t.colorRequired;
  }

  if ((values.microchipNumber ?? '').trim() && !microchipPattern.test((values.microchipNumber ?? '').trim())) {
    errors.microchipNumber = t.microchipPattern;
  }

  if (!(values.shortDescription ?? '').trim()) {
    errors.shortDescription = t.shortDescriptionRequired;
  } else if ((values.shortDescription ?? '').trim().length < 24) {
    errors.shortDescription = t.shortDescriptionLength;
  }

  const longDescription = (values.longDescription ?? '').trim();
  if (longDescription.length > 0 && longDescription.length < 20) {
    errors.longDescription = t.longDescriptionLength;
  }

  if (!(values.city ?? '').trim()) {
    errors.city = t.cityRequired;
  }

  if (!(values.country ?? '').trim()) {
    errors.country = t.countryRequired;
  }

  return errors;
}
