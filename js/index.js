window.addEventListener("load", function () {
  const loader = document.querySelector(".loader");
  loader.classList.add("hidden");
});

window.addEventListener("DOMContentLoaded", function () {
  var status = "lower200";
  var menu = document.querySelector(".menu");
  var scrollTop = document.querySelector(".scrollTop");
  var btn = document.querySelector(".btn");

  window.addEventListener("scroll", function () {
    var offset = window.pageYOffset;
    if (offset > 200) {
      if (status === "lower200") {
        menu.classList.add("menu--scroll");
        scrollTop.classList.add("scrollTop--animate");
        status = "higher200";
      }
    } else {
      if (status === "higher200") {
        menu.classList.remove("menu--scroll");
        scrollTop.classList.remove("scrollTop--animate");
        status = "lower200";
      }
    }
  });

  function smoothScroll(target, duration) {
    var target = document.querySelector(target);
    var targetPosition = target.offsetTop - 200;
    var startPosition = window.pageYOffset;
    var distance = targetPosition - startPosition;
    var startTime = null;

    function animationScroll(currentTime) {
      if (startTime === null) startTime = currentTime; // sau 7s khi refesh  mới nhấn nút để chuyển động thì current time lúc đầu bằng 7 và thay đổi đến khi hết hiệu ứng
      var timeElapsed = currentTime - startTime; // thời gian trôi qua
      var run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animationScroll);
    }

    function easeInOutCubic(t, b, c, d) {
      // function ease http://gizma.com/easing/#cub3
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t + b;
      t -= 2;
      return (c / 2) * (t * t * t + 2) + b;
    }

    requestAnimationFrame(animationScroll);
  }

  scrollTop.addEventListener("click", function () {
    smoothScroll(".menu", 1000); // menu top
  });

  if (btn !== null) {
    // khi sang trang khác thì ko có nút learn more nữa nên bị lỗi btn là null
    btn.addEventListener("click", function () {
      smoothScroll(".section-dns", 1000);
    });
  }
});
