---
id: solo-maintenance
title: Maintenance
sidebar_position: 13
sidebar_label: 12. Maintenance
description: A weekly review for a solo AI app, with a worked model-retirement migration, evaluation checks, cost monitoring, and recovery planning.
---

# Maintenance

> **In one line:** Use a short weekly review to find maintenance work early; budget separate time to investigate failures, test upgrades, and release fixes.

:::tip[In plain English]
A shipped AI tool still has code, dependencies, users, and services to maintain. Its model can also be retired, and real inputs can expose gaps in your tests. A weekly review gives those issues a regular place to surface. Fifteen minutes is a starting timebox for a small, quiet app, not a promise that all maintenance will fit inside it.
:::

## The 15-minute weekly ritual

Same time each week (Sunday evening works for most). Set a recurring calendar block.

1. **Re-run `eval.py`** (1 min). All 20 rows still pass? If not, investigate.
2. **Open Langfuse dashboard** (3 min). Any error spike? Any latency regression? Top user reasonable?
3. **Open Anthropic / OpenAI console** (1 min). Spend on track? Any unusual day?
4. **Open Sentry** (2 min). Triage new issues by affected users and severity; assign follow-up work to failures that need investigation.
5. **Open Stripe dashboard** (2 min). Any failed charges? Any chargebacks? Cancellations?
6. **Triage user inbox** (5 min). Reply to anyone who emailed. Even "got it, will look" beats silence.
7. **Review dependency updates** (1 min). Check release notes and test results; schedule upgrades that need further verification.

If the review finds a broken flow, an upcoming shutdown, or an unexplained bill, reserve time to resolve it. Automated alerts still need to catch urgent problems between weekly reviews.

## The four things that move under you

### 1. Model deprecations

**Deprecated** means a model is scheduled to leave service; **retired** means it is unavailable. Use the deadline in the notice for your exact model and hosting platform. There is no universal twelve-month window, and a pinned model ID does not prevent retirement. The optional provider reference below documents one concrete lifecycle.

**Defenses:**

- Record the exact model ID and platform used by each app, background job, and fallback.
- Watch your provider's deprecation notices and record the retirement date when one appears.
- Choose a migration date early enough to test a replacement and recover from a failed rollout before retirement.
- Compare the replacement on your eval set, schema/tool behavior, latency, and cost; verify the released app actually uses it.

:::note[Worked example: plan backward from retirement]
These dates and results are illustrative. A notice arrives on September 6: model A retires October 20. Your summarizer uses A in the web request handler and in a nightly retry job.

| Step | Evidence to record | Decision |
|---|---|---|
| Inventory usage | Both model settings and the fallback are listed | Include the background job in the migration |
| Test candidate B | A passes 20/20 saved cases; B passes 19/20 and omits an action item | Investigate the failed case before release |
| Retest the fix | B passes the saved set plus a new missing-action-item case; measured cost fits the app's limit | Schedule deployment with time left before October 20 |
| Verify production | Web and nightly traces report B; errors and output checks remain within the app's limits | Keep monitoring and retain the test record |

A passing set covers only those examples. Review representative fresh inputs too. If B fails after deployment, reverting to A is an option only while A remains available; after its retirement you need another tested model or a clear temporary-unavailability response.
:::

### 2. Provider price changes

Pricing and billing rules can change. Check the actual notice and effective date instead of assuming a standard notice period. Recalculate using your app's input and output usage; the same price change can affect short classifications and long summaries differently.

**Defenses:**

- Track cost-per-active-user in Langfuse weekly.
- If a price change hits, re-run the margin math from [payments](./08-payments.md). Decide: raise price, lower limit, swap model, eat the cost.
- Don't quietly eat repeated cost increases. They compound.

### 3. Eval drift

Real user inputs are weirder than your hand-curated 20-row eval. After two months in production, you'll have hundreds of real inputs. Some are doing things your eval doesn't cover.

**The cadence:** monthly, not weekly.

- Pull 20 random recent traces from Langfuse.
- For each, ask: "is this output what I'd want?"
- For any "no", add a row to `eval.csv` with the expected behavior, and iterate the prompt until that row passes alongside the existing ones.

This is the single most valuable monthly habit. The eval grows from your real users, which means your prompt gets better at handling reality.

### 4. User-expectation drift

Users may compare your output with newer tools. Compare replacements on the tasks your app promises to solve; a general benchmark increase does not establish that your app's results improve.

**Defenses:**

- When a new top-tier model ships, run your eval against it. Even if you don't switch, *know* the gap.
- If the gap is large and your tier economics still work on the new model, switch.
- Tell users when you upgrade — a tweet or a tiny in-app changelog reassures.

## When to invest beyond 15 min/week

Signals that maintenance load needs to go up:

| Signal                                | Add                                                        |
|---------------------------------------|-------------------------------------------------------------|
| Same user issue 3+ times in a month   | Specific eval row + prompt fix (graduate from manual reply) |
| Sentry error count growing            | Look at the actual top issue (not all of them) and fix     |
| Cost rising faster than active users  | Investigate per-user cost distribution; cap heavy users    |
| You're answering the same email a lot | Add a FAQ section or a tooltip in the product              |

The pattern: maintenance work *should* convert into structural fixes, not become a permanent firefighting hill.

## When NOT to add features

Maintenance time is not feature time. The instinct, when you have 15 minutes spare, is to ship a small new feature "while you're in there." Resist for two reasons:

