'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Locale } from '@/lib/i18n';

type GuideRow = readonly string[];
type GuideTable = {
  id?: string;
  title: string;
  description: string;
  columns: readonly string[];
  rows: readonly GuideRow[];
  tone?: 'default' | 'warning' | 'calm';
};

const guideCopy = {
  en: {
    eyebrow: 'USG owner guide',
    title: 'Pregnancy, birth, and the first 40 days',
    intro:
      'A practical Cane Corso calendar for owners. It supports preparation and observation, but it never replaces veterinary care, pregnancy monitoring, or emergency help.',
    principleTitle: 'USG principle',
    principle:
      'Natural approach does not mean uncontrolled waiting. The owner records dates, prepares the place, watches the mother and puppies, and calls a veterinarian early when something is not progressing normally.',
    cards: [
      { title: 'Date is an estimate', body: 'The mating/tie date is a starting point, not always the exact conception day. From mating the window may be wider than the ovulation-based term.' },
      { title: 'No home medication routine', body: 'Do not give oxytocin, calcium, antibiotics, dewormers, human medicine, or “cleaning” injections without veterinary instruction.' },
      { title: 'Public platform boundary', body: 'This page is education. It is not a breeding promise, medical diagnosis, or permission for uncontrolled litters.' },
    ],
    navLabel: 'Jump to section',
    navItems: [
      { label: 'Pregnancy', href: '#pregnancy-calendar' },
      { label: 'Preparation', href: '#birth-preparation' },
      { label: 'Birth problems', href: '#birth-warnings' },
      { label: 'After birth', href: '#postpartum-care' },
      { label: 'Day 1–40', href: '#puppy-day-1-40' },
      { label: 'Deworming', href: '#owner-vet-boundary' },
    ],
    tables: [
      {
        id: 'pregnancy-calendar',
        title: 'From tie / mating to whelping',
        description: 'Use this as an orientation calendar, then confirm real pregnancy status and risk with a veterinarian.',
        columns: ['Period', 'What may happen', 'Owner action'],
        rows: [
          ['Day 0', 'Tie / mating is recorded. This is not always the real conception day.', 'Do not pull the dogs apart. Record date, time, and any second mating date.'],
          ['Day 1–14', 'Early internal development; there may be no visible sign.', 'Keep routine calm. Do not add medication or supplements without veterinary advice.'],
          ['Around Day 18', 'Implantation period orientation.', 'Avoid stress, heavy jumping, rough play, and sudden environment changes.'],
          ['Day 25–35', 'Useful ultrasound window for pregnancy confirmation.', 'Book veterinary ultrasound if pregnancy needs confirmation.'],
          ['Day 45–50+', 'Puppies grow more clearly; birth planning becomes practical.', 'Prepare whelping place, transport plan, vet contact, scale, towels, and clean bedding.'],
          ['Day 55+', 'Closer observation: nesting, restlessness, appetite changes, temperature monitoring if taught by the vet.', 'Stay available, but keep the mother calm and undisturbed.'],
          ['Day 58–72 from mating', 'Possible wider birth window when counted from first mating.', 'Do not guess through danger signs. Call the veterinarian if progress is unclear or the mother looks unwell.'],
        ],
      },
      {
        id: 'birth-preparation',
        title: 'Preparation before birth',
        description: 'The best help is calm preparation before there is panic.',
        columns: ['Prepare', 'Why it matters', 'How to use it'],
        rows: [
          ['Quiet whelping area', 'Cane Corso mothers need space, warmth, and privacy.', 'Let her become familiar with the place before labor starts.'],
          ['Clean towels / bedding', 'Wet bedding chills puppies and stresses the mother.', 'Change only what is needed, gently and without disturbing the nest.'],
          ['Puppy scale and notes', 'Daily weight is one of the clearest early warning signals.', 'Record birth time, sex, color, weight, nursing, and behavior.'],
          ['Thermometer', 'Temperature trends can show that labor is approaching, if measured correctly.', 'Use only if your veterinarian explained how and when to measure.'],
          ['Vet and emergency plan', 'Large-breed birth problems need fast decisions.', 'Save phone numbers and transport options before the final week.'],
        ],
        tone: 'calm',
      },
      {
        id: 'birth-warnings',
        title: 'Birth problems: do not wait too long',
        description: 'These signs belong in a visible emergency card for owners.',
        columns: ['Signal', 'Possible meaning', 'Owner action'],
        rows: [
          ['Strong straining without a puppy', 'Possible dystocia, poor position, or blocked progress.', 'Call a veterinarian immediately. Do not pull forcefully.'],
          ['Weak straining for a long period with no progress', 'The uterus may be tired or contractions may not be effective.', 'Call the veterinarian for assessment.'],
          ['Green / dark discharge before a puppy is delivered', 'Possible placental separation or fetal risk.', 'Urgent veterinary contact if no puppy follows quickly.'],
          ['Long pause between puppies with no progress', 'There may be remaining puppies or the mother may be exhausted.', 'Do not wait overnight. Call the vet.'],
          ['Mother collapses, trembles, has fever, severe pain, or foul discharge', 'Possible emergency after or during birth.', 'Emergency clinic / veterinarian immediately.'],
        ],
        tone: 'warning',
      },
      {
        id: 'postpartum-care',
        title: 'After birth: recovery and “cleaning”',
        description: 'The mother usually clears naturally. Routine home medication for “cleaning” is not a safe rule.',
        columns: ['Moment', 'Normal care', 'Do not do'],
        rows: [
          ['First hours', 'Give water, warmth, clean bedding, and quiet. Check that every puppy breathes and nurses.', 'Do not disturb the mother repeatedly if she is caring for the litter.'],
          ['First 24 hours', 'Watch appetite, temperature, discharge, mammary glands, and puppy nursing.', 'Do not give oxytocin, antibiotics, calcium, herbs, or human medicine without a vet.'],
          ['First 48 hours', 'Arrange veterinary check for mother and puppies when possible.', 'Do not ignore bad smell, heavy bleeding, fever, collapse, painful mammary glands, or rejected puppies.'],
          ['Postpartum discharge', 'Some discharge can be normal if it gradually decreases and the mother feels well.', 'Do not assume foul smell, pus, fever, or weakness is normal.'],
        ],
        tone: 'calm',
      },
      {
        id: 'puppy-day-1-40',
        title: 'Puppies from Day 1 to Day 40',
        description: 'The first 40 days are about warmth, milk, clean bedding, weight, eyes, movement, and gentle social contact.',
        columns: ['Age', 'Development', 'Owner care'],
        rows: [
          ['Day 1–3', 'Puppies are blind, deaf, dependent on warmth and nursing.', 'Check nursing, warmth, and daily weight. A cold, silent, or constantly crying puppy needs help.'],
          ['Day 4–7', 'Still dependent; movement is crawling.', 'Keep bedding dry, room calm, and handling minimal.'],
          ['Day 8–14', 'Eyes usually begin to open in this period.', 'Never force eyes open. Swelling, discharge, or closed eyes after Day 14 needs veterinary attention.'],
          ['Day 14', 'First deworming is commonly started around two weeks.', 'Use only vet-selected product and dose by puppy weight.'],
          ['Day 15–21', 'More movement and early awareness.', 'Continue weighing. Start very gentle human contact without overstimulation.'],
          ['Day 21–28', 'Interest in soft puppy food may begin while nursing continues.', 'Introduce soft food gradually only if the litter is ready. Do not stop milk suddenly.'],
          ['Day 28', 'Second deworming point in many schedules.', 'Record product, date, weight, and any reaction.'],
          ['Day 35–40', 'More social behavior, play, character, and movement.', 'Keep growth steady, not forced. Prepare for the next veterinary schedule around six weeks.'],
        ],
      },
      {
        id: 'owner-vet-boundary',
        title: 'Deworming orientation',
        description: 'No doses belong in the public article. Every puppy must be dosed by actual weight and veterinary product choice.',
        columns: ['Age', 'Common orientation', 'Platform note'],
        rows: [
          ['2 weeks', 'First puppy deworming often starts here.', 'Mother may also be treated at the first puppy treatment, according to veterinary plan.'],
          ['4 weeks', 'Repeat treatment in many puppy protocols.', 'Update the puppy health table with weight and date.'],
          ['6 weeks', 'Next point after this Day 40 guide.', 'Coordinate with the first vaccine / health visit schedule.'],
          ['After weaning', 'Continuation depends on risk, product, country, and veterinarian.', 'USG stores records; it does not prescribe medicine.'],
        ],
      },
    ] as readonly GuideTable[],
  },
  bg: {
    eyebrow: 'USG насоки за собственик',
    title: 'Бременност, раждане и първи 40 дни',
    intro:
      'Практичен календар за Cane Corso собственици. Помага за подготовка и наблюдение, но не замества ветеринарен лекар, проследяване на бременност или спешна помощ.',
    principleTitle: 'USG принцип',
    principle:
      'Естествен подход не означава безконтролно чакане. Собственикът записва датите, подготвя мястото, наблюдава майката и малките и търси ветеринар навреме, когато нещо не върви нормално.',
    cards: [
      { title: 'Датата е ориентир', body: 'Денят на покриване/заклещване е начална дата, но не винаги е точният ден на зачеване. При броене от покриване прозорецът може да е по-широк.' },
      { title: 'Без домашна лекарствена рутина', body: 'Не се дават окситоцин, калций, антибиотици, обезпаразитяващи, човешки лекарства или “инжекция за изчистване” без ветеринар.' },
      { title: 'Граница на платформата', body: 'Това е образователна страница. Не е разрешение за безконтролни малки, медицинска диагноза или обещание за разплод.' },
    ],
    navLabel: 'Отиди директно към секция',
    navItems: [
      { label: 'Бременност', href: '#pregnancy-calendar' },
      { label: 'Подготовка', href: '#birth-preparation' },
      { label: 'Проблеми', href: '#birth-warnings' },
      { label: 'След раждане', href: '#postpartum-care' },
      { label: 'Ден 1–40', href: '#puppy-day-1-40' },
      { label: 'Обезпаразитяване', href: '#owner-vet-boundary' },
    ],
    tables: [
      {
        id: 'pregnancy-calendar',
        title: 'От заклещване / покриване до раждане',
        description: 'Използвай го като ориентир, а реалната бременност и риск се потвърждават с ветеринар.',
        columns: ['Период', 'Какво може да се случва', 'Какво прави собственикът'],
        rows: [
          ['Ден 0', 'Записва се покриване / заклещване. Това не винаги е реалният ден на зачеване.', 'Не се дърпат кучетата. Запиши дата, час и евентуална втора дата на покриване.'],
          ['Ден 1–14', 'Ранно вътрешно развитие; може да няма видими признаци.', 'Рутината остава спокойна. Без лекарства, добавки или препарати без ветеринар.'],
          ['Около Ден 18', 'Ориентировъчен период на имплантация.', 'Без стрес, тежки скачания, груба игра и внезапни промени в средата.'],
          ['Ден 25–35', 'Полезен прозорец за ехографско потвърждение.', 'Запази ветеринарен ехограф, ако искаш потвърждение на бременност.'],
          ['Ден 45–50+', 'Малките растат по-осезаемо; подготовката вече е практична.', 'Подготви родилно място, транспорт, телефон на ветеринар, кантар, кърпи и чисти постелки.'],
          ['Ден 55+', 'По-близко наблюдение: гнездене, неспокойствие, апетит, температура, ако ветеринарят е показал как.', 'Бъди наблизо, но пази спокойствието на майката.'],
          ['Ден 58–72 от покриване', 'Възможен по-широк прозорец за раждане при броене от първо покриване.', 'Не гадай при опасни признаци. Звъни на ветеринар, ако напредъкът е неясен или майката изглежда зле.'],
        ],
      },
      {
        id: 'birth-preparation',
        title: 'Подготовка преди раждането',
        description: 'Най-добрата помощ е спокойната подготовка преди да има паника.',
        columns: ['Подготви', 'Защо е важно', 'Как се използва'],
        rows: [
          ['Спокойно родилно място', 'Cane Corso майката има нужда от пространство, топлина и уединение.', 'Нека свикне с мястото преди раждането.'],
          ['Чисти кърпи / постелки', 'Мократа среда изстудява малките и стресира майката.', 'Сменяй само нужното, внимателно и без да разбиваш гнездото.'],
          ['Кантар и записки', 'Дневното тегло е един от най-ясните ранни сигнали.', 'Записвай час на раждане, пол, цвят, тегло, сучене и поведение.'],
          ['Термометър', 'Температурните промени могат да подсказват наближаващо раждане, ако се мерят правилно.', 'Използвай само ако ветеринарят е показал как и кога.'],
          ['Ветеринарен и спешен план', 'При едра порода проблемите изискват бързи решения.', 'Запази телефоните и транспорта преди финалната седмица.'],
        ],
        tone: 'calm',
      },
      {
        id: 'birth-warnings',
        title: 'Проблеми при раждане: не се чака твърде дълго',
        description: 'Тези сигнали трябва да стоят като видима спешна карта за собственика.',
        columns: ['Сигнал', 'Какво може да значи', 'Действие'],
        rows: [
          ['Силни напъни без малко', 'Възможна дистоция, неправилно положение или блокиран напредък.', 'Веднага ветеринар. Не се дърпа силово.'],
          ['Слаби напъни дълго време без резултат', 'Матката може да се изморява или контракциите да не са ефективни.', 'Ветеринарна преценка.'],
          ['Зелено / тъмно течение преди да излезе малко', 'Възможно отделяне на плацента или риск за малкото.', 'Спешен контакт с ветеринар, ако малко не последва бързо.'],
          ['Дълга пауза между малките без напредък', 'Може да има останали малки или майката да е изтощена.', 'Не се чака цяла нощ. Звъни на ветеринар.'],
          ['Майката колабира, трепери, има температура, силна болка или лоша миризма', 'Възможно спешно състояние по време или след раждане.', 'Спешна клиника / ветеринар веднага.'],
        ],
        tone: 'warning',
      },
      {
        id: 'postpartum-care',
        title: 'След раждането: възстановяване и “изчистване”',
        description: 'Майката обикновено се изчиства естествено. Рутинното домашно даване на лекарства “за изчистване” не е безопасно правило.',
        columns: ['Момент', 'Нормална грижа', 'Не прави'],
        rows: [
          ['Първи часове', 'Вода, топлина, чиста постелка и спокойствие. Провери дали всяко малко диша и суче.', 'Не я безпокой постоянно, ако се грижи за малките.'],
          ['Първи 24 часа', 'Следи апетит, температура, течение, млечни жлези и сучене на малките.', 'Не давай окситоцин, антибиотици, калций, билки или човешки лекарства без ветеринар.'],
          ['Първи 48 часа', 'Добре е да има ветеринарен преглед на майката и малките.', 'Не игнорирай лоша миризма, силно кървене, температура, колапс, болезнени млечни жлези или отблъснати малки.'],
          ['Следродилно течение', 'Някакво течение може да е нормално, ако постепенно намалява и майката е добре.', 'Не приемай гной, силна миризма, температура или отпадналост за нормални.'],
        ],
        tone: 'calm',
      },
      {
        id: 'puppy-day-1-40',
        title: 'Малките от Ден 1 до Ден 40',
        description: 'Първите 40 дни са топлина, мляко, чистота, тегло, проглеждане, движение и внимателен човешки контакт.',
        columns: ['Възраст', 'Развитие', 'Грижа'],
        rows: [
          ['Ден 1–3', 'Малките са слепи, глухи и зависими от топлина и сучене.', 'Проверявай сучене, топлина и дневно тегло. Студено, тихо или постоянно плачещо малко има нужда от помощ.'],
          ['Ден 4–7', 'Още са напълно зависими; движението е пълзене.', 'Суха постелка, спокойна стая и минимално пипане.'],
          ['Ден 8–14', 'Очите обикновено започват да се отварят в този период.', 'Не отваряй очи насила. Подуване, секрет или затворени очи след Ден 14 изискват ветеринар.'],
          ['Ден 14', 'Първо обезпаразитяване често започва около две седмици.', 'Само с продукт и доза, избрани от ветеринар според теглото.'],
          ['Ден 15–21', 'Повече движение и първа осъзнатост.', 'Продължи тегленето. Започни много нежен човешки контакт без претоварване.'],
          ['Ден 21–28', 'Може да започне интерес към мека храна, докато кърменето продължава.', 'Въвеждай мека храна постепенно само ако малките са готови. Не спирай млякото рязко.'],
          ['Ден 28', 'Втори ориентир за обезпаразитяване в много схеми.', 'Запиши продукт, дата, тегло и реакция.'],
          ['Ден 35–40', 'Повече социалност, игра, характер и движение.', 'Растежът трябва да е стабилен, не насилен. Подготви следващия ветеринарен етап около 6 седмици.'],
        ],
      },
      {
        id: 'owner-vet-boundary',
        title: 'Ориентир за обезпаразитяване',
        description: 'В публичната статия не трябва да има дози. Всяко малко се дозира според реално тегло и продукт, избран от ветеринар.',
        columns: ['Възраст', 'Общ ориентир', 'Бележка в платформата'],
        rows: [
          ['2 седмици', 'Първо обезпаразитяване на малките често започва тук.', 'Майката може да се третира заедно с първото третиране на малките по ветеринарен план.'],
          ['4 седмици', 'Повторение в много puppy протоколи.', 'Попълва се таблицата за здраве: тегло, дата и продукт.'],
          ['6 седмици', 'Следващ ориентир след този guide до Ден 40.', 'Съгласува се с първи ваксини / здравен преглед.'],
          ['След отбиване', 'Продължението зависи от риск, продукт, държава и ветеринар.', 'USG пази записи; не предписва лекарства.'],
        ],
      },
    ] as readonly GuideTable[],
  },
  it: {
    eyebrow: 'Guida USG proprietario',
    title: 'Gravidanza, parto e primi 40 giorni',
    intro:
      'Calendario pratico per proprietari Cane Corso. Aiuta a preparare e osservare, ma non sostituisce veterinario, monitoraggio della gravidanza o assistenza urgente.',
    principleTitle: 'Principio USG',
    principle:
      'Approccio naturale non significa attesa incontrollata. Il proprietario registra le date, prepara il luogo, osserva madre e cuccioli e chiama il veterinario presto quando il parto non procede normalmente.',
    cards: [
      { title: 'La data è orientativa', body: 'La data di accoppiamento/tie è un punto di partenza, non sempre il giorno esatto del concepimento. Dal mating la finestra può essere più ampia.' },
      { title: 'Nessuna routine farmaci in casa', body: 'Non dare ossitocina, calcio, antibiotici, antiparassitari, farmaci umani o iniezioni “per pulire” senza istruzione veterinaria.' },
      { title: 'Confine piattaforma', body: 'Questa pagina è educativa. Non è permesso per cucciolate incontrollate, diagnosi medica o promessa di riproduzione.' },
    ],
    navLabel: 'Vai alla sezione',
    navItems: [
      { label: 'Gravidanza', href: '#pregnancy-calendar' },
      { label: 'Preparazione', href: '#birth-preparation' },
      { label: 'Problemi parto', href: '#birth-warnings' },
      { label: 'Dopo il parto', href: '#postpartum-care' },
      { label: 'Giorno 1–40', href: '#puppy-day-1-40' },
      { label: 'Antiparassitario', href: '#owner-vet-boundary' },
    ],
    tables: [
      {
        id: 'pregnancy-calendar',
        title: 'Dal tie / accoppiamento al parto',
        description: 'Usalo come orientamento, poi conferma gravidanza reale e rischio con il veterinario.',
        columns: ['Periodo', 'Cosa può accadere', 'Azione proprietario'],
        rows: [
          ['Giorno 0', 'Accoppiamento / tie registrato. Non è sempre il vero giorno del concepimento.', 'Non separare i cani tirando. Registra data, ora e seconda data se presente.'],
          ['Giorno 1–14', 'Sviluppo interno iniziale; spesso nessun segno visibile.', 'Routine calma. Niente farmaci, integratori o prodotti senza veterinario.'],
          ['Circa Giorno 18', 'Periodo orientativo di impianto.', 'Evita stress, salti pesanti, gioco ruvido e cambi improvvisi.'],
          ['Giorno 25–35', 'Finestra utile per ecografia di conferma.', 'Prenota controllo veterinario se vuoi confermare la gravidanza.'],
          ['Giorno 45–50+', 'I cuccioli crescono più chiaramente; la preparazione diventa pratica.', 'Prepara luogo parto, trasporto, contatto vet, bilancia, asciugamani e lettiera pulita.'],
          ['Giorno 55+', 'Osservazione più stretta: nesting, inquietudine, appetito, temperatura se spiegato dal vet.', 'Resta disponibile, ma mantieni calma e privacy.'],
          ['Giorno 58–72 dal mating', 'Possibile finestra più ampia quando si conta dal primo mating.', 'Non indovinare davanti a segnali di pericolo. Chiama il veterinario se il progresso non è chiaro.'],
        ],
      },
      {
        id: 'birth-preparation',
        title: 'Preparazione prima del parto',
        description: 'Il miglior aiuto è preparare con calma prima del panico.',
        columns: ['Prepara', 'Perché serve', 'Come usarlo'],
        rows: [
          ['Area parto tranquilla', 'La madre Cane Corso richiede spazio, calore e privacy.', 'Falla abituare prima che inizi il travaglio.'],
          ['Asciugamani / lettiere pulite', 'Il bagnato raffredda i cuccioli e stressa la madre.', 'Cambia solo il necessario, con delicatezza.'],
          ['Bilancia e note', 'Il peso giornaliero è un segnale precoce molto chiaro.', 'Registra ora nascita, sesso, colore, peso, suzione e comportamento.'],
          ['Termometro', 'Le tendenze di temperatura possono indicare parto vicino se misurate correttamente.', 'Usalo solo se il veterinario ha spiegato come e quando.'],
          ['Piano veterinario/emergenza', 'Nei grandi molossi i problemi richiedono decisioni rapide.', 'Salva telefoni e trasporto prima dell’ultima settimana.'],
        ],
        tone: 'calm',
      },
      {
        id: 'birth-warnings',
        title: 'Problemi al parto: non aspettare troppo',
        description: 'Questi segnali devono essere visibili come card urgente per il proprietario.',
        columns: ['Segnale', 'Possibile significato', 'Azione'],
        rows: [
          ['Forti spinte senza cucciolo', 'Possibile distocia, posizione difficile o progresso bloccato.', 'Veterinario subito. Non tirare con forza.'],
          ['Spinte deboli a lungo senza risultato', 'L’utero può essere stanco o le contrazioni inefficaci.', 'Valutazione veterinaria.'],
          ['Scolo verde/scuro prima del cucciolo', 'Possibile distacco placentare o rischio fetale.', 'Contatto veterinario urgente se un cucciolo non segue rapidamente.'],
          ['Pausa lunga tra cuccioli senza progresso', 'Possibili cuccioli rimanenti o madre esausta.', 'Non aspettare tutta la notte. Chiama il vet.'],
          ['Madre collassa, trema, ha febbre, dolore forte o cattivo odore', 'Possibile emergenza durante o dopo il parto.', 'Clinica urgente / veterinario subito.'],
        ],
        tone: 'warning',
      },
      {
        id: 'postpartum-care',
        title: 'Dopo il parto: recupero e “pulizia”',
        description: 'La madre di solito si pulisce naturalmente. Farmaci domestici di routine “per pulire” non sono una regola sicura.',
        columns: ['Momento', 'Cura normale', 'Non fare'],
        rows: [
          ['Prime ore', 'Acqua, calore, lettiera pulita e calma. Controlla che ogni cucciolo respiri e succhi.', 'Non disturbare continuamente se lei cura la cucciolata.'],
          ['Prime 24 ore', 'Osserva appetito, temperatura, scolo, mammelle e suzione.', 'Non dare ossitocina, antibiotici, calcio, erbe o farmaci umani senza vet.'],
          ['Prime 48 ore', 'È consigliabile controllo veterinario di madre e cuccioli.', 'Non ignorare cattivo odore, sanguinamento forte, febbre, collasso, mammelle dolorose o cuccioli respinti.'],
          ['Scolo postpartum', 'Un certo scolo può essere normale se diminuisce e la madre sta bene.', 'Non considerare normale pus, forte odore, febbre o debolezza.'],
        ],
        tone: 'calm',
      },
      {
        id: 'puppy-day-1-40',
        title: 'Cuccioli dal Giorno 1 al Giorno 40',
        description: 'I primi 40 giorni sono calore, latte, pulizia, peso, apertura occhi, movimento e contatto umano delicato.',
        columns: ['Età', 'Sviluppo', 'Cura'],
        rows: [
          ['Giorno 1–3', 'Cuccioli ciechi, sordi e dipendenti da calore e suzione.', 'Controlla suzione, calore e peso quotidiano. Cucciolo freddo, silenzioso o che piange sempre richiede aiuto.'],
          ['Giorno 4–7', 'Ancora totalmente dipendenti; movimento a strisciare.', 'Lettiera asciutta, stanza calma e manipolazione minima.'],
          ['Giorno 8–14', 'Gli occhi di solito iniziano ad aprirsi in questo periodo.', 'Non forzare gli occhi. Gonfiore, secrezione o occhi chiusi dopo Giorno 14: veterinario.'],
          ['Giorno 14', 'Primo antiparassitario spesso intorno alle due settimane.', 'Solo prodotto e dose scelti dal veterinario secondo il peso.'],
          ['Giorno 15–21', 'Più movimento e prima consapevolezza.', 'Continua il peso. Contatto umano molto delicato senza sovrastimolare.'],
          ['Giorno 21–28', 'Può iniziare interesse per pappa morbida mentre l’allattamento continua.', 'Introduci cibo morbido gradualmente solo se pronti. Non fermare il latte bruscamente.'],
          ['Giorno 28', 'Secondo punto orientativo di deworming in molti protocolli.', 'Registra prodotto, data, peso e reazioni.'],
          ['Giorno 35–40', 'Più socialità, gioco, carattere e movimento.', 'Crescita stabile, non forzata. Preparare prossimo step veterinario verso 6 settimane.'],
        ],
      },
      {
        id: 'owner-vet-boundary',
        title: 'Orientamento antiparassitario',
        description: 'Nella pagina pubblica non vanno inserite dosi. Ogni cucciolo va dosato su peso reale e prodotto scelto dal veterinario.',
        columns: ['Età', 'Orientamento comune', 'Nota piattaforma'],
        rows: [
          ['2 settimane', 'Il primo trattamento dei cuccioli spesso inizia qui.', 'La madre può essere trattata insieme al primo trattamento cuccioli, secondo piano vet.'],
          ['4 settimane', 'Ripetizione in molti protocolli puppy.', 'Aggiorna tabella salute con peso, data e prodotto.'],
          ['6 settimane', 'Punto successivo dopo questa guida al Giorno 40.', 'Da coordinare con prime vaccinazioni / visita salute.'],
          ['Dopo svezzamento', 'La continuazione dipende da rischio, prodotto, paese e veterinario.', 'USG conserva registri; non prescrive medicine.'],
        ],
      },
    ] as readonly GuideTable[],
  },
} as const;

