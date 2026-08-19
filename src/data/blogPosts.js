export const blogPosts = [
  {
    slug: 'quorum-build',
    date: '2026-08-19',
    readTime: { en: '8 min read', de: '8 Min. Lesezeit' },
    tags: ['Multi-Agent Systems', 'LangGraph', 'Side Project'],
    title: {
      en: 'Turning Model Disagreement Into a Signal, Not Noise',
      de: 'Modell-Uneinigkeit zum Signal machen, nicht zum Rauschen',
    },
    excerpt: {
      en: 'Why I built a system where three independently modeled LLM critics review the same output in parallel, and let their disagreements, not their agreement, do the actual diagnostic work.',
      de: 'Warum ich ein System gebaut habe, in dem drei unabhängig modellierte LLM-Kritiker dieselbe Ausgabe parallel prüfen, und ihre Meinungsverschiedenheiten, nicht ihre Übereinstimmung, die eigentliche diagnostische Arbeit leisten lässt.',
    },
    sections: {
      en: [
        {
          heading: 'Grading your own homework',
          body: [
            "Ask a model to check the answer it just gave you, and you're asking it to spot a mistake it currently believes is correct. Same problem as proofreading your own email: the typo that would jump out to anyone else sails right past you, because you already trust the sentence you wrote.",
            "I ran into a version of this building EvalGate, where an LLM-as-judge step is only as good as the judge's own blind spots, and a single judge has exactly one set of them. This time I wanted to know if disagreement itself could be the useful signal, not agreement. Not one model checking an output. Three, built so they can't share a blind spot, and forced to work it out.",
          ],
        },
        {
          heading: 'Making them actually disagree',
          body: [
            "The plan: put three critics on any output in parallel, each scoped to one thing only (accuracy, logic, completeness), each running on a properly different model so a shared failure mode can't sneak in wearing a consensus costume. Where they disagreed, an adjudicator reads the actual disagreement and decides, instead of averaging three scores into a number that means nothing by itself. Three critics that secretly share the same weaknesses, because they're all flavors of one model family, would just produce agreement that looks like confidence and is really correlated blindness.",
            "Provider diversity wasn't decoration, it was the whole point. Accuracy and completeness route through two different Groq models (openai/gpt-oss-120b and qwen/qwen3.6-27b); logic runs on Mistral's mistral-large-latest. NVIDIA NIM was supposed to be the third provider family, for a cleaner split, but its free tier called back in 51 to 180 seconds, sometimes worse, the kind of lag you feel immediately staring at a spinner mid-demo. I swapped it for a second Groq model. Trading a neater design for something that actually answers is a call you only make once you're running the thing for real, not sketching the diagram.",
            "Disagreement detection turned out to be the harder design problem. Critics don't quote the same span of text word for word, so plain string matching between what one critic flagged and another validated would miss real overlaps. I fuzzy-matched quotes with difflib's SequenceMatcher, treating anything above a 0.35 similarity ratio, or an outright substring match, as the same span. Four separate kinds of disagreement sit on top of that, not one bucket: issue_presence (one critic calls it a problem, another validated the same text as fine), severity_gap (both flag it, but rate the severity more than two points apart), unique_finding (one critic catches something nobody else mentions), score_gap (the overall scores split hard with no specific span behind it). Collapsing those into a single generic \"disagreement\" would erase exactly the distinction that makes the output useful. One critic catching something alone is a different signal than two critics rating the same thing differently.",
            "LangGraph does the actual orchestration: parse the input, fan out to the three critics, fan back in, detect disagreements, then route. A clean sweep, every critic scoring it well with nothing to argue about, skips the adjudicator and short-circuits straight to a verdict, no reason to burn an extra LLM call reconciling critics who already agree. If every critic fails, the graph says so instead of pretending it evaluated anything. If some fail but not all, the survivors' verdict still ships, with a note that it's missing a dimension. None of that was safe to assume. Each path needed its own test forcing that exact state.",
            "The first real run just hung. Every time, on Windows, no traceback pointing anywhere useful. Turns out constructing an OpenAI-compatible client isn't cheap object setup, it lazily builds an SSL context that touches the OS certificate store, and LangGraph's parallel dispatch was calling that constructor from three threads at once on the very first request. Three threads fighting over the same OS resource is exactly the kind of thing a single-threaded test will never surface. The fix lives in providers.py: a lock and a cache, so only the first caller for a given provider builds the client and everyone else reuses it. Concurrent requests against an already-built client were never the issue, only the building of it.",
            "I didn't want \"works with API keys loaded\" to count as done, either. Every provider path has a deterministic offline mock behind it, so the full pipeline, dispatch through storage through the API through the Streamlit UI, runs end to end for free. That wasn't a demo convenience added later; it's what let me build and test the LangGraph routing before spending a single real request on it. Four fixed test cases anchor the suite: a factually wrong answer for the accuracy critic to catch, a logically fallacious one for the logic critic, one that answers half the question for completeness alone to flag, and one clean response that should short-circuit straight through. Whether all four take the right path, not just produce a plausible-looking verdict, is what the pytest suite checks.",
          ],
        },
        {
          body: [
            "What's running now is MIT-licensed, Dockerized, tested against real Groq and Mistral calls rather than only the mock path. Three critics reading the same output land in different places often enough that the Analytics tab tracking which one disagrees most, and which one gets overruled most, is tracking something real.",
            "Same lesson as EvalGate, from the other side this time: a model's confidence isn't evidence it's right, and one model's opinion of another model's output isn't either. What counts is whether an independent second read, one that can't inherit the first one's blind spot, agrees or doesn't. Getting three of them to actually disagree with each other on purpose turned out to be the entire project.",
          ],
        },
      ],
      de: [
        {
          heading: 'Die eigenen Hausaufgaben benoten',
          body: [
            'Ein Modell zu bitten, die eigene Antwort zu prüfen, heißt, es zu bitten, einen Fehler zu finden, den es gerade für richtig hält. Dasselbe Problem wie beim Korrekturlesen der eigenen E-Mail: Der Tippfehler, der jedem anderen sofort auffallen würde, rutscht bei einem selbst einfach durch, weil man dem Satz, den man geschrieben hat, schon vertraut.',
            'Auf eine Version davon bin ich beim Bau von EvalGate gestoßen, wo ein LLM-as-Judge-Schritt nur so gut ist wie die blinden Flecken des Richters selbst, und ein einzelner Richter hat genau einen Satz davon. Diesmal wollte ich wissen, ob Uneinigkeit selbst das nützliche Signal sein kann, nicht Übereinstimmung. Nicht ein Modell, das eine Ausgabe prüft. Drei, so gebaut, dass sie keinen blinden Fleck teilen können, und gezwungen, sich zu einigen.',
          ],
        },
        {
          heading: 'Sie wirklich uneinig werden lassen',
          body: [
            'Der Plan: drei Kritiker parallel auf jede Ausgabe ansetzen, jeden auf genau eine Sache beschränkt (Genauigkeit, Logik, Vollständigkeit), jeden auf einem wirklich anderen Modell, damit sich kein gemeinsamer Fehlermodus als Konsens verkleiden kann. Wo sie sich uneinig sind, liest ein Adjudicator die tatsächliche Meinungsverschiedenheit und entscheidet, statt drei Werte zu einer Zahl zu mitteln, die für sich allein nichts bedeutet. Drei Kritiker, die insgeheim dieselben Schwächen teilen, weil sie alle Varianten derselben Modellfamilie sind, würden nur eine Übereinstimmung erzeugen, die wie Sicherheit aussieht und eigentlich korrelierte Blindheit ist.',
            'Anbietervielfalt war keine Dekoration, sie war der ganze Punkt. Genauigkeit und Vollständigkeit laufen über zwei verschiedene Groq-Modelle (openai/gpt-oss-120b und qwen/qwen3.6-27b), Logik über Mistrals mistral-large-latest. NVIDIA NIM sollte die dritte Anbieterfamilie sein, für eine sauberere Aufteilung, aber die kostenlose Stufe antwortete nach 51 bis 180 Sekunden, manchmal schlimmer, eine Verzögerung, die man mitten in einer Demo sofort spürt. Ich habe sie gegen ein zweites Groq-Modell getauscht. Ein saubereres Design gegen etwas einzutauschen, das tatsächlich antwortet, ist genau die Entscheidung, die man erst trifft, wenn man das System wirklich laufen lässt, nicht beim Skizzieren des Diagramms.',
            'Die Erkennung von Meinungsverschiedenheiten war das schwierigere Problem. Kritiker zitieren dieselbe Textstelle nicht wortgleich, also hätte simpler String-Abgleich zwischen dem, was ein Kritiker markiert und ein anderer bestätigt hat, echte Überschneidungen übersehen. Ich habe Zitate mit difflibs SequenceMatcher fuzzy abgeglichen, alles über einer Ähnlichkeit von 0,35 oder einer direkten Teilstring-Übereinstimmung als dieselbe Stelle behandelt. Vier verschiedene Arten von Meinungsverschiedenheit liegen darüber, nicht ein Topf: issue_presence (ein Kritiker nennt es ein Problem, ein anderer hat denselben Text als in Ordnung bestätigt), severity_gap (beide markieren es, bewerten den Schweregrad aber um mehr als zwei Punkte anders), unique_finding (ein Kritiker findet etwas, das kein anderer erwähnt), score_gap (die Gesamtwertungen gehen stark auseinander, ohne konkrete Textstelle dahinter). Das alles in ein generisches „Meinungsverschiedenheit" zu werfen, hätte genau die Unterscheidung gelöscht, die die Ausgabe nützlich macht. Ein Kritiker, der allein etwas findet, ist ein anderes Signal als zwei, die dasselbe unterschiedlich bewerten.',
            'LangGraph übernimmt die Orchestrierung: Eingabe parsen, an die drei Kritiker verteilen, zusammenführen, Meinungsverschiedenheiten erkennen, dann weiterleiten. Ein sauberer Durchlauf, bei dem jeder Kritiker gut bewertet und nichts zu streiten gibt, überspringt den Adjudicator und springt direkt zu einem Verdikt; kein Grund, einen zusätzlichen LLM-Aufruf für Kritiker zu verschwenden, die sich schon einig sind. Fallen alle Kritiker aus, sagt der Graph das offen, statt so zu tun, als hätte er etwas bewertet. Fallen einige aus, nicht alle, geht das Verdikt der übrigen trotzdem raus, mit dem Hinweis, dass eine Dimension fehlt. Nichts davon war sicher anzunehmen. Jeder Pfad brauchte einen eigenen Test, der genau diesen Zustand erzwingt.',
            'Der erste echte Lauf ist einfach hängen geblieben. Jedes Mal, unter Windows, ohne einen Traceback, der irgendwohin führte. Es stellte sich heraus, dass die Erstellung eines OpenAI-kompatiblen Clients kein billiges Setup ist, sondern lazy einen SSL-Kontext aufbaut, der den Zertifikatsspeicher des Betriebssystems anfasst, und LangGraphs paralleles Dispatching rief diesen Konstruktor beim ersten Request von drei Threads gleichzeitig auf. Drei Threads, die um dieselbe Betriebssystem-Ressource konkurrieren, ist genau das, was ein Einzel-Thread-Test nie zeigen würde. Der Fix sitzt in providers.py: ein Lock und ein Cache, sodass nur der erste Aufrufer für einen Provider den Client baut und alle anderen ihn mitnutzen. Gleichzeitige Requests gegen einen bereits gebauten Client waren nie das Problem, nur der Bau selbst.',
            'Ich wollte auch nicht gelten lassen, dass „funktioniert mit geladenen API-Keys" als fertig zählt. Hinter jedem Provider-Pfad steht ein deterministischer Offline-Mock, sodass die komplette Pipeline, vom Dispatch über die Speicherung bis zur API und zur Streamlit-UI, end-to-end kostenlos läuft. Das war keine nachträgliche Demo-Bequemlichkeit, sondern das, was mir erlaubt hat, das LangGraph-Routing zu bauen und zu testen, bevor ich einen echten Request dafür ausgegeben habe. Vier feste Testfälle verankern die Suite: eine faktisch falsche Antwort für den Accuracy-Kritiker, eine logisch fehlerhafte für den Logic-Kritiker, eine, die nur die Hälfte der Frage beantwortet, für die nur Completeness zuständig ist, und eine saubere Antwort, die direkt durchspringen soll. Ob alle vier den richtigen Pfad nehmen, nicht nur ein plausibles Verdikt liefern, prüft die pytest-Suite.',
          ],
        },
        {
          body: [
            'Was jetzt läuft, ist MIT-lizenziert, containerisiert, gegen echte Groq- und Mistral-Aufrufe getestet, nicht nur über den Mock-Pfad. Drei Kritiker, die dieselbe Ausgabe lesen, landen oft genug an unterschiedlichen Stellen, dass der Analytics-Tab, der verfolgt, wer am häufigsten widerspricht und wer am häufigsten überstimmt wird, etwas Echtes verfolgt.',
            'Dieselbe Lektion wie bei EvalGate, diesmal von der anderen Seite: Die Sicherheit eines Modells ist kein Beleg, dass es richtig liegt, und das Urteil eines Modells über die Ausgabe eines anderen genauso wenig. Was zählt, ist, ob eine unabhängige zweite Meinung, eine, die den blinden Fleck der ersten nicht erben kann, zustimmt oder nicht. Drei davon dazu zu bringen, sich absichtlich wirklich uneinig zu sein, war am Ende das ganze Projekt.',
          ],
        },
      ],
    },
  },
  {
    slug: 'evalgate-build',
    date: '2026-08-10',
    readTime: { en: '7 min read', de: '7 Min. Lesezeit' },
    tags: ['LLM Evaluation', 'CI/CD', 'Side Project'],
    title: {
      en: 'Treating a Prompt Change Like Any Other Pull Request',
      de: 'Eine Prompt-Änderung wie jeden anderen Pull Request behandeln',
    },
    excerpt: {
      en: 'Why I built a small CI pipeline that tests every prompt change against a golden dataset before it can merge, and what a real pull request against my own repo caught that reading the code never would have.',
      de: 'Warum ich eine kleine CI-Pipeline gebaut habe, die jede Prompt-Änderung vor dem Merge gegen einen Golden-Datensatz testet, und was ein echter Pull Request gegen mein eigenes Repo aufgedeckt hat, was mir beim bloßen Lesen des Codes nie aufgefallen wäre.',
    },
    sections: {
      en: [
        {
          heading: 'The discipline a prompt never gets',
          body: [
            "For a long time my definition of \"the prompt works\" was: I read the output once, it looked fine, I moved on to the next assignment. None of my coursework at HNU ever pushed back on that. Software has an entire discipline built for exactly this problem, version control, regression tests, a CI pipeline that stops a bad change before it reaches anyone, and every LLM project I'd touched, mine included, skipped all of it.",
            "I wanted to find out what it would take to give a prompt the same discipline a function already gets. Not a bigger model. Not a cleverer template. A gate a change has to pass before it's allowed to matter.",
          ],
        },
        {
          heading: 'Picking a boring feature on purpose',
          body: [
            'The target was concrete: a pipeline that triggers on every prompt or model change, runs the feature against cases with known-correct answers, scores it on more than accuracy alone, and blocks the merge if something got worse than the last known-good version. I picked a customer support email classifier for the feature itself, on purpose, unglamorous enough that the harness stayed the actual subject of the project.',
            "A pipeline that only ever runs on my laptop is just a script wearing a costume. So the plan from day one was GitHub Actions, proven against a real pull request, not CI bolted on at the end once everything already worked by hand.",
          ],
        },
        {
          heading: 'Building it, then trying to break it',
          body: [
            "Dataset first, because if that's wrong everything downstream is testing against a lie. Fifty hand-verified support emails, not LLM-generated (an LLM grading an LLM against LLM-written test cases is grading its own homework), built from real ticket metadata off Kaggle and rewritten by hand into cases I'd vouch for individually. A chunk of them are deliberately awkward: emails that switch languages mid-sentence, ones that read as sarcastic, ones where the right category is a judgment call. Easy cases tell you nothing when a prompt changes. Awkward ones do.",
            'Exact category accuracy wasn\'t enough on its own. A prompt change can hold accuracy flat while quietly wrecking the summaries, or tripling the tokens burned per email. So every case gets checked on four things: does the category match, does a larger model rate the summary 3 out of 5 or better, how long did the request take, how many tokens did it cost. Each run gets diffed case by case against whatever the last run recorded, not just compared on the pass rate.',
            'The thresholds took some trial and error. Warn at a 3% drop, fail the build at 8%. But a single-run threshold is blind to the slower failure mode, a prompt eroding by a point every change for ten changes straight, never once tripping 8% on its own. Drift detection runs as its own check for exactly that: a rolling average over the last seven runs, compared against its own best-ever score. "Did this change break something" and "is this quietly rotting over months" are different questions, and folding the second into the first as a lower threshold would have missed it.',
            "GitHub Actions ties two triggers together. A pull request touching /prompts runs the eval, posts a pass or fail comment, fails the check on a critical regression, and writes nothing back to the branch. A merge to main re-runs it, records the result as the new baseline, pings Slack. That second trigger is the one that makes the next PR's diff mean anything; without a baseline that updates on merge, every comparison is against a stale number.",
            "Here's the part I'd tell you about over coffee: I didn't stop once the code looked right on my machine. I opened a real pull request against my own repo to watch the Action run start to finish, and it caught two bugs no amount of reading the source would have. The reports folder only existed on my machine, created once by hand and never tracked by git, so a fresh CI checkout had nowhere to write the HTML report. And an unset GitHub Actions variable evaluates to an empty string rather than a missing one, so my threshold parser tried to turn empty text into a number and crashed before it reached any code I'd actually written to test. Neither bug is exotic. Both live exactly at the seam between \"works on my machine\" and the environment that counts.",
            "Once the harness held up, I pointed it at the classifier for real. First baseline: 84%. The diff pointed straight at why, the account category sat at 43% because it kept overlapping with billing in how the prompt described it. Two targeted fixes later, aimed at that number instead of a guess, it hit 100%. The next change, a tie-break rule for emails raising two issues at once, cost two points on purpose, and the harness correctly left it unflagged since a 2% dip sits under the warning line. One run, and it told a real regression apart from a deliberate tradeoff instead of treating every drop the same.",
          ],
        },
        {
          body: [
            "What exists now is a small, MIT-licensed, Dockerized pipeline with its own CI and a pull request history I can point to: here's the bug it caught, here's the number it moved. For a course assignment that's already more testing than the feature needed. For an internship application, it's closer to the actual point.",
            "What I took from it wasn't really about prompts. I stopped trusting my own read of whether something worked. Both bugs only surfaced because I insisted on watching a real pull request run in a real CI environment instead of assuming clean-looking code meant a working pipeline. That's the habit I want to keep, not just a fact about one project.",
          ],
        },
      ],
      de: [
        {
          heading: 'Die Disziplin, die ein Prompt nie bekommt',
          body: [
            'Lange war meine Definition von „der Prompt funktioniert" simpel: Ich habe den Output einmal gelesen, er sah gut aus, ich bin zur nächsten Abgabe weiter. Keines meiner Projekte im Studium an der HNU hat das je infrage gestellt. Für Software gibt es eine ganze Disziplin genau für dieses Problem, Versionskontrolle, Regressionstests, eine CI-Pipeline, die eine schlechte Änderung stoppt, bevor sie irgendwen erreicht, und jedes LLM-Projekt, das ich angefasst habe, meines eingeschlossen, hat das komplett übersprungen.',
            'Ich wollte herausfinden, was es braucht, damit ein Prompt dieselbe Disziplin bekommt wie eine Funktion. Kein größeres Modell. Kein cleverer formuliertes Template. Ein Tor, durch das eine Änderung muss, bevor sie überhaupt zählt.',
          ],
        },
        {
          heading: 'Absichtlich ein langweiliges Feature wählen',
          body: [
            'Das Ziel war konkret: eine Pipeline, die bei jeder Prompt- oder Modelländerung anspringt, das Feature gegen Fälle mit bekannt richtiger Antwort testet, mehr als nur Genauigkeit bewertet und den Merge blockiert, wenn etwas schlechter wurde als die letzte bekannt gute Version. Als Feature selbst habe ich absichtlich einen Kundensupport-E-Mail-Klassifikator gewählt, unspektakulär genug, dass der Harness das eigentliche Thema der Arbeit blieb.',
            'Eine Pipeline, die nur auf meinem Laptop läuft, ist bloß ein Skript im Kostüm. Der Plan stand von Anfang an: GitHub Actions, bewiesen an einem echten Pull Request, nicht CI erst am Ende dazugeschraubt, wenn schon alles von Hand funktioniert.',
          ],
        },
        {
          heading: 'Es bauen und dann versuchen, es kaputtzukriegen',
          body: [
            'Zuerst der Datensatz, denn wenn der falsch ist, testet alles danach gegen eine Lüge. Fünfzig von Hand verifizierte Support-E-Mails, nicht LLM-generiert (ein LLM, das ein LLM anhand von LLM-geschriebenen Testfällen bewertet, korrigiert im Zweifel seine eigenen Hausaufgaben), aus echten Ticket-Metadaten von Kaggle aufgebaut und von Hand zu Fällen umgeschrieben, für die ich einzeln geradestehen kann. Ein Teil ist bewusst unangenehm: E-Mails, die mitten im Satz die Sprache wechseln, welche, die sarkastisch klingen, welche, bei denen die Kategorie wirklich Ermessenssache ist. Einfache Fälle sagen bei einer Prompt-Änderung nichts aus. Unangenehme schon.',
            'Exakte Kategorietreffer allein reichten nicht. Eine Prompt-Änderung kann die Genauigkeit halten und trotzdem leise die Zusammenfassungen ruinieren oder den Tokenverbrauch pro E-Mail verdreifachen. Also wird jeder Fall auf vier Dinge geprüft: Stimmt die Kategorie, bewertet ein größeres Modell die Zusammenfassung mit mindestens 3 von 5, wie lange hat die Anfrage gedauert, wie viele Tokens hat sie gekostet. Jeder Lauf wird Fall für Fall gegen den letzten aufgezeichneten Lauf verglichen, nicht nur über die Gesamtquote.',
            'Die Schwellenwerte brauchten etwas Ausprobieren. Warnung ab 3 % Rückgang, Build-Abbruch ab 8 %. Aber ein Schwellenwert pro Lauf ist blind für den langsameren Fehlermodus, einen Prompt, der sich über zehn Änderungen hinweg jedes Mal um einen Punkt verschlechtert, ohne je die 8 % zu reißen. Dafür läuft die Drift-Erkennung als eigener Check: ein gleitender Durchschnitt über die letzten sieben Läufe, verglichen mit dem eigenen Bestwert. „Hat diese Änderung etwas kaputtgemacht" und „verrottet das über Monate leise" sind verschiedene Fragen, und die zweite als niedrigere Schwelle an die erste zu hängen, hätte sie übersehen.',
            'GitHub Actions verbindet zwei Trigger. Ein Pull Request, der /prompts anfasst, führt die Auswertung aus, postet einen Pass/Fail-Kommentar, lässt den Check bei kritischer Regression scheitern und schreibt nichts in den Branch zurück. Ein Merge nach main führt es erneut aus, speichert das Ergebnis als neue Baseline, schickt den Slack-Alert. Erst dieser zweite Trigger macht den Diff des nächsten PRs aussagekräftig; ohne eine Baseline, die sich bei jedem Merge aktualisiert, vergleicht jeder Lauf gegen eine veraltete Zahl.',
            'Das ist der Teil, den ich beim Kaffee erzählen würde: Ich habe nicht aufgehört, sobald der Code auf meinem Rechner richtig aussah. Ich habe einen echten Pull Request gegen mein eigenes Repo geöffnet, um die Action einmal komplett laufen zu sehen, und sie hat zwei Bugs gefunden, die mir beim Lesen des Codes nie aufgefallen wären. Der reports-Ordner existierte nur auf meinem Rechner, von Hand angelegt und nie von Git verfolgt, also hatte ein frischer CI-Checkout keinen Ort für den HTML-Report. Und eine nicht gesetzte GitHub-Actions-Variable wird zu einem leeren String statt zu einer fehlenden, also hat mein Schwellenwert-Parser versucht, leeren Text in eine Zahl umzuwandeln, und ist abgestürzt, bevor er bei dem Code ankam, den ich eigentlich testen wollte. Keiner der beiden Bugs ist exotisch. Beide leben genau an der Naht zwischen „funktioniert auf meinem Rechner" und der Umgebung, die zählt.',
            'Sobald der Harness stand, habe ich ihn am Klassifikator ausprobiert. Erste Baseline: 84 %. Der Diff zeigte genau, warum: Die Kategorie account lag bei 43 %, weil sie sich in der Prompt-Formulierung ständig mit billing überschnitt. Zwei gezielte Korrekturen später, die genau auf diese Zahl zielten statt auf eine Vermutung, stand sie bei 100 %. Die nächste Änderung, eine Tie-Break-Regel für E-Mails mit zwei gleichzeitigen Anliegen, hat absichtlich zwei Punkte gekostet, und der Harness hat es zu Recht nicht als Regression markiert, weil 2 % unter der Warnschwelle liegen. Ein Lauf, und er konnte eine echte Regression von einem bewussten Trade-off unterscheiden, statt jeden Rückgang gleich zu behandeln.',
          ],
        },
        {
          body: [
            'Was jetzt existiert, ist eine kleine, MIT-lizenzierte, containerisierte Pipeline mit eigener CI und einer Pull-Request-Historie, auf die ich zeigen kann: Hier ist der Bug, hier ist die Zahl, die er bewegt hat. Für eine Studienarbeit wäre das schon mehr Testabdeckung, als das Feature gebraucht hätte. Für eine Praktikumsbewerbung kommt es näher an den eigentlichen Punkt.',
            'Was ich mitgenommen habe, hatte kaum mit Prompts zu tun. Ich habe aufgehört, meinem eigenen Eindruck zu vertrauen, ob etwas funktioniert. Beide Bugs sind nur aufgetaucht, weil ich darauf bestanden habe, einen echten Pull Request in einer echten CI-Umgebung laufen zu sehen, statt sauber aussehenden Code für eine funktionierende Pipeline zu halten. Diese Gewohnheit will ich behalten, nicht nur als Fakt über ein Projekt.',
          ],
        },
      ],
    },
  },
  {
    slug: 'llm-cost-autopilot-build',
    date: '2026-07-28',
    readTime: { en: '6 min read', de: '6 Min. Lesezeit' },
    tags: ['AI Engineering', 'Cost Optimization', 'Side Project'],
    title: {
      en: 'Cutting LLM Costs by Doing Less, Not More',
      de: 'LLM-Kosten senken, indem man weniger tut, nicht mehr',
    },
    excerpt: {
      en: "Why I built a routing layer that scores every request's complexity, sends it to the cheapest model that can handle it, and checks its own decisions in the background.",
      de: 'Warum ich eine Routing-Schicht gebaut habe, die jede Anfrage nach Komplexität bewertet, sie an das günstigste passende Modell schickt, und ihre eigenen Entscheidungen im Hintergrund überprüft.',
    },
    sections: {
      en: [
        {
          body: [
            "Every request I sent through an early prototype went to GPT-4o. A one-line extraction. A two-sentence summary. A hard multi-step reasoning task. Same model every time, because picking one model and pointing everything at it is the path of least resistance. It's also the expensive one. I've watched teams, mine included, in earlier versions of this exact project, casually overspend 2 to 20x on requests that never needed that much horsepower.",
            "So I asked a plain question: if something looked at what a prompt was asking for before deciding where to send it, how much of that spend just disappears, with nobody noticing a drop in quality?",
          ],
        },
        {
          heading: 'A router that has to earn the name',
          body: [
            "The goal, once I sat down to build it: a routing layer sitting in front of any LLM call, scoring how complex the request is, and sending it to the cheapest model that can handle it, without quietly degrading the answer. \"Trust me, it works\" doesn't cut it for something making cost decisions on every call, so it also had to catch its own mistakes and improve over time, not just route once and hope.",
          ],
        },
        {
          heading: "The boring part, and the part I'm proud of",
          body: [
            'I started with the unglamorous half: a scikit-learn classifier that scores incoming prompts into three complexity tiers using lightweight text features. Nothing clever, just enough signal to tell "extract this date" apart from "walk me through this multi-step proof." It hits 86% accuracy on held-out data. Good enough to route with. Not good enough to trust blindly.',
            "Which is where the async verifier comes in, running quietly in the background after every response. It re-runs the same prompt through a stronger reference model, compares the two answers, and escalates the moment they diverge too much instead of letting a bad answer slide through unnoticed. Those escalations don't die in a log file, either. They feed back into the training set for the next classifier retrain, so the routing judgment is supposed to sharpen the longer the system runs, instead of freezing at whatever it learned on day one.",
            "Routing changes shouldn't need a redeploy every time I second-guess a threshold, so the tier-to-model mapping lives in a config file the API can hot-reload. And because I wanted to watch the thing work rather than trust numbers buried in a log, there's a live Streamlit dashboard on top of the FastAPI backend showing real spend against baseline, routing distribution, and escalation rate.",
            "Tier 1 and Tier 2 run on real, free inference through Groq. Real responses, real near-zero cost and latency, nothing mocked. Tier 3 still routes to a mocked GPT-4o, since there's no free tier for frontier models, but every provider adapter falls back cleanly to a mock, so I could build and validate the whole system before spending a cent.",
          ],
        },
        {
          body: [
            "What came out of it is a working, containerized, CI-covered system rather than a notebook demo: a FastAPI service with a live dashboard, a classifier honest about its own limits, and a verification loop built to catch its own mistakes instead of assuming it's right. The core claim, that most requests don't need the most expensive model, holds up under that setup: route with a little judgment instead of defaulting to \"send everything to the biggest model,\" and that's where most of the 2 to 20x savings in this space comes from.",
            "The lesson that stuck with me wasn't about routing specifically. The expensive mistake in most systems isn't picking the wrong model. It's never checking whether the model you picked was necessary at all.",
          ],
        },
      ],
      de: [
        {
          body: [
            'Jede Anfrage in einem frühen Prototyp ging an GPT-4o. Eine einzeilige Extraktion. Eine Zwei-Satz-Zusammenfassung. Eine harte, mehrstufige Reasoning-Aufgabe. Immer dasselbe Modell, weil man eines auswählt und einfach alles dorthin schickt, das ist der Weg des geringsten Widerstands. Er ist auch der teure. Ich habe gesehen, wie Teams, meine eigenen früheren Versionen dieses Projekts eingeschlossen, locker das 2- bis 20-Fache für Anfragen ausgeben, die diese Leistung nie gebraucht hätten.',
            'Also habe ich mir eine einfache Frage gestellt: Wenn etwas sich ansieht, was ein Prompt verlangt, bevor es entscheidet, wohin er geht, wie viel von diesen Kosten verschwindet einfach, ohne dass jemand einen Qualitätsverlust merkt?',
          ],
        },
        {
          heading: 'Ein Router, der sich den Namen verdienen muss',
          body: [
            'Das Ziel, sobald ich mich hingesetzt habe, um es zu bauen: eine Routing-Schicht vor jedem LLM-Aufruf, die die Komplexität der Anfrage bewertet und sie an das günstigste Modell schickt, das sie tatsächlich bewältigen kann, ohne die Antwort still zu verschlechtern. „Vertrau mir, es funktioniert" reicht nicht für etwas, das bei jedem einzelnen Aufruf Kostenentscheidungen trifft, also musste es auch eigene Fehler erkennen und sich mit der Zeit verbessern, nicht nur einmal routen und hoffen.',
          ],
        },
        {
          heading: 'Der langweilige Teil, und der Teil, auf den ich stolz bin',
          body: [
            'Angefangen habe ich mit der unspektakulären Hälfte: einem Scikit-learn-Klassifikator, der eingehende Prompts anhand leichtgewichtiger Textmerkmale in drei Komplexitätsstufen einteilt. Nichts Ausgefallenes, nur genug Signal, um „extrahiere dieses Datum" von „führe mich durch diesen mehrstufigen Beweis" zu unterscheiden. Er erreicht 86 % Genauigkeit auf Testdaten. Gut genug zum Routen. Nicht gut genug, um ihm blind zu vertrauen.',
            'Und hier kommt der asynchrone Verifier ins Spiel, der still im Hintergrund läuft, nachdem jede Antwort raus ist. Er führt denselben Prompt erneut über ein stärkeres Referenzmodell aus, vergleicht beide Antworten und eskaliert, sobald sie zu stark auseinanderlaufen, statt eine schlechte Antwort unbemerkt durchzulassen. Diese Eskalationen verschwinden auch nicht in einer Log-Datei, sondern fließen direkt zurück ins Trainingsset für das nächste Nachtraining, sodass das Routing-Urteil mit der Laufzeit schärfer werden soll, statt auf dem Stand des ersten Tages einzufrieren.',
            'Routing-Änderungen sollten kein Redeploy brauchen, nur weil ich einen Schwellenwert noch mal überdenke, also liegt die Zuordnung von Stufe zu Modell in einer Konfigurationsdatei, die die API live nachladen kann. Und weil ich dem System beim Arbeiten zusehen wollte, statt Zahlen in einem Log zu vertrauen, gibt es ein Live-Streamlit-Dashboard über dem FastAPI-Backend, das echte Kosten gegen die Baseline, die Routing-Verteilung und die Eskalationsrate zeigt.',
            'Stufe 1 und Stufe 2 laufen über echte, kostenlose Inferenz via Groq. Echte Antworten, echte, nahezu kostenlose Latenz, nichts simuliert. Stufe 3 geht weiterhin simuliert an GPT-4o, da es für Frontier-Modelle keine kostenlose Stufe gibt, aber jeder Provider-Adapter fällt sauber auf einen Mock zurück, sodass ich das gesamte System bauen und validieren konnte, bevor ich auch nur einen Cent ausgegeben habe.',
          ],
        },
        {
          body: [
            'Am Ende stand ein funktionierendes, containerisiertes, mit CI abgesichertes System statt einer Notebook-Demo: ein FastAPI-Service mit Live-Dashboard, ein Klassifikator, der ehrlich mit seinen Grenzen umgeht, und eine Verifikationsschleife, die eigene Fehler erkennen soll, statt einfach von sich auszugehen. Die Kernaussage, dass die meisten Anfragen nicht das teuerste Modell brauchen, hält stand: mit etwas Urteilsvermögen routen statt „schick einfach alles ans größte Modell", genau daher kommt der Großteil der 2- bis 20-fachen Ersparnis in diesem Bereich.',
            'Die Lektion, die hängen geblieben ist, hatte weniger mit Routing im Speziellen zu tun. Der teuerste Fehler in den meisten Systemen ist nicht die Wahl des falschen Modells. Es ist, nie zu prüfen, ob das gewählte Modell überhaupt nötig war.',
          ],
        },
      ],
    },
  },
];
