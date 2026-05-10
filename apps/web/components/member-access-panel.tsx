'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ApiRequestError, fetchApiDocument } from '@/lib/api/fetcher';
import { useLocale } from '@/components/locale-provider';
import { SignOutButton } from '@/components/sign-out-button';
import { IconSymbol } from '@/components/icon-symbol';
import type {
  AppRole,
  DevAccessIdentitiesDocument,
  DevSignInDocument,
} from '@cane-corso-platform/contracts';
import {
  buildAccessPath,
  canAccessAdminArea,
  getAccessContinueLabel,
  getPostLoginRedirectPath,
  type AccessIntent,
  type AccessNotice,
} from '@/lib/access-control';

type AuthPanelCopy = {
  eyebrow: string;
  titleMember: string;
  titlePartner: string;
  descriptionMember: string;
  descriptionPartner: string;
  stepsMember: string[];
  stepsPartner: string[];
  noticeLabels: Record<AccessNotice, { title: string; description: string }>;
  registerTitleMember: string;
  registerTitlePartner: string;
  registerDescriptionMember: string;
  registerDescriptionPartner: string;
  signInTitle: string;
  signInDescriptionMember: string;
  signInDescriptionPartner: string;
  firstNameLabel: string;
  lastNameLabel: string;
  emailLabel: string;
  passwordLabel: string;
  showPasswordLabel: string;
  hidePasswordLabel: string;
  firstNamePlaceholder: string;
  lastNamePlaceholder: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  createAccountLabel: string;
  signInLabel: string;
  submitPendingLabel: string;
  benefitsTitleMember: string;
  benefitsTitlePartner: string;
  benefitsMember: string[];
  benefitsPartner: string[];
  partnerHintTitle: string;
  partnerHintDescription: string;
  switchToMember: string;
  switchToPartner: string;
  devToolsToggle: string;
  devToolsBadge: string;
  devBoxTitle: string;
  devBoxDescription: string;
  currentSessionTitle: string;
  currentSessionDescription: string;
  activeIdentity: string;
  continueCurrent: string;
  signOutLabel: string;
  switchHint: string;
  loading: string;
  noIdentities: string;
  customEmailLabel: string;
  customEmailPlaceholder: string;
  submitCustomLabel: string;
  success: string;
  successAccountCreatedMember: string;
  successAccountCreatedPartner: string;
  roleLabels: Record<string, string>;
  existingAccountHint: string;
  requiredFieldMessage: string;
  invalidEmailMessage: string;
  passwordTooShortMessage: string;
  fixSignUpErrorsMessage: string;
  fixSignInErrorsMessage: string;
  memberEditorialEyebrow: string;
  memberEditorialTitle: string;
  memberEditorialDescription: string;
  memberEditorialMonogram: string;
};

