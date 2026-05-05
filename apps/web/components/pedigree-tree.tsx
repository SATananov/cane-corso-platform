'use client';

import { useMemo, useState } from 'react';
import type {
  DogAncestorProfile,
  DogAncestorRelationKey,
  DogPedigreeProfile,
} from '@cane-corso-platform/contracts';
import { useLocale } from '@/components/locale-provider';
import { getPedigreeFilledCount, getPedigreePhotoCount } from '@/lib/dog-pedigree';

type TreeDefinition = {
  type: 'root' | 'ancestor';
  relationKey?: DogAncestorRelationKey;
  children?: TreeDefinition[];
};

const TREE_DEFINITION: TreeDefinition = {
  type: 'root',
  children: [
    {
      type: 'ancestor',
      relationKey: 'father',
      children: [
        {
          type: 'ancestor',
          relationKey: 'fatherFather',
          children: [
            { type: 'ancestor', relationKey: 'fatherFatherFather' },
            { type: 'ancestor', relationKey: 'fatherFatherMother' },
          ],
        },
        {
          type: 'ancestor',
          relationKey: 'fatherMother',
          children: [
            { type: 'ancestor', relationKey: 'fatherMotherFather' },
            { type: 'ancestor', relationKey: 'fatherMotherMother' },
          ],
        },
      ],
    },
    {
      type: 'ancestor',
      relationKey: 'mother',
      children: [
        {
          type: 'ancestor',
          relationKey: 'motherFather',
          children: [
            { type: 'ancestor', relationKey: 'motherFatherFather' },
            { type: 'ancestor', relationKey: 'motherFatherMother' },
          ],
        },
        {
          type: 'ancestor',
          relationKey: 'motherMother',
          children: [
            { type: 'ancestor', relationKey: 'motherMotherFather' },
            { type: 'ancestor', relationKey: 'motherMotherMother' },
          ],
        },
      ],
    },
  ],
};

interface PedigreeTreeProps {
  dogName: string;
  pedigree: DogPedigreeProfile;
  rootImageUrl?: string | null;
}

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

function hasVisibleNode(node: TreeDefinition, pedigree: DogPedigreeProfile): boolean {
  if (node.type === 'root') {
    return true;
  }

  if (node.relationKey && hasAncestorData(pedigree[node.relationKey])) {
    return true;
  }

  return false;
}

