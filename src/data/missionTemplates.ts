import type { ProjectType, Mission } from '@/types';

interface MissionSeed {
  title: string;
  shortDescription: string;
  concept: string;
  whatYouLearn: string;
  challenge: string;
  explanation: string;
  hint: string;
  stuckGuidance: string;
  estimatedMinutes: number;
}

type Template = MissionSeed[];

const webApp: Template = [
  {
    title: 'Build your first interface',
    shortDescription: 'Create the first usable screen of your app.',
    concept: 'Components and UI structure',
    whatYouLearn: 'How to break a screen into reusable components and arrange them into a layout.',
    challenge: 'Create the first usable screen of your app — something a person can see and understand.',
    explanation:
      'A component is a reusable piece of your interface — like a button or a card. You build small pieces, then combine them into a full screen. Start with one simple screen: a title, some text, and a button. That is your first interface.',
    hint: 'Start with the smallest version: one title, one paragraph, one button. Do not worry about styling yet — just get something on screen.',
    stuckGuidance:
      'If nothing appears, check that your component is actually being rendered by your app. Most frameworks have one root file that decides what shows on screen — make sure your component is imported there.',
    estimatedMinutes: 20,
  },
  {
    title: 'Add interaction',
    shortDescription: 'Make something on screen respond to the user.',
    concept: 'State and events',
    whatYouLearn: 'How user actions like clicks and typing can trigger changes in your app.',
    challenge: 'Make something on the screen respond to the user — a button that does something, or a field that updates text.',
    explanation:
      'Events are how your app hears the user — a click, a key press, a form submit. When an event fires, you run a function that decides what happens next. Start with a button that changes something visible when clicked.',
    hint: 'Think about what should change when the user interacts. You need a function that runs when the event happens, and that function needs to update something the user can see.',
    stuckGuidance:
      'If the button does not seem to do anything, check two things: is your function actually attached to the event? And does the function actually change something the screen depends on?',
    estimatedMinutes: 15,
  },
  {
    title: 'Manage your project state',
    shortDescription: 'Store and update the information your app needs.',
    concept: 'React state',
    whatYouLearn: 'How to store information in your app and update it over time.',
    challenge: 'Store and update the information your app needs — make your app remember something between actions.',
    explanation:
      'State is information your app remembers while it is running. When that information changes, React can update the screen. Think of it as a box: you put a value in, and whenever it changes, the screen reflects the new value.',
    hint: 'Think about where your current data is stored and what needs to happen when it changes. You need a place to store the value and a way to update it.',
    stuckGuidance:
      'If the screen does not update when you change a value, you may be modifying a plain variable instead of using state. State functions tell React the value changed and the screen needs to re-render.',
    estimatedMinutes: 20,
  },
  {
    title: 'Connect data',
    shortDescription: 'Load or save real data from an external source.',
    concept: 'APIs and asynchronous data',
    whatYouLearn: 'How to request data from outside your app and handle the wait.',
    challenge: 'Load or save real data — fetch a list from a free public API and show it on screen.',
    explanation:
      'Most real apps need data from somewhere else. You send a request, wait for the response, then display it. The key is handling the wait — show a loading state while the data is on its way, so the user never sees a blank screen.',
    hint: 'There is a built-in function for making web requests. It returns a promise, so you need to wait for the response before using the data. Show something while you wait.',
    stuckGuidance:
      'If the data never appears, check whether the request finished successfully. Log the response. If it errors, the URL or the response shape may be different from what you expected.',
    estimatedMinutes: 25,
  },
  {
    title: 'Polish the experience',
    shortDescription: 'Make the app feel complete on mobile and desktop.',
    concept: 'Responsive design and UX',
    whatYouLearn: 'How to make your app look good and work well on any screen size.',
    challenge: 'Make the app feel complete on mobile and desktop — spacing, readability, and layout.',
    explanation:
      'Polish is about consistency: even spacing, readable text, and a layout that adapts to different screens. You do not need to be a designer — just make sure nothing feels broken or cramped. Test on a narrow phone screen and a wide desktop screen.',
    hint: 'Start with spacing and readability. Make sure text is large enough, buttons are easy to tap, and nothing overflows on a narrow screen.',
    stuckGuidance:
      'If something looks off on mobile, check whether your layout has a fixed width. On small screens, use flexible widths and let content wrap naturally.',
    estimatedMinutes: 20,
  },
];

