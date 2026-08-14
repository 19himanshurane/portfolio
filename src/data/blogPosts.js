export const blogPosts = [
  {
    slug: 'llm-cost-autopilot-build',
    date: '2026-08-14',
    readTime: { en: '6 min read', de: '6 Min. Lesezeit' },
    tags: ['AI Engineering', 'Cost Optimization', 'Side Project'],
    title: {
      en: 'Cutting LLM Costs by Doing Less, Not More',
      de: 'LLM-Kosten senken, indem man weniger tut, nicht mehr',
    },
    excerpt: {
      en: "Why I built a routing layer that scores every request's complexity, sends it to the cheapest model that can handle it, and checks its own decisions in the background.",
      de: 'Warum ich eine Routing-Schicht gebaut habe, die jede Anfrage nach Komplexität bewertet, sie an das günstigste passende Modell schickt – und ihre eigenen Entscheidungen im Hintergrund überprüft.',
    },
    sections: {
      en: [
        {
          label: 'Situation',
          heading: 'The problem I kept running into',
          body: [
            "I kept noticing the same pattern in every AI project I looked at, including my own early prototypes: every single request, no matter how trivial, gets sent to the same model. A one-line data extraction goes to GPT-4o. A two-sentence summary goes to GPT-4o. A genuinely hard multi-step reasoning task also goes to GPT-4o. It's the easy default, and it's an expensive one — teams routinely overspend 2 to 20x on requests that never needed that much capability in the first place.",
            'I wanted to know: if I actually looked at what a prompt was asking for before deciding where to send it, how much of that spend could I avoid without anyone noticing a drop in quality?',
          ],
        },
        {
          label: 'Task',
          heading: 'What I set out to build',
          body: [
            'So I set myself a fairly specific goal: build a routing layer that sits in front of any LLM call, scores how complex the request actually is, and sends it to the cheapest model that can handle it — without silently degrading answers.',
            'And because "trust me, it works" isn\'t good enough for something making cost decisions on every request, it also had to catch its own mistakes and get better over time, not just route once and hope.',
          ],
        },
        {
          label: 'Action',
          heading: 'What I actually did',
          body: [
            'I started with the boring part first: a scikit-learn classifier trained to score incoming prompts into three complexity tiers using lightweight text features — nothing fancy, just enough signal to separate "extract this date" from "walk me through this multi-step proof." That classifier hits 86% accuracy on held-out data, which was good enough to route with, but not good enough to trust blindly.',
            "That's where the part I'm actually proud of comes in: an async verifier that runs quietly in the background after every response. It re-runs the same prompt through a stronger reference model, compares the two answers, and if they diverge too much, it escalates and logs the mismatch instead of letting a bad answer slip through unnoticed. Those escalated mismatches don't just disappear into a log file, either — they feed back into the training set for the next classifier retrain, so the system's routing judgment is supposed to get sharper the longer it runs, instead of staying frozen at whatever it learned on day one.",
            "I also didn't want routing changes to require a redeploy every time I second-guessed a threshold, so the tier-to-model mapping lives in a config file that's hot-reloadable through the API. And because I wanted to actually watch this thing work instead of trusting numbers in a log, I built a Streamlit dashboard on top of a FastAPI backend that shows real vs. baseline cost, routing distribution, and escalation rate — live.",
            "The part that made this feel real rather than a toy: Tier 1 and Tier 2 run on genuine, free inference through Groq, verified end to end with real responses and real (near-zero) cost and latency, not mocked numbers. Tier 3 still routes to GPT-4o mocked, since there's no free tier for frontier models — but every provider adapter falls back gracefully to a mock, so the whole system could be built and validated before I spent a cent.",
          ],
        },
        {
          label: 'Result',
          heading: 'What it came out to',
          body: [
            "What I ended up with is a working, containerized, CI-covered system — not a notebook demo: a FastAPI service with a live dashboard, a classifier that's honest about its own limits, and a verification loop that's designed to catch its own mistakes instead of assuming it's always right.",
            'The core claim — that most requests don\'t need the most expensive model — holds up when you actually look: routing intelligently instead of defaulting to "send everything to the biggest model" is where the 2 to 20x in this space usually comes from.',
            "The bigger lesson for me wasn't really about LLM routing specifically. It was a reminder that the most expensive mistake in most systems isn't picking the wrong model — it's never checking whether the model you picked was even necessary in the first place.",
          ],
        },
      ],
      de: [
        {
          label: 'Situation',
          heading: 'Das Problem, auf das ich immer wieder gestoßen bin',
          body: [
            'Mir ist bei jedem KI-Projekt, das ich mir angesehen habe – auch bei meinen eigenen frühen Prototypen – dasselbe Muster aufgefallen: Jede Anfrage, egal wie trivial, geht an dasselbe Modell. Eine einzeilige Datenextraktion geht an GPT-4o. Eine Zwei-Satz-Zusammenfassung geht an GPT-4o. Eine wirklich schwierige, mehrstufige Reasoning-Aufgabe geht ebenfalls an GPT-4o. Das ist der bequeme Standard – und ein teurer: Teams geben dadurch regelmäßig 2- bis 20-mal so viel aus wie nötig, für Anfragen, die diese Leistungsfähigkeit nie gebraucht hätten.',
            'Ich wollte wissen: Wenn ich mir tatsächlich ansehe, was ein Prompt verlangt, bevor ich entscheide, wohin er geht – wie viel von diesen Kosten könnte ich vermeiden, ohne dass jemand einen Qualitätsverlust bemerkt?',
          ],
        },
        {
          label: 'Task',
          heading: 'Was ich mir vorgenommen habe',
          body: [
            'Ich habe mir ein recht konkretes Ziel gesetzt: eine Routing-Schicht bauen, die sich vor jeden LLM-Aufruf schaltet, die tatsächliche Komplexität der Anfrage bewertet und sie an das günstigste Modell schickt, das sie bewältigen kann – ohne die Antwortqualität stillschweigend zu verschlechtern.',
            'Und weil "vertrau mir, es funktioniert" nicht reicht für etwas, das bei jeder Anfrage Kostenentscheidungen trifft, musste es auch seine eigenen Fehler erkennen und sich mit der Zeit verbessern – nicht nur einmal routen und hoffen.',
          ],
        },
        {
          label: 'Action',
          heading: 'Was ich konkret gemacht habe',
          body: [
            'Angefangen habe ich mit dem unspektakulären Teil: einem Scikit-learn-Klassifikator, der eingehende Prompts anhand leichtgewichtiger Textmerkmale in drei Komplexitätsstufen einteilt – nichts Ausgefallenes, nur genug Signal, um "extrahiere dieses Datum" von "führe mich durch diesen mehrstufigen Beweis" zu unterscheiden. Dieser Klassifikator erreicht 86 % Genauigkeit auf Testdaten – gut genug zum Routen, aber nicht gut genug, um ihm blind zu vertrauen.',
            'Genau da kommt der Teil, auf den ich am meisten stolz bin: ein asynchroner Verifier, der still im Hintergrund läuft, nachdem jede Antwort verschickt wurde. Er führt denselben Prompt erneut über ein stärkeres Referenzmodell aus, vergleicht beide Antworten – und wenn sie zu stark voneinander abweichen, eskaliert und protokolliert er die Abweichung, statt eine schlechte Antwort unbemerkt durchzulassen. Diese eskalierten Fehlfälle verschwinden auch nicht einfach in einer Log-Datei, sondern fließen zurück ins Trainingsset für das nächste Nachtraining des Klassifikators – das System soll mit der Zeit treffsicherer werden, statt auf dem Stand des ersten Tages stehen zu bleiben.',
            'Ich wollte außerdem nicht bei jeder Schwellenwert-Anpassung neu deployen müssen, also liegt die Zuordnung von Stufe zu Modell in einer Konfigurationsdatei, die sich live über die API nachladen lässt. Und weil ich dem System tatsächlich beim Arbeiten zusehen wollte, statt nur Zahlen in einem Log zu vertrauen, habe ich ein Streamlit-Dashboard auf einem FastAPI-Backend gebaut, das echte vs. Baseline-Kosten, die Routing-Verteilung und die Eskalationsrate live anzeigt.',
            'Der Teil, der das Ganze wirklich real gemacht hat statt nur ein Spielzeug: Stufe 1 und Stufe 2 laufen über echte, kostenlose Inferenz via Groq – end-to-end verifiziert mit echten Antworten und echten (nahezu null) Kosten und Latenzen, keine simulierten Zahlen. Stufe 3 geht weiterhin simuliert an GPT-4o, da es für Frontier-Modelle keine kostenlose Stufe gibt – aber jeder Provider-Adapter fällt sauber auf einen Mock zurück, sodass das gesamte System gebaut und validiert werden konnte, bevor ich auch nur einen Cent ausgegeben habe.',
          ],
        },
        {
          label: 'Result',
          heading: 'Wo ich am Ende gelandet bin',
          body: [
            'Am Ende stand ein funktionierendes, containerisiertes, mit CI abgesichertes System – keine Notebook-Demo: ein FastAPI-Service mit Live-Dashboard, ein Klassifikator, der ehrlich mit seinen eigenen Grenzen umgeht, und eine Verifikationsschleife, die darauf ausgelegt ist, eigene Fehler zu erkennen, statt einfach von sich selbst auszugehen.',
            'Die Kernaussage – dass die meisten Anfragen nicht das teuerste Modell brauchen – hält stand, wenn man genau hinschaut: Intelligentes Routing statt "schick einfach alles ans größte Modell" ist meist genau die Stelle, an der die 2- bis 20-fache Ersparnis in diesem Bereich herkommt.',
            'Die größere Erkenntnis für mich hatte eigentlich weniger mit LLM-Routing im Speziellen zu tun. Sie war eher eine Erinnerung daran, dass der teuerste Fehler in den meisten Systemen nicht die Wahl des falschen Modells ist – sondern, nie zu überprüfen, ob das gewählte Modell überhaupt nötig war.',
          ],
        },
      ],
    },
  },
];
