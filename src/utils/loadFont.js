export function loadFont(font) {

  if (!font?.file_url) return;

  const id = "dynamic-font";

  document
    .getElementById(id)
    ?.remove();

  const style =
    document.createElement("style");

  style.id = id;

  style.textContent = `

@font-face{

font-family:'CustomFont';

src:url('${font.file_url}');

}

:root{

--app-font:'CustomFont',sans-serif;

}

body,
button,
input,
textarea,
select{

font-family:var(--app-font);

}

`;

  document.head.appendChild(style);

}