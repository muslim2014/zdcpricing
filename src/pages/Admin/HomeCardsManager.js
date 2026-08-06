import {
  getHomeCards,
  createHomeCard,
  updateHomeCard,
  deleteHomeCard
} from "../../api/homeCardsApi";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function HomeCardsManager() {

  const cards = await getHomeCards();

  return `
    <div class="container">

      ${TopBar("إدارة الصفحة الرئيسية")}

      <div class="glass-card">

        ${cards.map(card => `

          <div class="admin-list-item">

            <div style="flex:1">

              <input
                class="glass-input home-card-title"
                data-id="${card.id}"
                value="${card.title}"
                placeholder="العنوان"
              >

              <textarea
                class="glass-input home-card-description"
                data-id="${card.id}"
                rows="3"
                style="margin-top:10px"
                placeholder="الوصف"
              >${card.description || ""}</textarea>

            </div>

            <div
              style="
                display:flex;
                gap:8px;
                flex-wrap:wrap;
                justify-content:flex-end;
              "
            >

              ${GlassButton("⬆️", {
                className: "move-home-up",
                data: { id: card.id }
              })}

              ${GlassButton("⬇️", {
                className: "move-home-down",
                data: { id: card.id }
              })}

              ${GlassButton(card.visible ? "👁️" : "🚫", {
                className: "toggle-home-visible",
                data: {
                  id: card.id,
                  visible: card.visible
                }
              })}

              ${GlassButton(card.featured ? "⭐" : "☆", {
                className: "toggle-home-featured",
                data: {
                  id: card.id,
                  featured: card.featured
                }
              })}

              ${GlassButton("💾", {
                className: "save-home-card",
                data: { id: card.id }
              })}

              ${GlassButton("🗑️", {
                className: "delete-home-card",
                data: { id: card.id }
              })}

            </div>

          </div>

        `).join("")}

        ${GlassButton("➕ إضافة كارت", {
          id: "addHomeCardBtn",
          style: "margin-top:20px"
        })}

      </div>

    </div>
  `;
}

/* ========================= */

export async function addHomeCard() {

  const cards = await getHomeCards();

  await createHomeCard({

    title: "كارت جديد",

    description: "",

    image: "",

    page: "pricing",

    visible: true,

    featured: false,

    sort_order: cards.length + 1

  });

}

/* ========================= */

export async function saveHomeCard(id) {

  const title = document.querySelector(
    `.home-card-title[data-id="${id}"]`
  ).value.trim();

  const description = document.querySelector(
    `.home-card-description[data-id="${id}"]`
  ).value.trim();

  await updateHomeCard(id, {

    title,

    description

  });

}

/* ========================= */

export async function removeHomeCard(id) {

  await deleteHomeCard(id);

}