const mobileApp: Template = [
  {
    title: 'Build the first screen',
    shortDescription: 'Create the main screen of your mobile app.',
    concept: 'Components and layout',
    whatYouLearn: 'How to structure a mobile screen using components and layout primitives.',
    challenge: 'Create the main screen of your app — something a person can see and navigate.',
    explanation:
      'A mobile screen is built from components stacked vertically or in a grid. Start with one screen: a header, some content, and a button. That is the foundation of your mobile app.',
    hint: 'Start with a vertical layout. Most mobile screens stack content top to bottom. Build one screen before adding navigation.',
    stuckGuidance:
      'If content does not appear, check that your screen component is registered in your navigation. Each screen needs to be connected to your app\'s navigator.',
    estimatedMinutes: 20,
  },
  {
    title: 'Add interaction',
    shortDescription: 'Make the screen respond to taps and input.',
    concept: 'State and events',
    whatYouLearn: 'How taps, input, and gestures trigger changes in your mobile app.',
    challenge: 'Make the screen respond to the user — a tap that does something, or a field that updates.',
    explanation:
      'Mobile interaction is about responding to taps and input. When a user taps a button, an event fires and you run a function. Start with a button that changes something visible.',
    hint: 'Attach a function to the tap event. Think about what should change visually when the user interacts.',
    stuckGuidance:
      'If taps do not register, check that your press handler is attached to the right element. Some components need a specific prop to be tappable.',
    estimatedMinutes: 15,
  },
  {
    title: 'Manage app data',
    shortDescription: 'Store and update information your app needs.',
    concept: 'Application state',
    whatYouLearn: 'How to store and update information across your mobile app.',
    challenge: 'Store and update the information your app needs so it remembers something between actions.',
    explanation:
      'Application state is the information your app remembers while it runs. When it changes, the screen updates. Think of it as shared memory your screens can read and update.',
    hint: 'You need a place to store the value and a way to update it. When the value changes, the screen should reflect the new value.',
    stuckGuidance:
      'If the screen does not update, you may be modifying a plain variable instead of using state. Use a state function so the framework knows to re-render.',
    estimatedMinutes: 20,
  },
  {
    title: 'Add a useful feature',
    shortDescription: 'Add a feature that uses an API or device capability.',
    concept: 'APIs or device functionality',
    whatYouLearn: 'How to connect to external data or device features like camera or location.',
    challenge: 'Add a feature that uses an API or device functionality — fetch data or use a device capability.',
    explanation:
      'Useful mobile features often need external data or device access. You request data, wait for it, and display it. Or you ask the device for a capability like the camera. Always handle the wait and the failure cases.',
    hint: 'Start with a simple data fetch. Show a loading state while you wait, and handle errors gracefully.',
    stuckGuidance:
      'If the data does not appear, check the request and log the response. If a device feature fails, check that you have the right permissions.',
    estimatedMinutes: 25,
  },
  {
    title: 'Polish and ship',
    shortDescription: 'Make the app feel smooth and ready for users.',
    concept: 'UX and responsive design',
    whatYouLearn: 'How to make your mobile app feel polished and ready for real users.',
    challenge: 'Make the app feel smooth — spacing, readability, and a clean layout.',
    explanation:
      'Polish means consistent spacing, readable text, and smooth interactions. Test on different screen sizes. Make sure nothing feels broken. Then ship it — your first version just needs to work.',
    hint: 'Focus on spacing and readability first. Make sure buttons are easy to tap and text is comfortable to read.',
    stuckGuidance:
      'If something feels off, test on a real device. Emulators can hide issues that show up on actual phones.',
    estimatedMinutes: 20,
  },
];

