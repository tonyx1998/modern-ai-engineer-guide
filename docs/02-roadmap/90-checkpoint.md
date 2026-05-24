---
id: roadmap-checkpoint
title: Chapter 2 Checkpoint
sidebar_position: 90
sidebar_label: Checkpoint quiz
description: Mandatory checkpoint quiz for Chapter 2 — Roadmap. 5 random questions drawn from a 15-question bank spanning all four Parts. Pass to unlock Chapter 3.
---

# Chapter 2 Checkpoint

You've worked through the Roadmap — the stages, the modern-stack picks, the intuitions beyond the stack, and the meta-skills of staying current in a fast-moving field. Take a minute to make sure the load-bearing ideas stuck.

There are **15 questions in the bank** — each visit picks 5 at random, so retaking gives you different ones. If you miss one, the result card tells you exactly which page section to revisit, and the link highlights the paragraph for you.

You must pass (≥ 60%) to unlock the Next button at the bottom.

<Quiz id="roadmap-checkpoint" title="Roadmap checkpoint" sampleSize={5}>

<Question
  prompt="The 10 build stages in Part I are deliberately ordered. Why is Stage 6 (Evals) placed BEFORE Stage 8 (Agent), instead of building the agent first and evaluating later?"
  options={[
    { text: "Evals are a prerequisite library for the agent SDK" },
    { text: "Without evals, you have no way to tell whether agent changes improve or regress behavior — debugging an agent by vibes is how you ship a broken one" },
    { text: "Agents require GPU hardware that evals provision" },
    { text: "Order doesn't matter; the stages are interchangeable" }
  ]}
  correct={1}
  explanation="Agents are multi-step, non-deterministic, and easy to break in subtle ways. Without an eval harness, every prompt tweak is a guess. Evals come first so you have a measurement loop before you take on the hardest pattern in the stack."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-6-evals", label: "Stage 6 — Evals" }}
/>

<Question
  prompt="A reader asks: 'Can I skip Stage 5 (RAG) and jump straight to Stage 8 (Agent)?' What's the most accurate response?"
  options={[
    { text: "Yes — agents replace RAG entirely" },
    { text: "No — retrieval is a load-bearing primitive most agents need; an agent without RAG fundamentals is an agent that hallucinates confidently over your data" },
    { text: "Only if you use a frontier model" },
    { text: "Only if you're targeting a chatbot use case" }
  ]}
  correct={1}
  explanation="Most useful agents call retrieval tools. Skipping RAG means skipping chunking, embeddings, recall/precision tradeoffs — the exact mechanics that determine whether your agent's answers are grounded or made up."
  revisit={{ to: "/docs/roadmap/part-1-from-zero/stage-5-rag", label: "Stage 5 — RAG" }}
/>

<Question
  prompt="What's the practical difference between the Frontier tier and the Workhorse tier in the 2026 stack?"
  options={[
    { text: "Frontier models are open-source; workhorse models are proprietary" },
    { text: "Frontier = highest-capability, highest-cost (Opus/GPT-5-class) for the hardest reasoning; Workhorse = the everyday default (Sonnet/GPT-5-mini-class) where 90% of calls actually live" },
    { text: "Frontier runs in the cloud; workhorse runs on-device" },
    { text: "They're the same thing under different vendor branding" }
  ]}
  correct={1}
  explanation="Frontier models are reserved for the genuinely hard reasoning calls — the rest of your traffic belongs on a workhorse model that's an order of magnitude cheaper and faster. Tier discipline is how you control cost without giving up quality where it matters."
  revisit={{ to: "/docs/roadmap/part-2-modern-stack/workhorse-tier", label: "Tier — Workhorse" }}
/>

<Question
  prompt="Why does the 2026 stack list 'Cheap tier' as a separate pick rather than just defaulting everything to the workhorse?"
  options={[
    { text: "Cheap models are required for compliance reasons" },
    { text: "Classification, routing, rewriting, and other simple-but-high-volume calls are 10–100× cheaper on a small/cheap model — and quality is indistinguishable for that class of work" },
    { text: "Cheap models are only used in development" },
    { text: "The cheap tier is purely a marketing label" }
  ]}
  correct={1}
  explanation="A lot of LLM work is routing, formatting, or 'does this match X?' — tasks that don't need a workhorse model. Sending those to Haiku/4o-mini-class models saves real money and latency without users noticing."
  revisit={{ to: "/docs/roadmap/part-2-modern-stack/cheap-tier", label: "Tier — Cheap" }}
/>

<Question
  prompt="The Vector DB pick chapter argues against reaching for Pinecone or Weaviate at the start. What's the recommended default for most new projects in 2026?"
  options={[
    { text: "Always start with Pinecone — it's the industry standard" },
    { text: "Start with pgvector (Postgres) or a similar 'just an extension on your existing DB' option, and only graduate to a dedicated vector DB when scale forces you to" },
    { text: "Build your own from scratch with FAISS" },
    { text: "Skip vector search; use full-text only" }
  ]}
  correct={1}
  explanation="A dedicated vector DB is real operational overhead — another service, another auth surface, another billing line. pgvector inside Postgres handles millions of vectors comfortably and keeps your data colocated with the rest of your app."
  revisit={{ to: "/docs/roadmap/part-2-modern-stack/vector-db-pick", label: "Pick — Vector DB" }}