const copyByLocale: Record<string, AuthPanelCopy> = {
  en: {
    eyebrow: 'Choose your path into the platform',
    titleMember: 'Create or continue your member access',
    titlePartner: 'Create your personal account first',
    descriptionMember:
      'Member access is for owners, enthusiasts, and future members who want a personal profile, My Cane Corso tools, and deeper platform access.',
    descriptionPartner:
      'Partner applicants start with a personal account for the real person behind the business. After that, they continue into the partner application for a clinic, service, or professional listing.',
    stepsMember: ['Personal account', 'Member access', 'My Cane Corso'],
    stepsPartner: ['Personal account first', 'Partner application next', 'Admin approval before publishing'],
    noticeLabels: {
      member_required: {
        title: 'This area is available for registered members only.',
        description: 'Create or continue your member access to unlock the deeper personal workspace and member tools.',
      },
      partner_required: {
        title: 'Partner submission requires a personal account first.',
        description: 'Continue as a member first, then move into the partner application flow.',
      },
      admin_required: {
        title: 'This area is restricted to approved admin access.',
        description: 'Public visitors and members can browse the platform, but moderation tools stay protected.',
      },
      signed_out: {
        title: 'You have signed out successfully.',
        description: 'You are now back in viewer mode. Sign in again whenever you want to continue deeper.',
      },
    },
    registerTitleMember: 'Create your personal member account',
    registerTitlePartner: 'Create the personal account behind the partner profile',
    registerDescriptionMember: 'Start with your own name and email. You can complete and enrich your profile after you enter the platform.',
    registerDescriptionPartner: 'The login account always belongs to a real person. The business or professional profile is submitted in the second step.',
    signInTitle: 'Already have an account?',
    signInDescriptionMember: 'Sign in to continue with your personal member access, My Cane Corso, and deeper platform areas.',
    signInDescriptionPartner: 'Sign in with your personal account first, then continue into the partner application flow.',
    firstNameLabel: 'First name',
    lastNameLabel: 'Last name',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    showPasswordLabel: 'Show password',
    hidePasswordLabel: 'Hide password',
    firstNamePlaceholder: 'Stefano',
    lastNamePlaceholder: 'De Tanini',
    emailPlaceholder: 'name@example.com',
    passwordPlaceholder: 'At least 8 characters',
    createAccountLabel: 'Create account',
    signInLabel: 'Sign in',
    submitPendingLabel: 'Please wait…',
    benefitsTitleMember: 'Member access includes',
    benefitsTitlePartner: 'What happens after the personal account',
    benefitsMember: ['Personal profile', 'My Cane Corso workspace', 'Deeper member-only sections'],
    benefitsPartner: ['Personal account first', 'Partner application second', 'Public listing only after approval'],
    partnerHintTitle: 'Partner applications are reviewed before publishing',
    partnerHintDescription: 'Clinics, trainers, breeders, transport, boarding, shops, photographers, and other relevant professionals can apply after their personal account is created.',
    switchToMember: 'Open the member path',
    switchToPartner: 'Open the partner path',
    devToolsToggle: 'Access testing tools',
    devToolsBadge: 'Testing only',
    devBoxTitle: 'Testing access',
    devBoxDescription: 'Use this only when testing access is enabled. It creates a signed session without going through the standard account flow.',
    currentSessionTitle: 'Current active access',
    currentSessionDescription: 'You already have an active session. Continue deeper or sign out and return to viewer mode.',
    activeIdentity: 'Active identity',
    continueCurrent: 'Continue with current session',
    signOutLabel: 'Sign out',
    switchHint: 'Choosing another test identity below will replace the current signed session.',
    loading: 'Loading test identities…',
    noIdentities: 'No local test identities are available yet. Create or seed one first.',
    customEmailLabel: 'Or continue with a known email',
    customEmailPlaceholder: 'member@demo.cane-corso.local',
    submitCustomLabel: 'Continue with email',
    success: 'Signed session created. Redirecting…',
    successAccountCreatedMember: 'Your member account is ready. Redirecting…',
    successAccountCreatedPartner: 'Your personal account is ready. Continuing to the partner application…',
    roleLabels: {
      admin: 'Admin',
      super_admin: 'Super admin',
      review_admin: 'Review admin',
      moderator: 'Moderator',
      member: 'Member',
    },
    existingAccountHint: 'Use the same personal account later if you also want to apply as a partner.',
    requiredFieldMessage: 'Please fill in this field.',
    invalidEmailMessage: 'Please enter a valid email address.',
    passwordTooShortMessage: 'Use at least 8 characters for the password.',
    fixSignUpErrorsMessage: 'Please correct the highlighted fields before creating the account.',
    fixSignInErrorsMessage: 'Please correct the highlighted fields before signing in.',
    memberEditorialEyebrow: 'Private USG layer',
    memberEditorialTitle: 'A quieter premium threshold into the private member presence',
    memberEditorialDescription: 'Your personal access begins in a darker, calmer layer before Cane Corso profiles and deeper member tools open in full.',
    memberEditorialMonogram: 'USG',
  },
  bg: {
    eyebrow: 'Избери своя път за включване',
    titleMember: 'Създай или продължи членския си достъп',
    titlePartner: 'Създай акаунт за партньорски достъп',
    descriptionMember:
      'Членският достъп е за собственици, любители и бъдещи членове, които искат личен профил, инструменти за своите Cane Corso и по-дълбок достъп до платформата.',
    descriptionPartner:
      'Партньорският път започва с личен акаунт на реален човек. След това продължаваш към кандидатура за клиника, услуга, професионален профил или бизнес присъствие.',
    stepsMember: ['Личен акаунт', 'Членски достъп', 'Моите Cane Corso'],
    stepsPartner: ['Личен акаунт', 'Партньорска кандидатура', 'Одобрено публикуване'],
    noticeLabels: {
      member_required: {
        title: 'Тази част е достъпна само за регистрирани членове.',
        description: 'Създай или продължи членския си достъп, за да отключиш по-дълбоката лична зона и членските инструменти.',
      },
      partner_required: {
        title: 'Партньорската кандидатура изисква първо личен акаунт.',
        description: 'Продължи първо като член, след което премини към партньорската кандидатура.',
      },
      admin_required: {
        title: 'Тази зона е достъпна само за одобрен админ достъп.',
        description: 'Публичните посетители и членовете могат да разглеждат платформата, но модерацията остава защитена.',
      },
      signed_out: {
        title: 'Успешно излезе от профила си.',
        description: 'Вече си в режим на разглеждане. Влез отново, когато искаш да продължиш.',
      },
    },
    registerTitleMember: 'Създай личния си членски акаунт',
    registerTitlePartner: 'Започни с личен акаунт за партньорски достъп',
    registerDescriptionMember: 'Започваш със своето име и имейл. След влизане в платформата можеш да допълниш и обогатиш профила си.',
    registerDescriptionPartner: 'Личният акаунт е първата и задължителна стъпка. След него подаваш отделно кандидатурата за своята клиника, услуга, развъдник или бизнес.',
    signInTitle: 'Вече имаш акаунт?',
    signInDescriptionMember: 'Влез, за да продължиш с личния си членски достъп, Моите Cane Corso и по-дълбоките зони на платформата.',
    signInDescriptionPartner: 'Влез с вече създадения личен акаунт и продължи директно към партньорския път.',
    firstNameLabel: 'Име',
    lastNameLabel: 'Фамилия',
    emailLabel: 'Имейл',
    passwordLabel: 'Парола',
    showPasswordLabel: 'Покажи паролата',
    hidePasswordLabel: 'Скрий паролата',
    firstNamePlaceholder: 'Стефан',
    lastNamePlaceholder: 'Тананов',
    emailPlaceholder: 'name@example.com',
    passwordPlaceholder: 'Поне 8 символа',
    createAccountLabel: 'Създай акаунт',
    signInLabel: 'Влез',
    submitPendingLabel: 'Моля, изчакай…',
    benefitsTitleMember: 'Членският достъп включва',
    benefitsTitlePartner: 'Как протича партньорският път',
    benefitsMember: ['Личен профил', 'Лична зона „Моите Cane Corso“', 'Разширени членски секции'],
    benefitsPartner: ['Първо личен акаунт', 'После партньорска кандидатура', 'Публично присъствие само след одобрение'],
    partnerHintTitle: 'Партньорските профили се публикуват само след преглед',
    partnerHintDescription: 'Клиники, треньори, развъдници, транспорт, хотели, магазини, фотографи и други професионалисти кандидатстват след личния акаунт и стават публични едва след одобрение.',
    switchToMember: 'Отвори членския път',
    switchToPartner: 'Отвори партньорския път',
    devToolsToggle: 'Тестови инструменти за достъп',
    devToolsBadge: 'Само за тест',
    devBoxTitle: 'Тестов достъп',
    devBoxDescription: 'Използвай това само когато тестовият достъп е разрешен. Създава подписана сесия без стандартния поток за акаунт.',
    currentSessionTitle: 'Текущ активен достъп',
    currentSessionDescription: 'Вече имаш активна сесия. Продължи по-надълбоко или излез и се върни в режим на разглеждане.',
    activeIdentity: 'Активна идентичност',
    continueCurrent: 'Продължи с текущата сесия',
    signOutLabel: 'Изход',
    switchHint: 'Изборът на друга тестова идентичност отдолу ще замени текущата подписана сесия.',
    loading: 'Зареждане на тестови идентичности…',
    noIdentities: 'Все още няма налични локални тестови идентичности. Създай или зареди тестов профил първо.',
    customEmailLabel: 'Или продължи с познат имейл',
    customEmailPlaceholder: 'member@demo.cane-corso.local',
    submitCustomLabel: 'Продължи с имейл',
    success: 'Подписаната сесия е създадена. Пренасочване…',
    successAccountCreatedMember: 'Членският ти акаунт е готов. Пренасочване…',
    successAccountCreatedPartner: 'Личният ти акаунт е готов. Продължаваме към партньорската кандидатура…',
    roleLabels: {
      admin: 'Админ',
      super_admin: 'Супер админ',
      review_admin: 'Админ за преглед',
      moderator: 'Модератор',
      member: 'Член',
    },
    existingAccountHint: 'Същият личен акаунт остава основата и за бъдещата ти партньорска кандидатура.',
    requiredFieldMessage: 'Моля, попълни това поле.',
    invalidEmailMessage: 'Въведи валиден имейл адрес.',
    passwordTooShortMessage: 'Паролата трябва да е поне 8 символа.',
    fixSignUpErrorsMessage: 'Поправи маркираните полета, преди да създадеш акаунта.',
    fixSignInErrorsMessage: 'Поправи маркираните полета, преди да влезеш.',
    memberEditorialEyebrow: 'Частен USG слой',
    memberEditorialTitle: 'По-спокоен премиум вход към личното членско пространство',
    memberEditorialDescription: 'Личният достъп започва спокойно и подредено, преди да се отворят Cane Corso профилите и по-дълбоките членски инструменти.',
    memberEditorialMonogram: 'USG',
  },
  it: {
    eyebrow: 'Scegli il tuo percorso di accesso',
    titleMember: 'Crea o continua il tuo accesso membro',
    titlePartner: 'Crea prima il tuo account personale',
    descriptionMember:
      'L’accesso membro è per proprietari, appassionati e futuri membri che vogliono un profilo personale, strumenti per i propri Cane Corso e un accesso completo alla piattaforma.',
    descriptionPartner:
      'Il percorso partner inizia con l’account personale della persona responsabile. Dopo, continua con la candidatura per attività, servizio o profilo professionale.',
    stepsMember: ['Account personale', 'Accesso membro', 'I miei Cane Corso'],
    stepsPartner: ['Prima account personale', 'Poi candidatura partner', 'Pubblicazione dopo approvazione'],
    noticeLabels: {
      member_required: {
        title: 'Questa area è disponibile solo per membri registrati.',
        description: 'Crea o continua il tuo accesso membro per sbloccare gli strumenti più profondi per owner e membri.',
      },
      partner_required: {
        title: 'La candidatura partner richiede prima un account personale.',
        description: 'Continua prima come membro e poi passa al flusso di candidatura partner.',
      },
      admin_required: {
        title: 'Quest’area è riservata all’accesso admin approvato.',
        description: 'I visitatori pubblici e i membri possono esplorare la piattaforma, ma gli strumenti di moderazione restano protetti.',
      },
      signed_out: {
        title: 'Sei uscito correttamente.',
        description: 'Ora sei tornato alla modalità visita. Accedi di nuovo quando vuoi continuare.',
      },
    },
    registerTitleMember: 'Crea il tuo account membro',
    registerTitlePartner: 'Crea l’account personale dietro il profilo partner',
    registerDescriptionMember: 'Inizia con nome ed email. Dopo l’accesso potrai completare e rifinire il profilo.',
    registerDescriptionPartner: 'L’account di accesso appartiene sempre a una persona reale. Il business o il profilo professionale si inviano nel secondo passaggio.',
    signInTitle: 'Hai già un account?',
    signInDescriptionMember: 'Accedi per continuare con il profilo personale, I miei Cane Corso e le aree riservate della piattaforma.',
    signInDescriptionPartner: 'Accedi prima con il tuo account personale e poi continua con la candidatura partner.',
    firstNameLabel: 'Nome',
    lastNameLabel: 'Cognome',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    showPasswordLabel: 'Mostra password',
    hidePasswordLabel: 'Nascondi password',
    firstNamePlaceholder: 'Stefano',
    lastNamePlaceholder: 'De Tanini',
    emailPlaceholder: 'name@example.com',
    passwordPlaceholder: 'Almeno 8 caratteri',
    createAccountLabel: 'Crea account',
    signInLabel: 'Accedi',
    submitPendingLabel: 'Attendere…',
    benefitsTitleMember: 'L’accesso membro include',
    benefitsTitlePartner: 'Cosa succede dopo l’account personale',
    benefitsMember: ['Profilo personale', 'Area I miei Cane Corso', 'Sezioni riservate ai membri'],
    benefitsPartner: ['Prima account personale', 'Poi candidatura partner', 'Profilo pubblico solo dopo approvazione'],
    partnerHintTitle: 'Le candidature partner vengono revisionate prima della pubblicazione',
    partnerHintDescription: 'Cliniche, trainer, allevatori, trasporto, hotel, negozi, fotografi e altri professionisti rilevanti possono candidarsi dopo aver creato il proprio account personale.',
    switchToMember: 'Apri il percorso membro',
    switchToPartner: 'Apri il percorso partner',
    devToolsToggle: 'Strumenti di accesso test',
    devToolsBadge: 'Solo test',
    devBoxTitle: 'Accesso di test',
    devBoxDescription: 'Usa questa sezione solo quando l’accesso di test è abilitato. Crea una sessione firmata senza passare dal flusso account standard.',
    currentSessionTitle: 'Accesso attivo attuale',
    currentSessionDescription: 'Hai già una sessione attiva. Continua più a fondo oppure esci e torna in modalità visita.',
    activeIdentity: 'Identità attiva',
    continueCurrent: 'Continua con la sessione attuale',
    signOutLabel: 'Esci',
    switchHint: 'Scegliere un’altra identità di test qui sotto sostituirà l’attuale sessione firmata.',
    loading: 'Caricamento identità di test…',
    noIdentities: 'Nessuna identità di test locale disponibile. Crea o importa prima un profilo di test.',
    customEmailLabel: 'Oppure continua con un’email conosciuta',
    customEmailPlaceholder: 'member@demo.cane-corso.local',
    submitCustomLabel: 'Continua con email',
    success: 'Sessione firmata creata. Reindirizzamento…',
    successAccountCreatedMember: 'Il tuo account membro è pronto. Reindirizzamento…',
    successAccountCreatedPartner: 'Il tuo account personale è pronto. Continuiamo verso la candidatura partner…',
    roleLabels: {
      admin: 'Admin',
      super_admin: 'Super admin',
      review_admin: 'Admin revisione',
      moderator: 'Moderatore',
      member: 'Membro',
    },
    existingAccountHint: 'Potrai usare lo stesso account personale anche più avanti se vorrai candidarti come partner.',
    requiredFieldMessage: 'Compila questo campo.',
    invalidEmailMessage: 'Inserisci un indirizzo email valido.',
    passwordTooShortMessage: 'Usa almeno 8 caratteri per la password.',
    fixSignUpErrorsMessage: 'Correggi i campi evidenziati prima di creare l’account.',
    fixSignInErrorsMessage: 'Correggi i campi evidenziati prima di accedere.',
    memberEditorialEyebrow: 'Livello USG privato',
    memberEditorialTitle: 'Ingresso premium verso l’area privata membro',
    memberEditorialDescription: 'L’accesso personale parte da un’area più calma e riservata, prima di aprire profilo, Cane Corso e strumenti membro.',
    memberEditorialMonogram: 'USG',
  },
};

