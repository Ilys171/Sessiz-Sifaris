/**
 * English content for the Səssiz Sifariş website.
 *
 * Every visible string lives here so the site can later be translated into
 * Azerbaijani (az.ts) and Russian (ru.ts) by copying this file and typing it
 * as `Dictionary`. Keep keys identical across languages.
 *
 * Content source: the Russian concept deck. Do not add claims, numbers,
 * partners or testimonials that are not in the deck.
 */
export const en = {
  meta: {
    lang: 'en',
    title: 'Səssiz Sifariş: ordering from your phone, accessible to everyone',
    description:
      'Səssiz Sifariş is a universal mobile ordering concept for restaurants. One QR code turns every phone into an extra ordering point, with a voice path for blind users. A project of AAYAHCE.',
  },

  common: {
    productName: 'Səssiz Sifariş',
    productNameMeaning: '“Silent Order” in Azerbaijani',
    runPilot: 'Run a pilot',
    seeHowItWorks: 'See how it works',
    skipToContent: 'Skip to main content',
    menu: 'Menu',
    closeMenu: 'Close menu',
    mainNav: 'Main',
    homeLabel: 'Səssiz Sifariş, back to top',
    step: 'Step',
  },

  nav: [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Two paths', href: '#two-paths' },
    { label: 'Accessibility', href: '#accessibility' },
    { label: 'Pilot', href: '#pilot' },
    { label: 'For restaurants', href: '#restaurants' },
    { label: 'About', href: '#about' },
  ],

  hero: {
    eyebrow: 'Universal mobile ordering',
    headline: 'Ordering from your phone, accessible to everyone.',
    lead:
      'A QR code lets people choose their order calmly on their own phone, without occupying a kiosk. After choosing a language, they leave a phone number or email for an electronic receipt.',
    note: 'The voice AI is only for blind users. Everyone else uses the standard interface.',
    flowLabel: 'The ordering flow',
    flow: ['QR', 'Language', 'Phone/Email', 'Questions', 'Apple Pay', 'Receipt'],
    visualAlt:
      'Illustration: a phone held up to a QR code poster on a restaurant wall. The phone screen shows the language choice: Azərbaycan dili, Русский, English.',
    visual: {
      poster: 'Scan to order',
      screenTitle: 'Choose a language',
    },
  },

  problem: {
    eyebrow: '01 / The problem',
    title: 'The queue forms at the hardware, not at the demand.',
    cards: [
      {
        title: 'Limited kiosks',
        text: 'At peak hours, the queue concentrates around a few screens.',
      },
      {
        title: 'One way to interact',
        text: 'Not everyone is comfortable reading small text, speaking, or using a single language.',
      },
      {
        title: 'The accessibility gap',
        text: 'Help usually appears only after a person has already hit a barrier.',
      },
    ],
    highlight:
      'One QR code turns every phone into an extra ordering point. People order in parallel instead of waiting for a free kiosk.',
  },

  journey: {
    eyebrow: '02 / The user journey',
    title: 'The whole sequence, from QR code to order number.',
    lead:
      'The main interface works for everyone. The voice AI creates a separate accessible path for blind users.',
    steps: [
      { title: 'Scan the QR code', text: 'A mobile web page opens. No waiting for a kiosk.' },
      {
        title: 'Choose a language',
        text: 'Azərbaycan dili, Русский or English. The screen is available immediately.',
      },
      { title: 'Sign in', text: 'A phone number or email, where the electronic receipt will go.' },
      {
        title: 'Get help if needed',
        text: 'After 15 seconds an audio hint plays. The voice AI is only for blind users.',
        help: true,
      },
      {
        title: 'Answer questions',
        text: 'Dish, variant, size, drink, extras and pickup method.',
      },
      {
        title: 'Review the cart',
        text: 'Ingredients, price, allergens and availability are visible before payment.',
      },
      { title: 'Pay', text: 'Apple Pay or card, after explicit confirmation of the total.' },
      {
        title: 'Get the result',
        text: 'Order number, status and receipt, sent to the chosen contact.',
      },
    ],
    helpBadge: 'Help appears here',
  },

  demo: {
    eyebrow: 'Try it',
    title: 'Walk through an order.',
    lead:
      'Click or use the keyboard to go through the flow. Switch to the voice path to see how the same order works as a spoken dialogue.',
    disclaimer: 'Concept demo, not a live ordering system. No real payments. Nothing you enter is sent anywhere.',
    modeLabel: 'Interface',
    modes: { standard: 'Standard interface', voice: 'Voice path' },
    modeAnnounce: {
      standard: 'Standard interface selected.',
      voice: 'Voice path selected. Spoken prompts are shown as captions.',
    },
    speakLabel: 'Read voice prompts aloud with this browser’s speech',
    speakHint: 'Optional. Turn it off if you already use a screen reader.',
    phoneLabel: 'Demo phone screen',
    restart: 'Start over',
    back: 'Back',
    next: 'Continue',
    progress: 'Step {current} of {total}',
    aiSays: 'AI says',
    youSaid: 'You said',
    sayPrefix: 'Say',
    commandsLabel: 'Voice commands',
    commands: { repeat: 'Repeat', staff: 'Call a staff member' },
    confirmYes: 'Yes, that’s right',
    confirmRepeat: 'Repeat',
    heard: 'I heard: {choice}. Is that right?',
    unavailable: 'Not available right now',
    chooseError: 'Choose an option to continue.',
    staffButton: 'Call a staff member',

    language: {
      title: 'Choose a language',
      voicePrompt: 'Say the name of your language.',
      options: [
        { code: 'AZ', label: 'Azərbaycan dili', lang: 'az' },
        { code: 'RU', label: 'Русский', lang: 'ru' },
        { code: 'EN', label: 'English', lang: 'en' },
      ],
      demoNote: 'In this demo the screens continue in English.',
    },

    contact: {
      title: 'Where should we send your receipt?',
      voicePrompt: 'Say your phone number or email address. One contact is enough.',
      fieldLabel: 'Phone number or email',
      fieldHint: 'One contact is enough. Example: +994 50 000 00 00',
      voiceSample: '+994 50 000 00 00',
      marketing: 'Also send me offers and news (optional)',
      privacy: 'We ask for this once. It is used for your receipt and order status.',
      error: 'Enter a phone number or an email address.',
    },

    questions: [
      {
        id: 'hunger',
        title: 'How hungry are you?',
        voicePrompt: 'How hungry are you? A light snack, a regular meal, or a full meal?',
        options: [
          { id: 'light', label: 'Light snack' },
          { id: 'regular', label: 'Regular' },
          { id: 'full', label: 'Full meal' },
        ],
      },
      {
        id: 'bread',
        title: 'Lavash or bun?',
        voicePrompt: 'Lavash or bun?',
        note: 'Only formats available for this dish are shown.',
        options: [
          { id: 'lavash', label: 'Lavash' },
          { id: 'bun', label: 'Bun' },
        ],
      },
      {
        id: 'meat',
        title: 'Which meat?',
        voicePrompt: 'Which meat? Chicken, beef, or meat-free? Fish is not available right now.',
        options: [
          { id: 'chicken', label: 'Chicken' },
          { id: 'beef', label: 'Beef' },
          { id: 'fish', label: 'Fish', unavailable: true },
          { id: 'none', label: 'Meat-free' },
        ],
      },
      {
        id: 'veg',
        title: 'Which vegetables?',
        voicePrompt: 'Which vegetables? Tomato, cucumber, onion, lettuce, or none?',
        multi: true,
        noneLabel: 'No vegetables',
        options: [
          { id: 'tomato', label: 'Tomato' },
          { id: 'cucumber', label: 'Cucumber' },
          { id: 'onion', label: 'Onion' },
          { id: 'lettuce', label: 'Lettuce' },
        ],
      },
      {
        id: 'sauce',
        title: 'Which sauce?',
        voicePrompt: 'Which sauce? Garlic, tomato, spicy, or no sauce?',
        options: [
          { id: 'garlic', label: 'Garlic sauce' },
          { id: 'tomato', label: 'Tomato sauce' },
          { id: 'spicy', label: 'Spicy sauce' },
          { id: 'none', label: 'No sauce' },
        ],
      },
      {
        id: 'side',
        title: 'Side and drink?',
        voicePrompt: 'Which side and drink? Fries with ayran, salad with water, or no side with tea?',
        options: [
          { id: 'fries-ayran', label: 'Fries + ayran' },
          { id: 'salad-water', label: 'Salad + water' },
          { id: 'none-tea', label: 'No side + tea' },
        ],
      },
    ],

    cart: {
      title: 'Review your order',
      voicePrompt:
        'Here is your order: {summary}. Total {total}. Say “Eat here” or “Take away” to confirm the order and continue to payment.',
      itemName: 'Wrap',
      ingredients: 'Ingredients',
      allergens: 'Allergens',
      allergensValue: 'Gluten (lavash, bun), milk (ayran, garlic sauce)',
      availabilityLabel: 'Availability',
      availability: 'All items available',
      pickupLabel: 'Pickup method',
      pickup: [
        { id: 'here', label: 'Eat here' },
        { id: 'away', label: 'Take away' },
      ],
      total: 'Total',
      confirm: 'Confirm total: {total}',
      priceNote: 'Demo prices.',
    },

    payment: {
      title: 'Pay {total}',
      voicePrompt: 'The total is {total}. Say “Apple Pay” or “Card” to pay.',
      applePay: 'Pay with Apple Pay',
      card: 'Pay by card',
      voiceOptions: { apple: 'Apple Pay', card: 'Card' },
      note: 'Demo only. No payment is taken.',
    },

    done: {
      title: 'Order {number}',
      voicePrompt: 'Thank you. Your order number is {number}. It is being prepared.',
      statusLabel: 'Status',
      status: 'Being prepared',
      receiptTo: 'Receipt sent to {contact}',
      receiptFallback: 'your contact',
    },

    staff: {
      title: 'A staff member is on the way',
      voicePrompt: 'A staff member has your order so far. You don’t need to start over.',
      text: 'They received your cart as it is now and the reason for the request.',
      reasonLabel: 'Reason sent',
      reason: 'Customer asked for help',
      cartLabel: 'Cart sent',
      emptyCart: 'Nothing chosen yet',
      back: 'Back to my order',
    },
  },

  firstSeconds: {
    eyebrow: '03 / The first seconds',
    title: 'Fifteen seconds trigger an audio hint, not a diagnosis.',
    rule: {
      label: 'Key rule',
      text: 'A pause only means no interaction. The system never draws conclusions about a person’s health or disability.',
      sub: 'The pause triggers a hint. The voice AI turns on only when a blind user asks for it by saying their language.',
    },
    timelineLabel: 'What happens in the first fifteen seconds',
    points: [
      {
        time: 't = 0',
        title: 'The interface is open immediately',
        text: 'Large language options are on screen. The phone’s built-in screen reader can read them from the first moment.',
      },
      {
        time: 't ≈ 15 s',
        title: 'If there is no interaction',
        text: 'Voice and on-screen text say: “If you can’t see the screen, say your language.” Everyone else simply keeps using the normal interface.',
        help: true,
      },
    ],
  },

  language: {
    eyebrow: '04 / Language and profile',
    title: 'Language first, then a short first sign-in.',
    lead:
      'The selected language is saved and used by the visual interface, the AI and electronic notifications.',
    promptCaption: 'The system also says this question aloud.',
    promptTitle: 'Choose a language',
    firstUseTitle: 'On first use',
    firstUse: [
      { title: 'Phone or email', text: 'One contact is enough.' },
      { title: 'Electronic receipt', text: 'Sent to the chosen contact.' },
      { title: 'Interface language', text: 'Already chosen, and it can be changed anytime.' },
    ],
    note: 'Data is requested once. Consent and the privacy policy must be easy to understand.',
  },

  twoPaths: {
    eyebrow: '05 / Two paths',
    title: 'Two paths, one system.',
    lead: 'Both paths use the same cart, the same prices and the restaurant’s live menu.',
    paths: [
      {
        tag: 'For everyone',
        title: 'Interface first',
        text: 'Large cards, clear categories, ingredients and price. The user answers short questions and chooses at their own pace.',
        points: ['Large cards', 'Clear categories', 'Ingredients and price', 'Fast ordering without waiting for a kiosk'],
      },
      {
        tag: 'Only for blind users',
        title: 'Step-by-step dialogue',
        text: 'The AI speaks each question, listens to the answer, repeats the recognized choice, and asks to confirm the order before payment.',
        points: ['Speaks each question', 'Listens to the answer', 'Repeats what it understood', 'Asks to confirm before payment'],
        commandsLabel: 'Commands',
        commands: ['“Repeat”', '“Call a staff member”'],
      },
    ],
    sharedLabel: 'Shared data source',
    shared: ['Live menu', 'Price', 'Availability', 'Ingredients', 'Cart'],
  },

  questions: {
    eyebrow: '06 / Dialogue logic',
    title: 'The AI only asks what’s necessary.',
    lead:
      'Time of day and menu context are already known: breakfast in the morning, the current main menu during the day.',
    items: [
      { q: 'How hungry are you?', a: 'A light snack, a regular or a full meal.' },
      { q: 'Lavash or bun?', a: 'The AI offers only formats available for the chosen dish.' },
      { q: 'Which meat?', a: 'Chicken, beef, fish, or a meat-free option.' },
      { q: 'Which vegetables?', a: 'Choose the ones you want, or order without them.' },
      { q: 'Which sauce?', a: 'One of the available sauces, or no sauce.' },
      { q: 'Side and drink?', a: 'Fries, another side, and an available drink.' },
    ],
  },

  completion: {
    eyebrow: '07 / Completion',
    title: 'Confirmation and payment, without losing context.',
    steps: [
      { title: 'Summary', text: 'Order items, changes, price and pickup method.' },
      { title: 'Payment', text: 'Apple Pay or bank card, after confirming the amount.' },
      { title: 'E-receipt', text: 'By email or phone. Marketing messages can be declined.' },
      { title: 'Status', text: 'Order number and a clear preparation status, on screen and by voice.' },
    ],
    handoff: {
      title: 'If a staff member is needed',
      text: 'They receive the already-built cart and the reason for the request. The customer never has to start over.',
    },
  },

  pilot: {
    eyebrow: '08 / Expected effect',
    title: 'One product addresses the queue and accessibility at the same time.',
    benefits: [
      {
        title: 'Parallel orders',
        text: 'Every phone becomes an ordering point. Capacity is not limited by the number of kiosks.',
      },
      {
        title: 'A fully accessible path',
        text: 'Language, choice, payment, receipt and status are all available in one process.',
      },
      {
        title: 'Fewer repeats',
        text: 'When a staff member takes over, the cart and the context of the request are kept.',
      },
      {
        title: 'Scales across restaurants and languages',
        text: 'The same logic can work in different restaurants and language environments.',
      },
    ],
    measureTitle: 'What the pilot will measure',
    measures: [
      'Time to start an order',
      'Completion without help',
      'Speech recognition errors',
      'Kiosk queue length',
      'Staff calls',
    ],
    honesty: 'No results are claimed yet. They will be confirmed through testing with real users.',
  },

  restaurants: {
    eyebrow: 'For restaurants',
    title: 'Run a pilot in your restaurant.',
    lead:
      'A pilot tests Səssiz Sifariş with your real customers, menu and peak hours. Tell us about your restaurant and we will get back to you.',
    needTitle: 'What a pilot needs',
    need: [
      { title: 'QR placement', text: 'Codes on walls, tables or the counter where customers wait.' },
      { title: 'Menu data', text: 'Your menu, prices, availability, ingredients and allergens.' },
      { title: 'Payment integration', text: 'Apple Pay and card payments through your payment provider.' },
    ],
    getTitle: 'What you get',
    get: 'Pilot data on the same metrics listed above: time to start an order, completion without help, speech recognition errors, kiosk queue length and staff calls.',
    photoPlaceholder: '[PHOTO: QR code table card next to a restaurant counter]',
    photoAlt: 'Photo placeholder: a QR code table card next to a restaurant counter.',
    form: {
      title: 'Request a pilot',
      required: 'All fields except the message are required.',
      fields: {
        name: { label: 'Your name', autocomplete: 'name' },
        restaurant: { label: 'Restaurant', autocomplete: 'organization' },
        city: { label: 'City', autocomplete: 'address-level2' },
        email: { label: 'Email', autocomplete: 'email' },
        message: { label: 'Message (optional)', hint: 'For example: number of kiosks, peak hours, languages your guests use.' },
      },
      errors: {
        required: 'Please fill in this field.',
        email: 'Enter an email address like name@restaurant.az.',
        summary: 'Please fix the highlighted fields.',
      },
      privacyNote: 'We only use these details to reply about a pilot.',
      privacyLink: 'Privacy policy',
      submit: 'Send request',
      sending: 'Sending…',
      success: 'Thank you. Your request has been sent. We will reply by email.',
      failure: 'Something went wrong and the request was not sent. Please try again or email us at {email}.',
      notConnected:
        'Online submissions are not connected yet. Please email your request to {email}.',
    },
  },

  cta: {
    title: 'Bring calm ordering to your restaurant.',
    text: 'One QR code, two paths, one system. Start with a pilot and measure it with real users.',
  },

  about: {
    title: 'About',
    text: 'Səssiz Sifariş is a project of AAYAHCE, a student-led American–Azerbaijani human-centered engineering initiative.',
    aayahceFull: 'American–Azerbaijani Youth Association for Human-Centered Engineering',
    aayahceLink: 'Visit the AAYAHCE website',
    teamTitle: 'Team',
    team: '[Team members to be added]',
    privacy: 'Privacy policy',
    contact: 'Contact',
    copyright: '© {year} AAYAHCE. Concept project.',
  },

  privacyPage: {
    title: 'Privacy policy',
    lead: 'This page is a placeholder. The full privacy policy will be published before any pilot collects personal data.',
    points: [
      'The demo on this website does not send or store anything you type.',
      'The pilot request form sends only the details you enter, so we can reply to you.',
      'In the product, a phone number or email is requested once and used for the receipt and order status. Marketing messages can be declined.',
    ],
    back: 'Back to the home page',
  },
};

export type Dictionary = typeof en;