function GuideTableCard({ table }: { table: GuideTable }) {
  return (
    <section id={table.id} className={`pregnancy-puppy-guide__table-card pregnancy-puppy-guide__table-card--${table.tone ?? 'default'}`}>
      <div className="pregnancy-puppy-guide__table-head">
        <h3>{table.title}</h3>
        <p>{table.description}</p>
      </div>
      <div className="pregnancy-puppy-guide__table-wrap">
        <table>
          <thead>
            <tr>
              {table.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.join('|')}>
                {row.map((cell, index) => (
                  <td key={`${row[0]}-${index}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function CaneCorsoPregnancyPuppyGuide({ locale }: { locale: Locale }) {
  const copy = guideCopy[locale] ?? guideCopy.en;
  const firstSectionId = copy.navItems[0]?.href.replace('#', '') ?? copy.tables[0]?.id ?? 'pregnancy-calendar';
  const sectionIds = useMemo(() => new Set(copy.tables.map((table) => table.id).filter(Boolean) as string[]), [copy.tables]);
  const [activeSectionId, setActiveSectionId] = useState(firstSectionId);

  useEffect(() => {
    setActiveSectionId(firstSectionId);
  }, [firstSectionId]);

  useEffect(() => {
    const handleExternalTabClick = (event: MouseEvent) => {
      const trigger = event.target instanceof Element
        ? event.target.closest<HTMLElement>('[data-pregnancy-guide-target]')
        : null;
      const targetId = trigger?.dataset.pregnancyGuideTarget;

      if (!targetId || !sectionIds.has(targetId)) return;

      event.preventDefault();
      setActiveSectionId(targetId);
    };

    document.addEventListener('click', handleExternalTabClick);
    return () => document.removeEventListener('click', handleExternalTabClick);
  }, [sectionIds]);

  const activeTable = copy.tables.find((table) => table.id === activeSectionId) ?? copy.tables[0];

  return (
    <section className="pregnancy-puppy-guide" id="pregnancy-puppy-guide" aria-label={copy.title}>
      <div className="pregnancy-puppy-guide__hero">
        <span className="eyebrow-label">{copy.eyebrow}</span>
        <h2>{copy.title}</h2>
        <p>{copy.intro}</p>
        <div className="pregnancy-puppy-guide__principle">
          <strong>{copy.principleTitle}</strong>
          <span>{copy.principle}</span>
        </div>
      </div>

      <div className="pregnancy-puppy-guide__cards">
        {copy.cards.map((card) => (
          <article className="pregnancy-puppy-guide__card" key={card.title}>
            <strong>{card.title}</strong>
            <p>{card.body}</p>
          </article>
        ))}
      </div>

      <nav className="pregnancy-puppy-guide__nav pregnancy-puppy-guide__nav--tabs" aria-label={copy.navLabel}>
        {copy.navItems.map((item) => {
          const sectionId = item.href.replace('#', '');
          const isActive = sectionId === activeSectionId;

          return (
            <button
              type="button"
              className={isActive ? 'is-active' : ''}
              aria-pressed={isActive}
              data-pregnancy-guide-target={sectionId}
              key={item.href}
              onClick={() => setActiveSectionId(sectionId)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="pregnancy-puppy-guide__tables pregnancy-puppy-guide__tables--progressive" aria-live="polite">
        {activeTable ? <GuideTableCard table={activeTable} /> : null}
      </div>
    </section>
  );
}
