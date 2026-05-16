# Validation

Reserved for generic validation utilities and future content validation scripts.

Domain-specific validators already exist in:

- `src/domain/flow-engine/validateFlow.ts`

Future repo-wide validation should orchestrate those validators instead of duplicating schema logic. Expected checks include content IDs, flow references, recommendation IDs, review metadata, and route/action targets.
