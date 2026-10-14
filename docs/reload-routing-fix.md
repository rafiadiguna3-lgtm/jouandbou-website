# Reload routing visibility fix for review

Reloading #about, #contact, #bou-works or #bou-works/temu previously painted the homepage before the dynamically imported router initialized. Reproduced with a browser test that delays about.mjs: 4 routes failed the assertion that the homepage stays hidden; homepage reload passed.

index.html now marks those routes before body parsing and hides content while initial routing is pending. about.mjs reveals content after the active route is applied; Bou details wait for renderBou to finish. Header and existing styling remain intact. URL hashes are preserved, so reload stays on the active section. No new splash screen, redesign or navigation reset. A noscript visibility rule avoids hiding content when scripts are disabled.

Validation: build PASS, assets 4/4 PASS, browser 11/11 PASS, syntax and git diff checks PASS. Regression tests cover reload while routing is delayed on homepage, About, Contact, Bou index and Temu detail; existing desktop/mobile, 3D, video and Bou scroll tests pass. Safari/iPhone device behavior and hosted preview browser verification remain untested.

Previous/rollback commit: d670554f826975acae1dc8e2b81de1857ada7cee. Prior/native file hashes remain in source-manifest.json. Only index.html and about.mjs frontend code changed. Sites live, main, domains, DNS, deployment configuration and Draft PR #1 are unchanged. Push uses the existing automatic Cloudflare preview integration. This is a review update, not a final release.
