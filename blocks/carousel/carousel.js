export default function decorate(block) {
  const originalSlides = [...block.children];
  if (originalSlides.length <= 1) return;

  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  /* ----------------------------
     Prepare Slides (overlay logic)
  ----------------------------- */

  const getCellText = (el) => (el && el.textContent ? el.textContent.trim() : '');
  const getCellLink = (el) => {
    if (!el) return { href: '#', text: '' };
    const a = el.querySelector('a');
    if (a) {
      return { href: a.getAttribute('href') || '#', text: a.textContent.trim() || getCellText(el) };
    }
    return { href: getCellText(el) || '#', text: '' };
  };

  originalSlides.forEach((slide) => {
    slide.classList.add('carousel-slide');

    const cells = [...slide.children];
    const imageCell = cells[0];
    const alignmentCell = cells[1];
    const titleCell = cells[2];
    const descCell = cells[3];
    const buttonLabelCell = cells[4];
    const buttonLinkCell = cells[5];
    const styleCell = cells[6];

    const alignmentRaw = getCellText(alignmentCell).toLowerCase();
    let alignment = 'left';
    if (alignmentRaw === 'center') alignment = 'center';
    else if (alignmentRaw === 'right') alignment = 'right';
    else if (alignmentRaw === 'left') alignment = 'left';

    const title = getCellText(titleCell);
    const description = getCellText(descCell);
    const buttonLabel = getCellText(buttonLabelCell);
    const { href: buttonHref, text: linkText } = getCellLink(buttonLinkCell);
    const styleRaw = getCellText(styleCell).toLowerCase();
    const buttonStyle = (styleRaw === 'secondary' ? 'secondary' : 'primary');

    const hasDetails = !!(title || description || buttonLabel || (buttonHref && buttonHref !== '#'));
    if (hasDetails) {
      const overlay = document.createElement('div');
      overlay.className = `carousel-overlay overlay-${alignment}`;

      if (title) {
        const h = document.createElement('h2');
        h.textContent = title;
        overlay.appendChild(h);
      }
      if (description) {
        const p = document.createElement('p');
        p.textContent = description;
        overlay.appendChild(p);
      }
      if (buttonLabel || buttonHref !== '#') {
        const a = document.createElement('a');
        a.href = buttonHref;
        a.textContent = linkText || buttonLabel || 'Learn more';
        a.className = `carousel-button ${buttonStyle}`;
        overlay.appendChild(a);
      }

      slide.appendChild(overlay);
    }

    [alignmentCell, titleCell, descCell, buttonLabelCell, buttonLinkCell, styleCell].forEach((c) => {
      if (c?.parentNode) c.remove();
    });
  });

  /* ----------------------------
     Infinite Loop Setup
  ----------------------------- */

  const stripEditorAttrs = (el) => {
    [...el.querySelectorAll('[data-aue-resource], [data-aue-id], [data-aue-behavior], [data-richtext-resource], [data-richtext-prop], [data-richtext-filter], [data-richtext-label]')]
      .concat(el.matches('[data-aue-resource], [data-aue-id], [data-aue-behavior], [data-richtext-resource], [data-richtext-prop], [data-richtext-filter], [data-richtext-label]') ? [el] : [])
      .forEach((node) => {
        ['data-aue-resource', 'data-aue-id', 'data-aue-behavior', 'data-richtext-resource', 'data-richtext-prop', 'data-richtext-filter', 'data-richtext-label'].forEach((attr) => node.removeAttribute(attr));
      });
  };

  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

  [firstClone, lastClone].forEach((clone) => {
    clone.classList.add('clone');
    stripEditorAttrs(clone);
  });

  track.append(lastClone);
  originalSlides.forEach((slide) => track.append(slide));
  track.append(firstClone);

  viewport.append(track);
  block.textContent = '';
  block.append(viewport);

  /* ----------------------------
     Navigation
  ----------------------------- */

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-nav prev';
  prevBtn.innerHTML = '&#10094;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-nav next';
  nextBtn.innerHTML = '&#10095;';

  block.append(prevBtn, nextBtn);

  let currentIndex = 1;
  const totalSlides = originalSlides.length;

  function setPosition(withTransition = true) {
    track.style.transition = withTransition
      ? 'transform 0.6s ease'
      : 'none';

    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  setPosition(false);

  nextBtn.addEventListener('click', () => {
    if (currentIndex >= totalSlides + 1) return;
    currentIndex++;
    setPosition();
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex <= 0) return;
    currentIndex--;
    setPosition();
  });

  track.addEventListener('transitionend', () => {
    if (currentIndex === totalSlides + 1) {
      currentIndex = 1;
      setPosition(false);
    }

    if (currentIndex === 0) {
      currentIndex = totalSlides;
      setPosition(false);
    }
  });
}