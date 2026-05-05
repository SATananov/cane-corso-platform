import type {
  DogAncestorProfile,
  DogAncestorRelationKey,
  DogPedigreeProfile,
} from '@cane-corso-platform/contracts';

export const PEDIGREE_RELATION_ORDER: readonly DogAncestorRelationKey[] = [
  'mother',
  'father',
  'motherMother',
  'motherFather',
  'fatherMother',
  'fatherFather',
  'motherMotherMother',
  'motherMotherFather',
  'motherFatherMother',
  'motherFatherFather',
  'fatherMotherMother',
  'fatherMotherFather',
  'fatherFatherMother',
  'fatherFatherFather',
] as const;

export const PEDIGREE_PARENTS: readonly DogAncestorRelationKey[] = ['mother', 'father'] as const;
export const PEDIGREE_MATERNAL_GRANDPARENTS: readonly DogAncestorRelationKey[] = ['motherMother', 'motherFather'] as const;
export const PEDIGREE_PATERNAL_GRANDPARENTS: readonly DogAncestorRelationKey[] = ['fatherMother', 'fatherFather'] as const;
export const PEDIGREE_GREAT_GRANDPARENTS: readonly DogAncestorRelationKey[] = [
  'motherMotherMother',
  'motherMotherFather',
  'motherFatherMother',
  'motherFatherFather',
  'fatherMotherMother',
  'fatherMotherFather',
  'fatherFatherMother',
  'fatherFatherFather',
] as const;

export const EMPTY_ANCESTOR_PROFILE: DogAncestorProfile = {
  name: '',
  photoUrl: null,
  sex: null,
  dateOfBirth: null,
  color: null,
  country: null,
  titles: null,
  note: null,
};

function normalizeAncestorProfile(value?: DogAncestorProfile | null): DogAncestorProfile {
  return {
    name: value?.name?.trim() ?? '',
    photoUrl: value?.photoUrl?.trim() || null,
    sex: value?.sex ?? null,
    dateOfBirth: value?.dateOfBirth?.trim() || null,
    color: value?.color?.trim() || null,
    country: value?.country?.trim() || null,
    titles: value?.titles?.trim() || null,
    note: value?.note?.trim() || null,
  };
}

export function normalizePedigreeProfile(value?: DogPedigreeProfile | null): DogPedigreeProfile {
  const normalized: DogPedigreeProfile = {};

  for (const relationKey of PEDIGREE_RELATION_ORDER) {
    const ancestor = normalizeAncestorProfile(value?.[relationKey]);
    const hasData = Boolean(
      ancestor.name ||
      ancestor.photoUrl ||
      ancestor.sex ||
      ancestor.dateOfBirth ||
      ancestor.color ||
      ancestor.country ||
      ancestor.titles ||
      ancestor.note,
    );

    if (hasData) {
      normalized[relationKey] = ancestor;
    }
  }

  return normalized;
}

export function updatePedigreeAncestor(
  pedigree: DogPedigreeProfile,
  relationKey: DogAncestorRelationKey,
  field: keyof DogAncestorProfile,
  value: DogAncestorProfile[keyof DogAncestorProfile],
): DogPedigreeProfile {
  const current = normalizeAncestorProfile(pedigree[relationKey]);
  const nextAncestor = normalizeAncestorProfile({
    ...current,
    [field]: value,
  });

  const hasData = Boolean(
    nextAncestor.name ||
    nextAncestor.photoUrl ||
    nextAncestor.sex ||
    nextAncestor.dateOfBirth ||
    nextAncestor.color ||
    nextAncestor.country ||
    nextAncestor.titles ||
    nextAncestor.note,
  );

  const next = { ...pedigree };

  if (hasData) {
    next[relationKey] = nextAncestor;
  } else {
    delete next[relationKey];
  }

  return next;
}

export function getPedigreeFilledCount(pedigree?: DogPedigreeProfile | null): number {
  return PEDIGREE_RELATION_ORDER.filter((relationKey) => Boolean(pedigree?.[relationKey]?.name?.trim())).length;
}

export function getPedigreePhotoCount(pedigree?: DogPedigreeProfile | null): number {
  return PEDIGREE_RELATION_ORDER.filter((relationKey) => Boolean(pedigree?.[relationKey]?.photoUrl?.trim())).length;
}
