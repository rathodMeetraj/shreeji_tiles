document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".hero-slider-dots .dot");
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");
    
    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        slides[currentSlide].classList.remove("active");
        dots[currentSlide].classList.remove("active");
        
        currentSlide = (index + slides.length) % slides.length;
        
        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetSlider() {
        clearInterval(slideInterval);
        startSlider();
    }

    if (rightArrow) {
        rightArrow.addEventListener("click", () => {
            nextSlide();
            resetSlider();
        });
    }

    if (leftArrow) {
        leftArrow.addEventListener("click", () => {
            prevSlide();
            resetSlider();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            goToSlide(index);
            resetSlider();
        });
    });

    startSlider();

    // --- Stats Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    const speed = 50; // Lower number = fewer steps = faster animation

    const startCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText.replace(/,/g, '');
                    
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc).toLocaleString();
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target.toLocaleString();
                    }
                };
                
                updateCount();
                observer.unobserve(counter); // Animate only once per load
            }
        });
    };

    const counterObserver = new IntersectionObserver(startCounters, {
        root: null,
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // --- Marvelous Auto Slider ---
    const marvGrid = document.querySelector('.marvelous-grid');
    const marvDots = document.querySelectorAll('.marvelous-dots .dot');
    let marvSlideInterval;
    let currentMarvIndex = 0;
    
    function updateMarvDots(direction) {
        if (!marvDots.length) return;
        marvDots[currentMarvIndex].classList.remove('active');
        if (direction === 'next') {
            currentMarvIndex = (currentMarvIndex + 1) % marvDots.length;
        } else {
            currentMarvIndex = (currentMarvIndex - 1 + marvDots.length) % marvDots.length;
        }
        marvDots[currentMarvIndex].classList.add('active');
    }

    if (marvGrid && marvGrid.children.length > 0) {
        function slideMarvelous() {
            const cardWidth = marvGrid.children[0].offsetWidth + 20;
            
            marvGrid.style.transition = "transform 0.5s ease-in-out";
            marvGrid.style.transform = `translateX(-${cardWidth}px)`;
            
            setTimeout(() => {
                marvGrid.style.transition = "none";
                marvGrid.appendChild(marvGrid.children[0]);
                marvGrid.style.transform = "translateX(0)";
            }, 500);
            
            updateMarvDots('next');
        }
        
        function startMarvSlider() {
            marvSlideInterval = setInterval(slideMarvelous, 3500); 
        }
        
        startMarvSlider();
        
        const marvNext = document.getElementById('marv-next');
        const marvPrev = document.getElementById('marv-prev');
        
        if (marvNext) {
            marvNext.addEventListener('click', () => {
                clearInterval(marvSlideInterval);
                slideMarvelous();
                startMarvSlider();
            });
        }
        
        if (marvPrev) {
            marvPrev.addEventListener('click', () => {
                clearInterval(marvSlideInterval);
                marvGrid.style.transition = "none";
                const lastEl = marvGrid.children[marvGrid.children.length - 1];
                marvGrid.prepend(lastEl);
                const cardWidth = lastEl.offsetWidth + 20;
                marvGrid.style.transform = `translateX(-${cardWidth}px)`;
                
                // Force layout reflow
                void marvGrid.offsetHeight; 
                
                marvGrid.style.transition = "transform 0.5s ease-in-out";
                marvGrid.style.transform = "translateX(0)";
                
                updateMarvDots('prev');
                startMarvSlider();
            });
        }
        
        marvDots.forEach((dot, index) => {
            // Optional: dot click navigation could jump, but since it's an infinite loop append approach, 
            // jumping by index requires sliding X times. We'll leave them as visual indicators for now.
        });
    }

    // --- Global Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Back to Top Button ---
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