/>

<Question
  prompt="When should you actually adopt an agent framework (LangChain, LlamaIndex, etc.) vs. calling the SDK directly?"
  options={[
    { text: "Always start with a framework — SDKs are too low-level" },
    { text: "Start with the raw SDK so you understand what's happening, and adopt a framework only when you have a concrete, repeated pattern it solves better than your own code" },
    { text: "Never use a framework — they all add too much overhead" },
    { text: "Only use frameworks if you're shipping to production" }
  ]}
  correct={1}
  explanation="Frameworks hide the wire protocol just as you're trying to learn it, and their abstractions often don't match what you actually need. The build-first instinct: SDK direct, then reach for a framework when you've felt the pain it removes."
  revisit={{ to: "/docs/roadmap/part-2-modern-stack/framework-pick", label: "Pick — Framework" }}
/>

<Question
  prompt="Why does the 2026 stack treat Observability as a Tier 1 'pick' rather than something to bolt on later?"
  options={[
    { text: "Compliance regulations require it from day one" },
    { text: "Without traces of every LLM call (prompt, response, tokens, latency, tool calls), debugging a non-deterministic system is essentially blind — you can't fix what you can't see" },
    { text: "Observability tools are free, so there's no reason not to" },
    { text: "It's only Tier 1 for enterprise customers" }
  ]}
  correct={1}
  explanation="LLM apps fail in ways traditional logs don't capture — a model drifted, a tool returned weird JSON, a retrieval missed the relevant chunk. Per-call traces (Langfuse, Braintrust, etc.) are the equivalent of stack traces for AI systems."
  revisit={{ to: "/docs/roadmap/part-2-modern-stack/observability-pick", label: "Pick — Observability" }}
/>

<Question
  prompt="The 'prompting as craft' chapter argues that prompt engineering is a real skill, not just typing English. What's the load-bearing intuition?"
  options={[
    { text: "Longer prompts always perform better" },
    { text: "Prompts are programs in natural language — small structural changes (ordering, examples, role framing, output format) change behavior in repeatable, measurable ways" },
    { text: "Only the model choice matters; prompts are interchangeable" },
    { text: "Prompts should always be one sentence" }
  ]}
  correct={1}
  explanation="A prompt is a program. The 'feels random' impression goes away once you start running evals on prompt variants — structure, examples, and output schema produce measurable, repeatable differences."
  revisit={{ to: "/docs/roadmap/part-3-beyond/prompting-as-craft", label: "Beyond the stack — prompting as craft" }}
/>

<Question
  prompt="What's the 'eval mindset' the Part III chapter argues every AI engineer needs to internalize?"
  options={[
    { text: "Only run evals before a release" },
    { text: "Build the evaluation set BEFORE (or alongside) the feature — so every prompt, model, and retrieval change has an objective signal instead of vibes" },
    { text: "Trust the model provider's published benchmarks" },
    { text: "Evals are only for research; production uses A/B tests" }
  ]}
  correct={1}
  explanation="Without an eval harness you're flying blind — every change becomes a 'feels better?' debate. The mindset shift is treating the eval set as a first-class artifact you build and grow alongside the feature itself."
  revisit={{ to: "/docs/roadmap/part-3-beyond/eval-mindset", label: "Beyond the stack — eval mindset" }}
/>

<Question
  prompt="The retrieval-quality chapter warns that 'RAG works in the demo, fails in production' is a predictable failure mode. What usually causes it?"
  options={[
    { text: "The vector DB silently corrupts embeddings" },
    { text: "Chunking strategy, embedding choice, and retrieval evaluation get skipped — so the system retrieves the wrong chunks confidently, and the LLM dutifully grounds an answer on garbage" },
    { text: "The model wasn't fine-tuned on your data" },
    { text: "Production traffic is higher than dev" }
  ]}
  correct={1}
  explanation="Retrieval is upstream of generation — if recall is bad, no model can save you. The fix is the unglamorous middle: eval the retriever (recall@k, precision@k) on real queries before blaming the LLM."
  revisit={{ to: "/docs/roadmap/part-3-beyond/retrieval-quality", label: "Beyond the stack — retrieval quality" }}
/>

