export const blogPosts = [
  {
    slug: 'quorum-build',
    date: '2026-08-19',
    readTime: { en: '3 min read', de: '3 Min. Lesezeit' },
    tags: ['Multi-Agent Systems', 'LangGraph', 'Side Project'],
    title: {
      en: 'Turning Model Disagreement Into a Signal, Not Noise',
      de: 'Modell-Uneinigkeit zum Signal machen, nicht zum Rauschen',
    },
    excerpt: {
      en: "Three LLM critics look at the same output and argue about it on purpose, each running on a different model so they can't quietly agree for the wrong reasons. An adjudicator reads the argument and decides who's right.",
      de: 'Drei LLM-Kritiker sehen sich dieselbe Ausgabe an und streiten absichtlich darüber, jeder auf einem anderen Modell, damit sie sich nicht aus den falschen Gründen leise einig werden. Ein Adjudicator liest den Streit und entscheidet, wer recht hat.',
    },
    sections: {
      en: [
        {
          heading: 'Grading your own homework',
          body: [
            "Ask a model to check the answer it just gave you, and you're asking it to spot a mistake it currently believes is correct. Same problem as proofreading your own email: the typo that would jump out to anyone else sails right past you, because you already trust the sentence you wrote.",
            "I ran into a version of this building EvalGate, where an LLM-as-judge step is only as good as the judge's own blind spots. This time I wanted disagreement itself to be the signal, not agreement. Three models, built so they can't share a blind spot, forced to work it out.",
          ],
        },
        {
          heading: 'Making them actually disagree',
          body: [
            "The plan: three critics on every output in parallel, each scoped to one thing only (accuracy, logic, completeness), each on a properly different model so a shared failure mode can't sneak in wearing a consensus costume. Accuracy and completeness run on two different Groq models; logic runs on Mistral. NVIDIA NIM was supposed to be the third provider, but its free tier answered in 51 to 180 seconds, so I swapped it for a second Groq model. Where they disagreed, an adjudicator reads the actual disagreement and decides, instead of averaging three scores into a number that means nothing by itself.",
            "Disagreement detection turned out to be the harder problem. Critics don't quote text identically, so I fuzzy-matched quotes with difflib's SequenceMatcher and sorted disagreements into four kinds: one critic flags what another validated as fine, two critics rate the same issue's severity far apart, one critic catches something nobody else mentions, or the overall scores just split hard. LangGraph fans out to all three critics, then routes: a clean sweep skips the adjudicator entirely, a total failure says so honestly instead of faking a verdict, and a partial failure ships with a note about what's missing.",
            "The first real run just hung, every time, on Windows. Turns out building an OpenAI-compatible client lazily builds an SSL context that touches the OS certificate store, and LangGraph's parallel dispatch was calling that constructor from three threads at once on the very first request. Fixed it with a lock and a cache in providers.py, so only the first caller builds the client and everyone else reuses it.",
            "Every provider path also has a deterministic offline mock behind it, so the full pipeline runs end to end for free, which is what let me build and test the routing logic before spending a real request on it. Four fixed test cases anchor the suite, one for each critic to catch and one clean case that should short-circuit straight through.",
          ],
        },
        {
          body: [
            "What's running now is MIT-licensed, Dockerized, and tested against real Groq and Mistral calls, not just the mock path. Three critics reading the same output land in different places often enough that tracking who disagrees most is tracking something real.",
            "Same lesson as EvalGate, from the other side: a model's confidence isn't evidence it's right, and neither is one model's opinion of another's output. What counts is whether an independent second read agrees or doesn't. Getting three of them to actually disagree on purpose was the whole project.",
          ],
        },
      ],
      de: [
        {
          heading: 'Die eigenen Hausaufgaben benoten',
          body: [
            'Ein Modell zu bitten, die eigene Antwort zu prüfen, heißt, es zu bitten, einen Fehler zu finden, den es gerade für richtig hält. Dasselbe Problem wie beim Korrekturlesen der eigenen E-Mail: Der Tippfehler, der jedem anderen sofort auffallen würde, rutscht bei einem selbst einfach durch, weil man dem Satz, den man geschrieben hat, schon vertraut.',
            'Auf eine Version davon bin ich beim Bau von EvalGate gestoßen, wo ein LLM-as-Judge-Schritt nur so gut ist wie die blinden Flecken des Richters selbst. Diesmal sollte Uneinigkeit selbst das Signal sein, nicht Übereinstimmung. Drei Modelle, so gebaut, dass sie keinen blinden Fleck teilen können, gezwungen, sich zu einigen.',
          ],
        },
        {
          heading: 'Sie wirklich uneinig werden lassen',
          body: [
            'Der Plan: drei Kritiker parallel auf jede Ausgabe, jeden auf genau eine Sache beschränkt (Genauigkeit, Logik, Vollständigkeit), jeden auf einem wirklich anderen Modell, damit sich kein gemeinsamer Fehlermodus als Konsens verkleiden kann. Genauigkeit und Vollständigkeit laufen über zwei verschiedene Groq-Modelle, Logik über Mistral. NVIDIA NIM sollte der dritte Anbieter sein, aber die kostenlose Stufe antwortete nach 51 bis 180 Sekunden, also habe ich sie gegen ein zweites Groq-Modell getauscht. Wo sie sich uneinig sind, liest ein Adjudicator die tatsächliche Meinungsverschiedenheit und entscheidet, statt drei Werte zu einer bedeutungslosen Zahl zu mitteln.',
            'Die Erkennung von Meinungsverschiedenheiten war das schwierigere Problem. Kritiker zitieren Text nicht wortgleich, also habe ich Zitate mit difflibs SequenceMatcher fuzzy abgeglichen und vier Arten von Meinungsverschiedenheit unterschieden: Ein Kritiker markiert, was ein anderer als in Ordnung bestätigt hat; zwei Kritiker bewerten denselben Fund weit auseinander; ein Kritiker findet etwas, das kein anderer erwähnt; oder die Gesamtwertungen gehen einfach stark auseinander. LangGraph verteilt an alle drei Kritiker und leitet dann weiter: Ein sauberer Durchlauf überspringt den Adjudicator komplett, ein Totalausfall sagt das ehrlich statt ein Verdikt vorzutäuschen, ein Teilausfall geht mit einem Hinweis raus, was fehlt.',
            'Der erste echte Lauf ist einfach hängen geblieben, jedes Mal, unter Windows. Es stellte sich heraus, dass die Erstellung eines OpenAI-kompatiblen Clients lazy einen SSL-Kontext aufbaut, der den Zertifikatsspeicher des Betriebssystems anfasst, und LangGraphs paralleles Dispatching rief diesen Konstruktor beim ersten Request von drei Threads gleichzeitig auf. Behoben mit einem Lock und einem Cache in providers.py, sodass nur der erste Aufrufer den Client baut.',
            'Hinter jedem Provider-Pfad steht außerdem ein deterministischer Offline-Mock, sodass die komplette Pipeline end-to-end kostenlos läuft, was mir erlaubt hat, das Routing zu bauen und zu testen, bevor ich einen echten Request dafür ausgegeben habe. Vier feste Testfälle verankern die Suite, einer pro Kritiker plus ein sauberer Fall, der direkt durchspringen soll.',
          ],
        },
        {
          body: [
            'Was jetzt läuft, ist MIT-lizenziert, containerisiert und gegen echte Groq- und Mistral-Aufrufe getestet, nicht nur über den Mock-Pfad. Drei Kritiker, die dieselbe Ausgabe lesen, landen oft genug an unterschiedlichen Stellen, dass es etwas Echtes ist, wer am häufigsten widerspricht.',
            'Dieselbe Lektion wie bei EvalGate, diesmal von der anderen Seite: Die Sicherheit eines Modells ist kein Beleg, dass es richtig liegt, und das Urteil eines Modells über ein anderes genauso wenig. Drei davon dazu zu bringen, sich absichtlich uneinig zu sein, war am Ende das ganze Projekt.',
          ],
        },
      ],
    },
  },
  {
    slug: 'evalgate-build',
    date: '2026-08-10',
    readTime: { en: '3 min read', de: '3 Min. Lesezeit' },
    tags: ['LLM Evaluation', 'CI/CD', 'Side Project'],
    title: {
      en: 'Treating a Prompt Change Like Any Other Pull Request',
      de: 'Eine Prompt-Änderung wie jeden anderen Pull Request behandeln',
    },
    excerpt: {
      en: 'A prompt change now has to clear a CI gate before it can merge, same as any other code change would. Building that gate caught two bugs a code review never would have.',
      de: 'Eine Prompt-Änderung muss jetzt ein CI-Tor passieren, bevor sie gemerged werden kann, genau wie jede andere Code-Änderung auch. Beim Bau dieses Tors sind zwei Bugs aufgetaucht, die ein Code-Review nie gefunden hätte.',
    },
    sections: {
      en: [
        {
          heading: 'The discipline a prompt never gets',
          body: [
            "For a long time my definition of \"the prompt works\" was: I read the output once, it looked fine, I moved on. Software has an entire discipline for this, version control, regression tests, CI that stops a bad change before it reaches anyone, and every LLM project I'd touched skipped all of it. I wanted to give a prompt the same discipline a function already gets: a gate a change has to pass before it's allowed to matter.",
          ],
        },
        {
          heading: 'Picking a boring feature on purpose',
          body: [
            "The target: a pipeline that triggers on every prompt or model change, tests the feature against cases with known-correct answers, scores it on more than accuracy alone, and blocks the merge if something got worse. I picked a customer support email classifier on purpose, unglamorous enough that the harness stayed the actual subject. And the plan was GitHub Actions from day one, proven against a real pull request, not CI bolted on after everything already worked by hand.",
          ],
        },
        {
          heading: 'Building it, then trying to break it',
          body: [
            "Dataset first: fifty hand-verified support emails, not LLM-generated, built from real ticket metadata and rewritten by hand, a chunk of them deliberately awkward (mixed languages, sarcasm, judgment calls), because easy cases tell you nothing when a prompt changes. Scoring couldn't stop at category accuracy either, since a prompt change can hold accuracy flat while quietly wrecking the summaries. Every case gets checked on four things: category match, a larger model's rating of the summary, latency, and token cost, diffed case by case against the last run.",
            "Thresholds took some trial and error: warn at a 3% drop, fail at 8%, plus a rolling seven-run average to catch a prompt eroding by a point every change, since that never trips a single-run threshold on its own. GitHub Actions runs the eval on every PR touching /prompts and posts a pass/fail comment; a merge to main re-runs it and records the new baseline, which is what makes the next PR's diff mean anything.",
            "Here's the part I'd tell you about over coffee: I opened a real pull request against my own repo to watch the Action run end to end, and it caught two bugs no amount of reading the source would have. The reports folder only existed on my machine and was never tracked by git, so CI had nowhere to write the report. And an unset GitHub Actions variable evaluates to an empty string rather than a missing one, so my threshold parser crashed trying to turn it into a number. Neither bug is exotic, both live exactly at the seam between \"works on my machine\" and the environment that counts. Once the harness held up, the first real baseline was 84%; two targeted fixes later it hit 100%.",
          ],
        },
        {
          body: [
            "What exists now is a small, MIT-licensed, Dockerized pipeline with its own CI and a pull request history I can point to: here's the bug it caught, here's the number it moved.",
            "What I took from it wasn't really about prompts. I stopped trusting my own read of whether something worked, and started insisting on watching it run somewhere real instead.",
          ],
        },
      ],
      de: [
        {
          heading: 'Die Disziplin, die ein Prompt nie bekommt',
          body: [
            'Lange war meine Definition von „der Prompt funktioniert" simpel: Ich habe den Output einmal gelesen, er sah gut aus, ich bin weiter. Für Software gibt es dafür eine ganze Disziplin, Versionskontrolle, Regressionstests, CI, die eine schlechte Änderung stoppt, bevor sie irgendwen erreicht, und jedes LLM-Projekt, das ich angefasst habe, hat das übersprungen. Ich wollte einem Prompt dieselbe Disziplin geben wie einer Funktion: ein Tor, durch das eine Änderung muss, bevor sie überhaupt zählt.',
          ],
        },
        {
          heading: 'Absichtlich ein langweiliges Feature wählen',
          body: [
            'Das Ziel: eine Pipeline, die bei jeder Prompt- oder Modelländerung anspringt, das Feature gegen Fälle mit bekannt richtiger Antwort testet, mehr als nur Genauigkeit bewertet und den Merge blockiert, wenn etwas schlechter wurde. Als Feature habe ich absichtlich einen Kundensupport-E-Mail-Klassifikator gewählt, unspektakulär genug, dass der Harness das eigentliche Thema blieb. Und der Plan stand von Anfang an: GitHub Actions, bewiesen an einem echten Pull Request, nicht CI erst am Ende dazugeschraubt.',
          ],
        },
        {
          heading: 'Es bauen und dann versuchen, es kaputtzukriegen',
          body: [
            'Zuerst der Datensatz: fünfzig von Hand verifizierte Support-E-Mails, nicht LLM-generiert, aus echten Ticket-Metadaten aufgebaut und von Hand umgeschrieben, ein Teil davon bewusst unangenehm (Sprachwechsel, Sarkasmus, Ermessensfälle), weil einfache Fälle bei einer Prompt-Änderung nichts aussagen. Beim Scoring reichte exakte Kategorietreffer allein nicht, denn eine Änderung kann die Genauigkeit halten und trotzdem leise die Zusammenfassungen ruinieren. Jeder Fall wird auf vier Dinge geprüft: Kategorie, Bewertung der Zusammenfassung durch ein größeres Modell, Dauer, Tokenkosten, jeweils gegen den letzten Lauf verglichen.',
            'Die Schwellenwerte brauchten Ausprobieren: Warnung ab 3 % Rückgang, Abbruch ab 8 %, dazu ein gleitender Durchschnitt über sieben Läufe, um einen Prompt zu fangen, der sich Punkt für Punkt verschlechtert, ohne je einen einzelnen Schwellenwert zu reißen. GitHub Actions führt die Auswertung bei jedem PR aus, der /prompts anfasst, und postet einen Pass/Fail-Kommentar; ein Merge nach main speichert das Ergebnis als neue Baseline, was den Diff des nächsten PRs erst aussagekräftig macht.',
            'Das ist der Teil, den ich beim Kaffee erzählen würde: Ich habe einen echten Pull Request gegen mein eigenes Repo geöffnet, um die Action komplett laufen zu sehen, und sie hat zwei Bugs gefunden, die mir beim Lesen des Codes nie aufgefallen wären. Der reports-Ordner existierte nur auf meinem Rechner und war nie von Git verfolgt, also hatte CI keinen Ort für den Report. Und eine nicht gesetzte GitHub-Actions-Variable wird zu einem leeren String statt zu einer fehlenden, also ist mein Schwellenwert-Parser abgestürzt. Keiner der beiden Bugs ist exotisch, beide leben an der Naht zwischen „funktioniert auf meinem Rechner" und der Umgebung, die zählt. Sobald der Harness stand, lag die erste Baseline bei 84 %, zwei gezielte Korrekturen später bei 100 %.',
          ],
        },
        {
          body: [
            'Was jetzt existiert, ist eine kleine, MIT-lizenzierte, containerisierte Pipeline mit eigener CI und einer Pull-Request-Historie, auf die ich zeigen kann: Hier ist der Bug, hier ist die Zahl, die er bewegt hat.',
            'Was ich mitgenommen habe, hatte kaum mit Prompts zu tun. Ich habe aufgehört, meinem eigenen Eindruck zu vertrauen, und stattdessen darauf bestanden, es irgendwo Echtem laufen zu sehen.',
          ],
        },
      ],
    },
  },
  {
    slug: 'llm-cost-autopilot-build',
    date: '2026-07-28',
    readTime: { en: '2 min read', de: '2 Min. Lesezeit' },
    tags: ['Model Routing', 'FastAPI', 'Side Project'],
    title: {
      en: 'Cutting LLM Costs by Doing Less, Not More',
      de: 'LLM-Kosten senken, indem man weniger tut, nicht mehr',
    },
    excerpt: {
      en: 'A 633-request load test cut LLM spend by 57%, using nothing more clever than sending each request to the cheapest model that could actually handle it instead of defaulting to the biggest one.',
      de: 'Ein Lasttest mit 633 Anfragen hat die LLM-Kosten um 57 % gesenkt, mit nichts Cleverem als jede Anfrage an das günstigste Modell zu schicken, das sie tatsächlich bewältigen konnte, statt pauschal ans größte zu gehen.',
    },
    sections: {
      en: [
        {
          body: [
            "Every request I sent through an early prototype went to GPT-4o, whether it was a one-line extraction or a genuinely hard reasoning task, because picking one model and pointing everything at it is the path of least resistance. It's also the expensive one; I've watched teams, mine included, casually overspend 2 to 20x on requests that never needed that much horsepower. So I asked a plain question: if something looked at what a prompt was actually asking for first, how much of that spend just disappears?",
          ],
        },
        {
          heading: 'A router that has to earn the name',
          body: [
            "The goal: a routing layer in front of any LLM call that scores how complex the request is and sends it to the cheapest model that can handle it, without quietly degrading the answer, and catches its own mistakes over time instead of routing once and hoping.",
          ],
        },
        {
          heading: "The boring part, and the part I'm proud of",
          body: [
            'I started with the unglamorous half: a scikit-learn classifier scoring prompts into three complexity tiers using nine lightweight text features, word count, analysis verbs like "compare," output format complexity. It hits 86% accuracy on held-out data. Good enough to route with, not good enough to trust blindly.',
            "Which is where the async verifier comes in: it quietly re-runs each prompt through a stronger reference model in the background, and escalates on disagreement instead of letting a bad answer slip through, feeding those mismatches back into the next classifier retrain. Routing itself lives in a hot-reloadable config, and a live Streamlit dashboard on top of the FastAPI backend shows real spend against baseline.",
            "Tier 1 and Tier 2 run on real, free inference through Groq, real responses, real near-zero cost and latency, nothing mocked. Tier 3 still routes to a mocked GPT-4o, since no free tier exists for frontier models. None of it hides behind a demo that only looks good, either: the live API spins down after fifteen minutes of quiet on Render's free tier, and it's rate-limited to ten requests a minute to protect the Groq quota underneath it.",
          ],
        },
        {
          body: [
            "A 633-request load test put a real number on the core claim: routing instead of defaulting everything to GPT-4o cost $0.3632 rather than $0.8493, a 57.2% cut, with a 0% escalation rate. Moving the simple tier off a paid model partway through pushed that up from an earlier 49.4%.",
            "The lesson wasn't about routing specifically. The expensive mistake in most systems isn't picking the wrong model, it's never checking whether the model you picked was necessary at all.",
          ],
        },
      ],
      de: [
        {
          body: [
            'Jede Anfrage in einem frühen Prototyp ging an GPT-4o, ob einzeilige Extraktion oder eine wirklich harte Reasoning-Aufgabe, weil man ein Modell auswählt und einfach alles dorthin schickt, das ist der Weg des geringsten Widerstands. Er ist auch der teure; ich habe gesehen, wie Teams, meine eigenen eingeschlossen, locker das 2- bis 20-Fache ausgeben für Anfragen, die diese Leistung nie gebraucht hätten. Also habe ich mir eine einfache Frage gestellt: Wenn etwas zuerst ansieht, was ein Prompt wirklich verlangt, wie viel von diesen Kosten verschwindet einfach?',
          ],
        },
        {
          heading: 'Ein Router, der sich den Namen verdienen muss',
          body: [
            'Das Ziel: eine Routing-Schicht vor jedem LLM-Aufruf, die die Komplexität bewertet und an das günstigste passende Modell schickt, ohne die Antwort still zu verschlechtern, und die eigene Fehler über Zeit erkennt statt nur einmal zu routen und zu hoffen.',
          ],
        },
        {
          heading: 'Der langweilige Teil, und der Teil, auf den ich stolz bin',
          body: [
            'Angefangen habe ich mit der unspektakulären Hälfte: einem Scikit-learn-Klassifikator, der Prompts anhand von neun leichtgewichtigen Textmerkmalen in drei Komplexitätsstufen einteilt, Wortanzahl, Analyseverben wie „vergleiche", Komplexität des Ausgabeformats. Er erreicht 86 % Genauigkeit auf Testdaten. Gut genug zum Routen, nicht gut genug für blindes Vertrauen.',
            'Und hier kommt der asynchrone Verifier ins Spiel: Er führt jeden Prompt still im Hintergrund erneut über ein stärkeres Referenzmodell aus und eskaliert bei Abweichung, statt eine schlechte Antwort durchzulassen, und speist diese Fälle zurück ins nächste Training. Das Routing selbst liegt in einer live nachladbaren Konfiguration, und ein Streamlit-Dashboard über dem FastAPI-Backend zeigt echte Kosten gegen die Baseline.',
            'Stufe 1 und Stufe 2 laufen über echte, kostenlose Inferenz via Groq, echte Antworten, echte, nahezu kostenlose Latenz, nichts simuliert. Stufe 3 geht weiterhin simuliert an GPT-4o, da es dafür keine kostenlose Stufe gibt. Das versteckt sich auch nicht hinter einer Demo, die nur gut aussieht: Die Live-API fährt nach fünfzehn Minuten Ruhe auf Renders kostenloser Stufe herunter und ist auf zehn Anfragen pro Minute begrenzt, um das Groq-Kontingent zu schützen.',
          ],
        },
        {
          body: [
            'Ein Lasttest mit 633 Anfragen hat der Kernaussage eine echte Zahl gegeben: Routing statt alles an GPT-4o zu schicken, kostete 0,3632 $ statt 0,8493 $, eine Ersparnis von 57,2 %, bei einer Eskalationsrate von 0 %. Die einfache Stufe von einem bezahlten Modell wegzuholen, hat diese Zahl von vorher 49,4 % nach oben geschoben.',
            'Die Lektion hatte weniger mit Routing im Speziellen zu tun. Der teuerste Fehler in den meisten Systemen ist nicht die Wahl des falschen Modells, sondern nie zu prüfen, ob das gewählte Modell überhaupt nötig war.',
          ],
        },
      ],
    },
  },
];
