export const THEME_KEY = "eco:theme";

/** Runs before paint so the page never flashes the wrong theme. */
export const themeBootScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})();`;
