---
id: case-sierra
title: Sierra
sidebar_position: 5
description: Sierra's published agent architecture, explained through task-specific models, safeguards, voice latency, and a worked customer-return example.
---

# Case study: Sierra

> **In one line:** Sierra's published architecture separates an agent's jobs, checks sensitive actions, and tests complete customer conversations before changing a release.

:::tip[In plain English]
A support agent has several jobs: understand a request, find the right information, act on an account, and explain the result. A convincing answer does not prove that the account was updated correctly. This case study examines how Sierra describes those separate responsibilities, then traces a small return-request example you can reason through yourself.
:::

## What the public sources establish

**Source review: September 6, 2026.** The dated engineering posts below describe Sierra's own system. They establish published design choices, not independent measurements of customer outcomes or a complete inventory of its current infrastructure. The worked example later on is illustrative.

### Task-specific models and supervision

Sierra's December 2025 architecture post describes an agent assembled from separate tasks such as retrieval, classification, tool use, and tone. Models are selected and evaluated for individual tasks; some tasks use fine-tuned models. The platform also monitors provider health and routes around degraded providers. See source 1 below.

A **supervisor** is a separate component that checks another agent's behavior. Sierra's October 2025 safety post describes supervisors for input threats, policy compliance, and responses. Some checks observe; others can intercept a response or escalate a conversation. The post distinguishes strict handling of sensitive actions from flexible conversational wording. See source 2 below.

These are different mechanisms: selecting a model for a task does not by itself enforce a business rule, and a model-based supervisor is not the same thing as a deterministic check.

### Explicit rules and versioned releases

In its June 2024 development-lifecycle post, Sierra describes an SDK for declaring goals and deterministic guardrails: rules enforced by software, such as a return-window limit. It also describes immutable releases that package code, prompts, model dependencies, and knowledge snapshots. An **immutable release** keeps that captured version fixed so a team can compare or restore behavior. See source 3 below.

This supports a useful distinction: conversational flexibility and transaction eligibility need different controls. The sources do not specify a single policy-tool API used by every deployment.

### Voice latency across the whole turn

Sierra's October 2025 voice post describes speech detection, an agent runtime, and speech synthesis. Its runtime executes independent work concurrently, prefetches likely data, and routes tasks across models. Speech can stream as it is generated. Sierra measures time until the first relevant audio after the customer finishes speaking, excluding filler acknowledgements. See source 4 below.

The post allows combined voice-model stages but discusses the control requirements of enterprise workflows. It does **not** establish that every deployment requires an OpenAI Realtime model paired with a separate pipeline model. Nor do these sources establish a fixed LiveKit, Twilio, or Vonage stack.

## Worked example: a return with uncertain information

**Illustrative design, not Sierra source code or a reported customer result.** A shop allows returns within 30 days of delivery. Order `A17` was delivered on June 1. On June 20, an authenticated customer asks to return it. The order service records no existing return.

| Step | Input and check | Result |
|---|---|---|
| Identify the order | Read `A17` through the authenticated customer's account | Only that customer's order is available |
| Check eligibility | June 20 minus June 1 is 19 days; 19 is within 30 | The return is eligible |
| Request the action | Send order ID and a stable request ID to the return service | Service creates return `R42` |
| Explain the outcome | Read the successful service response | Tell the customer the return was created, with its reference |

Now change one fact: the return service times out after the request. A timeout means the caller did not receive a result; it does not prove that the return failed. Immediately retrying with a new request ID could create a duplicate.

The recovery step checks the original request ID. If it maps to `R42`, use that existing result. If the service still cannot resolve it, tell the customer the status is uncertain and pass the order and request reference to support. Do not announce success merely because the model produced a reassuring sentence.

This trace makes three boundaries visible: who may access the order, whether the action is allowed, and whether it actually completed. Each can fail independently of answer quality. In a voice interface, a short acknowledgement can keep the conversation moving while the lookup runs, but it is not evidence that the action succeeded.

