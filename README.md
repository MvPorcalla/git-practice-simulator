# Git Practice Simulator

A beginner-friendly, hands-on project designed to help you **practice essential Git and GitHub commands** using the command line. This website serves as a safe and visual playground where you can simulate real-world workflows like pushing, pulling, branching, and merging — perfect for beginners who want to build confidence using Git.

---

## 📚 Why I Made This Project

I created this project to provide a safe, interactive space for beginners and developers to practice Git commands without the risk of breaking real repositories. Sometimes it’s scary to mess around with real projects, so I wanted to build a fun, low-pressure environment where you can try things out, make mistakes, and get more comfortable using Git. The goal is to help users build confidence and fluency with Git in a simple, simulated setup.

---

## 📚 Project Purpose

This project is created to:

* Practice creating GitHub repositories using the command line.
* Simulate real Git workflows like saving, pushing, pulling, and fetching changes.
* Safely explore Git commands without worrying about breaking anything.
* Visualize your progress by working on actual website files.

---

## 🚀 Git Commands to Practice

* `git init`
* `git clone`
* `git status`
* `git add`
* `git commit`
* `git push`
* `git pull`
* `git fetch`
* `git branch`
* `git checkout`
* `git merge`

---

## 🛠️ Project Structure

```text
/git-practice-simulator
│
├── /assets
│   ├── css
│   ├── images
│   │   └── favicon_io
│   └── js
│ 
├── aboutme.html
├── index.html
├── LICENSE
├── playground.html
└── README.md
```

---

Here’s your improved **Layout Guidelines** with the addition of your custom `utilities.css` usage:

---

## 📐 Layout Guidelines

- 🔹 **Use Bootstrap for Structure**
    - Utilize Bootstrap for all layout and spacing tasks, including padding, margins, containers, rows, and columns.

- 🔹 **Use `main.css` for Styling**
    - Manage typography, colors, font sizes, font families, font weights, text colors, and background colors using `main.css` file.

- 🔹 **Use `utilities.css` for Reusable Classes**
    - You can use the provided `utilities.css` for quick access to custom helper classes for fonts, text sizes, colors, spacing, and more. This file is your go-to for consistent styling outside of Bootstrap.

- 🔹 **Avoid Inline Styles**
    - Keep the codebase clean and maintainable by avoiding inline styles. Always use Bootstrap classes, your custom `utilities.css`, or the main stylesheet for all styling.

---

## 🎯 CSS Usage Guide

### 📐 Layout Guidelines

* **Bootstrap** handles all layout and structure:

  * Containers, rows, columns, padding, margins, and grid systems.
* **`utilities.css`** handles reusable custom utilities:

  * Typography (font sizes, font weights, font families)
  * Text and background colors
  * Custom spacing helpers
* **`main.css`** is for:

  * Page-specific styles
  * Custom components
  * Hover effects and animations
* ❌ **Avoid inline styles** for sizing, colors, or positioning.

---

### 📦 CSS Decision Table

| Purpose                        | Use Bootstrap                              | Use `utilities.css`                          | Use `main.css`                        |
| ------------------------------ | ------------------------------------------ | -------------------------------------------- | ------------------------------------- |
| **Layout / Structure**         | ✅ Containers, rows, columns, grids         | ✅ Custom spacing if needed                   | ❌ Not recommended for layout          |
| **Spacing (Padding/Margins)**  | ✅ Bootstrap spacing classes (`p-3`, `m-4`) | ✅ Custom sizes if not available in Bootstrap | ❌ Avoid                               |
| **Typography (Fonts, Sizes)**  | ❌                                          | ✅ Reusable text styles                       | ✅ Page/component-specific text styles |
| **Colors (Text, Background)**  | ❌                                          | ✅ Custom color utilities                     | ✅ Unique colors per page/section      |
| **Buttons / Components**       | ✅ Base buttons                             | ✅ Extra utility classes                      | ✅ Fully customized buttons            |
| **Hover Effects / Animations** | ❌                                          | ❌                                            | ✅ Best placed in `main.css`           |
| **Global Adjustments**         | ❌                                          | ✅ Reusable adjustments                       | ✅ One-off adjustments                 |
| **Quick Utility Classes**      | ❌                                          | ✅ Primary purpose of this file               | ❌                                     |
| **Inline Styles**              | ❌ Avoid                                    | ❌ Avoid                                      | ❌ Avoid                               |

### Note:
> *"Heads up! Some parts of the project don’t perfectly follow these CSS rules yet — I’m still working on cleaning things up and getting everything consistent. I’ll get there in future updates. 😉"*
---

## ✅ How to Use

1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/git-practice-simulator.git
```

2. **Make Local Changes**
   Add, edit, or delete files to simulate project updates.

3. **Practice Git Commands**
   Try adding, committing, pushing, pulling, branching, and merging.

4. **Repeat**
   Create new branches and simulate pull requests to improve your skills.

---

Here’s a casual and welcoming **"Open for Contributors"** section you can add to your README:

---

## Open for Contributors

This project is open for collaboration! 🎉
If you have ideas to improve the simulator, find bugs, or just want to practice contributing to open source, feel free to jump in. Whether you're fixing small issues or adding new features, all contributions are welcome.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

If you have suggestions, feel free to open an issue as well!
Let’s build and improve this project together!

---

## 📄 License

This project is licensed under the **MIT License** – feel free to use and modify for learning purposes.

---