# Release Workflow

Execute the full release workflow for this library. Follow each step in order. Do not skip steps.

## Step 1: Validate State

1. Confirm the current branch matches the pattern `release/vX.Y.Z`. If not, stop and warn the user.
2. Read `package.json` and extract the `"version"` field. This is `VERSION` (e.g. `2.6.0`).
3. The tag to create is `v$VERSION` (e.g. `v2.6.0`).
4. Confirm the tag `v$VERSION` does not already exist (`git tag -l v$VERSION`). If it does, stop and warn.
5. Find the previous tag: `git tag --sort=-creatordate | head -1`. This is `PREV_TAG`.
6. Tell the user the version, the tag to be created, and the previous tag being diffed against.

## Step 2: Create PR to main

Create a PR from the current branch into `main`:

```
gh pr create --base main --title "Release v$VERSION" --body "Release v$VERSION"
```

Print the PR URL, then **stop and ask the user to merge the PR on GitHub and come back**. Do not proceed until the user explicitly confirms the PR has been merged.

## Step 3: Checkout main

After the user confirms the merge:

```
git checkout main
git pull origin main
```

## Step 4: Create and push annotated tag

```
git tag -a v$VERSION -m "tag v$VERSION"
git push origin v$VERSION
```

## Step 5: Create draft GitHub release

Analyze changes between `PREV_TAG` and `v$VERSION` to write release notes:

```
git log $PREV_TAG..v$VERSION --oneline
```

Also inspect merged PRs and their authors for additional context.

### Release notes format

- Use **only** these H3 category headers (include only categories that have entries):
  - `### ✨ Features` — new features, new props, new capabilities
  - `### ⚠️ Changes` — breaking or behavioural changes, deprecations
  - `### 📈 Improvements` — enhancements to existing functionality, better defaults
  - `### 🐛 Fixes` — bug fixes
  - `### ⚙️ Dev Setup Modifications` — tooling, deps, CI, dev config changes
- Each entry is a bullet point, written as a brief sentence.
- Do NOT include PR/issue numbers for changes by `troberts-28`. Only reference PR/issue numbers inline as `(#XX)` for changes contributed by someone other than `troberts-28`.
- If a change was contributed by someone other than `troberts-28`, append `@username` to that bullet.
- If there were external contributors, add a closing line: `Thanks @user1 and @user2 for your contributions 👏` (adjust for singular/plural).
- If the release has **only** dev/tooling changes (nothing user-facing), prepend: `N.B. This release doesn't introduce any changes to the published package.`
- Do NOT include merge commits, version bumps, or branch-merge housekeeping.
- Keep descriptions simple and brief.

### Create the release

Show the drafted release notes to the user and ask for confirmation before creating. Once confirmed:

```
gh release create v$VERSION --draft --title "Release v$VERSION" --notes "<release_notes>"
```

## Step 6: Merge main into develop

```
git checkout develop
git pull origin develop
git merge main --no-ff -m "Merge branch 'main' into develop"
git push origin develop
```

Tell the user the release is complete and summarise what was done.