interface AccessIdentity {
  profileId: string;
  email: string;
  displayName: string;
  role: string;
}

interface CurrentSessionSummary {
  displayName: string | null;
  email: string;
  role: AppRole;
}

type SignUpField = 'firstName' | 'lastName' | 'email' | 'password';
type SignInField = 'email' | 'password';
type SignUpErrors = Partial<Record<SignUpField, string>>;
type SignInErrors = Partial<Record<SignInField, string>>;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}


type ActiveAccessExperience = {
  titleMember: string;
  titlePartner: string;
  descriptionMember: string;
  descriptionPartner: string;
  stepsMember: string[];
  stepsPartner: string[];
  visualEyebrow: string;
  visualTitleMember: string;
  visualTitlePartner: string;
  visualDescriptionMember: string;
  visualDescriptionPartner: string;
  quickTitle: string;
  quickDescription: string;
  workspaceTitleMember: string;
  workspaceTitlePartner: string;
  workspaceDescriptionMember: string;
  workspaceDescriptionPartner: string;
  workspaceLabelMember: string;
  workspaceLabelPartner: string;
  profileTitle: string;
  profileDescription: string;
  profileLabel: string;
  guideTitle: string;
  guideDescription: string;
  guideLabel: string;
};

const activeExperienceByLocale: Record<string, ActiveAccessExperience> = {
  en: {
    titleMember: 'Your member access is already active',
    titlePartner: 'Your personal access is active and ready for the partner path',
    descriptionMember:
      'Continue from your private member layer. From here you can move into My Cane Corso, profile refinement, and the deeper owner workspace.',
    descriptionPartner:
      'Your personal account is already active. Continue from here into profile refinement, the partner path, and the deeper private workspace before any public visibility.',
    stepsMember: ['Active access', 'My Cane Corso', 'Profile'],
    stepsPartner: ['Active access', 'Partner path', 'Profile'],
    visualEyebrow: 'Private member presence',
    visualTitleMember: 'A darker, more exclusive threshold into the private member layer',
    visualTitlePartner: 'A stronger private threshold before the partner application continues',
    visualDescriptionMember:
      'This state should feel less like a normal login page and more like a premium entrance into the protected member zone.',
    visualDescriptionPartner:
      'The private account stays personal first. The public partner presence comes only after the application, review, and approval flow.',
    quickTitle: 'Choose your next step',
    quickDescription: 'Use these shortcuts to continue from the active session without getting lost.',
    workspaceTitleMember: 'Open My Cane Corso',
    workspaceTitlePartner: 'Continue the partner path',
    workspaceDescriptionMember: 'Go directly to the private workspace where you prepare profiles, media, and submissions.',
    workspaceDescriptionPartner: 'Continue from the personal account toward the partner-facing flow and your deeper private tools.',
    workspaceLabelMember: 'Go to My Cane Corso',
    workspaceLabelPartner: 'Continue deeper',
    profileTitle: 'Refine your profile',
    profileDescription: 'Complete your personal details so the private side of the platform feels ready before publication work begins.',
    profileLabel: 'Open profile',
    guideTitle: 'See how the platform works',
    guideDescription: 'Return to the platform guide whenever you want the full explanation of trust, access, and publication flow.',
    guideLabel: 'Open platform guide',
  },
  bg: {
    titleMember: 'Членският ти достъп вече е активен',
    titlePartner: 'Личният ти достъп е активен и е готов за партньорския път',
    descriptionMember:
      'Продължи от частния членски слой. Оттук можеш да влезеш в Моите Cane Corso, да довършиш профила си и да работиш по-надълбоко в личната зона.',
    descriptionPartner:
      'Личният ти акаунт вече е активен. Оттук можеш да продължиш към профила, партньорския път и по-дълбоката лична зона, преди да има публична видимост.',
    stepsMember: ['Активен достъп', 'Моите Cane Corso', 'Профил'],
    stepsPartner: ['Активен достъп', 'Партньорски път', 'Профил'],
    visualEyebrow: 'Частно членско присъствие',
    visualTitleMember: 'По-тъмен и по-ексклузивен праг към личната членска зона',
    visualTitlePartner: 'По-силен частен праг, преди партньорската кандидатура да продължи',
    visualDescriptionMember:
      'Това състояние трябва да се усеща не като обикновена страница за вход, а като премиум вход към защитената членска зона.',
    visualDescriptionPartner:
      'Личният акаунт остава първата стъпка. Публичното партньорско присъствие идва едва след кандидатстване, преглед и одобрение.',
    quickTitle: 'Избери следващата си стъпка',
    quickDescription: 'Използвай тези преки пътища, за да продължиш от активната сесия без да се луташ.',
    workspaceTitleMember: 'Отвори Моите Cane Corso',
    workspaceTitlePartner: 'Продължи партньорския път',
    workspaceDescriptionMember: 'Влез директно в личната зона, където подготвяш профили, медии и подавания.',
    workspaceDescriptionPartner: 'Продължи от личния акаунт към партньорската посока и към по-дълбоките си частни инструменти.',
    workspaceLabelMember: 'Към Моите Cane Corso',
    workspaceLabelPartner: 'Продължи по-надълбоко',
    profileTitle: 'Довърши профила си',
    profileDescription: 'Попълни личните си данни, за да е подредена личната страна на платформата още преди работата по публикуване.',
    profileLabel: 'Към профила',
    guideTitle: 'Виж как работи платформата',
    guideDescription: 'Върни се към наръчника на платформата, когато искаш пълното обяснение за доверие, достъп и пътя към публикуване.',
    guideLabel: 'Отвори наръчника',
  },
  it: {
    titleMember: 'Il tuo accesso membro è già attivo',
    titlePartner: 'Il tuo accesso personale è attivo ed è pronto per il percorso partner',
    descriptionMember:
      'Continua dal livello membro privato. Da qui puoi aprire I miei Cane Corso, rifinire il profilo e lavorare più in profondità nello spazio personale.',
    descriptionPartner:
      'Il tuo account personale è già attivo. Da qui puoi continuare verso il profilo, il percorso partner e lo spazio privato più profondo prima di qualsiasi visibilità pubblica.',
    stepsMember: ['Accesso attivo', 'I miei Cane Corso', 'Profilo'],
    stepsPartner: ['Accesso attivo', 'Percorso partner', 'Profilo'],
    visualEyebrow: 'Presenza membro privata',
    visualTitleMember: 'Una soglia più scura ed esclusiva verso l’area membri privata',
    visualTitlePartner: 'Una soglia privata più forte prima che la candidatura partner continui',
    visualDescriptionMember:
      'Questo stato dovrebbe sentirsi meno come una normale pagina di accesso e più come un ingresso premium verso l’area membri protetta.',
    visualDescriptionPartner:
      'L’account personale resta il primo passo. La presenza partner pubblica arriva solo dopo candidatura, revisione e approvazione.',
    quickTitle: 'Scegli il prossimo passo',
    quickDescription: 'Usa questi accessi rapidi per continuare dalla sessione attiva senza perderti.',
    workspaceTitleMember: 'Apri I miei Cane Corso',
    workspaceTitlePartner: 'Continua il percorso partner',
    workspaceDescriptionMember: 'Entra direttamente nello spazio privato dove prepari profili, media e invii.',
    workspaceDescriptionPartner: 'Continua dall’account personale verso il flusso partner e i tuoi strumenti privati più profondi.',
    workspaceLabelMember: 'Vai a I miei Cane Corso',
    workspaceLabelPartner: 'Continua più a fondo',
    profileTitle: 'Completa il tuo profilo',
    profileDescription: 'Completa i dettagli personali così il lato privato della piattaforma è ordinato prima che inizi il lavoro di pubblicazione.',
    profileLabel: 'Apri profilo',
    guideTitle: 'Vedi come funziona la piattaforma',
    guideDescription: 'Torna alla guida della piattaforma ogni volta che vuoi la spiegazione completa di fiducia, accesso e flusso di pubblicazione.',
    guideLabel: 'Apri la guida',
  },
};

