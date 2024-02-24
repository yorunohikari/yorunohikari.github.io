---

## Japanese Prefecture Flag Quiz

### Introduction:
This JavaScript code implements a quiz game focused on Japanese prefectures and their flags. It allows users to select the number of prefectures for the quiz, displays flags, and prompts users to identify the corresponding prefecture. After the quiz, it provides users with their results, including the number of correct and wrong answers.

### Functionality:

1. **Initialization:**
   - Variables `numCorrectAnswers` and `numWrongAnswers` are initialized to keep track of the number of correct and wrong answers, respectively.
   - Modal and button elements are selected from the DOM for interaction.

2. **Modal Interaction:**
   - Clicking the help button (`helpBtn`) opens the help modal.
   - Clicking the close button (`closeBtn`) closes the help modal.
   - Clicking anywhere outside the modal also closes it.

3. **Quiz Initialization:**
   - When the play button (`playBtn`) is clicked, the quiz starts.
   - The selected number of prefectures is retrieved from the slider.
   - Data about prefectures and flags is fetched (from a hypothetical `flags.json` file).
   - The quiz starts with the selected number of prefectures.

4. **Quiz End:**
   - After answering all questions, the quiz ends, and the results are displayed.
   - The number of correct and wrong answers is shown.
   - If there are wrong answers, they are displayed with the corresponding prefecture names and flags.

5. **Resetting the Quiz:**
   - Clicking the "Play Again" button resets the quiz, allowing users to play again.

6. **Prefecture Count Slider:**
   - The slider allows users to select the number of prefectures for the quiz.
   - The current slider value is displayed dynamically.

### Usage:
To use this code:
1. Include it in your HTML file.
2. Ensure that the necessary HTML elements (`help-modal`, `help-btn`, `close`, `play-btn`, etc.) are present in the DOM.
3. Ensure that the `flags.json` file (or the data source) contains information about Japanese prefectures and their corresponding flags.

### Note:
- This code assumes the existence of a JSON file (`flags.json`) containing data about prefectures and flags. You may need to adjust the data source accordingly.
- The code contains comments for clarity and documentation.

---

**Demo Link:** [Japanese Prefecture Flag Quiz Demo](https://yorunohikari.github.io)

---
