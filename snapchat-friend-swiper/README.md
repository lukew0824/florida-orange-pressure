# Snapchat Web Friend Swiper

A userscript that overlays a Tinder-style swipe UI on top of
[web.snapchat.com](https://web.snapchat.com), so you can go through your
friends list one at a time and swipe **left to remove** / **right to keep**.

## Why a userscript

Snapchat Web blocks being framed and its DOM can't be reached from a
different origin, so this can't be a hosted page — it has to run *inside*
the Snapchat Web page itself, which is what a Tampermonkey/Greasemonkey
userscript does.

## Install

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension.
2. Open Tampermonkey's dashboard → "Create a new script".
3. Delete the placeholder content and paste in the contents of
   [`friend-swiper.user.js`](./friend-swiper.user.js).
4. Save. Visit `https://web.snapchat.com` — a small ⬇ button appears in the
   bottom-right corner.

## First-time setup (calibration)

Snapchat doesn't publish its DOM structure and its class names look
auto-generated, so the script can't ship with working selectors out of the
box. Instead, the first time you click the launcher button it walks you
through a short calibration:

1. Click on any one friend's row in your chat/friends list.
2. Click that friend's name text.
3. Optionally click their avatar image.
4. Click whatever control you'd normally use to start removing a friend
   (a "…" menu, a trash icon, etc).
5. Type the exact text of the "remove friend" menu item, if there is one
   (open it manually to check, then close it *without* clicking it).
6. Type the exact text of the confirm button, if removing shows a
   confirmation dialog.

**Steps 1–4 are safe to click for real** — the script intercepts those
clicks (`preventDefault`/`stopPropagation`) before they reach Snapchat, so
nothing actually happens on your account during calibration. Steps 5–6 ask
you to type text rather than click, specifically so calibration can never
trigger a real removal.

Calibration is saved in `localStorage` for `web.snapchat.com`, so you only
need to redo it if Snapchat changes its UI (recalibrate from the launcher's
confirm dialog: choose "Cancel" to redo setup).

## Using it

- Click the ⬇ launcher button.
- You'll be asked whether to run for real or in **dry run** (recommended
  first pass) — dry run logs what it *would* do without clicking anything
  real.
- Swipe cards left/right with your mouse or touch, or use the ✕ / ✓ buttons,
  or the arrow keys.
- Removing is rate-limited (1.5–3s between actual removals) and capped at
  50 removals per session by default — you'll be asked before it goes
  further.

## Safety design notes

- **Every friend is re-verified by name immediately before the remove click
  fires.** Long friend lists in web apps are usually virtualized (DOM rows
  get recycled for different people as you scroll), so caching a DOM
  reference from earlier and clicking it later risks removing the wrong
  person. This script always re-queries the live list by name right before
  acting, and skips (with a log entry) rather than guessing if the name on
  screen doesn't match or if two friends share a name.
- **Undo only affects the local swipe queue**, not Snapchat — there's no
  way to undo an actual friend removal from here.
- **This automates clicks you could otherwise make by hand** rather than
  calling any private Snapchat API. It still counts as automating
  interactions with Snapchat's site, which may be outside what Snapchat's
  Terms of Service intend — use it on your own account, at your own
  discretion and risk.

## Known limitations

- If Snapchat changes its UI, selectors derived during calibration will
  stop matching — recalibrate.
- Very long friend lists rely on auto-scrolling to load every row; if
  Snapchat lazy-loads on a delay longer than a few hundred ms, increase the
  scroll pause in `scrollToLoadAllRows` (`await sleep(250)`).
- Two friends with the exact same display name are treated as ambiguous
  and skipped rather than guessed at.