- Features add maintenance load. You'll regret the surface area in three months.
- Each feature should be planned with a one-pager (see [planning](./03-planning.md)) — not stuffed in during the weekly check.

Keep maintenance and feature work in separate time blocks.

## When to take a week off

Solo projects burn out their creators. If you're dreading the Sunday check-in for two weeks straight, you're heading toward "quietly let it die." Pre-empt by:

- Taking a planned week off. Set the auto-responder. Tell yourself it's allowed.
- Coming back to do the weekly check the following Sunday.
- If after that you still don't want to touch it: see [graduating](./17-graduating.md) — it's signaling that the project should either be sold, open-sourced, or shut down with dignity.

:::note[Worked example: catching a quiet regression]
Your weekly eval run shows row #14 (the adversarial prompt-injection test) failing for the first time since launch. The model now follows the injection where it used to ignore it.

First reproduce the failure and compare the recorded model ID, prompt, retrieved context, tool configuration, and dependency versions with the last passing run. One failure does not establish that the provider changed a model; nondeterministic output and changed application inputs also need investigation.

If the failure could expose private data or trigger an unauthorized action, disable that path while you investigate. Fix the relevant permission or tool boundary, test the existing cases plus variants of this attack, and inspect the result before release. Stronger prompt wording alone does not enforce authorization.

Without the weekly eval, you'd have learned about this from a user (best case) or a Twitter screenshot of your tool being jailbroken (worst case).
:::

:::info[Highlight: the prompt is the maintenance surface]
Treat prompts as versioned application behavior: review changes and keep their evaluation results. Also maintain the code, data access rules, dependencies, and services around them. A prompt change cannot repair every kind of failure.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **No weekly cadence at all.** Maintenance becomes "when something breaks," which means users find bugs before you do. The fix is a recurring calendar block — same time each week.
- **Ignoring deprecation warnings.** The model will keep working… until the morning it won't. The fix is to plan the swap when the warning lands, not when the API starts 410-ing.
- **Not re-running evals after a model bump.** "It's just a minor version, should be fine" → quality regresses silently. The fix is: every model string change requires a fresh eval run before merge.
- **Letting Sentry go to ignore-by-default.** New issues accumulate; the dashboard becomes useless. The fix is to triage to zero each week — mark as resolved, ignore deliberately, or fix.
- **Treating user emails as a low priority.** Replies in \&lt;24h are why solo tools feel personal and earn loyalty. The fix is to make user inbox part of the 15-minute weekly ritual.
:::

## Page checkpoint

Self-check:

- Is there a recurring calendar block for the weekly maintenance ritual?
- Is the model string pinned explicitly in your code?
- Do you run `eval.py` weekly? Add real-user-input rows monthly?

<Quiz id="solo-maintenance-quick-check" variant="micro" title="Quick check">

<Question
  prompt="What is the primary defense against a model deprecation breaking your tool one morning?"
  options={[
    { text: "Record the model and platform, watch retirement notices, and test a replacement before the stated deadline" },
    { text: "Use a model alias like claude-latest so you always get the newest version automatically" },
    { text: "Self-host an open model so no provider can deprecate it" },
    { text: "Keep two providers wired in production and load-balance between them" }
  ]}
  correct={0}
  explanation="An explicit model ID makes usage inspectable but does not keep a retired model available. Work backward from the actual deadline and include background jobs and fallbacks in the migration."
/>

<Question
  prompt="What is the monthly eval-drift habit the page calls the single most valuable one?"
  options={[
    { text: "Rewrite the system prompt from scratch each month" },
    { text: "Double the size of the eval CSV with synthetic LLM-generated cases" },
    { text: "Pull 20 random recent traces from Langfuse, judge each output, and add eval rows for any that fall short" },
    { text: "Switch to whichever model tops the public benchmarks that month" }
  ]}
  correct={2}
  explanation="Real user inputs are weirder than your hand-curated 20 rows, so the eval set grows from production traces — which means the prompt improves at handling reality, not hypotheticals. Synthetic case generation is the plausible-sounding distractor, but the page's whole point is that the valuable rows come from REAL traffic, not generated approximations."
/>

<Question
  prompt="You bump the model version in your config. What must happen before that change merges?"
  options={[
    { text: "Nothing extra for a minor version — only major versions need review" },
    { text: "A fresh eval run, since quality can regress silently even on a small version change" },
    { text: "A one-week canary period with 1% of traffic" },
    { text: "Notifying all users by email about the upcoming change" }
  ]}
  correct={1}
  explanation="A model change can alter application behavior, so rerun the evals and inspect failures before merging. Those checks complement production monitoring and an appropriate rollout; a passing eval does not replace them."
/>

</Quiz>

:::tip[→ Going deeper]
[Observability](./10-observability.md) explains the traces to record during these checks. Revisit [Deployment](./09-deployment.md) before releasing a replacement model.
:::

:::note[Go deeper (optional): provider reference]
[Anthropic's model-deprecation documentation](https://platform.claude.com/docs/en/about-claude/model-deprecations), reviewed September 6, 2026, distinguishes deprecated from retired models and lists deadlines and replacements. Check the schedule for the platform you use; partner-hosted models can have different dates.
:::

## What's next

→ Continue to [Realistic Time Investment](./13-time-investment.md) where we'll calibrate weekend-MVP, month-to-100-users, and three-months-to-$100-MRR expectations.
