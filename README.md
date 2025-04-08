# NextJS DiasyUI Boilerplate
A simple boilerplate based off `create-next-app` with TailwindCSS and DaisyUI for styled components and utility classes.
Nothing fancy, just a little code to make set up faster.

## Installation
Follow these steps to get started:

1. Clone the repository:
    ```bash
    git clone https://github.com/jean-brg/nextjs-daisyui-boilerplate.git
    ```
    
    Renaming the cloned project is also an option
    ```bash
    git clone https://github.com/jean-brg/nextjs-daisyui-boilerplate.git <new-project-name>
    ```

2. Navigate into the project directory:
    ```bash
    cd <project-directory>
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

The app should now be running at `http://localhost:3000`.

## Make It Your Own
Follow these steps to use this boilerplate to make your own project:

1. Rename project directory if not already done
    ```bash
    mv nextjs-daisyui-boilerplate my-new-project
    ```

2. Rename project in `package.json` and `package-lock.json`
    ```json
    {
        "name": "my-new-project-name",  // Update this to the new project name
        // ...
    }
    ```

3. Regenerate `package-lock.json` and dependencies
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    ```

4. Reinitialize Git
    ```bash
    rm -rf .git
    git init
    ```

All of these steps are optional.

## Usage
This boilerplate comes pre-configured with:
- **Tailwind CSS**: A utility-first CSS framework.
- **DaisyUI**: A set of pre-designed components built on top of Tailwind.

## Attributions
This project is built on top of the following open-source projects:
- **Main Boilerplate**: [create-next-app by Vercel](https://nextjs.org/docs/app/api-reference/cli/create-next-app)
- **Styling and Utility Classes**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [DaisyUI](https://daisyui.com)

Full credits go to the creators of these projects.