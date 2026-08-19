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
          label: 'Situation',
          heading: "Every review that shares the reviewer's blind spots",
          body: [
            "A model checking its own output has the same problem a person does proofreading their own writing: the mistakes that would jump out to someone else are exactly the ones you're least likely to catch, because you already believe the sentence you wrote. Ask an LLM to grade the answer it just gave, and you're asking it to notice a blind spot it's currently standing inside of.",
            "I'd run into this from the other side while building EvalGate: an LLM-as-judge step is only as good as the judge's own limits, and a single judge has exactly one set of limits. What I wanted to know this time was whether disagreement itself, not agreement, could be made into the actual signal. Not one model checking an output. Several, deliberately unable to share a blind spot, forced to reconcile.",
          ],
        },
        {
          label: 'Task',
          heading: 'Three critics, one adjudicator, no averaging',
          body: [
            "The target: take any LLM output and put three critic agents on it in parallel, each scoped to one dimension only (accuracy, logic, completeness), each routed through a genuinely different model so a shared failure mode couldn't sneak in disguised as agreement. Where they disagreed, an adjudicator would have to read the actual disagreement and decide, not just average three scores into one number that means nothing on its own.",
            'The failure mode I wanted to avoid: three critics that all secretly share the same weaknesses because they\'re all variations of one model family, producing a consensus that looks like confidence and is actually just correlated blindness.',
          ],
        },
        {
          label: 'Action',
          heading: 'Building the critics, then watching them actually disagree',
          body: [
            "Provider diversity wasn't a nice-to-have, it was the entire point: accuracy and completeness route through two different Groq models (openai/gpt-oss-120b and qwen/qwen3.6-27b), logic routes through Mistral's mistral-large-latest. NVIDIA NIM was the original plan for a genuine third provider family, which would have made for a cleaner three-way split. Its free tier turned out to be too unreliable to build around: calls regularly took 51 to 180 seconds, sometimes longer, a difference you feel immediately the first time you're staring at a spinner mid-demo. I swapped it for a second Groq model instead. Trading a tidier design for something that actually responds is the kind of call that only shows up once you're running the thing for real, not reading the architecture diagram.",
            "The harder design problem was disagreement detection itself. Critics don't quote the same span of text identically, so naive string matching between what one critic flagged and what another validated would miss real overlaps. I ended up fuzzy-matching quotes with difflib's SequenceMatcher, treating anything above a 0.35 similarity ratio (or an outright substring match) as the same underlying span. On top of that sit four distinct kinds of disagreement, not just one: issue_presence, when one critic calls something a problem and another explicitly validated overlapping text as correct; severity_gap, when two critics flag the same span but rate its severity more than two points apart; unique_finding, when a critic catches something no one else even mentions; and score_gap, when overall scores diverge sharply with no specific span behind it at all. Collapsing these into one generic \"disagreement\" bucket would have thrown away exactly the distinction that makes the output useful: a critic catching something alone is a different kind of signal than two critics rating the same problem differently.",
            "LangGraph handles the actual orchestration: parse the input, fan out to all three critics in parallel, fan back in, run disagreement detection, then route conditionally. A clean sweep, every critic scoring the output well with nothing flagged and nothing to disagree about, skips the adjudicator entirely and short-circuits straight to a verdict; there's no reason to spend an extra LLM call reconciling critics that already agree. If every critic fails outright, the graph returns a verdict that says so instead of pretending it evaluated anything. And if some critics fail but not all, the surviving critics' verdict still goes out, just with an explicit note that it's missing a dimension and its confidence should be read accordingly. None of those paths were things I could just assume worked; each needed its own test forcing that exact state.",
            "The bug I'm most glad I hit: the very first live run deadlocked on Windows, every time, with no traceback pointing anywhere useful. It turned out constructing an OpenAI-compatible client isn't just cheap object setup, it lazily builds an SSL context that touches the OS certificate store, and LangGraph's parallel critic dispatch was calling that constructor from three threads at once on the very first request. Three threads racing to touch the same OS resource simultaneously is exactly the kind of thing that only shows up under real concurrency, never in a single-threaded test. The fix was a lock and a cache in providers.py: only the first caller for a given provider actually builds the client, everyone else just reuses it, and actual concurrent requests against an already-built client were never the problem.",
            "I also refused to let \"works when I have API keys loaded\" count as done. Every provider path has a deterministic offline mock standing behind it, so the entire pipeline, dispatch through storage through the API through the Streamlit UI, runs end to end with zero cost and zero network calls. That mode wasn't a demo convenience bolted on afterward; it's what let me build and test the LangGraph routing logic itself before I'd spent a single real request on it. Four canonical test cases anchor the suite: a factually wrong answer the accuracy critic should catch, a logically fallacious one the logic critic should catch, one that answers half the question and only the completeness critic should flag, and one genuinely clean response that should short-circuit straight through. Getting all four to route down the correct path, not just produce a plausible-looking verdict, is what the pytest suite actually checks.",
          ],
        },
        {
          label: 'Result',
          heading: 'What holds up when the models are real',
          body: [
            "What exists now is an MIT-licensed, Dockerized system I've run against real Groq and Mistral calls, not just the mock path: three critics that read the same output and actually land in different places often enough that the Analytics tab tracking which critic disagrees most, and which one gets overruled most, is tracking something real instead of noise.",
            "The broader thing I keep relearning, this time from the other direction of the EvalGate project: a single model's confidence isn't evidence of correctness, and neither is a single model's judgment of someone else's output. What's evidence is whether an independent second opinion, built so it genuinely can't inherit the first one's blind spot, agrees or doesn't. Getting three of those to actually disagree with each other, deliberately, on purpose, turned out to be the whole project.",
          ],
        },
      ],
      de: [
        {
          label: 'Situation',
          heading: 'Jede Prüfung, die die blinden Flecken der prüfenden Instanz teilt',
          body: [
            'Ein Modell, das die eigene Ausgabe überprüft, hat dasselbe Problem wie jemand, der den eigenen Text Korrektur liest: Die Fehler, die einer anderen Person sofort auffallen würden, sind genau die, die man selbst am wenigsten bemerkt, weil man den Satz, den man geschrieben hat, bereits für richtig hält. Ein LLM zu bitten, die eigene, gerade gegebene Antwort zu bewerten, heißt, es zu bitten, einen blinden Fleck zu erkennen, in dem es selbst gerade steht.',
            'Auf dieses Problem bin ich schon von der anderen Seite gestoßen, beim Bau von EvalGate: Ein LLM-as-Judge-Schritt ist nur so gut wie die eigenen Grenzen des Richters, und ein einzelner Richter hat genau einen Satz Grenzen. Diesmal wollte ich wissen, ob sich Uneinigkeit selbst, nicht Übereinstimmung, zum eigentlichen Signal machen lässt. Nicht ein Modell, das eine Ausgabe prüft. Mehrere, die absichtlich keinen gemeinsamen blinden Fleck teilen können und gezwungen sind, sich zu einigen.',
          ],
        },
        {
          label: 'Task',
          heading: 'Drei Kritiker, ein Adjudicator, kein Mitteln',
          body: [
            'Das Ziel: eine beliebige LLM-Ausgabe nehmen und drei Kritiker-Agenten parallel darauf ansetzen, jeden auf genau eine Dimension beschränkt (Genauigkeit, Logik, Vollständigkeit), jeden über ein wirklich anderes Modell angebunden, damit sich kein gemeinsamer Fehlermodus als Übereinstimmung tarnen kann. Wo sie sich uneinig sind, sollte ein Adjudicator die tatsächliche Meinungsverschiedenheit lesen und entscheiden, statt einfach drei Werte zu einer Zahl zu mitteln, die für sich genommen nichts bedeutet.',
            'Der Fehlermodus, den ich vermeiden wollte: drei Kritiker, die insgeheim dieselben Schwächen teilen, weil sie alle Varianten derselben Modellfamilie sind, und die einen Konsens erzeugen, der wie Sicherheit aussieht, aber eigentlich nur korrelierte Blindheit ist.',
          ],
        },
        {
          label: 'Action',
          heading: 'Die Kritiker bauen und dann zusehen, wie sie sich wirklich uneinig sind',
          body: [
            'Anbietervielfalt war kein nettes Extra, sie war der ganze Punkt: Genauigkeit und Vollständigkeit laufen über zwei verschiedene Groq-Modelle (openai/gpt-oss-120b und qwen/qwen3.6-27b), Logik über Mistrals mistral-large-latest. NVIDIA NIM war ursprünglich für eine echte dritte Anbieterfamilie vorgesehen, was eine sauberere Dreiteilung ergeben hätte. Die kostenlose Stufe erwies sich als zu unzuverlässig, um darauf zu bauen: Aufrufe brauchten regelmäßig 51 bis 180 Sekunden, manchmal länger, ein Unterschied, den man sofort spürt, sobald man mitten in einer Demo auf einen Spinner starrt. Ich habe es gegen ein zweites Groq-Modell getauscht. Das sauberere Design gegen etwas einzutauschen, das tatsächlich antwortet, ist genau die Art von Entscheidung, die erst auffällt, wenn man das System wirklich laufen lässt, statt nur das Architekturdiagramm zu lesen.',
            'Das schwierigere Design-Problem war die Erkennung von Meinungsverschiedenheiten selbst. Kritiker zitieren dieselbe Textstelle nicht identisch, also hätte naiver String-Abgleich zwischen dem, was ein Kritiker markiert und ein anderer bestätigt hat, echte Überschneidungen übersehen. Ich habe Zitate am Ende mit difflibs SequenceMatcher fuzzy abgeglichen und alles über einer Ähnlichkeit von 0,35 (oder einer direkten Teilstring-Übereinstimmung) als dieselbe zugrunde liegende Textstelle behandelt. Darüber liegen vier unterschiedliche Arten von Meinungsverschiedenheit, nicht nur eine: issue_presence, wenn ein Kritiker etwas als Problem bezeichnet und ein anderer überlappenden Text ausdrücklich als korrekt bestätigt hat; severity_gap, wenn zwei Kritiker dieselbe Textstelle markieren, ihre Schweregrade sich aber um mehr als zwei Punkte unterscheiden; unique_finding, wenn ein Kritiker etwas findet, das kein anderer auch nur erwähnt; und score_gap, wenn die Gesamtwertungen stark auseinandergehen, ganz ohne konkrete Textstelle dahinter. Das alles in einen einzigen, generischen „Meinungsverschiedenheit"-Topf zu werfen, hätte genau die Unterscheidung weggeworfen, die die Ausgabe nützlich macht: Ein Kritiker, der allein etwas findet, ist ein anderes Signal als zwei Kritiker, die dasselbe Problem unterschiedlich bewerten.',
            'LangGraph übernimmt die eigentliche Orchestrierung: Eingabe parsen, parallel an alle drei Kritiker verteilen, wieder zusammenführen, Meinungsverschiedenheiten erkennen, dann bedingt weiterleiten. Ein sauberer Durchlauf, bei dem jeder Kritiker die Ausgabe gut bewertet, nichts markiert und nichts zum Uneinigsein da ist, überspringt den Adjudicator komplett und springt direkt zu einem Verdikt; es gibt keinen Grund, einen zusätzlichen LLM-Aufruf für Kritiker zu verschwenden, die sich ohnehin schon einig sind. Fallen alle Kritiker komplett aus, gibt der Graph ein Verdikt zurück, das das offen sagt, statt so zu tun, als hätte er irgendetwas bewertet. Und fallen einige, aber nicht alle Kritiker aus, geht das Verdikt der verbliebenen trotzdem raus, nur mit einem expliziten Hinweis, dass eine Dimension fehlt und die Konfidenz entsprechend gelesen werden sollte. Keiner dieser Pfade war etwas, das ich einfach als funktionierend voraussetzen konnte; jeder brauchte einen eigenen Test, der genau diesen Zustand erzwingt.',
            'Der Bug, über den ich am meisten froh bin, ihn getroffen zu haben: Der allererste Live-Lauf blockierte unter Windows, jedes Mal, ohne einen Traceback, der irgendwohin führte. Es stellte sich heraus, dass die Erstellung eines OpenAI-kompatiblen Clients kein billiges Objekt-Setup ist, sondern lazy einen SSL-Kontext aufbaut, der auf den Zertifikatsspeicher des Betriebssystems zugreift, und LangGraphs paralleles Kritiker-Dispatching rief diesen Konstruktor beim allerersten Request von drei Threads gleichzeitig auf. Drei Threads, die gleichzeitig um dieselbe Betriebssystem-Ressource wettlaufen, ist genau die Art von Problem, die nur unter echter Nebenläufigkeit auftaucht, nie in einem Einzel-Thread-Test. Der Fix war ein Lock und ein Cache in providers.py: Nur der erste Aufrufer für einen bestimmten Provider baut den Client tatsächlich, alle anderen nutzen ihn einfach mit, und echte gleichzeitige Requests gegen einen bereits gebauten Client waren nie das Problem.',
            'Ich wollte außerdem nicht gelten lassen, dass „funktioniert, wenn ich API-Keys geladen habe" als fertig zählt. Hinter jedem Provider-Pfad steht ein deterministischer Offline-Mock, sodass die gesamte Pipeline, vom Dispatch über die Speicherung bis zur API und zur Streamlit-UI, end-to-end ohne Kosten und ohne einen einzigen Netzwerkaufruf läuft. Dieser Modus war keine nachträglich angeflanschte Demo-Bequemlichkeit, er hat mir erst ermöglicht, die LangGraph-Routing-Logik selbst zu bauen und zu testen, bevor ich auch nur einen echten Request dafür ausgegeben hatte. Vier feste Testfälle verankern die Suite: eine faktisch falsche Antwort, die der Accuracy-Kritiker fangen soll, eine logisch fehlerhafte, die der Logic-Kritiker fangen soll, eine, die nur die Hälfte der Frage beantwortet und die nur der Completeness-Kritiker markieren soll, und eine wirklich saubere Antwort, die direkt durchspringen soll. Ob alle vier tatsächlich den richtigen Pfad nehmen, nicht nur ein plausibel aussehendes Verdikt liefern, ist das, was die pytest-Suite wirklich prüft.',
          ],
        },
        {
          label: 'Result',
          heading: 'Was hält, wenn die Modelle echt sind',
          body: [
            'Was jetzt existiert, ist ein MIT-lizenziertes, containerisiertes System, das ich gegen echte Groq- und Mistral-Aufrufe laufen lassen habe, nicht nur über den Mock-Pfad: drei Kritiker, die dieselbe Ausgabe lesen und oft genug tatsächlich zu unterschiedlichen Einschätzungen kommen, dass der Analytics-Tab, der verfolgt, welcher Kritiker am häufigsten widerspricht und welcher am häufigsten überstimmt wird, etwas Echtes verfolgt und kein Rauschen.',
            'Die größere Erkenntnis, die ich diesmal aus der anderen Richtung als beim EvalGate-Projekt neu gelernt habe: Die Sicherheit eines einzelnen Modells ist kein Beleg für Richtigkeit, und das Urteil eines einzelnen Modells über die Ausgabe eines anderen ebenso wenig. Beleg ist, ob eine unabhängige zweite Meinung, so gebaut, dass sie den blinden Fleck der ersten wirklich nicht erben kann, zustimmt oder nicht. Drei davon dazu zu bringen, sich absichtlich, wirklich uneinig zu sein, war am Ende das ganze Projekt.',
          ],
        },
      ],
    },
  },
  {
    slug: 'evalgate-build',
    date: '2026-08-19',
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
          label: 'Situation',
          heading: 'What does "it works" mean two prompt edits later?',
          body: [
            "That's the question none of my AI coursework at HNU ever made me answer. Get the output looking right in a notebook, screenshot it for the slide deck, move on to the next assignment. Software has an entire discipline built around exactly that question: version control, regression tests, a CI pipeline that stops a bad change before it reaches anyone. Every LLM project I'd touched, including my own, skipped all of it. A prompt gets read over once, looks fine, ships.",
            "I wanted to know what it would take to give a prompt the same discipline a function already gets. Not a bigger model. Not a cleverer prompt template. A gate that a change has to pass before it's allowed to matter.",
          ],
        },
        {
          label: 'Task',
          heading: 'A CI pipeline where the thing under test is a prompt',
          body: [
            'The target was specific: a pipeline that triggers whenever a prompt or model changes, runs the feature against a set of cases with known-correct answers, scores it on more than one dimension, and blocks the merge if something got worse than the last known-good version. I picked something deliberately unglamorous for the feature itself, a customer support email classifier, so the harness around it stayed the real subject of the project, not the classifier.',
            'A pipeline I only ever ran on my own laptop would just be a script with extra steps. The plan from the start was to wire it into GitHub Actions and prove it on a real pull request, not bolt CI on at the end once everything already worked by hand.',
          ],
        },
        {
          label: 'Action',
          heading: 'Building the harness, then trying to break it',
          body: [
            "I started with the dataset, since if that's wrong, everything downstream is testing against a lie. Fifty hand-verified support emails, not LLM-generated ones (an LLM grading an LLM against LLM-written test cases is grading its own homework), built from real ticket metadata off Kaggle and rewritten by hand into cases I could vouch for individually. A chunk of them are deliberately awkward: emails that switch languages mid-sentence, ones that read as sarcastic, ones where the right category is genuinely a judgment call. The easy cases don't tell you anything when a prompt changes. The awkward ones do.",
            "Scoring couldn't stop at exact category accuracy. A prompt change can hold accuracy flat while quietly making the summaries worse, or tripling the tokens it burns per email. So every case gets checked on four things: does the category match, does a second, larger model rate the generated summary at 3 out of 5 or better, how long the request took, and how many tokens it cost. Each run gets diffed case by case against whatever the previous run recorded, not just compared on the aggregate pass rate.",
            'Getting the thresholds right took some trial and error: warn at a 3% drop, fail the build at 8%. But a single-run threshold is blind to a slower failure mode, a prompt that erodes by a point every change for ten changes straight, where nothing ever trips 8% on its own. Drift detection runs as its own separate check for exactly that: a rolling average over the last seven runs, compared against its own best-ever score. "Did this change break something" and "is this quietly getting worse over months" are two different questions, and bolting the second onto the first as a lower threshold would have missed it.',
            "GitHub Actions ties the two triggers together. A pull request touching /prompts runs the eval and posts the pass or fail summary as a comment, failing the check on a critical regression, without writing anything back to the branch. A merge to main re-runs it, records the result as the new baseline, and pings Slack. That second trigger is what makes the next PR's diff mean anything. Without a baseline that updates on merge, every future comparison is against a stale number.",
            "The part I'm most glad I did: I didn't stop once the code looked right locally. I opened a real pull request against my own repo to watch the Action run end to end, and it caught two bugs no amount of reading the source would have. The reports folder only existed on my machine, created once by hand and never tracked by git, so a fresh CI checkout had nowhere to write the HTML report. And an unset GitHub Actions variable evaluates to an empty string, not a missing one, so my threshold parser tried to convert an empty string into a number and crashed before it reached any of the code I'd written to test. Neither bug is exotic. Both only exist at the boundary between \"works on my machine\" and the environment that actually matters.",
            "Once the harness itself held up, I ran it against the classifier for real. The first baseline scored 84%, and the diff pointed straight at why: the account category sat at 43% because it kept overlapping with billing in how the prompt described it. Two targeted fixes later, aimed at that specific number instead of a guess, it hit 100%. The next change, a tie-break rule for emails raising two issues at once, cost two points on purpose, and the harness correctly left it unflagged, since a 2% dip sits under the 3% warning line. That's the whole point in one run: the harness told a real regression apart from a deliberate tradeoff, instead of treating every drop the same.",
          ],
        },
        {
          label: 'Result',
          heading: 'A repo I can point to, not a screenshot',
          body: [
            "What exists now is a small, MIT-licensed, Dockerized pipeline with its own CI and a pull request history I can point to: here's the bug it caught, here's the number it moved. For a course assignment, that would already be more testing than the feature strictly needed. For an internship application, it's closer to the actual point.",
            "The bigger thing I took from this wasn't about prompts specifically. It's that I stopped trusting my own read of whether something worked. Both real bugs only turned up because I insisted on watching an actual pull request run in a real CI environment instead of assuming clean-looking code meant a working pipeline. That's the habit I want to keep past this one project, not just a fact about it.",
          ],
        },
      ],
      de: [
        {
          label: 'Situation',
          heading: 'Was heißt „es funktioniert“ noch zwei Prompt-Änderungen später?',
          body: [
            'Genau diese Frage hat mich in keinem meiner KI-Projekte im Studium an der HNU je jemand beantworten lassen. Output im Notebook zurechtbiegen, für die Folie einen Screenshot machen, weiter zur nächsten Abgabe. Für Software gibt es dafür eine ganze Disziplin: Versionskontrolle, Regressionstests, eine CI-Pipeline, die eine schlechte Änderung stoppt, bevor sie irgendwen erreicht. Jedes LLM-Projekt, das ich bisher angefasst habe, meines eingeschlossen, hat das komplett übersprungen. Ein Prompt wird einmal überflogen, sieht gut aus, geht raus.',
            'Ich wollte wissen, was es braucht, damit ein Prompt dieselbe Disziplin bekommt wie eine Funktion. Kein größeres Modell. Kein cleverer formuliertes Prompt-Template. Ein Tor, durch das eine Änderung muss, bevor sie überhaupt zählt.',
          ],
        },
        {
          label: 'Task',
          heading: 'Eine CI-Pipeline, bei der ein Prompt das Testobjekt ist',
          body: [
            'Das Ziel war konkret: eine Pipeline, die bei jeder Prompt- oder Modelländerung anspringt, das Feature gegen Fälle mit bekannt richtiger Antwort testet, es auf mehr als einer Dimension bewertet und den Merge blockiert, wenn etwas schlechter wurde als die letzte bekannt gute Version. Als Feature selbst habe ich absichtlich etwas Unspektakuläres gewählt, einen Kundensupport-E-Mail-Klassifikator, damit der Harness drumherum das eigentliche Thema der Arbeit bleibt, nicht der Klassifikator.',
            'Eine Pipeline, die nur auf meinem eigenen Laptop läuft, wäre bloß ein Skript mit Umwegen. Der Plan stand von Anfang an fest: in GitHub Actions einbauen und an einem echten Pull Request beweisen, nicht CI erst am Ende dazuschrauben, wenn schon alles von Hand funktioniert.',
          ],
        },
        {
          label: 'Action',
          heading: 'Den Harness bauen und dann versuchen, ihn kaputtzukriegen',
          body: [
            'Angefangen habe ich beim Datensatz, denn wenn der falsch ist, testet alles danach gegen eine Lüge. Fünfzig von Hand verifizierte Support-E-Mails, nicht LLM-generiert (ein LLM, das ein LLM anhand von LLM-geschriebenen Testfällen bewertet, korrigiert im Zweifel seine eigenen Hausaufgaben), aufgebaut aus echten Ticket-Metadaten von Kaggle und von Hand zu Fällen umgeschrieben, für die ich einzeln geradestehen kann. Ein Teil davon ist bewusst unangenehm: E-Mails, die mitten im Satz die Sprache wechseln, welche, die sarkastisch klingen, welche, bei denen die richtige Kategorie wirklich Ermessenssache ist. Die einfachen Fälle sagen bei einer Prompt-Änderung nichts aus. Die unangenehmen schon.',
            'Beim Scoring reichte exakte Kategorietreffer-Genauigkeit nicht. Eine Prompt-Änderung kann die Genauigkeit halten und trotzdem leise die Zusammenfassungen verschlechtern oder den Tokenverbrauch pro E-Mail verdreifachen. Also wird jeder Fall auf vier Dinge geprüft: Stimmt die Kategorie, bewertet ein zweites, größeres Modell die generierte Zusammenfassung mit mindestens 3 von 5 Punkten, wie lange hat die Anfrage gedauert, und wie viele Tokens hat sie gekostet. Jeder Lauf wird Fall für Fall gegen den letzten aufgezeichneten Lauf verglichen, nicht nur über die Gesamt-Trefferquote.',
            'Die Schwellenwerte richtig zu setzen, hat etwas Ausprobieren gebraucht: Warnung ab 3 % Rückgang, Build-Abbruch ab 8 %. Aber ein Schwellenwert pro Lauf ist blind für einen langsameren Fehlermodus, einen Prompt, der sich über zehn Änderungen hinweg jedes Mal um einen Punkt verschlechtert, ohne dass je ein einzelner Lauf die 8 % reißt. Dafür läuft die Drift-Erkennung als eigener, getrennter Check: ein gleitender Durchschnitt über die letzten sieben Läufe, verglichen mit seinem eigenen bisherigen Bestwert. „Hat diese Änderung etwas kaputtgemacht“ und „wird das über Monate hinweg leise schlechter“ sind zwei verschiedene Fragen, und die zweite als niedrigere Schwelle an die erste dranzuhängen, hätte sie übersehen.',
            'GitHub Actions verbindet zwei Trigger. Ein Pull Request, der /prompts anfasst, führt die Auswertung aus und postet die Pass/Fail-Zusammenfassung als Kommentar, lässt den Check bei einer kritischen Regression scheitern und schreibt dabei nichts in den Branch zurück. Ein Merge nach main führt es erneut aus, speichert das Ergebnis als neue Baseline und schickt den Slack-Alert. Erst dieser zweite Trigger macht den Diff des nächsten PRs überhaupt aussagekräftig. Ohne eine Baseline, die sich bei jedem Merge aktualisiert, vergleicht jeder künftige Lauf gegen eine veraltete Zahl.',
            'Der Teil, auf den ich am meisten stolz bin: Ich habe nicht aufgehört, sobald der Code lokal richtig aussah. Ich habe einen echten Pull Request gegen mein eigenes Repo geöffnet, um die Action einmal komplett live laufen zu sehen, und sie hat zwei Bugs gefunden, die mir beim bloßen Lesen des Codes nie aufgefallen wären. Der reports-Ordner existierte nur auf meinem Rechner, von Hand angelegt und nie von Git verfolgt, also hatte ein frischer CI-Checkout keinen Ort, um den HTML-Report zu schreiben. Und eine nicht gesetzte GitHub-Actions-Variable wird zu einem leeren String, nicht zu einer fehlenden, also hat mein Schwellenwert-Parser versucht, einen leeren String in eine Zahl umzuwandeln, und ist abgestürzt, bevor der Lauf überhaupt bei dem Code ankam, den ich eigentlich testen wollte. Keiner der beiden Bugs ist exotisch. Beide existieren nur an der Grenze zwischen „funktioniert auf meinem Rechner“ und der Umgebung, die tatsächlich zählt.',
            'Sobald der Harness selbst stand, habe ich ihn am Klassifikator ausprobiert. Die erste Baseline lag bei 84 %, und der Diff zeigte genau, warum: Die Kategorie account lag bei 43 %, weil sie sich in der Prompt-Formulierung ständig mit billing überschnitt. Zwei gezielte Korrekturen später, die genau auf diese Zahl zielten statt auf eine Vermutung, stand sie bei 100 %. Die nächste Änderung, eine Tie-Break-Regel für E-Mails mit zwei gleichzeitigen Anliegen, hat absichtlich zwei Punkte gekostet, und der Harness hat es zu Recht nicht als Regression markiert, weil ein Rückgang von 2 % unter der 3-%-Warnschwelle liegt. Das ist der Punkt an einem einzigen Lauf: Der Harness konnte eine echte Regression von einem bewussten Trade-off unterscheiden, statt jeden Rückgang gleich zu behandeln.',
          ],
        },
        {
          label: 'Result',
          heading: 'Ein Repo, auf das ich zeigen kann, kein Screenshot',
          body: [
            'Was jetzt existiert, ist eine kleine, MIT-lizenzierte, containerisierte Pipeline mit eigener CI und einer Pull-Request-Historie, auf die ich zeigen kann: Hier ist der Bug, den sie gefunden hat, hier ist die Zahl, die sie bewegt hat. Für eine Studienarbeit wäre das schon mehr Testabdeckung, als das Feature eigentlich gebraucht hätte. Für eine Praktikumsbewerbung kommt es näher an den eigentlichen Punkt heran.',
            'Die größere Erkenntnis hatte weniger mit Prompts im Speziellen zu tun. Ich habe aufgehört, meinem eigenen Eindruck zu vertrauen, ob etwas funktioniert. Beide echten Bugs sind nur aufgetaucht, weil ich darauf bestanden habe, einen echten Pull Request in einer echten CI-Umgebung laufen zu sehen, statt anzunehmen, sauber aussehender Code bedeute eine funktionierende Pipeline. Diese Gewohnheit will ich über dieses eine Projekt hinaus behalten, nicht nur als Fakt darüber festhalten.',
          ],
        },
      ],
    },
  },
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
      de: 'Warum ich eine Routing-Schicht gebaut habe, die jede Anfrage nach Komplexität bewertet, sie an das günstigste passende Modell schickt, und ihre eigenen Entscheidungen im Hintergrund überprüft.',
    },
    sections: {
      en: [
        {
          label: 'Situation',
          heading: 'The problem I kept running into',
          body: [
            "I kept noticing the same pattern in every AI project I looked at, including my own early prototypes: every single request, no matter how trivial, gets sent to the same model. A one-line data extraction goes to GPT-4o. A two-sentence summary goes to GPT-4o. A genuinely hard multi-step reasoning task also goes to GPT-4o. It's the easy default, and it's an expensive one. Teams routinely overspend 2 to 20x on requests that never needed that much capability in the first place.",
            'I wanted to know: if I looked at what a prompt was asking for before deciding where to send it, how much of that spend could I avoid without anyone noticing a drop in quality?',
          ],
        },
        {
          label: 'Task',
          heading: 'What I set out to build',
          body: [
            'So I set myself a fairly specific goal: build a routing layer that sits in front of any LLM call, scores how complex the request is, and sends it to the cheapest model that can handle it, without silently degrading answers.',
            'And because "trust me, it works" isn\'t good enough for something making cost decisions on every request, it also had to catch its own mistakes and get better over time, not just route once and hope.',
          ],
        },
        {
          label: 'Action',
          heading: 'What I did',
          body: [
            'I started with the boring part first: a scikit-learn classifier trained to score incoming prompts into three complexity tiers using lightweight text features. Nothing fancy, just enough signal to separate "extract this date" from "walk me through this multi-step proof." That classifier hits 86% accuracy on held-out data, which was good enough to route with, but not good enough to trust blindly.',
            "That's where the part I'm proud of comes in: an async verifier that runs quietly in the background after every response. It re-runs the same prompt through a stronger reference model, compares the two answers, and if they diverge too much, it escalates and logs the mismatch instead of letting a bad answer slip through unnoticed. Those escalated mismatches don't just disappear into a log file, either. They feed back into the training set for the next classifier retrain, so the system's routing judgment is supposed to get sharper the longer it runs, instead of staying frozen at whatever it learned on day one.",
            "I also didn't want routing changes to require a redeploy every time I second-guessed a threshold, so the tier-to-model mapping lives in a config file that's hot-reloadable through the API. And because I wanted to watch this thing work instead of trusting numbers in a log, I built a live Streamlit dashboard on top of a FastAPI backend that shows real vs. baseline cost, routing distribution, and escalation rate.",
            "The part that made this feel real rather than a toy: Tier 1 and Tier 2 run on genuine, free inference through Groq, verified end to end with real responses and real (near-zero) cost and latency, not mocked numbers. Tier 3 still routes to GPT-4o mocked, since there's no free tier for frontier models. But every provider adapter falls back gracefully to a mock, so the whole system could be built and validated before I spent a cent.",
          ],
        },
        {
          label: 'Result',
          heading: 'What it came out to',
          body: [
            "What I ended up with is a working, containerized, CI-covered system, not a notebook demo: a FastAPI service with a live dashboard, a classifier that's honest about its own limits, and a verification loop that's designed to catch its own mistakes instead of assuming it's always right.",
            'The core claim (that most requests don\'t need the most expensive model) holds up: route intelligently instead of defaulting to "send everything to the biggest model," and that\'s where most of the 2 to 20x in this space comes from.',
            "The bigger lesson for me wasn't about LLM routing specifically. It was a reminder that the most expensive mistake in most systems isn't picking the wrong model: it's never checking whether the model you picked was even necessary in the first place.",
          ],
        },
      ],
      de: [
        {
          label: 'Situation',
          heading: 'Das Problem, auf das ich immer wieder gestoßen bin',
          body: [
            'Mir ist bei jedem KI-Projekt, das ich mir angesehen habe (auch bei meinen eigenen frühen Prototypen), dasselbe Muster aufgefallen: Jede Anfrage, egal wie trivial, geht an dasselbe Modell. Eine einzeilige Datenextraktion geht an GPT-4o. Eine Zwei-Satz-Zusammenfassung geht an GPT-4o. Eine wirklich schwierige, mehrstufige Reasoning-Aufgabe geht ebenfalls an GPT-4o. Das ist der bequeme Standard, und ein teurer. Teams geben dadurch regelmäßig 2- bis 20-mal so viel aus wie nötig, für Anfragen, die diese Leistungsfähigkeit nie gebraucht hätten.',
            'Ich wollte wissen: Wenn ich mir ansehe, was ein Prompt verlangt, bevor ich entscheide, wohin er geht, wie viel von diesen Kosten könnte ich vermeiden, ohne dass jemand einen Qualitätsverlust bemerkt?',
          ],
        },
        {
          label: 'Task',
          heading: 'Was ich mir vorgenommen habe',
          body: [
            'Ich habe mir ein recht konkretes Ziel gesetzt: eine Routing-Schicht bauen, die sich vor jeden LLM-Aufruf schaltet, die Komplexität der Anfrage bewertet und sie an das günstigste Modell schickt, das sie bewältigen kann, ohne die Antwortqualität stillschweigend zu verschlechtern.',
            'Und weil "vertrau mir, es funktioniert" nicht reicht für etwas, das bei jeder Anfrage Kostenentscheidungen trifft, musste es auch seine eigenen Fehler erkennen und sich mit der Zeit verbessern, nicht nur einmal routen und hoffen.',
          ],
        },
        {
          label: 'Action',
          heading: 'Was ich konkret gemacht habe',
          body: [
            'Angefangen habe ich mit dem unspektakulären Teil: einem Scikit-learn-Klassifikator, der eingehende Prompts anhand leichtgewichtiger Textmerkmale in drei Komplexitätsstufen einteilt. Nichts Ausgefallenes, nur genug Signal, um "extrahiere dieses Datum" von "führe mich durch diesen mehrstufigen Beweis" zu unterscheiden. Dieser Klassifikator erreicht 86 % Genauigkeit auf Testdaten, gut genug zum Routen, aber nicht gut genug, um ihm blind zu vertrauen.',
            'Genau da kommt der Teil, auf den ich am meisten stolz bin: ein asynchroner Verifier, der still im Hintergrund läuft, nachdem jede Antwort verschickt wurde. Er führt denselben Prompt erneut über ein stärkeres Referenzmodell aus, vergleicht beide Antworten, und wenn sie zu stark voneinander abweichen, eskaliert und protokolliert er die Abweichung, statt eine schlechte Antwort unbemerkt durchzulassen. Diese eskalierten Fehlfälle verschwinden auch nicht einfach in einer Log-Datei, sondern fließen zurück ins Trainingsset für das nächste Nachtraining des Klassifikators. Das System soll dadurch mit der Zeit treffsicherer werden, statt auf dem Stand des ersten Tages stehen zu bleiben.',
            'Ich wollte außerdem nicht bei jeder Schwellenwert-Anpassung neu deployen müssen, also liegt die Zuordnung von Stufe zu Modell in einer Konfigurationsdatei, die sich live über die API nachladen lässt. Und weil ich dem System beim Arbeiten zusehen wollte, statt nur Zahlen in einem Log zu vertrauen, habe ich ein Streamlit-Dashboard auf einem FastAPI-Backend gebaut, das echte vs. Baseline-Kosten, die Routing-Verteilung und die Eskalationsrate live anzeigt.',
            'Der Teil, der das Ganze wirklich real gemacht hat statt nur ein Spielzeug: Stufe 1 und Stufe 2 laufen über echte, kostenlose Inferenz via Groq, end-to-end verifiziert mit echten Antworten und echten (nahezu null) Kosten und Latenzen, keine simulierten Zahlen. Stufe 3 geht weiterhin simuliert an GPT-4o, da es für Frontier-Modelle keine kostenlose Stufe gibt. Aber jeder Provider-Adapter fällt sauber auf einen Mock zurück, sodass das gesamte System gebaut und validiert werden konnte, bevor ich auch nur einen Cent ausgegeben habe.',
          ],
        },
        {
          label: 'Result',
          heading: 'Wo ich am Ende gelandet bin',
          body: [
            'Am Ende stand ein funktionierendes, containerisiertes, mit CI abgesichertes System, keine Notebook-Demo: ein FastAPI-Service mit Live-Dashboard, ein Klassifikator, der ehrlich mit seinen eigenen Grenzen umgeht, und eine Verifikationsschleife, die darauf ausgelegt ist, eigene Fehler zu erkennen, statt einfach von sich selbst auszugehen.',
            'Die Kernaussage (dass die meisten Anfragen nicht das teuerste Modell brauchen) hält stand, wenn man genau hinschaut: Intelligentes Routing statt "schick einfach alles ans größte Modell" ist meist genau die Stelle, an der die 2- bis 20-fache Ersparnis in diesem Bereich herkommt.',
            'Die größere Erkenntnis für mich hatte weniger mit LLM-Routing im Speziellen zu tun. Sie war eher eine Erinnerung daran, dass der teuerste Fehler in den meisten Systemen nicht die Wahl des falschen Modells ist, sondern die Tatsache, nie zu überprüfen, ob das gewählte Modell überhaupt nötig war.',
          ],
        },
      ],
    },
  },
];
