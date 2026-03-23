# AutoMindLab Agent Notes

## Council seats
- place seat files in `context/council/`
- use the standard schema already used by existing seat files
- keep the declared council at 13 unless `COUNCIL_OF_13.md` is updated on purpose

## Specialists
- place specialist files under the relevant domain directory
- include a clear input contract and output contract
- specialist influence lists must only reference declared council seats
- specialist output stays advisory unless a consumer application persists it

## Host and worker
- external channels stay on the host agent
- the worker is for delegated isolated execution only
