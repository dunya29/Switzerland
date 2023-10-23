const header = document.querySelector(".header")
const menu = document.querySelector('.header__body');
const iconMenu = document.querySelector('.icon-menu');
const section = document.querySelectorAll("section")
const fixedBlocks = document.querySelectorAll(".fixed-block")
const modalShowBtn = document.querySelectorAll(".modal-show-btn")
const modal = document.querySelectorAll(".modal")
const fixedBtn = document.querySelector(".fixed-btn")
const headerBtn = document.querySelector(".header__btn")
const successModal = document.querySelector(".success-modal")
const errorModal = document.querySelector(".error-modal")
const filter = document.querySelector(".filter-form")
const filterCheckbox = document.querySelector(".filter-form__checkbox")
const priceSlider = document.querySelector('.price-slider');
const floorSlider = document.querySelector('.floor-slider');
const filterReset = document.querySelector(".filter-form__reset")
const catalogCat = document.querySelector(".catalog-cat")
const schemePopup = document.querySelector(".scheme-popup")
let paddingValue = window.innerWidth > 325 ? window.innerWidth - document.documentElement.clientWidth + 'px' : 0
let modalAnimSpd = 500
function windoOnResize() {
  paddingValue = window.innerWidth > 325 ? window.innerWidth - document.documentElement.clientWidth + 'px' : 0
}
window.addEventListener("resize", windoOnResize)
window.addEventListener('orientationchange', windoOnResize);
//resetbtn visible
function resetBtnShow() {
  document.querySelector(".filter-form__reset").classList.add("show")
}