function PedigreeNodeCard({
  title,
  subtitle,
  imageUrl,
  size,
  onClick,
  filled,
  isRoot = false,
}: {
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  size: 'root' | 'parent' | 'grandparent' | 'great';
  onClick?: () => void;
  filled: boolean;
  isRoot?: boolean;
}) {
  const content = (
    <>
      <div className={`pedigree-node-card__image pedigree-node-card__image--${size}`}>
        {imageUrl ? <img src={imageUrl} alt={title} loading="lazy" decoding="async" /> : <span>{title.slice(0, 1).toUpperCase()}</span>}
      </div>
      <div className="pedigree-node-card__copy">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </>
  );

  if (isRoot || !onClick) {
    return (
      <div className={`pedigree-node-card pedigree-node-card--${size}${filled ? ' is-filled' : ''}${isRoot ? ' is-root' : ''}`}>
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`pedigree-node-card pedigree-node-card--${size}${filled ? ' is-filled' : ''}`}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

function PedigreeBranch({
  node,
  dogName,
  pedigree,
  onOpen,
  relations,
  previewLabel,
  emptyState,
  rootImageUrl = null,
  depth = 0,
}: {
  node: TreeDefinition;
  dogName: string;
  pedigree: DogPedigreeProfile;
  onOpen: (relationKey: DogAncestorRelationKey) => void;
  relations: Record<DogAncestorRelationKey, string>;
  previewLabel: string;
  emptyState: string;
  rootImageUrl?: string | null;
  depth?: number;
}) {
  const isRoot = node.type === 'root';
  const relationKey = node.relationKey;
  const profile = relationKey ? pedigree[relationKey] : null;
  const filled = isRoot ? Boolean(dogName.trim()) : hasAncestorData(profile);

  if (!isRoot && !filled) {
    return null;
  }

  const size = depth === 0 ? 'root' : depth === 1 ? 'parent' : depth === 2 ? 'grandparent' : 'great';
  const title = isRoot ? dogName || emptyState : profile?.name?.trim() || relations[relationKey!];
  const subtitle = isRoot ? previewLabel : relations[relationKey!];
  const resolvedImageUrl = isRoot ? rootImageUrl : profile?.photoUrl;
  const visibleChildren = (node.children ?? []).filter((child) => hasVisibleNode(child, pedigree));

  return (
    <div className={`pedigree-branch pedigree-branch--depth-${depth}${visibleChildren.length ? ' has-children' : ''}`}>
      <PedigreeNodeCard
        title={title}
        subtitle={subtitle}
        imageUrl={resolvedImageUrl}
        size={size}
        filled={filled}
        isRoot={isRoot}
        onClick={relationKey && filled ? () => onOpen(relationKey) : undefined}
      />

      {visibleChildren.length ? (
        <div className="pedigree-branch__children-wrap">
          <span className="pedigree-branch__line-vertical" />
          <div className={`pedigree-branch__children pedigree-branch__children--${visibleChildren.length}`}>
            {visibleChildren.length > 1 ? <span className="pedigree-branch__line-horizontal" /> : null}
            {visibleChildren.map((child) => (
              <div key={child.relationKey ?? 'root'} className="pedigree-branch__child">
                <span className="pedigree-branch__line-child" />
                <PedigreeBranch
                  node={child}
                  dogName={dogName}
                  pedigree={pedigree}
                  onOpen={onOpen}
                  relations={relations}
                  previewLabel={previewLabel}
                  emptyState={emptyState}
                  rootImageUrl={rootImageUrl}
                  depth={depth + 1}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PedigreeTree({ dogName, pedigree, rootImageUrl = null }: PedigreeTreeProps) {
  const { dictionary } = useLocale();
  const t = dictionary.form.pedigree;
  const [activeRelationKey, setActiveRelationKey] = useState<DogAncestorRelationKey | null>(null);
  const filledCount = getPedigreeFilledCount(pedigree);
  const photoCount = getPedigreePhotoCount(pedigree);
  const activeProfile = useMemo(
    () => (activeRelationKey ? pedigree[activeRelationKey] : null),
    [activeRelationKey, pedigree],
  );

  return (
    <div className="pedigree-tree-stage">
      <div className="pedigree-tree-stage__head">
        <div>
          <span className="eyebrow-label">{t.treeEyebrow}</span>
          <h3>{t.treeTitle}</h3>
          <p>{t.treeDescription.replace('{dog}', dogName || dictionary.form.preview.unnamed)}</p>
        </div>
        <div className="pedigree-tree-stage__stats">
          <div>
            <strong>{filledCount}/14</strong>
            <span>{t.stats.filledAncestors}</span>
          </div>
          <div>
            <strong>{photoCount}</strong>
            <span>{t.stats.ancestorPhotos}</span>
          </div>
        </div>
      </div>

      <div className="pedigree-tree-canvas">
        <div className="pedigree-tree-canvas__inner">
          <PedigreeBranch
            node={TREE_DEFINITION}
            dogName={dogName}
            pedigree={pedigree}
            onOpen={setActiveRelationKey}
            relations={t.relations}
            previewLabel={dictionary.form.preview.livePreview}
            emptyState={dictionary.form.preview.unnamed}
            rootImageUrl={rootImageUrl}
          />
        </div>
      </div>

      {activeRelationKey ? (
        <div className="pedigree-lightbox" role="dialog" aria-modal="true">
          <button
            type="button"
            className="pedigree-lightbox__backdrop"
            onClick={() => setActiveRelationKey(null)}
            aria-label={dictionary.common.close}
          />
          <div className="pedigree-lightbox__panel">
            <button type="button" className="pedigree-lightbox__close" onClick={() => setActiveRelationKey(null)}>
              {dictionary.common.close}
            </button>
            <div className="pedigree-lightbox__content">
              <div className="pedigree-lightbox__image">
                {activeProfile?.photoUrl ? (
                  <img src={activeProfile.photoUrl} alt={activeProfile.name || t.relations[activeRelationKey]} loading="lazy" decoding="async" />
                ) : (
                  <span>{(activeProfile?.name || t.relations[activeRelationKey]).slice(0, 1).toUpperCase()}</span>
                )}
              </div>
              <div className="pedigree-lightbox__copy">
                <span className="eyebrow-label">{t.relations[activeRelationKey]}</span>
                <h4>{activeProfile?.name || t.modal.unknownAncestor}</h4>
                <dl className="pedigree-lightbox__details">
                  <div>
                    <dt>{t.fields.sex}</dt>
                    <dd>
                      {activeProfile?.sex === 'male'
                        ? dictionary.form.fields.male
                        : activeProfile?.sex === 'female'
                          ? dictionary.form.fields.female
                          : dictionary.common.notSetYet}
                    </dd>
                  </div>
                  <div>
                    <dt>{t.fields.birthDate}</dt>
                    <dd>{activeProfile?.dateOfBirth || dictionary.common.notSetYet}</dd>
                  </div>
                  <div>
                    <dt>{t.fields.color}</dt>
                    <dd>{activeProfile?.color || dictionary.common.notSetYet}</dd>
                  </div>
                  <div>
                    <dt>{t.fields.country}</dt>
                    <dd>{activeProfile?.country || dictionary.common.notSetYet}</dd>
                  </div>
                  <div>
                    <dt>{t.fields.titles}</dt>
                    <dd>{activeProfile?.titles || dictionary.common.notSetYet}</dd>
                  </div>
                  <div>
                    <dt>{t.fields.note}</dt>
                    <dd>{activeProfile?.note || dictionary.common.notSetYet}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
