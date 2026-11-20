const slides = [...document.querySelectorAll(".slide")];
const slideCount = document.querySelector(".slide-count");
let activeSlide = 0;

document.querySelectorAll("[data-step]").forEach((button) => {
  button.addEventListener("click", () => {
    slides[activeSlide].hidden = true;
    activeSlide = (activeSlide + Number(button.dataset.step) + slides.length) % slides.length;
    slides[activeSlide].hidden = false;
    slideCount.textContent = [activeSlide + 1, slides.length]
      .map((number) => String(number).padStart(2, "0"))
      .join(" / ");
  });
});

const dialog = document.querySelector(".search-dialog");
const query = dialog.querySelector("input");
const status = dialog.querySelector(".search-status");
const results = dialog.querySelector(".search-results");
const products = [...document.querySelectorAll(".product")].map((product) => ({
  href: product.querySelector(".product-link")?.getAttribute("href") ?? `#${product.id}`,
  name: product.querySelector("h3").textContent,
}));
const normalize = (text) => text.normalize("NFC").replace(/\s+/g, "").toLowerCase();

function updateResults() {
  const term = normalize(query.value);
  const matches = products.filter(({ name }) => normalize(name).includes(term));

  status.textContent = matches.length ? `${matches.length}개 제품` : "검색 결과가 없습니다.";
  results.replaceChildren(...matches.map(({ href, name }) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = href;
    link.textContent = name;
    item.append(link);
    return item;
  }));
}

query.addEventListener("input", updateResults);
results.addEventListener("click", (event) => {
  if (event.target.closest("a")) dialog.close();
});

document.querySelectorAll(".search-trigger, [data-search]").forEach((button) => {
  button.addEventListener("click", () => {
    query.value = "";
    updateResults();
    dialog.showModal();
  });
});