<Question
  prompt="The 'agent discipline' chapter argues that the most common agent failure mode in 2026 is...?"
  options={[
    { text: "Models aren't smart enough yet" },
    { text: "Reaching for an agent when a single LLM call or a simple chain would have worked — agents add non-determinism, latency, and cost, and should be the LAST tool you reach for, not the first" },
    { text: "Lack of GPU memory at inference time" },
    { text: "Insufficient training data" }
  ]}
  correct={1}
  explanation="Agents are powerful and expensive (in tokens, latency, and debugging effort). The discipline is asking 'can this be a single structured call?' before reaching for a multi-step loop — most product problems can."
  revisit={{ to: "/docs/roadmap/part-3-beyond/agent-discipline", label: "Beyond the stack — agent discipline" }}
/>

<Question
  prompt="A feature works great with GPT-5/Opus but costs $0.40/request. The cost-intuition chapter would have you try what FIRST?"
  options={[
    { text: "Renegotiate pricing with the provider" },
    { text: "Drop to the workhorse tier and measure quality — most of the time you keep 95% of the quality for 10% of the cost; if not, try splitting the work into a cheap classifier + a focused frontier call" },
    { text: "Move to an open-source model immediately" },
    { text: "Cache every response and hope hit rate saves you" }
  ]}
  correct={1}
  explanation="Frontier-everywhere is the most common cost mistake. The intuitions are: tier down by default, then cascade (cheap model gates the expensive one), then cache. You almost never need frontier on every call."
  revisit={{ to: "/docs/roadmap/part-3-beyond/cost-intuition", label: "Beyond the stack — cost intuition" }}
/>

<Question
  prompt="The latency-intuition chapter argues streaming changes the UX math even when total time is the same. Why?"
  options={[
    { text: "Streaming reduces total tokens generated" },
    { text: "Time-to-first-token is what users perceive as 'fast' — a 3-second response that starts streaming at 300ms feels dramatically better than a 1-second response that arrives all at once" },
    { text: "Streaming bypasses rate limits" },
    { text: "Non-streamed responses are throttled by the provider" }
  ]}
  correct={1}
  explanation="Perceived latency is dominated by time-to-first-token, not total time. Streaming buys you UX even when the total wall-clock is identical — a load-bearing trick when you can't make the model itself faster."
  revisit={{ to: "/docs/roadmap/part-3-beyond/latency-intuition", label: "Beyond the stack — latency intuition" }}
/>

<Question
  prompt="The 'safety mindset' chapter frames prompt injection as which kind of problem?"
  options={[
    { text: "A model-quality problem that better training will eventually fix" },
    { text: "A classic security problem dressed in new clothes — untrusted input reaches a privileged interpreter (the LLM), and the defense is the same as SQL injection: treat all retrieved/tool content as untrusted, never grant the model more authority than the LEAST trusted input it sees" },
    { text: "A purely theoretical risk with no production impact" },
    { text: "Only a concern for chatbots" }
  ]}
  correct={1}
  explanation="Prompt injection is the LLM equivalent of SQLi — the model can't distinguish 'instructions from the developer' from 'instructions hidden in a retrieved document.' The mitigation is the same shape: assume input is hostile, scope authority tightly."
  revisit={{ to: "/docs/roadmap/part-3-beyond/safety-mindset", label: "Beyond the stack — safety mindset" }}
/>

<Question
  prompt="The 'how to learn fast' meta chapter recommends a specific loop for keeping up with a field that ships weekly. What is it?"
  options={[
    { text: "Read every paper on arXiv as it drops" },
    { text: "Build small, throwaway projects that exercise each new capability — reading about a feature creates recognition, building with it creates intuition" },
    { text: "Wait six months for the dust to settle before touching anything new" },
    { text: "Only follow vendor blog posts" }
  ]}
  correct={1}
  explanation="The fluency illusion bites hardest in AI — there's so much to read that 'I read about it' starts feeling like 'I know it.' The fix is the same as any other engineering skill: small builds beat passive reading, every time."
  revisit={{ to: "/docs/roadmap/part-4-meta/how-to-learn-fast", label: "Meta — how to learn fast" }}
/>

<Question
  prompt="The 'when to pivot' chapter is about deciding when to throw away your current approach. What's the signal it points to as most reliable?"
  options={[
    { text: "A new model from a different vendor was released" },
    { text: "Your evals stop improving despite real effort — when the curve flattens and prompt/retrieval tweaks no longer move the needle, the architecture (not the prompt) is probably wrong" },
    { text: "A competitor announced a similar feature" },
    { text: "You hit a budget cap" }
  ]}
  correct={1}
  explanation="The eval curve is the honest signal. If you've genuinely iterated and the numbers won't budge, the next prompt tweak won't save you — it's time to question chunking, retrieval, model tier, or whether an agent loop was the wrong shape entirely."
  revisit={{ to: "/docs/roadmap/part-4-meta/when-to-pivot", label: "Meta — when to pivot" }}
/>

</Quiz>

## What's next

You've finished Chapter 2 — the progression view of the whole guide.

→ Continue to [Chapter 3 — Lifecycle](/docs/lifecycle) to see what every phase of building an AI feature actually looks like, or jump to [Timeline & Path](./99-timeline-and-path.md) for a planning view of the whole thing.
