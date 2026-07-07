# Duplicate Lead Rules

## Duplicate keys

Check combinations of:

- partner ID + lead email hash
- partner ID + business name normalized
- phone hash + email hash
- payload hash
- source + external lead ID

## Result types

- `none`
- `possible_duplicate`
- `likely_duplicate`
- `confirmed_duplicate`

## Actions

| Duplicate result | Action |
|---|---|
| `none` | continue |
| `possible_duplicate` | continue and mark for review |
| `likely_duplicate` | manual review required |
| `confirmed_duplicate` | do not create duplicate active lead |

## Response

Duplicate handling should still be safe:

> Lead submission received for review. A similar record may already exist.
