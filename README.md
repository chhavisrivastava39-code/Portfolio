# Chhavi Srivastava - Portfolio Website

A static personal portfolio built with plain **HTML5, CSS3 and vanilla JavaScript**.
No frameworks, no backend, no database, no build step. It works by opening `index.html`
and deploys to Vercel with zero configuration.

---

## 1. Project structure

```
portfolio/
├── index.html      # All page content (sections, text, links)
├── style.css       # All styling (dark + light themes, responsive layout)
├── script.js       # Theme toggle, mobile menu, scroll effects, contact form
├── README.md       # This file
└── assets/
    ├── chhavi.jpeg                 # Your profile photo (included)
    └── Chhavi-Srivastava-CV.pdf    # YOU ADD THIS FILE (not included)
```

Page order (top to bottom): Navigation, Home, About Me, Skills, Education,
Experience, Projects, Let's Connect, Footer.

---

## 2. Run locally

No installation needed.

1. Keep all files together exactly as shown above.
2. Double-click `index.html` (or right-click, Open with, your browser).

Optional: if you use VS Code, the "Live Server" extension gives you auto-refresh while you edit.

> The Inter and Caveat fonts load from Google Fonts. If you are offline the site
> automatically falls back to your system fonts, so nothing breaks.

---

## 3. Create a GitHub repository

1. Sign in at <https://github.com>.
2. Click **+** (top right), then **New repository**.
3. Repository name: for example `portfolio`.
4. Choose **Public** (or Private, Vercel works with both).
5. Do **not** tick "Add a README" (you already have one).
6. Click **Create repository**.

---

## 4. Upload / push the project to GitHub

### Option A: browser upload (no Git needed)

1. Open your new empty repository.
2. Click **uploading an existing file**.
3. Drag in `index.html`, `style.css`, `script.js`, `README.md` **and the `assets` folder**.
4. Click **Commit changes**.

Make sure `assets/chhavi.jpeg` appears inside an `assets` folder in the repository.

### Option B: Git command line

Run these inside the `portfolio` folder:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/portfolio.git
git push -u origin main
```

---

## 5. Connect the repository to Vercel

1. Go to <https://vercel.com> and sign up / log in with **Continue with GitHub**.
2. Click **Add New...**, then **Project**.
3. Find your `portfolio` repository and click **Import**
   (if it is not listed, click "Adjust GitHub App Permissions" and allow access).

## 6. Deploy it

On the import screen leave everything at its default:

- **Framework Preset:** Other
- **Build Command:** leave empty
- **Output Directory:** leave empty
- **Install Command:** leave empty

Click **Deploy**. After a few seconds Vercel gives you a live link like
`https://portfolio-yourname.vercel.app`. You can add your own domain later under
Project Settings, then Domains.

## 7. Update the live website after changes

Every time you change files and push them to GitHub, Vercel redeploys automatically.

- **Browser upload:** open the file on GitHub, click the pencil icon, edit, and
  **Commit changes**. To replace an image or the CV, use **Add file, Upload files**
  in the `assets` folder.
- **Git:**

  ```bash
  git add .
  git commit -m "Update portfolio"
  git push
  ```

Refresh your Vercel link after about a minute.

---

## 8. Where to place the profile photo

The photo is already at `assets/chhavi.jpeg` and is used in the hero section
(`index.html`, search for `assets/chhavi.jpeg`).

To replace it, save your new photo with the **same name** `chhavi.jpeg` inside
`assets/`. A square or portrait photo with your face near the upper-middle works best.
The crop is controlled by `object-position` in `style.css` (`.photo-blob img`).

File names on Vercel are case-sensitive: use exactly `chhavi.jpeg`, all lowercase.

## 9. Where to place the actual CV

Add your PDF here, with exactly this name:

```
assets/Chhavi-Srivastava-CV.pdf
```

The **Download CV** button (in the navigation bar and mobile menu) already points to it.
**Until you add the file, the button will show a "file not found" error.** That is
expected because no CV was created for you. If you prefer a different file name,
search `index.html` for `Chhavi-Srivastava-CV.pdf` (it appears twice) and change both.

## 10. Where to update project details

Open `index.html` and search for `PROJECTS`. There are three cards, each starting with
`<!-- PROJECT CARD ... -->`. For each card:

| What | How |
| --- | --- |
| Title | Replace `Project Title (Placeholder)` |
| Description | Replace the paragraph text |
| Technologies | Edit the `<li>` items inside `<ul class="tags">` |
| View Project link | Replace `href="#"` on the first button with your live URL, and delete `data-placeholder` |
| View Code link | Replace `href="#"` on the second button with your GitHub repo URL, and delete `data-placeholder` |
| Placeholder badge | Delete the `<span class="badge">Placeholder</span>` line |

To open a link in a new tab add `target="_blank" rel="noopener noreferrer"`.
To add a project, copy one whole `<article class="card project-card reveal">...</article>` block.
Also update or delete the small note under the "Projects" heading (`class="section-note"`).

## 11. Where to update the B.Sc. passing year

In `index.html`, search for `[PLACEHOLDER]`. Replace it, for example:

```html
<span class="pill">Passing Year: 2024</span>
```

(Use your real year.)

## 12. Where to update contact information

| Item | Where to change it |
| --- | --- |
| **Email** | `index.html`: the Email contact card (`mailto:` link and visible text). **Also** `script.js`: the `CONTACT_EMAIL` line at the top. The contact form uses that value. |
| **LinkedIn** | `index.html`: search `linkedin.com/in/`. It appears in the hero icons, the contact card and the footer. Update all of them. |
| **GitHub** | `index.html`: search `https://github.com/`. It currently points to the GitHub home page as a placeholder. Replace it with `https://github.com/<your-username>` in the hero icons, the contact card and the footer. |

Also worth completing later: the **Experience** card (`index.html`, search `InAmigos Foundation`)
only states your role. Add dates, responsibilities or technologies once you are ready to share them.

---

## How the contact form works

There is no server. When someone presses **Send Message**, `script.js` opens a Gmail
compose window in a new tab with:

- **To:** `chhavisrivastava39@gmail.com`
- **Subject:** `Portfolio Contact - <Name>`
- **Body:** the visitor's name, email and message

If the browser blocks the new tab, it falls back to a `mailto:` link that opens the
visitor's default email app. A "use your default email app" link is also shown after
sending. The visitor still has to press Send in their email window.

## Theme

Dark mode is the default. The sun/moon button in the navigation bar switches themes
and remembers the choice in the browser (`localStorage`, key `theme`).
