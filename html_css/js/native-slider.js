class NativeSlider {
  #selector;
  #renderFunc;
  #makeActiveFunc;

  setData = () => {};

  constructor({ parentClassName, renderSlidesHtml, makeActive }) {
    this.#selector = parentClassName;
    this.#renderFunc = renderSlidesHtml;
    this.#makeActiveFunc = makeActive;
    this.initSlider();
  }

  initSlider() {
    const parentSelector = document.getElementById(this.#selector);
    parentSelector.append(...this.#renderFunc());
    this.#makeActiveFunc();
  }
}

function makeActiveNative() {
  const sliderNative = document.getElementById("native-slider");
  const sliderContainer = document.querySelector(".study__list-container");
  const buttonPrev = document.querySelector(".study__slide-prev");
  const buttonNext = document.querySelector(".study__slide-next");
  const ulList = document.querySelector(".study__list");

  window.addEventListener("resize", adaptive);
  sliderNative.addEventListener("click", (event) => {
    if (event.target.classList.contains("study__slide-prev")) {
      prev();
    } else if (event.target.classList.contains("study__slide-next")) {
      next();
    }
  });

  let slidesToShow;
  let position = 0;
  const SLIDES_TO_SCROLL = 1;
  const arrItems = document.querySelectorAll(".study__item");
  const itemsCount = arrItems.length;

  function adaptive() {
    if (sliderContainer.clientWidth === 217) {
      return (slidesToShow = 1);
    } else if (sliderContainer.clientWidth === 651) {
      return (slidesToShow = 3);
    } else if (sliderContainer.clientWidth === 868) {
      return (slidesToShow = 4);
    }
  }

  adaptive();

  const itemWidth = sliderContainer.clientWidth / slidesToShow;
  const movePosition = SLIDES_TO_SCROLL * itemWidth;

  arrItems.forEach((el) => {
    el.style.minWidth = `calc(${itemWidth}px - 20px)`;
  });

  function setPosition() {
    ulList.style.transform = `translateX(${position}px)`;
  }
  function checkButtons() {
    buttonPrev.disabled = position === 0;
    buttonNext.disabled = position <= -(itemsCount - slidesToShow) * itemWidth;
  }

  function prev() {
    const restItems = Math.abs(position) / itemWidth;
    position +=
      restItems >= SLIDES_TO_SCROLL ? movePosition : restItems * itemWidth;

    setPosition();
    checkButtons();
  }

  function next() {
    const restItems =
      itemsCount - (Math.abs(position) + slidesToShow * itemWidth) / itemWidth;
    position -=
      restItems >= SLIDES_TO_SCROLL ? movePosition : restItems * itemWidth;
    setPosition();
    checkButtons();
  }

  checkButtons();
}

function renderSlides() {
  const sliderContainer = document.createElement("div");
  const ulList = document.createElement("ul");
  const buttonPrev = document.createElement("button");
  const buttonNext = document.createElement("button");

  sliderContainer.classList.add("study__list-container");
  sliderContainer.append(ulList);
  ulList.classList.add("study__list");
  buttonPrev.classList.add("study__slide-prev", "slider__btn");
  buttonNext.classList.add("study__slide-next", "slider__btn");

  for (let i = 0; i < 6; i++) {
    const liItem = document.createElement("li");
    const imageBg = document.createElement("img");
    const title = document.createElement("h3");

    liItem.classList.add("study__item");
    imageBg.classList.add("study__item-img");
    imageBg.style.height = "197px";
    imageBg.style.minWidth = "197px";
    title.classList.add("study__item-text");

    liItem.append(imageBg, title);
    ulList.append(liItem);
  }
  return [buttonPrev, sliderContainer, buttonNext];
}

function setNativeData(data) {
  if (!data) {
    throw new Error("No data for slider provided");
  }
  const arrTitles = document.querySelectorAll(".study__item-text");
  const arrImages = document.querySelectorAll(".study__item-img");
  const arrItems = document.querySelectorAll(".study__item");
  data.forEach((el, i) => {
    arrTitles[i].innerText = el.title;
    arrImages[i].src = el.imageUrl;
    arrItems[i].style.backgroundColor = el.bgColor;
  });
}

export { NativeSlider, renderSlides, setNativeData, makeActiveNative };