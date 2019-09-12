#### Handoff checklist

- [ ] All content has been used from the design file
- Basic browsers tests were made
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
  - [ ] IE11 (If required in project's specification.)
- Code validates
  - [ ] HTML (Online validator - https://validator.w3.org/#validate_by_uri or browser plugin - check source and outline to see headings nesting as well.)
  - [ ] JS and CSS (Run `npm run lint`, this way Travis will be happy.)
  - [ ] All unused (commented out) code has been removed
  - [ ] Console doesn't show any errors or unnecessary logs
- Security
  - [ ] All links with `target="_blank"` should have `rel="noopener"`
- [ ] Touch devices have properly coded link styles (tap & hover issue)
