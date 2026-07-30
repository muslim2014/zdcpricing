import {
  getHomeCards,
  createHomeCard,
  updateHomeCard,
  deleteHomeCard
} from "../../api/homeCardsApi";

export async function HomeCardsManager() {

  const cards = await getHomeCards();

  return `
    <div class="container">

      <div class="top-bar">

        <button
          id="backToDashboard"
          class="back-btn"
        >
          ←
        </button>

        <h2>إدارة الصفحة الرئيسية</h2>

      </div>

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

              <button
                class="glass-button move-home-up"
                data-id="${card.id}"
              >
                ⬆️
              </button>

              <button
                class="glass-button move-home-down"
                data-id="${card.id}"
              >
                ⬇️
              </button>

              <button
                class="glass-button toggle-home-visible"
                data-id="${card.id}"
                data-visible="${card.visible}"
              >
                ${card.visible ? "👁️" : "🚫"}
              </button>

              <button
                class="glass-button toggle-home-featured"
                data-id="${card.id}"
                data-featured="${card.featured}"
              >
                ${card.featured ? "⭐" : "☆"}
              </button>

              <button
                class="glass-button save-home-card"
                data-id="${card.id}"
              >
                💾
              </button>

              <button
                class="glass-button delete-home-card"
                data-id="${card.id}"
              >
                🗑️
              </button>

            </div>

          </div>

        `).join("")}

        <button
          id="addHomeCardBtn"
          class="glass-button"
          style="margin-top:20px"
        >
          ➕ إضافة كارت
        </button>

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