const game: Template = [
  {
    title: 'Create the game scene',
    shortDescription: 'Render the first scene of your game.',
    concept: 'Rendering and components',
    whatYouLearn: 'How to render a game scene and structure your game visually.',
    challenge: 'Create the first scene of your game — something the player can see.',
    explanation:
      'A game scene is what the player sees: a background, some objects, maybe a character. Start with the simplest version: one background and one object on screen. That is your game world.',
    hint: 'Start with one static scene. Do not add movement yet — just get something visible on screen.',
    stuckGuidance:
      'If nothing renders, check that your game loop or render function is running. Most game frameworks need a loop that draws the scene every frame.',
    estimatedMinutes: 20,
  },
  {
    title: 'Add player interaction',
    shortDescription: 'Let the player interact with the game.',
    concept: 'Events and state',
    whatYouLearn: 'How player input like keyboard or touch drives game behavior.',
    challenge: 'Let the player interact — move something, click something, or press a key to make something happen.',
    explanation:
      'Player interaction is how the game hears input. When a key is pressed or the screen is tapped, an event fires and you change something in the game. Start with one input that moves or changes one thing.',
    hint: 'Attach a handler to a key or tap event. Think about what should change when the input happens.',
    stuckGuidance:
      'If input does not register, check that your event listener is attached and that your game loop is reading the updated state.',
    estimatedMinutes: 15,
  },
  {
    title: 'Add game state',
    shortDescription: 'Track the information your game needs.',
    concept: 'State management',
    whatYouLearn: 'How to track and update game information like position, score, or level.',
    challenge: 'Track the information your game needs — position, score, or level — and update it over time.',
    explanation:
      'Game state is the information the game tracks: player position, score, level, health. When state changes, the game updates. Start by tracking one value and changing it during play.',
    hint: 'Think about what values the game needs to remember. Store them in one place and update them when events happen.',
    stuckGuidance:
      'If the game does not reflect changes, you may be updating a copy instead of the actual state. Make sure your updates target the real game state.',
    estimatedMinutes: 20,
  },
  {
    title: 'Add scoring or progression',
    shortDescription: 'Give the player a goal to work toward.',
    concept: 'Logic and data',
    whatYouLearn: 'How to add scoring, levels, or progression to make the game feel meaningful.',
    challenge: 'Add scoring or progression — give the player a goal to work toward.',
    explanation:
      'Scoring and progression give the game purpose. The player needs a goal: a score to reach, a level to beat, or a challenge to overcome. Start with a simple score that increases when the player does something right.',
    hint: 'Start with a simple counter. Increase it when the player does something good. Show it on screen.',
    stuckGuidance:
      'If the score does not update, check that the event that should increase it is actually connected to the score variable.',
    estimatedMinutes: 20,
  },
  {
    title: 'Polish and ship',
    shortDescription: 'Make the game feel fun and ready to share.',
    concept: 'UX and game feedback',
    whatYouLearn: 'How to add feedback and polish so the game feels fun and ready.',
    challenge: 'Make the game feel fun — add feedback, polish visuals, and ship it.',
    explanation:
      'Game polish is about feedback: when something happens, the player should see or hear it. A score goes up, a sound plays, a flash appears. Small feedback moments make the game feel alive. Then ship it.',
    hint: 'Add one piece of feedback: a visual change or a sound when the player scores. Small details make the game feel responsive.',
    stuckGuidance:
      'If the game feels flat, add feedback for every player action. Even a small visual change makes a big difference.',
    estimatedMinutes: 20,
  },
];

