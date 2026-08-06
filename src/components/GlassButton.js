export function GlassButton(
  content,
  {
    id = "",
    className = "",
    type = "",
    data = {},
    onclick = "",
    style = "",
    title = ""
  } = {}
) {

  const attrs = [];

  if (id) attrs.push(`id="${id}"`);

  attrs.push(
    `class="glass-button${className ? ` ${className}` : ""}"`
  );

  if (type) attrs.push(`type="${type}"`);

  Object.entries(data).forEach(([key, value]) => {
    attrs.push(`data-${key}="${value}"`);
  });

  if (onclick) attrs.push(`onclick="${onclick}"`);

  if (style) attrs.push(`style="${style}"`);

  if (title) attrs.push(`title="${title}"`);

  return `
    <button ${attrs.join(" ")}>
      ${content}
    </button>
  `;

}
