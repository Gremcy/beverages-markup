// eslint-disable-next-line max-classes-per-file
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import $, { Callbacks } from 'jquery';
import 'slick-carousel';

function fixHeight() {
  const vh = window.innerHeight;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

$(document).ready(() => {
  fixHeight();

  window.addEventListener('resize', () => {
    fixHeight();
  });

  $.fn.modalOpen = function () {
    $('.js-modal').modalCloseAll();
    $('body').addClass('is-hidden');
    $(this).fadeIn(1);
    $(this).addClass('is-open');

    // hotfix for zoomer inside modal
    window.PinchZoomer.remove();
    $('.controlHolder').remove();
    window.PinchZoomer.init();
    return this;
  };

  $.fn.modalClose = function () {
    $(this).fadeOut(1);
    $(this).removeClass('is-open');
    $('body').removeClass('is-hidden');
    return this;
  };

  $.fn.modalCloseAll = function () {
    $('.js-modal').modalClose();
    return this;
  };

  $(document).on('click', '.js-close-modal', () => {
    $('.js-modal').modalCloseAll();
  });

  $(document).on('click', '.js-modal-link', (e) => {
    const target = $(e.currentTarget).attr('data-target');
    const $modal = $(`.js-modal[data-modal="${target}"]`);

    if ($modal.length) {
      $modal.modalOpen();
    }
  });

  $(document).on('click', '.header-burger', () => {
    $('.menu-wrapper').addClass('show');
    $('.menu-overlay').addClass('show');
    $('html').addClass('is-hidden');
  });

  $(document).on('click', '.js-menu-close, .menu-overlay', () => {
    $('.menu-wrapper').removeClass('show');
    $('.menu-overlay').removeClass('show');
    $('html').removeClass('is-hidden');
  });

  gsap.registerPlugin(ScrollTrigger);

  gsap.to('.home-hero-image', {
    scrollTrigger: {
      trigger: '.home-head',
      start: 'top top',
      // end: 'top 100px',
      scrub: 0.6,
      // markers: true,
      // toggleClass: { targets: '.home-hero-image', className: 'active' },
    },
    scale: 1,
  });

  if ($('.home-insta-container').length > 0) {
    $('.home-insta-container').slick({
      slidesToShow: 1.2,
      arrows: false,
      dots: false,
      infinite: false,
      slidesToScroll: 1,
      mobileFirst: true,
      responsive: [
        {
          breakpoint: 767,
          settings: 'unslick',
        },
      ],
    });
  }

  if ($('.product-first-slider').length > 0) {
    $('.product-first-slider').slick({
      slidesToShow: 1,
      arrows: true,
      dots: true,
      infinite: true,
      slidesToScroll: 1,
      prevArrow: $('.product-first-slider-arrows .slick-prev'),
      nextArrow: $('.product-first-slider-arrows .slick-next'),
      responsive: [
        {
          breakpoint: 767,
        },
      ],
    });
  }

  if ($('.product-other-slider').length > 0) {
    $('.product-other-slider').slick({
      slidesToShow: 3,
      arrows: true,
      dots: false,
      infinite: true,
      slidesToScroll: 1,
      prevArrow: $('.product-other-slider-arrows .slick-prev'),
      nextArrow: $('.product-other-slider-arrows .slick-next'),
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            arrows: true,
            dots: true,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            arrows: false,
            dots: true,
          },
        },
      ],
    });
  }

  $('.inputText, .textareaText').on('blur', function () {
    if (!$(this).val().trim()) {
      $(this).removeClass('empty');
    } else {
      $(this).addClass('empty');
    }
  });

  // bubbles
  /* eslint-disable */
  class Bubbles {
    constructor(options) {
      this.options = options;
      this.setCanvas();
      // this.options.sprite = new Image();
      // this.options.sprite.onload = ()=> {
      this.createBubbles();
      this.drawBubbles();
      // };
      // this.options.sprite.src = this.options.spriteSource;
      this.options.spriteSize =
        this.options.sprite.height / this.options.spriteCount;
      new ResizeObserver(this.resizeCanvas.bind(this)).observe(this.canvas);
    }

    setCanvas() {
      this.canvas = document.getElementById(this.options.canvasID);
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
      this.ctx = this.canvas.getContext('2d');
    }

    resizeCanvas() {
      this.setCanvas();
      this.createBubbles();
    }

    createBubbles() {
      this.bubbleArray = [];
      let bubbleCount = Math.floor(
        this.options.bubbleDensity *
          ((this.canvas.width * this.canvas.height) / 2000)
      );
      console.log(bubbleCount);
      for (let i = 0; i < bubbleCount; i++) {
        this.createBubble(i);
      }
    }

    createBubble(i) {
      let sprite = {};
      let bubble = {};
      let canvas = {};

      sprite.posX = 0;
      sprite.posY =
        Math.floor(Math.random() * this.options.spriteCount) *
        (this.options.sprite.height / this.options.spriteCount);
      bubble.size = Math.floor(
        Math.random() *
          (this.options.bubbleSize[1] - this.options.bubbleSize[0]) +
          this.options.bubbleSize[0]
      );
      bubble.velocity =
        Math.random() *
          (this.options.bubbleVelocityY[1] - this.options.bubbleVelocityY[0]) +
        this.options.bubbleVelocityY[0];
      bubble.opacity =
        Math.random() *
          (this.options.bubbleOpacity[1] - this.options.bubbleOpacity[0]) +
        this.options.bubbleOpacity[0];
      canvas.posX = Math.floor(
        Math.random() * this.canvas.width - bubble.size / 2
      );
      canvas.posY = Math.floor(Math.random() * this.canvas.height);
      let singleBubble = new Bubble(sprite, bubble, canvas);
      this.bubbleArray.push(singleBubble);
    }

    drawBubbles() {
      this.updateBubbles();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = 0; i < this.bubbleArray.length; i++) {
        let b = this.bubbleArray[i];
        this.ctx.globalAlpha = b.bubble.opacity;
        this.ctx.drawImage(
          this.options.sprite,
          this.bubbleArray[i].sprite.posX,
          this.bubbleArray[i].sprite.posY,
          this.options.spriteSize,
          this.options.spriteSize,
          this.bubbleArray[i].canvas.posX,
          this.bubbleArray[i].canvas.posY,
          this.bubbleArray[i].bubble.size,
          this.bubbleArray[i].bubble.size
        );
      }
      requestAnimationFrame(this.drawBubbles.bind(this));
    }

    updateBubbles() {
      for (let i = 0; i < this.bubbleArray.length; i++) {
        if (this.bubbleArray[i].canvas.posY < 0) {
          this.bubbleArray[i].canvas.posY =
            this.canvas.height + this.bubbleArray[i].bubble.size;
        } else {
          this.bubbleArray[i].canvas.posY -=
            this.bubbleArray[i].bubble.velocity;
        }
      }
    }
  }

  class Bubble {
    constructor(sprite, bubble, canvas) {
      this.sprite = sprite;
      this.bubble = bubble;
      this.canvas = canvas;
    }
  }

  /* document.querySelector('#year').innerHTML = new Date().getFullYear(); */

  let sprite = new Image();
  sprite.onload = () => {
    bubbles = new Bubbles({
      canvasID: 'bubbles',
      sprite: sprite,
      spriteCount: 10,
      bubbleDensity: 2.5,
      bubbleSize: [3, 20],
      bubbleVelocityY: [0.5, 4.5],
      bubbleOpacity: [0.05, 0.25],
    });
  };
  sprite.src = '/wp-content/themes/spraga/assets/images/sprite.png';

  $(window).scroll(function () {
    $('.about-page').toggleClass('scroll', $(this).scrollTop() > 70);
  });

  $(window).scroll(function () {
    $('.about-sidebar').toggleClass('fixed', $(this).scrollTop() > 2000);
  });

  /* eslint-enable */

  gsap.to('.sec1', {
    scrollTrigger: {
      trigger: '#section1',
      start: 'top top+=154px',
      end: 'bottom top+=154px',
      toggleActions: 'restart reverse restart reverse',
      // markers: true,
      toggleClass: {
        targets: '.sec1',
        className: 'active',
      },
    },
  });

  gsap.to('.sec2', {
    scrollTrigger: {
      trigger: '#section2',
      start: 'top top+=154px',
      end: 'bottom top+=154px',
      toggleActions: 'restart reverse restart reverse',
      // markers: true,
      toggleClass: {
        targets: '.sec2',
        className: 'active',
      },
    },
  });

  gsap.to('.sec3', {
    scrollTrigger: {
      trigger: '#section3',
      start: 'top top+=154px',
      end: 'bottom top+=154px',
      toggleActions: 'restart reverse restart reverse',
      // markers: true,
      toggleClass: {
        targets: '.sec3',
        className: 'active',
      },
    },
  });

  gsap.to('.sec4', {
    scrollTrigger: {
      trigger: '#section4',
      start: 'top top+=154px',
      end: 'bottom top+=154px',
      toggleActions: 'restart reverse restart reverse',
      // markers: true,
      toggleClass: {
        targets: '.sec4',
        className: 'active',
      },
    },
  });

  gsap.to('.sec5', {
    scrollTrigger: {
      trigger: '#section5',
      start: 'top top+=154px',
      end: 'bottom top+=154px',
      toggleActions: 'restart reverse restart reverse',
      // markers: true,
      toggleClass: {
        targets: '.sec5',
        className: 'active',
      },
    },
  });

  // change product view
  $(document).on('click', '.js-btn-bottles', () => {
    $('.js-btn-bottles').addClass('active');
    $('.product-first-select-container-bottles').addClass('show');
    $('.js-btn-cans').removeClass('active');
    $('.product-first-select-container-cans').removeClass('show');
  });
  $(document).on('click', '.js-btn-cans', () => {
    $('.js-btn-cans').addClass('active');
    $('.product-first-select-container-cans').addClass('show');
    $('.js-btn-bottles').removeClass('active');
    $('.product-first-select-container-bottles').removeClass('show');
  });

  // cart
  $(document).on('click', '.header-right-cart, .header-mob-cart', () => {
    $('.cart-wrapper').addClass('show');
    $('.cart-overlay').addClass('show');
    $('html').addClass('is-hidden');
  });
  $(document).on('click', '.cart-close, .cart-overlay', () => {
    $('.cart-wrapper').removeClass('show');
    $('.cart-overlay').removeClass('show');
    $('html').removeClass('is-hidden');
  });

  // window.updateTrigger = () => ScrollTrigger.refresh();
  // $(window).resize(checkWidth);
});