const aiTool: Template = [
  {
    title: 'Build the interface',
    shortDescription: 'Create the input form for your AI tool.',
    concept: 'Components and forms',
    whatYouLearn: 'How to build a form-based interface for user input.',
    challenge: 'Create the interface — a form where the user enters their input.',
    explanation:
      'An AI tool starts with an interface: a text field, a button, and a place for the result. Build the form first, before any AI logic. The user types something, clicks a button, and expects a response.',
    hint: 'Start with a text field and a submit button. Do not connect the AI yet — just get the form working.',
    stuckGuidance:
      'If the form does not submit, check that your submit handler is attached and that it prevents the default form behavior.',
    estimatedMinutes: 15,
  },
  {
    title: 'Build the input flow',
    shortDescription: 'Capture and prepare the user input.',
    concept: 'State and events',
    whatYouLearn: 'How to capture, validate, and prepare user input before sending it.',
    challenge: 'Capture the user input and prepare it so it is ready to be used.',
    explanation:
      'The input flow is how you capture what the user typed, validate it, and prepare it. You store the input in state, check that it is not empty, and format it for the next step. This is the bridge between the form and the AI.',
    hint: 'Store the input value in state when the user types. When they submit, check that it is not empty before proceeding.',
    stuckGuidance:
      'If the input seems empty when submitted, check that you are reading the value from state, not from the DOM directly.',
    estimatedMinutes: 15,
  },
  {
    title: 'Connect the AI',
    shortDescription: 'Send the input and receive a response.',
    concept: 'API requests',
    whatYouLearn: 'How to send a request to an AI API and receive a response.',
    challenge: 'Connect to an AI — send the user input and receive a response. Use a mock for now if you do not have a key.',
    explanation:
      'Connecting the AI means sending the user input to an API and receiving a response. You send a request with the input, wait for the AI to process it, and get a result back. For now, you can mock the response — just return a placeholder after a short delay.',
    hint: 'Start with a mock: return a placeholder response after a short delay. This lets you build the full flow without a real API key.',
    stuckGuidance:
      'If the response never comes, check that your request is actually being sent and that you are waiting for it before displaying the result.',
    estimatedMinutes: 25,
  },
  {
    title: 'Handle loading and errors',
    shortDescription: 'Show loading states and handle failures gracefully.',
    concept: 'Async programming and error handling',
    whatYouLearn: 'How to show loading states and handle errors so the user is never confused.',
    challenge: 'Handle loading and errors — show a loading state while waiting and handle failures gracefully.',
    explanation:
      'When you call an API, things can go wrong: the request can be slow, fail, or return something unexpected. Show a loading state while waiting, and an error message if it fails. The user should always know what is happening.',
    hint: 'Add a loading state that shows while the request is in flight. Add an error state that shows if the request fails. Never leave the user staring at a blank screen.',
    stuckGuidance:
      'If errors disappear silently, wrap your request in a try-catch and set an error message in state. Show the error to the user with a retry option.',
    estimatedMinutes: 20,
  },
  {
    title: 'Polish and ship',
    shortDescription: 'Make the tool feel reliable and responsible.',
    concept: 'UX and responsible AI usage',
    whatYouLearn: 'How to polish the experience and present AI results responsibly.',
    challenge: 'Polish the tool — make it feel reliable, clear, and ready for users.',
    explanation:
      'Polish for an AI tool means clear results, honest loading states, and responsible presentation. Show where the answer came from. Let the user retry. Make sure the interface does not overpromise. Then ship it.',
    hint: 'Focus on clarity: label the result, show loading state, and let the user retry. Do not present the AI output as infallible.',
    stuckGuidance:
      'If the results feel unreliable, add clear labels and a retry button. Let the user know the AI can be wrong.',
    estimatedMinutes: 20,
  },
];

