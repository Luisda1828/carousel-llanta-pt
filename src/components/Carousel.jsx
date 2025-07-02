import React, { useEffect, useRef } from 'react';

const Carousel = ({ images }) => {
  const carouselRef = useRef(null);
  const llantaRef = useRef(null);
  const itemsRef = useRef([]);
  const circleRef = useRef(null);

  const radius = 290;
  const centerAngle = 270;
  const angleStep = 360 / images.length;
  const initialIndex = 1;

  let rotation = centerAngle - initialIndex * angleStep;
  let isDragging = false;
  let startX = 0;
  let lastRotation = rotation;

  useEffect(() => {
    const carousel = carouselRef.current;
    const llanta = llantaRef.current;
    const items = itemsRef.current;

    function normalizeAngle(angle) {
      angle = angle % 360;
      if (angle < 0) angle += 360;
      return angle;
    }

    function positionItems() {
      let closestIndex = 0;
      let minDiff = 360;

      items.forEach((item, i) => {
        let imgAngle = normalizeAngle(i * angleStep + rotation);
        let diff = Math.abs(imgAngle - centerAngle);
        if (diff > 180) diff = 360 - diff;
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      });

      items.forEach((item, i) => {
        let angle = i * angleStep + rotation;
        const rad = angle * Math.PI / 180;
        const x = radius * Math.cos(rad);
        const y = radius * Math.sin(rad);
        const rotationAngle = angle + 90;

        if (i === closestIndex) {
          item.classList.add('carousel__item.active');
          item.style.transform = `translate(${x}px, ${y}px) rotate(${rotationAngle}deg) scale(3)`;
          
        } else {
          item.classList.remove('carousel__item.active');
          item.style.transform = `translate(${x}px, ${y}px) rotate(${rotationAngle}deg) scale(1)`;
        }
      });

      llanta.style.transform = `rotate(${rotation}deg)`;
      return closestIndex;
    }

    function correctRotationToCenter(index) {
      const targetAngle = normalizeAngle(index * angleStep + rotation);
      let diff = centerAngle - targetAngle;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      rotation += diff;
    }

    // Mouse events
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      rotation = lastRotation + deltaX / 5;
      positionItems();
    };
     
    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX;
      lastRotation = rotation;
      carousel.classList.add('active');
    
    };
    
    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      carousel.classList.remove('active');
      const closestIndex = positionItems();
      correctRotationToCenter(closestIndex);
      positionItems();
    };

    // Touch events
    const onTouchStart = (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      lastRotation = rotation;
    
    };

    const onTouchMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - startX;
      rotation = lastRotation + deltaX / 2;
      positionItems();
      e.preventDefault();
    };

    const onTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      carousel.classList.remove('active');
      const closestIndex = positionItems();
      correctRotationToCenter(closestIndex);
      positionItems();
    };

    const onSelectStart = (e) => {
      if (isDragging) e.preventDefault();
    };

    carousel.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    carousel.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('selectstart', onSelectStart);

    positionItems();

    return () => {
      carousel.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      carousel.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('selectstart', onSelectStart);
    };
  }, [angleStep, centerAngle, radius]);

  return (
    <div className='carousel-container'>
      <div className="carousel" ref={carouselRef}>
        <div id="llanta" ref={llantaRef}>
          <img draggable="false" src="/Llanta.png" alt="llanta" />
          <svg
            ref={circleRef}
            className="circle"
            width="450"
            height="450"
            viewBox="-35 0 410 345"
          >
            <circle cx="170" cy="170" r="190" stroke="#a02423" strokeWidth="1" fill="none" />
            <circle cx="360" cy="170" r="2" fill="#e74c3c" />
            <circle cx="265" cy="334.54" r="2" fill="#e74c3c" />
            <circle cx="75" cy="334.54" r="2" fill="#e74c3c" />
            <circle cx="-20" cy="170" r="2" fill="#e74c3c" />
            <circle cx="75" cy="5.46" r="2" fill="#e74c3c" />
            <circle cx="265" cy="5.46" r="2" fill="#e74c3c" />
          </svg>
        </div>
        {images.map((src, i) => (
          <div
            key={i}
            className="carousel__item"
            ref={(el) => (itemsRef.current[i] = el)}
          >
            <img draggable="false" src={src} alt={`img-${i}`} />  
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