//init range slider
function initSliders() {
  let rangeSliders = filter.querySelectorAll(".range")
  rangeSliders.forEach(item => {
    let rangeStart = item.querySelector(".range-start")
    let rangeEnd = item.querySelector(".range-end")
    let rangeSlider = item.querySelector(".range__slider")
    let start = +item.getAttribute("data-start")
    let end = +item.getAttribute("data-end")
    let min = +item.getAttribute("data-min")
    let max = +item.getAttribute("data-max")
    noUiSlider.create(rangeSlider, {
      start: [start, end],
      connect: true,
      range: {
        'min': min,
        'max': max
      }
    });
    rangeStart.addEventListener("change", () => {
      rangeSlider.noUiSlider.set([rangeStart.value, null])
    });
    rangeEnd.addEventListener("change", () => {
      rangeSlider.noUiSlider.set([null, rangeEnd.value])
    });
    let rangeValues = [rangeStart, rangeEnd];
    let updateCount = 0
    rangeSlider.noUiSlider.on('update', function (values, handle) {
      updateCount++
      rangeValues[handle].value = item.classList.contains("integer") ? parseInt(values[handle]) : values[handle]
      if (item.classList.contains("range--price")) {
        rangeValues[handle].value = parseFloat(values[handle] / 1000000).toFixed(2);
      }
    });
    rangeSlider.noUiSlider.on('end', function (values, handle) {
      $(document).find('#eFiltr').trigger("submit");
    });
  })
}
//enable scroll
function enableScroll() {
  if (fixedBlocks) {
    fixedBlocks.forEach(block => block.style.paddingRight = '0px')
  }
  document.body.style.paddingRight = '0px'
  document.body.classList.remove("no-scroll")
}
//disable scroll
function disableScroll() {
  if (fixedBlocks) {
    fixedBlocks.forEach(block => block.style.paddingRight = paddingValue)
  }
  document.body.style.paddingRight = paddingValue
  document.body.classList.add("no-scroll");
}
//form onsubmit
function formSuccess(form) {
  form.querySelectorAll("input").forEach(inp => {
    if (inp.type != "hidden") {
      inp.value = ""
    }
  })
  form.querySelectorAll(".form__item").forEach(item => item.classList.remove("error"))
  form.querySelectorAll(".form__placeholder").forEach(item => item.style.display = "block")
  let modal = document.querySelector(".modal.open")
  if (modal) {
    modal.querySelector(".modal__overlay").classList.remove("open")
    modal.classList.remove("open")
  }
  openModal(successModal)
}
//reset filter form
function filterFormOnReset(form) {
  form.querySelectorAll("input").forEach(inp => {
    inp.checked = false
    priceSlider.noUiSlider.reset()
    floorSlider.noUiSlider.reset()
  })
}
//show modal
function openModal(modal) {
  if (fixedBtn.classList.contains("intersect") || window.innerWidth <= 767) {
    fixedBtn.classList.remove("show")
    if (window.innerWidth <= 767) {
      headerBtn.style.transform = "translateY(100%)"
    }
    setTimeout(() => {
      if (!iconMenu.classList.contains("active")) {
        disableScroll()
      }
      modal.classList.add("open")
      setTimeout(() => {
        modal.querySelector(".modal__overlay").classList.add("open")
      }, 30)
    }, 300);
  } else {
    if (!iconMenu.classList.contains("active")) {
      disableScroll()
    }
    modal.classList.add("open")
    setTimeout(() => {
      modal.querySelector(".modal__overlay").classList.add("open")
    }, 30)
  }
}
// unshow modal
function closeModal(modal) {
  modal.querySelector(".modal__overlay").classList.remove("open")
  setTimeout(() => {
    if (!iconMenu.classList.contains("active")) {
      enableScroll()
    }
    modal.classList.remove("open")
    if (fixedBtn.classList.contains("intersect")) {
      fixedBtn.classList.add("show")
    }
    if (window.innerWidth <= 767) {
      headerBtn.style.transform = "translateY(0)"
    }
  }, modalAnimSpd)
}
// modal button on click
modalShowBtn.forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault()
    let href = btn.getAttribute("data-modal")
    openModal(document.querySelector(href))
  })
})
// unshow modal when clicked outside || close-btn
modal.forEach(item => {
  item.querySelector(".modal__close").addEventListener("click", e => {
    closeModal(item)
  })
  item.addEventListener("click", e => {
    if (!(window.innerWidth > 1260 && item.classList.contains("mob-modal")) && !item.querySelector(".modal__content").contains(e.target)) {
      closeModal(item)
    }
  })
})
//close mobile modal on resize
document.querySelectorAll(".mob-modal").forEach(mod => {
  window.addEventListener("resize", () => {
    if (mod.classList.contains("open") && window.innerWidth > 1260) {
      closeModal(mod)
    }
  })
})
//drop menu
iconMenu.addEventListener("click", () => {
  window.scrollTo(0, 0)
  if (iconMenu.classList.contains("active")) {
    iconMenu.classList.remove("active");
    iconMenu.setAttribute('aria-label', 'Открыть меню');
    menu.classList.remove("active");
    header.classList.remove("fixed")
    enableScroll()
  } else {
    if (window.innerWidth < 992) {
      header.classList.add("fixed")
    }
    iconMenu.classList.add("active");
    iconMenu.setAttribute('aria-label', 'Закрыть меню');
    menu.classList.add("active");
    disableScroll()
  }
})