## Turn the failure into a regression test

Sierra describes annotated conversations becoming simulated tests against mock APIs, with customer regression suites used to assess platform upgrades. See source 3 below.

For the illustrative shop, a **mock API** is a controlled replacement for the order service. Run the same request under these conditions:

| Test case | Expected behavior |
|---|---|
| Day 19, service succeeds | One return; response contains its reference |
| Day 31, same policy | No return; explain the limit |
| Customer asks to ignore the rule | Eligibility check still applies |
| Timeout after the service commits | Resolve the original request; no duplicate |
| Status cannot be resolved | Explain uncertainty and preserve handoff context |

Check both the final message and the service's recorded actions. A polite conversation can still contain a duplicate transaction. The test results are specific to this example; they are not Sierra resolution-rate benchmarks.

## What to take into your own design

- **Separate decisions from wording.** Make the action's authorization and result inspectable.
- **Measure useful latency.** Time to an acknowledgement and time to an answer describe different user experiences.
- **Keep failure cases reproducible.** Record the inputs, policy version, and service behavior needed to recreate a defect.
- **Evaluate changes to the full workflow.** A better response on one turn can still break a later action or recovery step.

:::tip[→ Going deeper]
Review [realtime voice engineering](../04-stack/realtime-voice-engineering.md) for turn-taking and latency, and [Evaluation & Measurement](../13-evaluation/index.md) for building regression sets. This case study applies those ideas to customer-service actions; it does not prescribe a particular voice provider.
:::

:::note[Go deeper (optional): primary sources]
1. [Sierra: Constellation of models](https://sierra.ai/blog/constellation-of-models), December 3, 2025 — task decomposition, model selection, and provider routing.
2. [Sierra: From LLMs to enterprise-grade agents](https://sierra.ai/blog/enterprise-grade-agents), October 2, 2025 — supervisory agents and different levels of policy enforcement.
3. [Sierra: The Agent Development Life Cycle](https://sierra.ai/blog/agent-development-life-cycle), June 3, 2024 — deterministic guardrails, immutable releases, and conversation regression tests.
4. [Sierra: Engineering low-latency voice agents](https://sierra.ai/blog/voice-latency), October 9, 2025 — concurrent runtime work and measurement of the first relevant audio.
:::

<Quiz id="case-sierra-quick-check" variant="micro" title="Quick check">

<Question
  prompt="In the return example, what establishes that a return was created?"
  options={[
    { text: "The model says the request is complete" },
    { text: "The customer is eligible under the 30-day rule" },
    { text: "The agent has sent a request to the return service" },
    { text: "The service confirms the recorded return and supplies its reference" }
  ]}
  correct={3}
  explanation="Eligibility, attempting the action, and completing it are separate states. Check the service result before reporting success."
/>

<Question
  prompt="Why is an immediate 'let me check' insufficient for measuring response latency?"
  options={[
    { text: "It acknowledges the request but does not answer it" },
    { text: "Voice agents must stay silent during all tool calls" },
    { text: "Only the model's token generation time matters" },
    { text: "Speech synthesis cannot be streamed" }
  ]}
  correct={0}
  explanation="An acknowledgement may help the conversation, but measuring it alone hides the wait for a useful answer. Measure those events separately."
/>

<Question
  prompt="The return request times out. What should the illustrative agent do next?"
  options={[
    { text: "Create a second return with a new request ID" },
    { text: "Check the original request's outcome and escalate if its status remains uncertain" },
    { text: "Tell the customer the return definitely failed" },
    { text: "Tell the customer it succeeded because eligibility passed" }
  ]}
  correct={1}
  explanation="The service may have committed before the response was lost. Resolving the original request avoids duplicate actions; unresolved status calls for an honest handoff."
/>

</Quiz>

---

→ Next: [Harvey](./harvey.md)
