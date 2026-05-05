'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  DogAncestorProfile,
  DogAncestorRelationKey,
  DogPedigreeProfile,
} from '@cane-corso-platform/contracts';
import { useLocale } from '@/components/locale-provider';
import {
  EMPTY_ANCESTOR_PROFILE,
  PEDIGREE_GREAT_GRANDPARENTS,
  PEDIGREE_MATERNAL_GRANDPARENTS,
  PEDIGREE_PARENTS,
  PEDIGREE_PATERNAL_GRANDPARENTS,
} from '@/lib/dog-pedigree';
import { LuxurySelect } from '@/components/luxury-select';
import { ImageLightbox } from '@/components/image-lightbox';

interface PedigreeEditorProps {
  pedigree: DogPedigreeProfile;
  onAncestorChange: <K extends keyof DogAncestorProfile>(
    relationKey: DogAncestorRelationKey,
    field: K,
    value: DogAncestorProfile[K],
  ) => void;
}

const BRANCH_RELATIONS: Record<DogAncestorRelationKey, readonly DogAncestorRelationKey[]> = {
  mother: ['motherMother', 'motherFather', 'motherMotherMother', 'motherMotherFather', 'motherFatherMother', 'motherFatherFather'],
  father: ['fatherMother', 'fatherFather', 'fatherMotherMother', 'fatherMotherFather', 'fatherFatherMother', 'fatherFatherFather'],
  motherMother: ['motherMotherMother', 'motherMotherFather'],
  motherFather: ['motherFatherMother', 'motherFatherFather'],
  fatherMother: ['fatherMotherMother', 'fatherMotherFather'],
  fatherFather: ['fatherFatherMother', 'fatherFatherFather'],
  motherMotherMother: [],
  motherMotherFather: [],
  motherFatherMother: [],
  motherFatherFather: [],
  fatherMotherMother: [],
  fatherMotherFather: [],
  fatherFatherMother: [],
  fatherFatherFather: [],
};

const GREAT_PARENT_MAP: Record<DogAncestorRelationKey, DogAncestorRelationKey | null> = {
  mother: null,
  father: null,
  motherMother: 'mother',
  motherFather: 'mother',
  fatherMother: 'father',
  fatherFather: 'father',
  motherMotherMother: 'motherMother',
  motherMotherFather: 'motherMother',
  motherFatherMother: 'motherFather',
  motherFatherFather: 'motherFather',
  fatherMotherMother: 'fatherMother',
  fatherMotherFather: 'fatherMother',
  fatherFatherMother: 'fatherFather',
  fatherFatherFather: 'fatherFather',
};

const ANCESTOR_FIELDS: Array<keyof DogAncestorProfile> = [
  'name',
  'photoUrl',
  'sex',
  'dateOfBirth',
  'color',
  'country',
  'titles',
  'note',
];

function hasAncestorData(profile?: DogAncestorProfile | null): boolean {
  return Boolean(
    profile?.name?.trim() ||
      profile?.photoUrl?.trim() ||
      profile?.sex ||
      profile?.dateOfBirth ||
      profile?.color?.trim() ||
      profile?.country?.trim() ||
      profile?.titles?.trim() ||
      profile?.note?.trim(),
  );
}

function hasAnyPedigreeData(pedigree: DogPedigreeProfile, keys: readonly DogAncestorRelationKey[]) {
  return keys.some((key) => hasAncestorData(pedigree[key]));
}

