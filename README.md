# A Little Trust

## Play online

[Play A Little Trust](https://clairesuyuw.github.io/a-little-trust/)

## Original idea

I wanted to create a small game for people who enjoy cats and gentle, cozy interactions. When someone correctly chooses the item Miso asks for, the experience should increase her trust; after enough correct choices, Miso should feel safe and nuzzle the player.

## How to play

Open `dist/index.html` in a web browser. Read Miso's request and choose one of the three items. A correct answer adds 20 trust points, while a wrong answer removes 10. Reach 100 trust points to earn Miso's friendship. If trust falls to zero, Miso becomes angry, leaves, and the game ends.

## AI tool and selected prompts

I used Codex to help plan, build, and test the browser game.

Selected prompt:

> The kitten will make requests. For example, if the kitten wants fish, the player must choose fish instead of watermelon or another item. Correct choices increase affection, and wrong choices decrease it. After affection reaches a certain value, the kitten trusts the player and nuzzles them. Build this game, and make all visible text and effects English.

An important design decision was to use short clue-like requests instead of directly naming the correct item. This makes each choice feel like a small puzzle. I also decided that correct answers add 20 points and wrong answers remove 10, so mistakes matter without making the game frustrating.

## Reflection

The finished interaction matches my original intention: Miso asks for something, the player chooses among three objects, and the trust meter clearly responds to the decision. I tested both correct and incorrect choices. Correct answers highlight the requested object, show a happy response, and add 20 trust points. Incorrect answers identify the object Miso actually wanted and remove 10 points without allowing the score to fall below zero. If the meter reaches zero, Miso gets upset, leaves the scene, and the game stops until the player chooses to try again. I also changed the choices so their positions are shuffled each round; this keeps the player from succeeding by memorizing a button position.

AI helped turn the idea into working HTML, CSS, and JavaScript and suggested useful states such as visible feedback, a progress meter, sound control, and a replay button. I still had to decide the tone, scoring, clue difficulty, and what “trust” should look like at the end. The final nuzzling animation communicates the emotional goal well. One uncertainty is whether all players will understand every clue immediately. If I revised the game again, I would test it with several people and simplify any clue that causes repeated confusion.