interface MemberAccessPanelProps {
  currentSession?: CurrentSessionSummary | null;
  initialIntent?: AccessIntent;
  notice?: AccessNotice | null;
  nextPath?: string | null;
  showDevelopmentTools?: boolean;
}

interface LocalAuthResponse {
  session: {
    user: {
      role: AppRole;
    };
  };
  accountCreated?: boolean;
}

function getRoleLabel(role: string, copy: AuthPanelCopy) {
  return copy.roleLabels[role] ?? role;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

type SignInPayload = {
  email: string;
  password: string;
};

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function buildSignInPayload(source: SignInPayload): SignInPayload {
  return {
    email: source.email.trim().toLowerCase(),
    password: source.password.trim(),
  };
}

function getSignInErrorMessage(error: unknown, fallback: string, payload: SignInPayload, locale: string) {
  const message = getErrorMessage(error, fallback);

  if (!(error instanceof ApiRequestError) || error.status !== 401) {
    return message;
  }

  if (locale === 'bg') {
    return `${message} Изпратеният login payload е с имейл ${payload.email} и дължина на паролата ${payload.password.length}. Demo паролата DemoMember123! трябва да е точно 14 символа.`;
  }

  if (locale === 'it') {
    return `${message} Il payload di login inviato usa email ${payload.email} e password lunga ${payload.password.length} caratteri. La password demo DemoMember123! deve avere esattamente 14 caratteri.`;
  }

  return `${message} Login payload sent email ${payload.email} with password length ${payload.password.length}. Demo password DemoMember123! must be exactly 14 characters.`;
}

export function MemberAccessPanel({
  currentSession = null,
  initialIntent = 'member',
  notice = null,
  nextPath = null,
  showDevelopmentTools = false,
}: MemberAccessPanelProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const copy = useMemo(() => copyByLocale[locale] ?? copyByLocale.en, [locale]);
  const [identities, setIdentities] = useState<AccessIdentity[]>([]);
  const [devEmail, setDevEmail] = useState('member@demo.cane-corso.local');
  const [devPending, setDevPending] = useState(false);
  const [devStatus, setDevStatus] = useState<string | null>(copy.loading);
  const [signUpPending, setSignUpPending] = useState(false);
  const [signUpStatus, setSignUpStatus] = useState<string | null>(null);
  const [signInPending, setSignInPending] = useState(false);
  const [signInStatus, setSignInStatus] = useState<string | null>(null);
  const [signUpErrors, setSignUpErrors] = useState<SignUpErrors>({});
  const [signInErrors, setSignInErrors] = useState<SignInErrors>({});
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signUpForm, setSignUpForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (!showDevelopmentTools) {
      setIdentities([]);
      setDevStatus(null);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const data = await fetchApiDocument<DevAccessIdentitiesDocument>('/api/auth/dev-identities');

        if (cancelled) {
          return;
        }

        setIdentities(data.identities);
        setDevStatus(data.identities.length > 0 ? null : copy.noIdentities);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setDevStatus(error instanceof Error ? error.message : copy.noIdentities);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [copy.loading, copy.noIdentities, showDevelopmentTools]);

  const validateSignUp = () => {
    const nextErrors: SignUpErrors = {};

    if (!signUpForm.firstName.trim()) {
      nextErrors.firstName = copy.requiredFieldMessage;
    }

    if (!signUpForm.lastName.trim()) {
      nextErrors.lastName = copy.requiredFieldMessage;
    }

    if (!signUpForm.email.trim()) {
      nextErrors.email = copy.requiredFieldMessage;
    } else if (!isValidEmail(signUpForm.email.trim())) {
      nextErrors.email = copy.invalidEmailMessage;
    }

    if (!signUpForm.password.trim()) {
      nextErrors.password = copy.requiredFieldMessage;
    } else if (signUpForm.password.trim().length < 8) {
      nextErrors.password = copy.passwordTooShortMessage;
    }

    return nextErrors;
  };

  const validateSignIn = (form: { email: string; password: string } = signInForm) => {
    const nextErrors: SignInErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = copy.requiredFieldMessage;
    } else if (!isValidEmail(form.email.trim())) {
      nextErrors.email = copy.invalidEmailMessage;
    }

    if (!form.password.trim()) {
      nextErrors.password = copy.requiredFieldMessage;
    }

    return nextErrors;
  };

  const handleSuccessfulAuth = (role: AppRole) => {
    const targetPath = nextPath || (initialIntent === 'partner' ? '/partners/apply' : getPostLoginRedirectPath(role));
    router.push(targetPath);
    router.refresh();
  };

  const continueAsEmail = async (targetEmail: string) => {
    setDevPending(true);
    setDevStatus(null);

    try {
      const data = await fetchApiDocument<DevSignInDocument>('/api/auth/dev-login', {
        method: 'POST',
        body: JSON.stringify({ email: targetEmail }),
      });

      setDevStatus(copy.success);
      handleSuccessfulAuth(data.session.user.role);
    } catch (error) {
      setDevStatus(getErrorMessage(error, 'Unable to continue with the selected identity.'));
    } finally {
      setDevPending(false);
    }
  };

  const handleSignUp = async () => {
    const nextErrors = validateSignUp();
    setSignUpErrors(nextErrors);
    setSignUpStatus(null);

    if (Object.keys(nextErrors).length > 0) {
      setSignUpStatus(copy.fixSignUpErrorsMessage);
      return;
    }

    setSignUpPending(true);

    try {
      const data = await fetchApiDocument<LocalAuthResponse>('/api/auth/sign-up', {
        method: 'POST',
        body: JSON.stringify({
          ...signUpForm,
          locale,
        }),
      });

      setSignUpStatus(initialIntent === 'partner' ? copy.successAccountCreatedPartner : copy.successAccountCreatedMember);
      handleSuccessfulAuth(data.session.user.role);
    } catch (error) {
      setSignUpStatus(getErrorMessage(error, 'Unable to create the account right now.'));
    } finally {
      setSignUpPending(false);
    }
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const rawEmail = getFormString(formData, 'email') || signInForm.email;
    const rawPassword = getFormString(formData, 'password') || signInForm.password;
    const nextForm = buildSignInPayload({
      email: rawEmail,
      password: rawPassword,
    });

    setSignInForm(nextForm);

    const nextErrors = validateSignIn(nextForm);
    setSignInErrors(nextErrors);
    setSignInStatus(null);

    if (Object.keys(nextErrors).length > 0) {
      setSignInStatus(copy.fixSignInErrorsMessage);
      return;
    }

    setSignInPending(true);

    try {
      const data = await fetchApiDocument<LocalAuthResponse>('/api/auth/sign-in', {
        method: 'POST',
        body: JSON.stringify(nextForm),
      });

      setSignInStatus(copy.success);
      handleSuccessfulAuth(data.session.user.role);
    } catch (error) {
      setSignInStatus(getSignInErrorMessage(error, 'Unable to sign in right now.', nextForm, locale));
    } finally {
      setSignInPending(false);
    }
  };

  const activeExperience = activeExperienceByLocale[locale] ?? activeExperienceByLocale.en;
  const noticeContent = notice ? copy.noticeLabels[notice] : null;
  const title = currentSession
    ? initialIntent === 'partner'
      ? activeExperience.titlePartner
      : activeExperience.titleMember
    : initialIntent === 'partner'
      ? copy.titlePartner
      : copy.titleMember;
  const description = currentSession
    ? initialIntent === 'partner'
      ? activeExperience.descriptionPartner
      : activeExperience.descriptionMember
    : initialIntent === 'partner'
      ? copy.descriptionPartner
      : copy.descriptionMember;
  const steps = currentSession
    ? initialIntent === 'partner'
      ? activeExperience.stepsPartner
      : activeExperience.stepsMember
    : initialIntent === 'partner'
      ? copy.stepsPartner
      : copy.stepsMember;
  const registerTitle = initialIntent === 'partner' ? copy.registerTitlePartner : copy.registerTitleMember;
  const registerDescription = initialIntent === 'partner' ? copy.registerDescriptionPartner : copy.registerDescriptionMember;
  const signInDescription = initialIntent === 'partner' ? copy.signInDescriptionPartner : copy.signInDescriptionMember;
  const benefitsTitle = initialIntent === 'partner' ? copy.benefitsTitlePartner : copy.benefitsTitleMember;
  const benefits = initialIntent === 'partner' ? copy.benefitsPartner : copy.benefitsMember;
  const currentTargetPath = currentSession
    ? nextPath || (initialIntent === 'partner' ? '/partners/apply' : getPostLoginRedirectPath(currentSession.role))
    : null;
  const activeWorkspaceHref = currentTargetPath ?? '/my-dogs';
  const activeWorkspaceTitle = initialIntent === 'partner' ? activeExperience.workspaceTitlePartner : activeExperience.workspaceTitleMember;
  const activeWorkspaceDescription =
    initialIntent === 'partner'
      ? activeExperience.workspaceDescriptionPartner
      : activeExperience.workspaceDescriptionMember;
  const activeWorkspaceLabel =
    initialIntent === 'partner'
      ? activeExperience.workspaceLabelPartner
      : activeExperience.workspaceLabelMember;
  const activeVisualTitle = initialIntent === 'partner' ? activeExperience.visualTitlePartner : activeExperience.visualTitleMember;
  const activeVisualDescription =
    initialIntent === 'partner'
      ? activeExperience.visualDescriptionPartner
      : activeExperience.visualDescriptionMember;
  const isAdminSession = currentSession ? canAccessAdminArea(currentSession.role) : false;
  const activeQuickCards = currentSession
    ? [
        {
          title: activeWorkspaceTitle,
          description: isAdminSession
            ? locale === 'bg'
              ? 'Отвори модерационната зона и продължи от официалния слой на доверие и публикуване.'
              : locale === 'it'
                ? 'Apri l’area di moderazione e continua dal livello ufficiale di fiducia e pubblicazione.'
                : 'Open the moderation area and continue from the official trust and publication layer.'
            : activeWorkspaceDescription,
          href: activeWorkspaceHref,
          label: isAdminSession ? getAccessContinueLabel(currentSession.role, locale) : activeWorkspaceLabel,
        },
        {
          title: activeExperience.profileTitle,
          description: activeExperience.profileDescription,
          href: '/profile',
          label: activeExperience.profileLabel,
        },
        {
          title: activeExperience.guideTitle,
          description: activeExperience.guideDescription,
          href: '/guide?topic=overview#overview',
          label: activeExperience.guideLabel,
        },
      ]
    : [];

  const memberEditorial = {
    eyebrow: copy.memberEditorialEyebrow,
    title: copy.memberEditorialTitle,
    description: copy.memberEditorialDescription,
    monogram: copy.memberEditorialMonogram,
  };

  const supportLayerByLocale = {
    en: {
      eyebrow: 'Before you move deeper',
      title: 'Identity, help, and trust should stay close to access',
      description: 'Access feels stronger when identity, guidance, and the official trust path stay connected. These links keep the member and partner entry clear before deeper actions begin.',
      memberCards: [
        { title: 'Manifesto', description: 'Read the point of view behind the platform before you build your private member presence.', href: '/manifesto', icon: 'manifesto' as const },
        { title: 'FAQ', description: 'See the most important answers about review, visibility, and access before you continue.', href: '/faq', icon: 'faq' as const },
        { title: 'Platform guide', description: 'Return to the guide whenever you want the complete explanation of official vs community and publication flow.', href: '/guide?topic=access#access', icon: 'guide' as const },
        { title: 'Official trust', description: 'Explore registry and verify first if you want to understand the public trust layer before deeper member work.', href: '/verify', icon: 'verify' as const },
      ],
      partnerCards: [
        { title: 'Partner world', description: 'See how trusted partner presence fits into the broader ecosystem before you apply.', href: '/partners', icon: 'partners' as const },
        { title: 'Manifesto', description: 'The partner layer should stay aligned with the same breed responsibility and platform doctrine.', href: '/manifesto', icon: 'manifesto' as const },
        { title: 'FAQ', description: 'Get quick clarity on review, visibility, and what becomes public only after approval.', href: '/faq', icon: 'faq' as const },
        { title: 'Platform guide', description: 'Use the guide when you want the bigger map of trust, community, and moderated publication.', href: '/guide?topic=partners#partners', icon: 'guide' as const },
      ],
    },
    bg: {
      eyebrow: 'Преди да продължиш по-надълбоко',
      title: 'Идентичност, помощ и доверие трябва да стоят близо до достъпа',
      description: 'Достъпът работи най-добре, когато идентичността, помощта и доверието са свързани. Тези връзки държат членския и партньорския път ясни, преди да започнат по-дълбоки действия.',
      memberCards: [
        { title: 'Манифест', description: 'Прочети гледната точка зад платформата, преди да изградиш личното си членско присъствие.', href: '/manifesto', icon: 'manifesto' as const },
        { title: 'FAQ', description: 'Виж най-важните отговори за прегледа, видимостта и достъпа, преди да продължиш.', href: '/faq', icon: 'faq' as const },
        { title: 'Наръчник на платформата', description: 'Върни се към наръчника, когато искаш пълното обяснение за официалните и общностните слоеве и пътя към публикуване.', href: '/guide?topic=access#access', icon: 'guide' as const },
        { title: 'Официално доверие', description: 'Разгледай първо регистъра и проверката, ако искаш да разбереш публичния слой на доверие преди по-дълбоката членска работа.', href: '/verify', icon: 'verify' as const },
      ],
      partnerCards: [
        { title: 'Партньорски свят', description: 'Виж как довереното партньорско присъствие влиза в по-широката екосистема, преди да кандидатстваш.', href: '/partners', icon: 'partners' as const },
        { title: 'Манифест', description: 'Партньорският слой трябва да остане в същата отговорност към породата и платформената доктрина.', href: '/manifesto', icon: 'manifesto' as const },
        { title: 'FAQ', description: 'Вземи бърза яснота за прегледа, видимостта и какво става публично едва след одобрение.', href: '/faq', icon: 'faq' as const },
        { title: 'Наръчник на платформата', description: 'Използвай наръчника, когато искаш по-голямата карта на доверието, общностния слой и модерираното публикуване.', href: '/guide?topic=partners#partners', icon: 'guide' as const },
      ],
    },
    it: {
      eyebrow: 'Prima di andare più in profondità',
      title: 'Identità, aiuto e fiducia dovrebbero restare vicini all’accesso',
      description: 'L’accesso funziona meglio quando identità, aiuto e fiducia restano collegati. Questi link mantengono chiaro il percorso membro e partner prima delle azioni più profonde.',
      memberCards: [
        { title: 'Manifesto', description: 'Leggi il punto di vista dietro la piattaforma prima di costruire la tua presenza privata come membro.', href: '/manifesto', icon: 'manifesto' as const },
        { title: 'FAQ', description: 'Vedi le risposte più importanti su revisione, visibilità e accesso prima di continuare.', href: '/faq', icon: 'faq' as const },
        { title: 'Guida piattaforma', description: 'Torna alla guida ogni volta che vuoi la spiegazione completa dei livelli ufficiali e comunitari e del flusso di pubblicazione.', href: '/guide?topic=access#access', icon: 'guide' as const },
        { title: 'Fiducia ufficiale', description: 'Esplora prima registro e verifica se vuoi capire il livello di fiducia pubblica prima del lavoro membro più profondo.', href: '/verify', icon: 'verify' as const },
      ],
      partnerCards: [
        { title: 'Mondo partner', description: 'Vedi come la presenza di partner affidabile si inserisce nell’ecosistema più ampio prima di candidarti.', href: '/partners', icon: 'partners' as const },
        { title: 'Manifesto', description: 'Il livello partner dovrebbe restare allineato con la stessa responsabilità verso la razza e la dottrina della piattaforma.', href: '/manifesto', icon: 'manifesto' as const },
        { title: 'FAQ', description: 'Ottieni chiarezza rapida su revisione, visibilità e su cosa diventa pubblico solo dopo approvazione.', href: '/faq', icon: 'faq' as const },
        { title: 'Guida piattaforma', description: 'Usa la guida quando vuoi la mappa più ampia di fiducia, comunità e pubblicazione moderata.', href: '/guide?topic=partners#partners', icon: 'guide' as const },
      ],
    },
  } as const;

  const supportLayer = supportLayerByLocale[locale] ?? supportLayerByLocale.en;
  const supportCards = initialIntent === 'partner' ? supportLayer.partnerCards : supportLayer.memberCards;

  const partnerEditorial = locale === 'bg'
    ? {
        eyebrow: 'Партньорски път USG',
        title: 'Партньорското присъствие започва лично, а става публично по-късно',
        description:
          'Първо създаваш личен акаунт. После подаваш кандидатура за своята услуга, клиника, развъдник или бизнес присъствие и чакаш одобрение.',
        points: [
          'Личен акаунт за реалния човек зад профила',
          'Отделна партньорска кандидатура за бизнеса или услугата',
          'Публичност само след преглед и одобрение',
        ],
      }
    : locale === 'it'
      ? {
          eyebrow: 'Percorso partner USG',
          title: 'La presenza partner inizia in privato e diventa pubblica più tardi',
          description:
            'Prima crei l’account personale. Poi invii la candidatura per servizio, clinica, allevamento o business e attendi la revisione.',
          points: [
            'Account personale della persona reale dietro al profilo',
            'Candidatura partner separata per attività o servizio',
            'Visibilità pubblica solo dopo revisione e approvazione',
          ],
        }
      : {
          eyebrow: 'USG partner path',
          title: 'The partner presence starts privately and becomes public later',
          description:
            'First you create the personal account. Then you submit the partner application for your service, clinic, breeding program, or business presence and wait for review.',
          points: [
            'Personal account for the real person behind the profile',
            'Separate partner application for the business or service',
            'Public visibility only after review and approval',
          ],
        };

  return (
    <section className="section-card section-card--form access-shell-card">
      <div className="section-card__header">
        <div>
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h1 className="route-title">{title}</h1>
          <p className="route-copy">{description}</p>
        </div>
        <div className="route-hero-pills route-hero-pills--member">
          {steps.map((step) => (
            <span className="route-pill" key={step}>
              {step}
            </span>
          ))}
        </div>
      </div>

      {noticeContent ? (
        <div className="access-notice-banner">
          <span className="eyebrow-label">{locale === 'bg' ? 'USG достъп' : locale === 'it' ? 'Accesso USG' : 'USG access'}</span>
          <h2>{noticeContent.title}</h2>
          <p>{noticeContent.description}</p>
        </div>
      ) : null}

      {currentSession ? (
        <div className="access-active-layout">
          <div className="access-active-main">
            <div className="access-panel-card access-panel-card--session access-panel-card--session-rich">
              <div className="access-session-copy">
                <h2 className="section-card__title">{copy.currentSessionTitle}</h2>
                <p className="section-card__copy">{copy.currentSessionDescription}</p>
              </div>

              <div className="access-session-summary">
                <span className="eyebrow-label">{copy.activeIdentity}</span>
                <h3>{currentSession.displayName ?? currentSession.email}</h3>
                <p>{currentSession.email}</p>
                <span className="access-session-summary__role">{getRoleLabel(currentSession.role, copy)}</span>
              </div>

              <div className="access-panel-card__actions">
                {currentTargetPath ? (
                  <Link href={currentTargetPath} className="btn btn--primary">
                    {copy.continueCurrent}
                  </Link>
                ) : null}
                <SignOutButton label={copy.signOutLabel} />
              </div>
            </div>

            <div className="access-active-quick-grid">
              <div className="access-active-quick-grid__header">
                <span className="eyebrow-label">UNICO SUO GENERE</span>
                <h2 className="section-card__title">{activeExperience.quickTitle}</h2>
                <p className="section-card__copy">{activeExperience.quickDescription}</p>
              </div>

              <div className="access-active-quick-grid__cards">
                {activeQuickCards.map((card) => (
                  <Link className="access-active-quick-card" href={card.href} key={card.href}>
                    <span className="eyebrow-label">{locale === 'bg' ? 'USG път' : locale === 'it' ? 'Percorso USG' : 'USG path'}</span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <span className="access-active-quick-card__action">{card.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="access-active-visual">
            <div className="access-visual-card">
              <div className="access-visual-card__image-wrap">
                <Image
                  src="/brand/editorial-member-shadow-eye.jpg"
                  alt="Cane Corso private member access visual"
                  width={992}
                  height={992}
                  className="access-visual-card__image"
                  priority
                />
              </div>
              <div className="access-visual-card__copy">
                <span className="eyebrow-label">{activeExperience.visualEyebrow}</span>
                <h2>{activeVisualTitle}</h2>
                <p>{activeVisualDescription}</p>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className={`access-onboarding-grid${initialIntent === 'partner' ? ' access-onboarding-grid--partner' : ''}`}>
          <article className="access-panel-card access-onboarding-card access-onboarding-card--primary">
            <span className="eyebrow-label">UNICO SUO GENERE</span>
            <h2 className="section-card__title">{registerTitle}</h2>
            <p className="section-card__copy">{registerDescription}</p>

            <div className="access-benefits-block">
              <h3>{benefitsTitle}</h3>
              <ul className="access-benefits-list">
                {benefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="access-form-grid">
              <label className="field-label" htmlFor="access-first-name">
                {copy.firstNameLabel}
              </label>
              <input
                id="access-first-name"
                className={`field-input${signUpErrors.firstName ? ' is-invalid' : ''}`}
                name="signup_first_name"
                value={signUpForm.firstName}
                onChange={(event) => {
                  const value = event.target.value;
                  setSignUpForm((current) => ({ ...current, firstName: value }));
                  setSignUpErrors((current) => ({ ...current, firstName: undefined }));
                }}
                placeholder={copy.firstNamePlaceholder}
                autoComplete="section-signup given-name"
              />
              {signUpErrors.firstName ? <p className="field-error">{signUpErrors.firstName}</p> : null}

              <label className="field-label" htmlFor="access-last-name">
                {copy.lastNameLabel}
              </label>
              <input
                id="access-last-name"
                className={`field-input${signUpErrors.lastName ? ' is-invalid' : ''}`}
                name="signup_last_name"
                value={signUpForm.lastName}
                onChange={(event) => {
                  const value = event.target.value;
                  setSignUpForm((current) => ({ ...current, lastName: value }));
                  setSignUpErrors((current) => ({ ...current, lastName: undefined }));
                }}
                placeholder={copy.lastNamePlaceholder}
                autoComplete="section-signup family-name"
              />
              {signUpErrors.lastName ? <p className="field-error">{signUpErrors.lastName}</p> : null}

              <label className="field-label" htmlFor="access-signup-email">
                {copy.emailLabel}
              </label>
              <input
                id="access-signup-email"
                className={`field-input${signUpErrors.email ? ' is-invalid' : ''}`}
                name="signup_email"
                type="email"
                inputMode="email"
                value={signUpForm.email}
                onChange={(event) => {
                  const value = event.target.value;
                  setSignUpForm((current) => ({ ...current, email: value }));
                  setSignUpErrors((current) => ({ ...current, email: undefined }));
                }}
                placeholder={copy.emailPlaceholder}
                autoComplete="section-signup email"
              />
              {signUpErrors.email ? <p className="field-error">{signUpErrors.email}</p> : null}

              <label className="field-label" htmlFor="access-signup-password">
                {copy.passwordLabel}
              </label>
              <div className="password-field">
                <input
                  id="access-signup-password"
                  className={`field-input password-field__input${signUpErrors.password ? ' is-invalid' : ''}`}
                  name="signup_password"
                  type={showSignUpPassword ? 'text' : 'password'}
                  value={signUpForm.password}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSignUpForm((current) => ({ ...current, password: value }));
                    setSignUpErrors((current) => ({ ...current, password: undefined }));
                  }}
                  placeholder={copy.passwordPlaceholder}
                  autoComplete="section-signup new-password"
                />
                <button
                  className="password-field__toggle"
                  type="button"
                  aria-label={showSignUpPassword ? copy.hidePasswordLabel : copy.showPasswordLabel}
                  aria-pressed={showSignUpPassword}
                  onClick={() => setShowSignUpPassword((current) => !current)}
                >
                  <span aria-hidden="true">{showSignUpPassword ? '🙈' : '👁'}</span>
                  <span>{showSignUpPassword ? copy.hidePasswordLabel : copy.showPasswordLabel}</span>
                </button>
              </div>
              {signUpErrors.password ? <p className="field-error">{signUpErrors.password}</p> : null}
            </div>

            <button
              className="btn btn--primary access-form-submit"
              type="button"
              onClick={() => void handleSignUp()}
              disabled={signUpPending}
            >
              {signUpPending ? copy.submitPendingLabel : copy.createAccountLabel}
            </button>

            <p className="access-panel-status">{signUpStatus ?? copy.existingAccountHint}</p>
          </article>

          <div className="access-onboarding-side">
            <article className="access-panel-card access-onboarding-card access-onboarding-card--secondary">
              <span className="eyebrow-label">{locale === 'bg' ? 'USG достъп' : locale === 'it' ? 'Accesso USG' : 'USG access'}</span>
              <h2 className="section-card__title">{copy.signInTitle}</h2>
              <p className="section-card__copy">{signInDescription}</p>

              <form
                className="access-form-grid"
                onSubmit={(event) => {
                  void handleSignIn(event);
                }}
              >
                <label className="field-label" htmlFor="access-signin-email">
                  {copy.emailLabel}
                </label>
                <input
                  id="access-signin-email"
                  className={`field-input${signInErrors.email ? ' is-invalid' : ''}`}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={signInForm.email}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSignInForm((current) => ({ ...current, email: value }));
                    setSignInErrors((current) => ({ ...current, email: undefined }));
                  }}
                  placeholder={copy.emailPlaceholder}
                  autoComplete="section-signin username"
                />
                {signInErrors.email ? <p className="field-error">{signInErrors.email}</p> : null}

                <label className="field-label" htmlFor="access-signin-password">
                  {copy.passwordLabel}
                </label>
                <div className="password-field">
                  <input
                    id="access-signin-password"
                    className={`field-input password-field__input${signInErrors.password ? ' is-invalid' : ''}`}
                    name="password"
                    type={showSignInPassword ? 'text' : 'password'}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={signInForm.password}
                    onChange={(event) => {
                      const value = event.target.value;
                      setSignInForm((current) => ({ ...current, password: value }));
                      setSignInErrors((current) => ({ ...current, password: undefined }));
                    }}
                    placeholder={copy.passwordPlaceholder}
                    autoComplete="section-signin current-password"
                  />
                  <button
                    className="password-field__toggle"
                    type="button"
                    aria-label={showSignInPassword ? copy.hidePasswordLabel : copy.showPasswordLabel}
                    aria-pressed={showSignInPassword}
                    onClick={() => setShowSignInPassword((current) => !current)}
                  >
                    <span aria-hidden="true">{showSignInPassword ? '🙈' : '👁'}</span>
                    <span>{showSignInPassword ? copy.hidePasswordLabel : copy.showPasswordLabel}</span>
                  </button>
                </div>
                {signInErrors.password ? <p className="field-error">{signInErrors.password}</p> : null}

                <button className="btn btn--secondary access-form-submit" type="submit" disabled={signInPending}>
                  {signInPending ? copy.submitPendingLabel : copy.signInLabel}
                </button>
              </form>

              <p className="access-panel-status" aria-live="polite">
                {signInStatus ?? copy.existingAccountHint}
              </p>

              {initialIntent === 'partner' ? (
                <div className="access-partner-hint">
                  <h3>{copy.partnerHintTitle}</h3>
                  <p>{copy.partnerHintDescription}</p>
                </div>
              ) : null}

              <Link
                className="inline-link-action"
                href={buildAccessPath({ intent: initialIntent === 'partner' ? 'member' : 'partner' })}
              >
                {initialIntent === 'partner' ? copy.switchToMember : copy.switchToPartner}
              </Link>
            </article>

            {initialIntent === 'partner' ? (
              <aside className="access-partner-editorial">
                <div className="access-partner-editorial__image-wrap">
                  <Image
                    src="/brand/editorial-platform-heritage.png"
                    alt="Cane Corso heritage editorial visual for partner access"
                    width={1400}
                    height={1050}
                    className="access-partner-editorial__image"
                  />
                </div>
                <div className="access-partner-editorial__copy">
                  <span className="eyebrow-label">{partnerEditorial.eyebrow}</span>
                  <h3>{partnerEditorial.title}</h3>
                  <p>{partnerEditorial.description}</p>
                  <ul className="access-partner-editorial__points">
                    {partnerEditorial.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </aside>
            ) : (
              <aside className="access-member-editorial">
                <span className="eyebrow-label">{memberEditorial.eyebrow}</span>
                <div className="access-member-editorial__monogram" aria-hidden="true">
                  {memberEditorial.monogram}
                </div>
                <h3>{memberEditorial.title}</h3>
                <p>{memberEditorial.description}</p>
              </aside>
            )}
          </div>
        </div>
      )}

      <div className="access-support-layer">
        <div className="access-support-layer__header">
          <span className="eyebrow-label">{supportLayer.eyebrow}</span>
          <h2 className="section-card__title">{supportLayer.title}</h2>
          <p className="section-card__copy">{supportLayer.description}</p>
        </div>

        <div className="access-support-layer__grid">
          {supportCards.map((card) => (
            <Link className="access-support-card" href={card.href} key={card.href}>
              <span className="access-support-card__icon" aria-hidden="true">
                <IconSymbol name={card.icon} />
              </span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {showDevelopmentTools ? (
        <details className="access-dev-tools" open={false}>
          <summary>
            <span className="access-dev-tools__badge">{copy.devToolsBadge}</span>
            <span>{copy.devToolsToggle}</span>
          </summary>
          <div className="access-dev-tools__body">
            <div className="access-panel-grid access-panel-grid--dev">
              <div className="access-panel-card">
                <h2 className="section-card__title">{copy.devBoxTitle}</h2>
                <p className="section-card__copy">{copy.devBoxDescription}</p>
                <div className="access-panel-list">
                  {identities.map((identity) => (
                    <article className="access-identity-card" key={identity.profileId}>
                      <div>
                        <h3>{identity.displayName}</h3>
                        <p>{identity.email}</p>
                        <span>{getRoleLabel(identity.role, copy)}</span>
                      </div>
                      <button
                        className="btn btn--primary"
                        type="button"
                        onClick={() => void continueAsEmail(identity.email)}
                        disabled={devPending}
                      >
                        {getAccessContinueLabel(identity.role, locale)}
                      </button>
                    </article>
                  ))}
                </div>
              </div>

              <div className="access-panel-card access-panel-card--secondary">
                <label className="field-label" htmlFor="dev-access-email">
                  {copy.customEmailLabel}
                </label>
                <input
                  id="dev-access-email"
                  className="field-input"
                  value={devEmail}
                  onChange={(event) => setDevEmail(event.target.value)}
                  placeholder={copy.customEmailPlaceholder}
                  autoComplete="email"
                />
                <button
                  className="btn btn--secondary"
                  type="button"
                  onClick={() => void continueAsEmail(devEmail)}
                  disabled={devPending || devEmail.trim().length === 0}
                >
                  {copy.submitCustomLabel}
                </button>

                {devStatus ? <p className="access-panel-status">{devStatus}</p> : null}
                <p className="access-panel-status access-panel-status--subtle">{copy.switchHint}</p>
              </div>
            </div>
          </div>
        </details>
      ) : null}
    </section>
  );
}