const other: Template = [
  {
    title: 'Define the first experience',
    shortDescription: 'Decide what the first thing your user sees will be.',
    concept: 'Planning and scoping',
    whatYouLearn: 'How to scope a first version and define the core experience.',
    challenge: 'Define the first experience — what will the user see and do first?',
    explanation:
      'Before building, decide what the first version looks like. What is the one thing the user does? Keep it small. A first version is not the full product — it is the simplest thing that works.',
    hint: 'Write down one sentence: "The user can ___." That is your first experience. Build only that.',
    stuckGuidance:
      'If you cannot decide, pick the smallest thing that could possibly work. You can always expand later.',
    estimatedMinutes: 15,
  },
  {
    title: 'Build the core interaction',
    shortDescription: 'Create the main thing your project does.',
    concept: 'Core functionality',
    whatYouLearn: 'How to build the one main interaction your project is built around.',
    challenge: 'Build the core interaction — the main thing your project does.',
    explanation:
      'The core interaction is the heart of your project. If it is a tool, it is the main action. If it is a site, it is the main page. Build the one thing that matters most, and do not add anything else yet.',
    hint: 'Focus on one action. Build it, test it, and make sure it works before adding anything else.',
    stuckGuidance:
      'If the core interaction feels too big, break it into smaller steps. Build the smallest version that works.',
    estimatedMinutes: 25,
  },
  {
    title: 'Add project logic',
    shortDescription: 'Add the rules and behavior your project needs.',
    concept: 'Logic and state',
    whatYouLearn: 'How to add the rules and behavior that make your project functional.',
    challenge: 'Add the logic your project needs — the rules that make it work.',
    explanation:
      'Project logic is the set of rules that govern how your project behaves. If something should happen when a condition is met, that is logic. Start with the most important rule and build outward.',
    hint: 'Think about what should happen and when. Write the rules as simple if-then statements first.',
    stuckGuidance:
      'If the logic feels tangled, write it down as steps on paper. Often the clearest version is the simplest one.',
    estimatedMinutes: 20,
  },
  {
    title: 'Connect data or functionality',
    shortDescription: 'Bring in external data or a useful feature.',
    concept: 'Data and integration',
    whatYouLearn: 'How to connect external data or additional functionality to your project.',
    challenge: 'Connect data or functionality — bring in something from outside your project.',
    explanation:
      'Most projects need data or a feature from outside: an API, a file, or a service. You connect to it, request what you need, and use the result. Handle the wait and the failure cases.',
    hint: 'Start with a simple data fetch or a small integration. Show a loading state and handle errors.',
    stuckGuidance:
      'If the connection fails, check the URL and log the response. Start with a mock if the real source is not ready.',
    estimatedMinutes: 25,
  },
  {
    title: 'Polish and ship',
    shortDescription: 'Make it feel complete and share it.',
    concept: 'UX and shipping',
    whatYouLearn: 'How to polish your project and ship it to real users.',
    challenge: 'Polish the project and ship it — make it feel complete and share it.',
    explanation:
      'Polish means making sure nothing feels broken: spacing, readability, and flow. Then ship it. Your first version does not need to be perfect — it needs to work and be shareable.',
    hint: 'Test on different screen sizes. Fix anything that feels broken. Then deploy and share the link.',
    stuckGuidance:
      'If you keep finding things to fix, set a hard limit: fix only things that would confuse a new user. Everything else can wait.',
    estimatedMinutes: 20,
  },
];

const templates: Record<ProjectType, Template> = {
  'Web app': webApp,
  'Mobile app': mobileApp,
  Game: game,
  'AI tool': aiTool,
  Other: other,
};

export function generateMissions(type: ProjectType): Mission[] {
  const seeds = templates[type];
  return seeds.map((seed, i) => ({
    id: `mission-${i + 1}`,
    order: i + 1,
    title: seed.title,
    shortDescription: seed.shortDescription,
    concept: seed.concept,
    whatYouLearn: seed.whatYouLearn,
    challenge: seed.challenge,
    explanation: seed.explanation,
    hint: seed.hint,
    stuckGuidance: seed.stuckGuidance,
    status: i === 0 ? 'active' : 'locked',
    estimatedMinutes: seed.estimatedMinutes,
    completedAt: null,
  }));
}