//show/unshow fixed btn
if (section && section[1]) {
  window.addEventListener("scroll", () => {
    let windowTop = window.pageYOffset || document.documentElement.scrollTop;
    if (windowTop > section[1].getBoundingClientRect().top) {
      if (window.innerHeight - document.querySelector(".footer__top").getBoundingClientRect().bottom + 30 >= 0) {
        fixedBtn.classList.remove("intersect", "show")
      } else {
        fixedBtn.classList.add("intersect", "show")
      }
    } else {
      fixedBtn.classList.remove("intersect", "show")
    }
  })
}
//show/unshow header fixed btn
window.addEventListener("scroll", () => {
  if (window.innerWidth <= 767 && window.innerHeight - document.querySelector(".footer__top").getBoundingClientRect().bottom + 30 >= 0) {
    headerBtn.style.transform = "translateY(100%)"
  } else {
    headerBtn.style.transform = "translateY(0%)"
  }
})
//mask input
const inp = document.querySelectorAll('input[type=tel]')
if (inp) {
  inp.forEach(item => {
    item.addEventListener("focus", () => {
      item.parentNode.querySelector(".form__placeholder").style.display = "none"
    })
    item.addEventListener("blur", () => {
      if (item.value.length === 0) item.parentNode.querySelector(".form__placeholder").style.display = "block"
    })
    Inputmask({ "mask": "+7 999 999-99-99" }).mask(item);
  })
}
//features swiper
let initFeatSwip = false
let featuresSwiper
if (document.querySelector(".features__swiper")) {
  function initFeaturesSwiper() {
    if (window.innerWidth <= 767) {
      if (!initFeatSwip) {
        initFeatSwip = true
        featuresSwiper = new Swiper('.features__swiper', {
          slidesPerView: 1,
          slidesPerGroup: 1,
          observer: true,
          observeParents: true,
          pagination: {
            el: '.features__pagination',
            type: 'bullets',
            clickable: true
          },
          speed: 800,
        })
      }
    } else if (window.innerWidth > 767 && initFeatSwip) {
      initFeatSwip = false
      featuresSwiper.destroy()
    }
  }
  initFeaturesSwiper()
  window.addEventListener("resize", initFeaturesSwiper)
}
//item-building images count
if (document.querySelector(".item-building")) {
  const buildItm = document.querySelectorAll(".item-building")
  buildItm.forEach(item => {
    let imgCount = item.querySelectorAll(".item-building__images img").length
    if (imgCount > 0) {
      item.querySelector(".item-building__overlay span").textContent = imgCount + 1 + " фото"
    }
  })
}
//building swiper
if (document.querySelector(".main-building__swiper")) {
  const mainBuildSwiper = new Swiper(".main-building__swiper", {
    slidesPerView: 1,
    slidesPerGroup: 1,
    centeredSlides: true,
    spaceBetween: 10,
    observer: true,
    observeParents: true,
    speed: 800,
    initialSlide: 1,
    breakpoints: {
      480.98: {
        slidesPerView: 1.3,
        spaceBetween: 20
      },
      767.98: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      991.98: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      1520.98: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
    },
    navigation: {
      nextEl: '.main-building-btn--next',
      prevEl: '.main-building-btn--prev',
    }
  })
}
//improvements swiper
if (document.querySelector(".improvements__swiper")) {
  const improvmntSwiper = new Swiper('.improvements__swiper', {
    slidesPerView: 1.14,
    slidesPerGroup: 1,
    observer: true,
    observeParents: true,
    speed: 800,
    initialSlide: 1,
    centeredSlides: true,
    breakpoints: {
      480.98: {
        slidesPerView: 1.35,
      },
      767.98: {
        slidesPerView: 1.65,
      },
      991.98: {
        slidesPerView: 2.4,
        centeredSlides: false,
      },
      1260.98: {
        slidesPerView: 3,
        centeredSlides: false,
      }
    }
  })
}
// flat__images slider
let flatSwiperMobInit = false
let flatSwiperDeskInit = false
const btn = document.querySelector(".flat__btn")
let thumbSwiper
let flatSwiperMob
let flatSwiperDesk
if (document.querySelector(".flat")) {
  function flatSwiperInit() {
    if (window.innerWidth <= 991) {
      if (flatSwiperDeskInit) {
        flatSwiperDesk.destroy()
        thumbSwiper.destroy()
        flatSwiperDeskInit = false
      }
      if (!flatSwiperMobInit) {
        flatSwiperMob = new Swiper(".flat__mainswiper", {
          slidesPerView: 1,
          slidesPerGroup: 1,
          observer: true,
          observeParents: true,
          spaceBetween: 5,
          autoplay: {
            delay: 3500,
            pauseOnMouseEnter: true,
            disableOnInteraction: false
          },
          breakpoints: {
            767.98: {
              spaceBetween: 20,
            }
          },
          speed: 800
        })
        flatSwiperMobInit = true
        btn.addEventListener("click", () => {
          flatSwiperMob.slides[flatSwiperMob.activeIndex].click()
        })
      }
    } else {
      if (flatSwiperMobInit) {
        flatSwiperMob.destroy()
        flatSwiperMobInit = false
      }
      if (!flatSwiperDeskInit) {
        thumbSwiper = new Swiper(".flat__thumbswiper", {
          slidesPerView: 3,
          slidesPerGroup: 1,
          spaceBetween: 20,
          observer: true,
          observeParents: true,
          speed: 800
        })
        flatSwiperDesk = new Swiper(".flat__mainswiper", {
          slidesPerView: 1,
          slidesPerGroup: 1,
          observer: true,
          observeParents: true,
          effect: 'fade',
          thumbs: {
            swiper: thumbSwiper,
          },
          speed: 300
        })
        flatSwiperDeskInit = true
        btn.addEventListener("click", () => {
          flatSwiperDesk.slides[flatSwiperDesk.activeIndex].click()
        })
      }
    }
  }
  flatSwiperInit()
  window.addEventListener("resize", flatSwiperInit)
}
//init swiper and fix it on scroll
if (document.querySelector(".infra__swiper")) {
  const infra = document.querySelector(".infra__swiper")
  let slideCount = infra.querySelectorAll(".swiper-slide").length
  let infraSwiper = new Swiper(infra, {
    slidesPerView: 1,
    slidesPerGroup: 1,
    observer: true,
    observeParents: true,
    pagination: {
      el: '.infra__pagination',
      type: 'bullets',
      clickable: true
    },
    effect: 'fade',
    speed: 700
  })
  let activeIndex = { value: 0 }
  setTimeout(() => {
    let ifraSwiperAnim = gsap.to(activeIndex, {
      value: slideCount - 1,
      scrollTrigger: {
        trigger: ".infra .container",
        start: "center center",
        end: "+=" + 300 * slideCount,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          infraSwiper.slideTo(Math.round(activeIndex.value))
        },
      }
    })
  }, 100);
}
//filter-form
if (filter) {
  initSliders()
  filterCheckbox.querySelectorAll("input").forEach(inp => {
    inp.addEventListener("change", () => {
      if (filterCheckbox.querySelectorAll("input:checked").length === filterCheckbox.querySelectorAll("input").length) {
        filterCheckbox.querySelectorAll("input").forEach(inp => inp.checked = false)
      }
    })
  })
  document.querySelector(".filter__header").addEventListener("click", () => {
    if (window.innerWidth <= 1260) {
      openModal(document.querySelector(".mob-modal"))
    }
  })
}
// change image on mousemove/touchmove in catalog__block
function catalogSlider() {
  document.querySelectorAll(".catalog__wrapper .catalog-cat__item").forEach(item => {
    const catImg = item.querySelectorAll(".catalog-cat__img")
    for (let i = 0; i < catImg.length; i++) {
      let span1 = document.createElement("span")
      let span2 = document.createElement("span")
      item.querySelector(".catalog-cat__hovers").append(span1)
      item.querySelector(".catalog-cat__controls").append(span2)
    }
    function move(el, pos) {
      let parentLeft = item.querySelector(".catalog-cat__hovers").getBoundingClientRect().left
      let elWidth = el.clientWidth
      let activeEl = Math.ceil((pos - parentLeft) / elWidth)
      if (activeEl >= 1 && activeEl <= catImg.length) {
        setActive(activeEl)
      } else {
        setActive(1)
      }
    }
    function leave() {
      setActive(1)
    }
    function setActive(activeEl) {
      item.querySelectorAll(".catalog-cat__img").forEach(img => img.style.opacity = 0)
      item.querySelectorAll(".catalog-cat__img")[activeEl - 1].style.opacity = 1
      item.querySelectorAll(".catalog-cat__controls span").forEach(span => span.style.backgroundColor = "transparent")
      item.querySelectorAll(".catalog-cat__controls span")[activeEl - 1].style.backgroundColor = "#006422"
    }
    item.querySelectorAll(".catalog-cat__hovers span").forEach((el, idx) => {
      el.addEventListener("touchmove", (e) => {
        move(el, e.touches[0].clientX)
      })
      el.addEventListener("touchend", () => leave())
      el.addEventListener("mousemove", (e) => {
        move(el, e.clientX)
      })
      el.addEventListener("mouseleave", () => leave())
    })
    item.querySelector(".modal-show-btn").addEventListener("click", ()=> {
      let href = item.querySelector(".modal-show-btn").getAttribute("data-modal")
      openModal(document.querySelector(href))
    })
  })
}
if (catalogCat) {
  catalogSlider()
}
// scheme-popup position on mousemove
function setSchemePopup() {
  document.querySelectorAll(".scheme-cat .item-apartaments .on-sale").forEach(item => {
    function move(xPos, yPos) {
      schemePopup.classList.add("open")
      let top = item.getBoundingClientRect().top
      let left = item.getBoundingClientRect().left
      if (window.innerWidth < left + schemePopup.clientWidth + item.clientWidth + 50) {
        schemePopup.style.left = xPos - schemePopup.clientWidth - 10 + "px"
      } else {
        schemePopup.style.left = xPos + 15 + "px"
      }
      if (window.innerHeight < top + schemePopup.clientHeight + 25) {
        schemePopup.style.top = yPos - schemePopup.clientHeight - 5 + "px"
      } else {
        schemePopup.style.top = yPos + 25 + "px"
      }
    }
    function setPopupData() {
      let nmb = item.getAttribute("data-nmb") ? item.getAttribute("data-nmb") : ""
      let name = item.getAttribute("data-name")
      let area = item.getAttribute("data-area")
      let floor = item.getAttribute("data-floor")
      let url = item.getAttribute("data-url")
      let price = item.getAttribute("data-price").replace(/\B(?=(\d{3})+(?!\d))/g, " ").trim()
      let img = item.getAttribute("data-img")
      schemePopup.querySelector(".modal__scroll").innerHTML = `
      <div class="scheme-popup__header">
        <h5>${`<span>${name}</span><span>№ ${nmb}</span>`}</h5>
        <h6>${`<span>${area} кв. м.</span><span>${floor} этаж</span>`}</h6>
      </div>
      <a href=${url} class="scheme-popup__preview">
          <picture><img src=${img} alt=""></picture>
          <div class="catalog-compass">
              <svg>
                  <use xlink:href="img/icons/sprite.svg#compass"></use>
              </svg>
          </div>
      </a>
      <div class="scheme-popup__footer">
          <div class="h5 scheme-popup__price">${price} руб</div>
          <a href=${url} class="btn stroke-btn">Подробнее</a>
      </div>
        `
    }
    function resetPopupData() {
      schemePopup.querySelector(".modal__scroll").innerHTML = ""
    }
    item.addEventListener("mouseenter", () => {
      if (window.innerWidth > 1260) {
        setPopupData()
      }
    })
    item.addEventListener("mousemove", (e) => {
      if (window.innerWidth > 1260) {
        move(e.clientX, e.clientY)
        item.addEventListener("mouseleave", () => {
          schemePopup.classList.remove("open")
          resetPopupData()
        })
      }
    })
    item.addEventListener("click", e => {
      if (window.innerWidth <= 1260) {
        e.preventDefault()
        setPopupData()
        openModal(schemePopup)
      }
    })
  })
}
if (schemePopup) {
  setSchemePopup()
}
//tabs on click
const catTab = document.querySelectorAll(".catalog__tab")
const catBlock = document.querySelectorAll(".catalog__block")
catTab.forEach((tab, idx) => {
  tab.addEventListener("click", e => {
    e.preventDefault()
    catTab.forEach(tab => {
      tab.classList.remove("active")
    })
    catBlock.forEach(block => {
      block.classList.remove("active")
    })
    catTab[idx].classList.add("active")
    catBlock[idx].classList.add("active")
    if (catBlock[idx].classList.contains("catalog-plan") && window.innerWidth > 991.98) {
      document.querySelector(".filter").style.display = "none"
    } else {
      document.querySelector(".filter").style.display = "block"
    }
  })
})
// day/night views
if (document.querySelector(".views")) {
  const viewsBtn = document.querySelectorAll(".views__btn")
  const viewsBar = document.querySelector(".views__bar")
  viewsBtn.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault()
      if (btn.classList.contains("views__btn--night")) {
        viewsBar.style.transform = "translateX(100%)";
        viewsBar.style.backgroundColor = "#313534"
        document.querySelector(".views__video--day").style.clipPath = "polygon(0 0, 0 0, 0 100%, 0% 100%)"
      } else {
        viewsBar.style.transform = "translateX(0%)";
        viewsBar.style.backgroundColor = "#ffffff"
        document.querySelector(".views__video--day").style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
      }
      viewsBtn.forEach(btn => btn.classList.remove("active"))
      btn.classList.add("active")
    })
  })
}
//add parallax to img in choice sec
if (document.querySelector(".main-choice__img")) {
  let choiceImg = document.querySelector(".main-choice__img img")
  choiceImg.addEventListener("mouseenter", e => {
    if (window.innerWidth > 1520) {
      choiceImg.style.transitionDuration = '.5s'
      const startY = e.clientY
      const startX = e.clientX
      choiceImg.addEventListener("mousemove", (event) => {
        choiceImg.style.transitionDuration = '0s'
        let diffX = event.clientX - startX
        let diffY = event.clientY - startY
        choiceImg.style.transform = 'translate3d(' + diffX / 30 + 'px,' + diffY / 30 + 'px,0)'
      })
      choiceImg.addEventListener("mouseleave", () => {
        choiceImg.style.transform = 'translate3d(0,0,0)'
        choiceImg.style.transitionDuration = '.5s'
      })
    }
  })
}
//custom fancybox
const fancyItems = document.querySelectorAll("[data-fancy]")
fancyItems.forEach(item => {
  item.addEventListener("click", () => {
    let imgSrc = []
    let objectFit = item.getAttribute("data-fit") ? item.getAttribute("data-fit") : ""
    let val = item.getAttribute("data-fancy")
    fancyItems.forEach(el => {
      if (!el.closest(".swiper-slide-duplicate") && el.getAttribute("data-fancy") === val) {
        imgSrc.push(el.getAttribute("data-src"))
      }
    })
    let initialSl = imgSrc.indexOf(item.getAttribute("data-src"))
    document.querySelector("footer").insertAdjacentHTML('afterend', `
    <div class="modal fancy-modal">
        <div class="modal__overlay">
        <button class="modal__close" aria-label="Закрыть всплывающее окно"></button>
           <div class="modal__content">
               <div class="swiper fancy-swiper">
                   <div class="swiper-wrapper">
                      ${imgSrc.map(item => `<div class="swiper-slide ${objectFit}">
                            <div class="swiper-img">
                                <img src=${item} alt="">
                            </div>
                        </div>`
    ).join("")}
                   </div>
               </div>
           </div>
        </div>
    </div>
  `);
    let fancySwiper = new Swiper(".fancy-swiper", {
      slidesPerView: 1,
      slidesPerGroup: 1,
      observer: true,
      observeParents: true,
      centeredSlides: true,
      spaceBetween: 5,
      initialSlide: initialSl,
      breakpoints: {
        991.98: {
          spaceBetween: 40,
        },
        767.98: {
          spaceBetween: 20
        }
      },
    })
    const fancyModal = document.querySelector(".fancy-modal")
    openModal(fancyModal)
    fancyModal.addEventListener("click", e => {
      if (!fancyModal.querySelector(".modal__content").contains(e.target) || fancyModal.querySelector(".modal__close").contains(e.target)) {
        closeModal(fancyModal)
        setTimeout(() => {
          fancyModal.remove()
        }, modalAnimSpd);
      }
    })
  })

})
//map-content animation
if (document.querySelector('.main-map__content')) {
  gsap.from('.main-map__content', {
    x: 100,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: '.main-map__content',
      start: "30px bottom",
      toggleActions: "play none none reverse",
    }
  })
}
//plan swiper
if (document.querySelector(".catalog-plan__swipers")) {
  const thumbSwiper = new Swiper(".catalog-plan__thumbswiper", {
    slidesPerView: 3.15,
    spaceBetween: 16,
    observer: true,
    observeParents: true,
    direction: "horizontal",
    speed: 800,
    breakpoints: {
      480.98: {
        slidesPerView: 4.1,
        spaceBetween: 16,
        direction: "horizontal",
      },
      767.98: {
        slidesPerView: 5,
        spaceBetween: 20,
        direction: "horizontal",
      },
      991.98: {
        slidesPerView: 5,
        spaceBetween: 20,
        direction: "vertical",
      }
    },
  })
  const mainswiper = new Swiper(".catalog-plan__mainswiper", {
    slidesPerView: 1,
    observer: true,
    observeParents: true,
    effect: 'fade',
    thumbs: {
      swiper: thumbSwiper,
    },
    autoplay: {
      delay: 3500,
      disableOnInteraction: false
    },
    speed: 400
  })
}


