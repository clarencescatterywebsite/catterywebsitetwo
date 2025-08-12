document.addEventListener('DOMContentLoaded', () => {

  // --- Show/Hide Pages ---
  function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
      page.style.display = (page.id === pageId) ? 'block' : 'none';
    });

    // ✅ Background only on home page
    if (pageId === 'home') {
      document.body.classList.add('home-page');
    } else {
      document.body.classList.remove('home-page');
    }
  }
  window.showPage = showPage;

  // Show the home page by default
  showPage('home');

  // --- Contact Form Submission ---
  const form = document.getElementById('contactForm');
  const thankYouMessage = document.getElementById('thankYouMessage');

  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (response.ok) {
          form.reset();
          if (thankYouMessage) {
            thankYouMessage.innerHTML = "✅ Thanks for your message! We'll get back to you soon.";
            thankYouMessage.style.display = 'block';
            thankYouMessage.style.color = 'green';
            fadeOut(thankYouMessage, 4000);
          }
        } else {
          showError();
        }
      }).catch(showError);
    });
  }

  function showError() {
    if (thankYouMessage) {
      thankYouMessage.innerHTML = "❌ Oops! There was a problem submitting your form.";
      thankYouMessage.style.display = 'block';
      thankYouMessage.style.color = 'red';
      fadeOut(thankYouMessage, 4000);
    }
  }  function fadeOut(element, delay) {
    setTimeout(() => {
      element.style.transition = "opacity 1s ease";
      element.style.opacity = 0;
      setTimeout(() => {
        element.style.display = "none";
        element.style.opacity = 1;
      }, 1000);
    }, delay);
  }

  // --- Load Gallery ---
  fetch('/gallery.json')
    .then(response => response.json())
    .then(data => {
      const gallery = document.getElementById('gallery');
      if (!gallery) return;
      data.forEach(item => {
        const container = document.createElement('div');
        container.classList.add('gallery-item');

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;

        const caption = document.createElement('p');
        caption.textContent = item.caption;

        container.appendChild(img);
        container.appendChild(caption);
        gallery.appendChild(container);
      });
    })
    .catch(err => console.error('Error loading gallery:', err));

  // --- Modal Image Viewer ---
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalCloseBtn = document.querySelector('.modal-close');

  document.querySelectorAll('.photo-card img').forEach(img => {
    img.addEventListener('click', () => {
      modal.style.display = 'block';
      modalImg.src = img.src;
      modalImg.alt = img.alt;
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // --- Lightbox for Gallery Images ---
  const galleryImages = document.querySelectorAll('.gallery img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const closeBtn = document.querySelector('.lightbox .close');
  const prevBtn = document.querySelector('.lightbox-nav .prev');
  const nextBtn = document.querySelector('.lightbox-nav .next');

  let currentIndex = 0;

  function showLightbox(index) {
    currentIndex = index;
    lightboxImg.src = galleryImages[currentIndex].src;
    lightbox.style.display = 'flex';
    document.body.classList.add('lightbox-open');
  }

  function hideLightbox() {
    lightbox.style.display = 'none';
    document.body.classList.remove('lightbox-open');
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
  }

  galleryImages.forEach((img, index) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => showLightbox(index));
  });

  if (closeBtn) closeBtn.addEventListener('click', hideLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) hideLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape') hideLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    }
  });

});