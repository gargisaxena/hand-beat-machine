# Rockabye Hand Game

Build a complete, fully functional web game called ROCKABYE.

ROCKABYE is a webcam-controlled Rock Paper Scissors game where the player uses real hand gestures to play against a computer opponent.

TAGLINE:
"Can your hands beat the machine?"

TECHNOLOGY:

React

TypeScript

Tailwind CSS

Browser webcam using getUserMedia

Browser-based hand tracking/computer vision

Prefer MediaPipe Hands or another reliable browser-compatible hand landmark solution

No backend or database required

Keep dependencies minimal

CORE GAME:

✊ = ROCK
✋ = PAPER
✌️ = SCISSORS

Gesture recognition:

Closed fist = Rock

Open palm = Paper

Two extended fingers = Scissors

The computer randomly chooses Rock, Paper, or Scissors.

GAME FLOW:

HOME
→ PLAY
→ Request camera permission
→ Camera preview
→ READY?
→ 3
→ 2
→ 1
→ SHOW!
→ Detect player's hand
→ Computer chooses
→ Reveal both moves
→ Determine result
→ Update score
→ Update streak
→ NEXT ROUND or QUIT
→ RESULTS

SCORING:

Win = +10

Draw = +3

Loss = +0

STREAK:

Consecutive wins increase streak

Loss resets streak to 0

Draw leaves streak unchanged

Track best streak

HOME SCREEN:

Display:

ROCKABYE

"Can your hands beat the machine?"

[ START GAME ]

✊ ✋ ✌️

HOW TO PLAY

BEST SCORE

Make the home screen feel like the title screen of a futuristic arcade game.

GAME SCREEN:

Create a real game arena rather than a dashboard.

Display:

ROCKABYE

PLAYER 01

SCORE

STREAK

ROUND

Main gameplay:

YOU
[WEBCAM]

VS

THE MACHINE
[COMPUTER MOVE]

During the round display:

CAMERA READY
or
SHOW YOUR HAND

Countdown:

READY?
3
2
1
SHOW!

After the round:

YOU THE MACHINE
✋ VS ✊

Then show:

YOU WIN
or
THE MACHINE WINS
or
STALEMATE

Show points earned.

Buttons:
NEXT ROUND
QUIT

CAMERA:

The webcam must actually work.

Requirements:

Request camera permission using getUserMedia

Display the live camera feed

Run continuous hand landmark detection

Recognize Rock, Paper and Scissors

Stabilize detection so the result does not flicker rapidly

Show a useful message when no hand is detected

Gracefully handle camera permission denial

Prevent duplicate camera streams

Stop the camera when leaving the game

Clean up animation loops and camera resources

Do NOT fake gesture recognition with buttons.

Do NOT use manually selected Rock/Paper/Scissors controls as a replacement for webcam detection.

COMPUTER:

The computer randomly selects one of the three moves.

Keep the computer move hidden until the reveal.

RESULTS SCREEN:

Create a futuristic arcade-style results screen.

Display:

GAME OVER
or
RUN COMPLETE

FINAL SCORE

WINS
LOSSES
DRAWS

BEST STREAK

[ PLAY AGAIN ]
[ HOME ]

HOW TO PLAY MODAL:

Explain:

✊ ROCK
✋ PAPER
✌️ SCISSORS

Rock beats Scissors.
Scissors beats Paper.
Paper beats Rock.

Tell the player to show their hand clearly to the camera during SHOW.

CYBERPUNK INDIE ARCADE DESIGN:

The visual design should feel like a premium futuristic arcade game.

Use:

Near-black / deep charcoal background

Electric purple

Magenta

Cyan

Deep blue

White text

Use neon accents carefully rather than making everything glow.

IMPORTANT:
Do NOT make the entire interface neon.
Do NOT make it look like an RGB gaming keyboard.
Do NOT make it cluttered.
Do NOT make it childish.
Do NOT make it overly feminine or masculine.

Use:

Futuristic HUD panels

Thin glowing borders

Subtle grid patterns

Subtle scanlines

Small digital interface labels

Controlled glow

Slight glitch effects

Dark surfaces

High contrast typography

Clean spacing

ARCADE LABELS:

Use details such as:

SYSTEM ONLINE
PLAYER 01
CAMERA READY
ROUND 01
SCORE
STREAK
AI PROCESSING
MOVE LOCKED
SIGNAL DETECTED
GAME OVER
RUN COMPLETE

TYPOGRAPHY:

Use a distinctive futuristic/arcade display font for:

ROCKABYE

Countdown

WIN/LOSS

Major game states

Use a clean readable sans-serif for supporting text.

ANIMATIONS:

Add polished animations for:

Page transitions

Countdown

Hand gesture detection

Gesture reveal

Score changes

Streak changes

Buttons

Win state

Loss state

Use subtle glitch/scan animations where appropriate.

STREAK MILESTONES:

At 3 consecutive wins:
"ON A ROLL"

At 5 consecutive wins:
"ON FIRE"

Make these visually exciting with tasteful cyberpunk effects.

RESPONSIVE DESIGN:

Make the entire game work well on:

Desktop

Tablet

Mobile

ACCESSIBILITY:

Use readable contrast, keyboard-accessible controls, visible focus states and do not rely only on color for results.

CODE QUALITY:

Use reusable React components

Separate game logic from UI where practical

Avoid unnecessary dependencies

No TypeScript errors

No runtime errors

No console errors

Proper webcam cleanup

DO NOT ADD:

Authentication

Profiles

Payments

Multiplayer

Chat

Database

Complex leaderboards

Unnecessary game modes

Build the complete functional ROCKABYE MVP now.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0539fb4a-246f-47d7-a575-ec2a4d028cfe).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