function ancestorInitial(title: string, value: DogAncestorProfile) {
  if (value.name.trim()) {
    return value.name.trim().slice(0, 1).toUpperCase();
  }

  return title
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function withCurrentValue(options: Array<{ value: string; label: string }>, currentValue?: string | null) {
  const normalizedCurrentValue = currentValue?.trim() ?? '';

  if (!normalizedCurrentValue || options.some((option) => option.value === normalizedCurrentValue)) {
    return options;
  }

  return [options[0], { value: normalizedCurrentValue, label: normalizedCurrentValue }, ...options.slice(1)];
}

function PedigreeAncestorCard({
  relationKey,
  title,
  subtitle,
  value,
  onAncestorChange,
  onClear,
}: {
  relationKey: DogAncestorRelationKey;
  title: string;
  subtitle: string;
  value: DogAncestorProfile;
  onAncestorChange: <K extends keyof DogAncestorProfile>(
    relationKey: DogAncestorRelationKey,
    field: K,
    value: DogAncestorProfile[K],
  ) => void;
  onClear: (relationKey: DogAncestorRelationKey) => void;
}) {
  const { dictionary } = useLocale();
  const t = dictionary.form.pedigree;
  const copy = t.progressive ?? {};
  const colorLabels = dictionary.form.options.colors;
  const countryLabels = dictionary.form.options.countries;
  const globalPlaceholders = dictionary.form.placeholders;
  const hasData = hasAncestorData(value);
  const [isOpen, setIsOpen] = useState(hasData);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (hasData) {
      setIsOpen(true);
    }
  }, [hasData]);

  const colorOptions = useMemo(
    () =>
      withCurrentValue(
        [
          { value: '', label: globalPlaceholders.selectColor },
          { value: 'Black', label: colorLabels.black },
          { value: 'Black Brindle', label: colorLabels.blackBrindle },
          { value: 'Grey', label: colorLabels.grey },
          { value: 'Grey Brindle', label: colorLabels.greyBrindle },
          { value: 'Formentino', label: colorLabels.formentino },
          { value: 'Fawn', label: colorLabels.fawn },
          { value: 'Red', label: colorLabels.red },
          { value: 'Chestnut Brindle', label: colorLabels.chestnutBrindle },
          { value: 'Blue', label: colorLabels.blue },
          { value: 'Other', label: colorLabels.other },
        ],
        value.color,
      ),
    [colorLabels, globalPlaceholders.selectColor, value.color],
  );

  const countryOptions = useMemo(
    () =>
      withCurrentValue(
        [
          { value: '', label: globalPlaceholders.selectCountry },
          { value: 'Bulgaria', label: countryLabels.bulgaria },
          { value: 'Italy', label: countryLabels.italy },
          { value: 'Serbia', label: countryLabels.serbia },
          { value: 'Romania', label: countryLabels.romania },
          { value: 'Greece', label: countryLabels.greece },
          { value: 'North Macedonia', label: countryLabels.northMacedonia },
          { value: 'Albania', label: countryLabels.albania },
          { value: 'Montenegro', label: countryLabels.montenegro },
          { value: 'Croatia', label: countryLabels.croatia },
          { value: 'Slovenia', label: countryLabels.slovenia },
          { value: 'Bosnia and Herzegovina', label: countryLabels.bosniaAndHerzegovina },
          { value: 'Germany', label: countryLabels.germany },
          { value: 'France', label: countryLabels.france },
          { value: 'Spain', label: countryLabels.spain },
          { value: 'Portugal', label: countryLabels.portugal },
          { value: 'Netherlands', label: countryLabels.netherlands },
          { value: 'Belgium', label: countryLabels.belgium },
          { value: 'Austria', label: countryLabels.austria },
          { value: 'Switzerland', label: countryLabels.switzerland },
          { value: 'United Kingdom', label: countryLabels.unitedKingdom },
          { value: 'Ireland', label: countryLabels.ireland },
          { value: 'Poland', label: countryLabels.poland },
          { value: 'Czech Republic', label: countryLabels.czechRepublic },
          { value: 'Slovakia', label: countryLabels.slovakia },
          { value: 'Hungary', label: countryLabels.hungary },
          { value: 'Turkey', label: countryLabels.turkey },
          { value: 'United States', label: countryLabels.unitedStates },
          { value: 'Canada', label: countryLabels.canada },
        ],
        value.country,
      ),
    [countryLabels, globalPlaceholders.selectCountry, value.country],
  );

  const avatar = value.photoUrl ? (
    <ImageLightbox src={value.photoUrl} alt={value.name || title} />
  ) : (
    <span>{ancestorInitial(title, value)}</span>
  );

  const handleLocalImageChange = (file: File | null) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      onAncestorChange(relationKey, 'photoUrl', result as DogAncestorProfile['photoUrl']);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) {
    return (
      <div className={`pedigree-progress-card${hasData ? ' is-filled' : ' is-empty'}`}>
        <div className="pedigree-progress-card__head">
          <div className="pedigree-progress-card__avatar">{avatar}</div>
          <div className="pedigree-progress-card__copy">
            <span className="eyebrow-label">{title}</span>
            <h4>{hasData ? value.name || title : subtitle}</h4>
            <p>{hasData ? copy.savedHint ?? 'Записът е подготвен и можеш да го редактираш по всяко време.' : copy.emptyHint ?? 'Полетата ще се покажат само когато решиш да добавиш тази връзка.'}</p>
          </div>
        </div>

        <div className="pedigree-progress-card__actions">
          <button type="button" className="button-secondary small" onClick={() => setIsOpen(true)}>
            {hasData ? copy.edit ?? 'Редактирай' : `${copy.add ?? 'Добави'} ${title.toLowerCase()}`}
          </button>
          {hasData ? (
            <button type="button" className="button-ghost small" onClick={() => onClear(relationKey)}>
              {copy.remove ?? 'Премахни'}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="pedigree-progress-card is-open is-filled">
      <div className="pedigree-progress-card__head">
        <div className="pedigree-progress-card__avatar">{avatar}</div>
        <div className="pedigree-progress-card__copy">
          <span className="eyebrow-label">{title}</span>
          <h4>{value.name || subtitle}</h4>
          <p>{copy.openHint ?? 'Добави референтна снимка, после само детайлите, които наистина знаеш за този предец.'}</p>
        </div>
      </div>

      <div className="pedigree-progress-card__actions is-open-row">
        <button type="button" className="button-ghost small" onClick={() => setIsOpen(false)}>
          {copy.collapse ?? 'Скрий полетата'}
        </button>
        <button type="button" className="button-ghost small" onClick={() => onClear(relationKey)}>
          {copy.remove ?? 'Премахни'}
        </button>
      </div>

      <div className="pedigree-progress-card__form-shell">
        <div className="pedigree-ancestor-upload">
          <div className="pedigree-ancestor-upload__preview">
            {value.photoUrl ? (
              <ImageLightbox src={value.photoUrl} alt={value.name || title} />
            ) : (
              <span>{ancestorInitial(title, value)}</span>
            )}
          </div>

          <div className="pedigree-ancestor-upload__copy">
            <span className="field-label">{copy.imageLabel ?? 'Изображение на предеца'}</span>
            <p>{copy.imageHint ?? 'Избери снимка от устройството си. Тя ще се покаже веднага в тази форма и в родословното дърво.'}</p>
            <div className="pedigree-ancestor-upload__actions">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="pedigree-ancestor-upload__input"
                onChange={(event) => {
                  handleLocalImageChange(event.target.files?.[0] ?? null);
                  event.currentTarget.value = '';
                }}
              />
              <button type="button" className="button-secondary small" onClick={() => fileInputRef.current?.click()}>
                {value.photoUrl ? copy.replaceImage ?? 'Смени изображението' : copy.uploadImage ?? 'Качи изображение'}
              </button>
              {value.photoUrl ? (
                <button
                  type="button"
                  className="button-ghost small"
                  onClick={() => onAncestorChange(relationKey, 'photoUrl', null)}
                >
                  {copy.removeImage ?? 'Премахни изображението'}
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="form-grid two-up pedigree-editor-grid">
          <label className="field-group">
            <span className="field-label">{t.fields.name}</span>
            <input
              className="field-input"
              value={value.name}
              onChange={(event) => onAncestorChange(relationKey, 'name', event.target.value)}
              placeholder={t.placeholders.name}
            />
          </label>

          <label className="field-group">
            <span className="field-label">{t.fields.sex}</span>
            <LuxurySelect
              value={value.sex ?? ''}
              onValueChange={(nextValue) => onAncestorChange(relationKey, 'sex', (nextValue || null) as DogAncestorProfile['sex'])}
              options={[
                { value: '', label: t.placeholders.selectSex },
                { value: 'male', label: dictionary.form.fields.male },
                { value: 'female', label: dictionary.form.fields.female },
              ]}
            />
          </label>

          <label className="field-group">
            <span className="field-label">{t.fields.birthDate}</span>
            <input
              className="field-input"
              type="date"
              value={value.dateOfBirth ?? ''}
              onChange={(event) => onAncestorChange(relationKey, 'dateOfBirth', event.target.value || null)}
            />
          </label>

          <label className="field-group">
            <span className="field-label">{t.fields.color}</span>
            <LuxurySelect
              value={value.color ?? ''}
              onValueChange={(nextValue) => onAncestorChange(relationKey, 'color', (nextValue || null) as DogAncestorProfile['color'])}
              options={colorOptions}
            />
          </label>

          <label className="field-group">
            <span className="field-label">{t.fields.country}</span>
            <LuxurySelect
              value={value.country ?? ''}
              onValueChange={(nextValue) => onAncestorChange(relationKey, 'country', (nextValue || null) as DogAncestorProfile['country'])}
              options={countryOptions}
            />
          </label>

          <label className="field-group">
            <span className="field-label">{t.fields.titles}</span>
            <input
              className="field-input"
              value={value.titles ?? ''}
              onChange={(event) => onAncestorChange(relationKey, 'titles', event.target.value || null)}
              placeholder={t.placeholders.titles}
            />
          </label>

          <label className="field-group pedigree-editor-grid__full">
            <span className="field-label">{t.fields.note}</span>
            <textarea
              className="field-textarea"
              value={value.note ?? ''}
              onChange={(event) => onAncestorChange(relationKey, 'note', event.target.value || null)}
              placeholder={t.placeholders.note}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export function PedigreeEditor({ pedigree, onAncestorChange }: PedigreeEditorProps) {
  const { dictionary } = useLocale();
  const t = dictionary.form.pedigree;
  const copy = t.progressive ?? {};

  const [showParents, setShowParents] = useState(() => hasAnyPedigreeData(pedigree, PEDIGREE_PARENTS));
  const [showMaternal, setShowMaternal] = useState(() => hasAnyPedigreeData(pedigree, PEDIGREE_MATERNAL_GRANDPARENTS));
  const [showPaternal, setShowPaternal] = useState(() => hasAnyPedigreeData(pedigree, PEDIGREE_PATERNAL_GRANDPARENTS));
  const [showGreatGrandparents, setShowGreatGrandparents] = useState(() => hasAnyPedigreeData(pedigree, PEDIGREE_GREAT_GRANDPARENTS));

  const fatherReady = hasAncestorData(pedigree.father);
  const motherReady = hasAncestorData(pedigree.mother);
  const maternalGrandparentsReady = hasAnyPedigreeData(pedigree, PEDIGREE_MATERNAL_GRANDPARENTS);
  const paternalGrandparentsReady = hasAnyPedigreeData(pedigree, PEDIGREE_PATERNAL_GRANDPARENTS);
  const visibleGreatGrandparents = useMemo(
    () =>
      PEDIGREE_GREAT_GRANDPARENTS.filter((relationKey) => {
        const parentKey = GREAT_PARENT_MAP[relationKey];
        return parentKey ? hasAncestorData(pedigree[parentKey]) : false;
      }),
    [pedigree],
  );

  useEffect(() => {
    if (hasAnyPedigreeData(pedigree, PEDIGREE_PARENTS)) setShowParents(true);
    if (hasAnyPedigreeData(pedigree, PEDIGREE_MATERNAL_GRANDPARENTS)) setShowMaternal(true);
    if (hasAnyPedigreeData(pedigree, PEDIGREE_PATERNAL_GRANDPARENTS)) setShowPaternal(true);
    if (hasAnyPedigreeData(pedigree, PEDIGREE_GREAT_GRANDPARENTS)) setShowGreatGrandparents(true);
  }, [pedigree]);

  const clearAncestor = (relationKey: DogAncestorRelationKey) => {
    const keysToClear = [relationKey, ...BRANCH_RELATIONS[relationKey]];

    for (const key of keysToClear) {
      for (const field of ANCESTOR_FIELDS) {
        onAncestorChange(key, field, EMPTY_ANCESTOR_PROFILE[field] as DogAncestorProfile[typeof field]);
      }
    }
  };

  const renderGroup = (
    title: string,
    description: string,
    keys: readonly DogAncestorRelationKey[],
  ) => (
    <section className="pedigree-editor-group pedigree-progressive-group">
      <div className="pedigree-editor-group__head">
        <div>
          <span className="eyebrow-label">{title}</span>
          <h3>{description}</h3>
        </div>
      </div>

      <div className="pedigree-progress-grid">
        {keys.map((relationKey) => (
          <PedigreeAncestorCard
            key={relationKey}
            relationKey={relationKey}
            title={t.relations[relationKey]}
            subtitle={t.subtitles[relationKey]}
            value={{ ...EMPTY_ANCESTOR_PROFILE, ...pedigree[relationKey] }}
            onAncestorChange={onAncestorChange}
            onClear={clearAncestor}
          />
        ))}
      </div>
    </section>
  );

  return (
    <div className="pedigree-editor-stack pedigree-progressive-stack">
      <div className="pedigree-editor-intro pedigree-editor-intro--progressive">
        <div className="pedigree-editor-intro__main">
          <div className="pedigree-editor-intro__copy">
            <span className="eyebrow-label">{t.editorEyebrow}</span>
            <h3>{t.editorTitle}</h3>
            <p>{t.editorText}</p>
          </div>

          <div className="pedigree-progressive-help__steps">
            <div>
              <strong>01</strong>
              <span>{copy.stepOne ?? 'Първо попълни основния Cane Corso профил.'}</span>
            </div>
            <div>
              <strong>02</strong>
              <span>{copy.stepTwo ?? 'После добавяй само родителите и линиите, които реално знаеш.'}</span>
            </div>
            <div>
              <strong>03</strong>
              <span>{copy.stepThree ?? 'Дървото отгоре се разширява само за попълнените клонове.'}</span>
            </div>
          </div>
        </div>

        <div className="pedigree-editor-intro__actions">
          <a href="/guide?topic=member-workspace#member-workspace" className="button-ghost small">
            {copy.helpCta ?? 'Помощ / как се работи'}
          </a>
        </div>
      </div>

      {!showParents ? (
        <section className="pedigree-step-shell pedigree-step-shell--compact">
          <div className="pedigree-step-shell__copy">
            <span className="eyebrow-label">{t.groups.parents}</span>
            <h3>{copy.parentsTitle ?? 'Добави родители само ако са известни'}</h3>
            <p>{copy.parentsText ?? 'Не е нужно да попълваш всичко наведнъж. Отвори само баща и майка, ако имаш реална информация.'}</p>
          </div>
          <div className="pedigree-step-shell__actions">
            <button type="button" className="button-secondary" onClick={() => setShowParents(true)}>
              {copy.addParents ?? 'Добави родители (ако се знаят)'}
            </button>
          </div>
        </section>
      ) : (
        renderGroup(t.groups.parents, t.groupDescriptions.parents, PEDIGREE_PARENTS)
      )}

      {!showPaternal ? (
        <section className={`pedigree-step-shell${fatherReady ? '' : ' is-disabled'}`}>
          <div className="pedigree-step-shell__copy">
            <span className="eyebrow-label">{t.groups.paternalLine}</span>
            <h3>{copy.paternalTitle ?? 'Добави родителите на бащата само ако са известни'}</h3>
            <p>{fatherReady ? copy.paternalReady ?? 'Бащата е добавен. Можеш да отвориш само неговата линия и да попълниш това, което знаеш.' : copy.waitingForFather ?? 'Първо добави бащата. След това ще можеш спокойно да отвориш бащината линия.'}</p>
          </div>
          <div className="pedigree-step-shell__actions">
            <button type="button" className="button-secondary" onClick={() => setShowPaternal(true)} disabled={!fatherReady}>
              {copy.addPaternal ?? 'Добави родители на бащата'}
            </button>
          </div>
        </section>
      ) : (
        renderGroup(t.groups.paternalLine, t.groupDescriptions.paternalLine, PEDIGREE_PATERNAL_GRANDPARENTS)
      )}

      {!showMaternal ? (
        <section className={`pedigree-step-shell${motherReady ? '' : ' is-disabled'}`}>
          <div className="pedigree-step-shell__copy">
            <span className="eyebrow-label">{t.groups.maternalLine}</span>
            <h3>{copy.maternalTitle ?? 'Добави родителите на майката само ако са известни'}</h3>
            <p>{motherReady ? copy.maternalReady ?? 'Майката е добавена. Отвори само майчината линия и попълвай стъпка по стъпка.' : copy.waitingForMother ?? 'Първо добави майката. След това ще можеш да покажеш майчината линия.'}</p>
          </div>
          <div className="pedigree-step-shell__actions">
            <button type="button" className="button-secondary" onClick={() => setShowMaternal(true)} disabled={!motherReady}>
              {copy.addMaternal ?? 'Добави родители на майката'}
            </button>
          </div>
        </section>
      ) : (
        renderGroup(t.groups.maternalLine, t.groupDescriptions.maternalLine, PEDIGREE_MATERNAL_GRANDPARENTS)
      )}

      {!showGreatGrandparents ? (
        <section className={`pedigree-step-shell${maternalGrandparentsReady || paternalGrandparentsReady ? '' : ' is-disabled'}`}>
          <div className="pedigree-step-shell__copy">
            <span className="eyebrow-label">{t.groups.greatGrandparents}</span>
            <h3>{copy.greatTitle ?? 'Разшири дървото само ако имаш данни за следващото поколение'}</h3>
            <p>{maternalGrandparentsReady || paternalGrandparentsReady ? copy.greatReady ?? 'Ще се покажат само клоновете, за които вече има баба или дядо.' : copy.waitingForGrandparents ?? 'Първо добави поне една баба или дядо. Тогава ще можеш да разшириш дървото още едно ниво.'}</p>
          </div>
          <div className="pedigree-step-shell__actions">
            <button
              type="button"
              className="button-secondary"
              onClick={() => setShowGreatGrandparents(true)}
              disabled={visibleGreatGrandparents.length === 0}
            >
              {copy.addGreat ?? 'Добави следващо поколение'}
            </button>
          </div>
        </section>
      ) : visibleGreatGrandparents.length ? (
        renderGroup(t.groups.greatGrandparents, t.groupDescriptions.greatGrandparents, visibleGreatGrandparents)
      ) : null}
    </div>
  );
}
