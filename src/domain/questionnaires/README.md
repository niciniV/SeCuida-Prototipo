# Questionnaires

Questionnaire-like experiences are JSON guided-flow content executed by `src/domain/flow-engine`.

Do not add questionnaire-specific React screens, routes, TypeScript content files, scoring services, or persistence here. If a questionnaire needs scoring, consent copy, branching, recommendations, or safety interruption, express those requirements in JSON flow content and extend the generic flow engine only when the capability is reusable by other flows.
